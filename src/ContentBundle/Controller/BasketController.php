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
use ContentBundle\Entity\Article;

class BasketController extends Controller {
    /**
     * @Route("/basket", methods={"GET","HEAD"}, name="basket")
     *
     * @param Request $request
     *
     * Retourne les produits et éventuellement les sous-catégories à partir d'un identifiant de catégorie
     */
    public function showBasketAction(Request $request) {
        $request->setRequestFormat("html");
        
        return $this->render(
            "@Content/basket/basketlist.html.twig"
        );
    }
}