<?php

namespace AppBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use ContentBundle\ContentBundle;
use Symfony\Component\Asset\Packages;
use \AppBundle\Service\SiteService;

class DefaultController extends Controller
{
    
	/**
	 * @Route("/", defaults={"_format"="html"}, name="home")
	 */
	public function indexAction(Request $request, Packages $assetPackage, SiteService $siteService) {
	    $request->setRequestFormat("html");
	    
	    $editorial = $this->getEditorial();
	    
	    $discovering = $this->getDiscovering();
	    
	    // Promotions en cours...
	    $promotion = $this->getBySlug("promotions");
	    $products = [];
	    
	    if ($promotion) {
	        $catToArticles = $promotion->getArticles();
	        foreach($catToArticles as $catToArticle) {
	            $products[] = [
	                "category" => $catToArticle->getCategorie(),
	                "product" => $catToArticle->getArticle(),
	                "image" => $catToArticle->getArticle()->getMainImage()
	            ];
	        }
	    }
	    
	    // Produit du mois
	    $monthProductCategory = $this->getBySlug("monthly-product");
	    $monthProduct = [];
	    if ($monthProductCategory) {
	        $categoryContent = $monthProductCategory->getContent();
	        $monthProduct["category"] = $monthProductCategory;
	        $catToArticles = $monthProductCategory->getArticles();
	        $catToArticle = $catToArticles[0];
	        $product = [
	           "product" => $catToArticle->getArticle(),
	            "image" => $catToArticle->getArticle()->getMainImage()
	        ];
	        $monthProduct["product"] = $product;
	    }
	    
	    
	    // Produit Coup de coeur
	    $heartProductCategory = $this->getBySlug("heart");
	    $heartProduct = [];
	    if ($heartProductCategory) {
	        $heartProduct["category"] = $heartProductCategory;
	        $catToArticles = $heartProductCategory->getArticles();
	        $catToArticle = $catToArticles[0];
	        $product = [
	            "product" => $catToArticle->getArticle(),
	            "image" => $catToArticle->getArticle()->getMainImage()
	        ];
	        $heartProduct["product"] = $product;
	    }
	    
	    // Réunions à domicile
	    $homeMeetingCategory = $this->getBySlug("home-meeting");
	    $homeMeeting = [];
	    if ($homeMeetingCategory) {
	        $homeMeeting["category"] = $homeMeetingCategory;
	        $homeMeeting["content"] = $homeMeetingCategory->getContent();
	    }
	    
	    // Images de slider
	    $sliderImages = $this->getSliderImages($assetPackage);
	    
		return $this->render("@App/Default/index.html.twig",
		  [
		      "sliderImages" => $sliderImages,
		      "editorial" => $editorial,
		      "discovering" => $discovering,
		      "promotions" => $products,
		      "monthProduct" => $monthProduct,
		      "heartProduct" => $heartProduct,
		      "homeMeeting" => $homeMeeting,
		      "site" => $siteService
		  ]
		);
	}
	
	/**
	 * Retourne l'article spécifique éditorial
	 * 
	 */
	private function getEditorial() {
	    $content = null;
	    $editorial = $this->getDoctrine()
	       ->getManager()
	       ->getRepository("ContentBundle:Article")
	       ->findOneBySlug("editorial");
	   
	   if ($editorial) {
	       $content = $editorial->getContent();        
	   }
	   
	   return $content;
	    
	}
	
	/**
	 * Retourne l'article spécifique Découverte des boxes
	 *
	 */
	private function getDiscovering() {
	    $content = null;
	    $discover = $this->getDoctrine()
	       ->getManager()
	       ->getRepository("ContentBundle:Article")
	       ->findOneBySlug("box-discovering");
	    
	    if ($discover) {
	        $content = $discover->getContent();
	    }
	    
	    return $content;
	    
	}
	
	/**
	 * Retourne la catégorie par l'intermédiaire du slug
	 * @param string $slug
	 * @return \MenuBundle\Entity\Categorie|NULL
	 */
	private function getBySlug(string $slug) {
	    $category = $this->getDoctrine()
	    ->getManager()
	    ->getRepository(\MenuBundle\Entity\Categorie::class)
	    ->findOneBy(["slug" => $slug]);
	    
	    return $category;
	}
	
	/**
	 * Récupère les images pour le slider de la page d'accueil
	 * @return array
	 */
	private function getSliderImages(Packages $assetPackage): array {
	    $sliderImages = [];
	    
	    $categories = $this->getDoctrine()
	       ->getRepository(\MenuBundle\Entity\Categorie::class)
	       ->getSliderImages();
	    
	       if ($categories) {
	           $indice = 0;
	           foreach ($categories as $category) {
	               $content = $category->getContent();
	               
	               if (property_exists($content, "slide")) {
	                   $sliderImages[] = [
	                       "image" => $assetPackage->getUrl("images/" . $content->slide),
	                       "alt" => $content->title->fr,
	                       "active" => $indice === 0 ? true : false,
	                       "order" => $indice
	                   ];
	                   $indice++;
	               }
	           }
	       }
	       
	       return $sliderImages;
	}
    
}