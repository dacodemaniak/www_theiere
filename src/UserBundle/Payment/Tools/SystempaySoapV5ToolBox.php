<?php
namespace UserBundle\Payment\Tools;

/*
 * Utility class easing Systempay SOAP V5 webservices use
 *
 * Currently only supports `createPayment` requests
 *
 * @version 0.5
 *
 * @depends UUID.php, the external UUID generator
 * @link https://gist.github.com/dahnielson/508447
 *
 */

use UserBundle\Payment\Tools\UUID;


class SystempaySoapV5ToolBox
{
    /**************** CLASS CONSTANTS **************/
    
    // The toolbox uses V5 UUID, wich needs a valid UUID value as namespace
    public $uuidNameSpace = '1546058f-5a25-4334-85ae-e68f2a44bbaf';
    
    /**************** CLASS PROPERTIES **************/
    
    //  Container for specific PHP SOAP Client configuration
    public $soapClientOptions =  array(
        'trace'         => 1,              // Enable trace to get access to request and response details
        'encoding'      => 'UTF-8',          // Systempay SOAP V5 expects utf-8 encoded data
    );
    
    // Container for Systempay user's account informations
    public $systempayAccount;
    
    private $certificate;
    
    
    /**************** CLASS METHOD - PUBLIC **************/
    /*
     * Constructor, stores the Systempay user's account informations
     * @param $args array(
     *
     * @param $shopid string, the account shop id as provided by Systempay
     * @param $cert_test string, certificate, test-version, as provided by Systempay
     * @param $cert_prod string, certificate, production-version, as provided by Systempay
     * @param $mode string ("TEST" or "PRODUCTION"), the Systempay mode to operate
     * @param $ns
     * )
     * @param $soap_options array
     */
    
    public function __construct(array $args, $soap_options = false)
    {
        $shopID = (isset($args['shopID']))? $args['shopID'] : '';
        $certTest = (isset($args['certTest']))? $args['certTest'] : '';
        $certProd = (isset($args['certProd']))? $args['certProd'] : '';
        $ctxMode = (isset($args['ctxMode']))? $args['ctxMode'] : 'TEST';
        $wsdl = (isset($args['wsdl']))? $args['wsdl'] : '';
        $ns = (isset($args['ns']))? $args['ns'] : '';
        
        $this->systempayAccount = array(
            'shopId' => $shopID,
            'mode' => $ctxMode,
            'wsdl' => $wsdl,
            'ns'    => $ns
        );
        
        $this->certificate = ($ctxMode == 'TEST') ? $certTest : $certProd;
        //optional parameter for soapclient
        if($soap_options and is_array($soap_options) ){
            foreach($soap_options as $key => $value){
                $this->soapClientOptions[$key] = $value;
            }
            
        }
        
    }
    
    
    /*
     * simpleCreatePayment
     * Main function, creates and sends a `createPayment` Systempay request
     *
     * @param $args array(
     *  @param $amount string, the amount to charge, using the smallest unit of the choosen currency
     *  @param $currency string, the code of the currency to use
     *  @param $cardNumber string, the number of the payment or credit card
     *  @param $expiryMonth string, the card expiry month, two digits formatted
     *  @param $expiryYear string, the card expiry year, four digits formatted
     *  @param $cardSecurityCode string, the card CSC
     *  @param $scheme string, the card type ("AMEX", "CB", "MASTERCARD", "VISA", "MAESTRO", "E-CARTEBLEUE" or "CB")
     *  @param $orderId string, the order identifier
     * )
     *
     * @return Object, Systempay SOAP response
     *
     */
    public function simpleCreatePayment($args){
        // Formats the `commonRequest` part
        $commonRequest = $this->buildCommonRequest();
        // Formats the `paymentRequest` part
        $paymentRequest = $this->buildPaymentRequest($args['amount'], $args['currency']);
        // Formats the `cardRequest` part
        $cardRequest = $this->buildCardRequest($args['cardNumber'], $args['expiryMonth'], $args['expiryYear'], $args['csc'], $args['scheme']);
        // Formats the `orderRequest` part
        $orderRequest = $this->buildOrderRequest($args['orderId']);
        
        // Builds SOAP headers
        $soapHeaders = $this->buildSoapHeaders();
        
        // Builds the SOAP request body
        $createPaymentWorkload = array(
            'commonRequest'     => $commonRequest,
            'paymentRequest'    => $paymentRequest,
            'orderRequest'      => $orderRequest,
            'cardRequest'       => $cardRequest,
            'customerRequest'   => array(), // Mandatory, but can be empty
            'techRequest'       => array(), // Mandatory, but can be empty
        );
        
        // Sets-up the whole SOAP request
        $soapClient = new \SoapClient($this->systempayAccount['wsdl'], $this->soapClientOptions);
        $soapClient->__setSoapHeaders($soapHeaders);
        
        // Sends the `createPayment` request
        $res = $soapClient->createPayment($createPaymentWorkload);
        $code = $res->createPaymentResult->commonResponse->responseCode;
        
        if ($code === 0) {
            //Response received, request was successful: code is 0
        } else {
            //Response received, request wasn't successful: code is $code
        }
        
        // Validates the response's SOAP header
        $this->checkResponseHeaders($soapClient->__getLastResponse());
        
        return $res;
    }
    
    /*
     * Utility function, check the response SOAP headers for a correct authToken
     *
     * @param $response, string the response as XML string
     *
     * @throws Exception if the correct authToken is not found
     */
    public function checkResponseHeaders($response)
    {
        $dom = new \DOMDocument;
        $dom->loadXML($response, LIBXML_NOWARNING);
        $path = new \DOMXPath($dom);
        $headers = $path->query('//*[local-name()="Header"]/*');
        $responseHeader = array();
        foreach ($headers as $headerItem) {
            $responseHeader[$headerItem->nodeName] = $headerItem->nodeValue;
        }
        foreach (array("shopId", "timestamp", "requestId", "mode", "authToken") as $name) {
            if (!isset($responseHeader[$name])) throw new \Exception("Missing `$name` header in Systempay SOAP response");
        }
        $expected = $this->buildAuthToken($responseHeader['requestId'], $responseHeader['timestamp'], 'response');
        if ($responseHeader['authToken'] !== $expected) {
            $msg = sprintf("Bad response's authToken - Expected `%s`, found `%s`", $expected, $responseHeader['authToken']);
            throw new \Exception($msg);
        }
    }
    
    /*
     * Utility function, generates the Systempay authToken
     *
     * @param $requestId string, UUID for the request
     * @param $timeStamp string, timeStamp of the request
     * @param $format string ("request" or "response"), the expected format of the authToken
     *
     * @return string, the authToken
     */
    public function buildAuthToken($requestId, $timeStamp, $format = "request")
    {
        // the request's authToken must be based on $requestId.$timeStamp
        // the response's authToken must be based on $timeStamp.$requestId
        $data = ($format == 'request') ? $requestId . $timeStamp : $timeStamp . $requestId;
        return base64_encode(
            hash_hmac('sha256',
                $data,
                $this->certificate, true
                ));
    }
    
    /*
     * Utility function, build the Systempay SOAP V5 headers
     *
     * @return Array of SOAPHeader objects, the complete headers definition
     *
     * @throws Exception, if UUID generation fails
     */
    public function buildSoapHeaders()
    {
        $timeStamp = gmdate("Y-m-d\TH:i:s\Z");
        $requestId = UUID::v5($this->uuidNameSpace, $timeStamp);
        if (false === $requestId) {
            throw new \Exception("Failed to generate the mandatory UUID");
        }
        
        $systempaySoapHeaders = array(
            'shopId' => $this->systempayAccount['shopId'],
            'requestId' => $requestId,
            'timestamp' => $timeStamp,
            'mode' => $this->systempayAccount['mode'],
            'authToken' => $this->buildAuthToken($requestId, $timeStamp)
        );
        
        $soapHeaders = array();
        foreach ($systempaySoapHeaders as $header => $value) {
            $soapHeaders[] = new \SOAPHeader($this->systempayAccount['ns'], $header, $value);
        }
        
        return $soapHeaders;
    }
    
    
    /*
     * Utility function, format the "common request" informations as needed by Systempay
     * Currently only sets the submissionDate entry
     *
     * @return Array of strings, the `commonRequest` part of createPayment request
     */
    public function buildCommonRequest()
    {
        return array(
            'submissionDate' => gmdate("Y-m-d\TH:i:s\Z")
        );
    }
    
    /*
     * Utility function, format the payment informations as needed by Systempay
     *
     * @param $amount string, the amount to charge, using the smallest unit of the choosen currency
     * @param $currency string, the code of the currency to use, default to 978 (euro)
     *
     * @return Array of strings, the `paymentRequest` part of createPayment request
     */
    public function buildPaymentRequest($amount, $currency = '978')
    {
        return array(
            'amount' => $amount,
            'currency' => $currency
        );
    }
    
    /*
     * Utility function, format the card informations as needed by Systempay
     *
     * @param $cardNumber string, the number of the payment or credit card
     * @param $expiryMonth string, the card expiry month, two digits formatted
     * @param $expiryYear string, the card expiry year, four digits formatted
     * @param $cardSecurityCode string, the card CSC,three-or-four digits formatted
     * @param $scheme string, the card type ("AMEX", "CB", "MASTERCARD", "VISA", "MAESTRO", "E-CARTEBLEUE" or "CB")
     *
     * @return Array of strings, the `cardRequest` part of createPayment request
     */
    public function buildCardRequest($cardNumber, $expiryMonth, $expiryYear, $cardSecurityCode, $scheme)
    {
        return array(
            'number' => $cardNumber,
            'expiryMonth' => $expiryMonth,
            'expiryYear' => $expiryYear,
            'cardSecurityCode' => $cardSecurityCode,
            'scheme' => $scheme
        );
    }
    
    /*
     * Utility function, format the order informations as needed by Systempay
     *
     * @param $orderId string, the order identifier
     *
     * @return Array of strings, the `orderRequest` part of createPayment request
     */
    public function buildOrderRequest($orderId)
    {
        return array(
            'orderId' => $orderId     // Identifiant de commande
        );
    }
    
    /*
     * Utility function, pretty-formats an XML string
     *
     * @param $xml string, the XML to process
     *
     * @return string, the XML, pretty-formatted
     */
    public function formatXML($xml)
    {
        $dom = new \DOMDocument('1.0');
        $dom->preserveWhiteSpace = false;
        $dom->formatOutput = true;
        $dom->loadXML($xml);
        return $dom->saveXML();
    }
    
}
