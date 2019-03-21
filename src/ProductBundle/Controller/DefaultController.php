<?php

namespace ProductBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use MenuBundle\Category\CategoryHelper;
use AppBundle\Service\SiteService;
use ContentBundle\Entity\Article;

class DefaultController extends Controller
{
    /**
     * Identifiant du produit à récupérer
     * @var int
     */
    private $productId;
    
    /**
     * @Route("/product/{slug}/{category}", name="product", defaults={"_format"="html"})
     */
    public function indexAction(Request $request)
    {
        $request->setRequestFormat("html");
        
        $helper = new CategoryHelper($request->get('category'), $this->getDoctrine()->getManager());
        
        $category = $helper->getCurrentCategory();
        
        // Récupère le fil d'ariane de la catégorie courante
        if ($category->hasParent()) {
            $ancestors = $category->getBreadcrumb();
        }
        $ancestors[] = $category; // Catégorie courante dans le fil d'ariane
        
        $this->productId = $request->get("slug");
        
        $product = $this->getProduct();
        
        $sliderImages = $product->getImages();
        
        $decorators = $product->getProductDecorators();
        
        $siteService = $this->container->get("site_service");
        
        return $this->render(
            "@Product/Default/index.html.twig",
            [
                "currentCategory" => $category,
                "product" => $product,
                "ancestors" => $ancestors,
                "sliderImages" => $sliderImages,
                "decorators" => $decorators,
                "site" => $siteService
            ]
        );
    }
    
    /**
     * Récupère le produit concerné
     * @return \ContentBundle\Entity\Article
     */
    private function getProduct(): \ContentBundle\Entity\Article {
        $product = $this->getDoctrine()
            ->getManager()
            ->find(Article::class, $this->productId);
        
        return $product;
    }
}
