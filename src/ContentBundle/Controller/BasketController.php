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


class BasketController extends Controller {
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