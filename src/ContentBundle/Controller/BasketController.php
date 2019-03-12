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
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use AppBundle\Service\SiteService;



class BasketController extends Controller {

    /**
     * @Route("/basket", name="view-basket")
     */
    public function showBasketAction(Request $request) {
        $request->setRequestFormat("html");
        
        $siteService = $this->container->get("site_service");
        
        return $this->render(
            "@Content/basket/basketlist.html.twig",
            [
                "phone" => $siteService->getPhoneNumber()
            ]
        );
    }
    
    /**
     * @Route("/delivery", defaults={"_format"="html"}, methods={"GET", "HEAD"}, name="delivery")
     */
    public function deliveryBasketAction(Request $request) {
        $request->setRequestFormat("html");
        
        $siteService = $this->container->get("site_service");
        
        return $this->render(
            "@Content/basket/delivery.html.twig",
            [
                "phone" => $siteService->getPhoneNumber()
            ]
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
        
        $siteService = $this->container->get("site_service");
        
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
            [
                "address" => $address,
                "phone" => $siteService->getPhoneNumber()
            ]
        );
    }
}