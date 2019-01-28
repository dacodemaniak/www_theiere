<?php
namespace ContentBundle\Controller;

/**
* @name BasketController
* @author IDea Factory - Déc. 2018 (dev-team@ideafactory.fr)
* @package ContentBundle\Controller
* @version 1.0.0
*/

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use FOS\RestBundle\Controller\Annotations as Rest;
use FOS\RestBundle\Controller\FOSRestController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use FOS\RestBundle\View\View;



class BasketController extends FOSRestController {

    /**
     * @Route("/basket", defaults={"_format"="html"}, methods={"GET","HEAD"}, name="view-basket")
     */
    public function showBasketAction(Request $request) {
        $request->setRequestFormat("html");
        
        return $this->render(
            "@Content/basket/basketlist.html.twig"
        );
    }
    
    /**
     * @Route("/delivery", defaults={"_format"="html"}, methods={"GET", "HEAD"}, name="delivery")
     */
    public function deliveryBasketAction(Request $request) {
        $request->setRequestFormat("html");
        
        return $this->render(
            "@Content/basket/delivery.html.twig"
            );
    }
    
    /**
     * @Route("/checkout/{delivery_address}", defaults={"_format"="html"}, methods={"GET", "HEAD"}, name="checkout")
     */
    public function checkoutBasketAction(Request $request) {
        $request->setRequestFormat("html");
        
        // Récupérer l'adresse postale et le nom de la boutique
        $site = $this
            ->getDoctrine()
            ->getManager()
            ->getRepository(\SiteBundle\Entity\Site::class)
            ->find(1);
        
        $siteContent = $site->getContent();
        
        $address = [
            "name" => $siteContent->name,
            "address" => [
                "hote" => property_exists($siteContent->address, "hote") ? $siteContent->address->hote : null,
                "streetNumber" => property_exists($siteContent->address, "streetNumber") ? $siteContent->address->streetNumber : null,
                "street" => property_exists($siteContent->address, "street") ? $siteContent->address->street : null,
                "zipcode" => property_exists($siteContent->address, "zipcode") ? $siteContent->address->zipcode : null,
                "city" => property_exists($siteContent->address, "city") ? $siteContent->address->city : null,
            ]
        ];
        return $this->render(
            "@Content/basket/checkout.html.twig",
            ["address" => $address]
        );
    }
}