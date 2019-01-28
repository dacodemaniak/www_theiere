<?php
namespace UserBundle\Payment;

/**
* @name PaymentProcess
* @desc Appel SOAP vers l'API de paiement Systempay
* @author IDea Factory - Jan. 2019 (dev-team@ideafactory.fr)
* @namespace UserBundle\Payment
* @version 1.0.0
*/

use UserBundle\Payment\Tools\SystempaySoapV5ToolBox;

class PaymentProcess {
    
    /**
     * Boîte à outils Systempay
     */
    private $toolBox;
    
    
    /**
     * Arguments de l'appel SOAP vers l'API de paiement
     * @var array
     */
    private $callArgs = [];
    
    public function __construct() {
        $this->toolBox = $this->_getToolbox();
        
        $this->callArgs = [
            "amount" => 0,
            "currency" => "978",
            "cardNumber" => "",
            "expiryMonth" => "",
            "expiryYear" => "",
            "csc" => "",
            "scheme" => "",
            "orderId" => "",
            "insuranceAmount" => ""
        ];
    }
    
    public function process(string $type = "simple") {
        if ($type === "simple") {
            return $this->toolBox->simpleCreatePayment($this->callArgs);
        }
    }
    
    public function setAmount(float $amount): PaymentProcess {
        $centAmount = $amount * 100;
        $this->callArgs["amount"] = $centAmount;
        
        return $this;
    }
    
    public function setCurrency(string $currency): PaymentProcess {
        $this->callArgs["currency"] = $currency;
        return $this;
    }
    
    public function setCardNumber(string $cardNumber): PaymentProcess {
        $this->callArgs["cardNumber"] = $cardNumber;
        
        return $this;
    }
    
    public function setExpiryMonth(string $expiryMonth): PaymentProcess {
        $this->callArgs["expiryMonth"] = $expiryMonth;
        
        return $this;
    }
    
    public function setExpiryYear(string $expiryYear): PaymentProcess {
        $this->callArgs["expiryYear"] = $expiryYear;
        
        return $this;
    }
    
    public function setCsc(string $csc): PaymentProcess {
        $this->callArgs["csc"] = $csc;
        
        return $this;
    }
    
    public function setScheme(string $scheme): PaymentProcess {
        $this->callArgs["scheme"] = $scheme;
        
        return $this;
    }
    
    public function setOrderId(string $token): PaymentProcess {
        $this->callArgs["orderId"] = $token;
        
        return $this;
    }
    
    public function setInsuranceAmount(float $amount): PaymentProcess {
        $this->callArgs["insuranceAmount"] = $amount * 100;
        
        return $this;
    }
    
    
    private function _getToolbox() {
        $soap_options = [];
        
        $args = [
            "shopID" => "SITE_ID",
            "certTest" => "TEST",
            "certProd" => "PRODUCTION",
            "ctxMode" => "TEST",
            "wsdl" => "https://paiement.systempay.fr/vads-ws/v5?wsdl",
            "ns" => "http://v5.ws.vads.lyra.com/Header"
        ];
        
        return new SystempaySoapV5ToolBox($args, $soap_options);
    }
}