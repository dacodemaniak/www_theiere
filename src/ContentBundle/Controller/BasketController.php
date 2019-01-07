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
}