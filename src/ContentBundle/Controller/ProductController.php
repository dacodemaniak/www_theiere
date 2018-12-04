<?php
/**
 * @name ProductController Contrôleur pour la gestion d'un produit
 * @author IDea Factory (dev-team@ideafactory.fr) - Oct. 2018
 * @package \ContentBundle\Controller
 * @version 1.0.0
 */
namespace ContentBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use FOS\RestBundle\Controller\Annotations as Rest;
use FOS\RestBundle\Controller\FOSRestController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use FOS\RestBundle\View\View;
use MenuBundle\Entity\Categorie;
use ContentBundle\Entity\Article;

use Doctrine\ORM\Mapping\Entity;
use Doctrine\Common\Collections\ArrayCollection;
use ContentBundle\Repository\ArticleRepository;

class ProductController extends FOSRestController {
    
    /**
     * Produit complet avec les décors
     * @var \ContentBundle\Entity\Article
     */
    private $product;
    
    /**
     * Constructeur du contrôleur
     */
    public function __construct() {}
    
    /**
     * @Rest\Get("/product/search/{terms}")
     * 
     * @param Request $request
     */
    public function fullSearch(Request $request) {
        $articleRepository = $this->getDoctrine()
            ->getManager()
            ->getRepository(Article::class);
        
            
            
        $results = $articleRepository->fullContentSearch($request->get("terms"));
        
        return new View($results, Response::HTTP_OK);
        
        
        
    }
    
    /**
     * @Rest\Get("/product/{slug}")
     */
    public function byProductAction(Request $request) {
        $routeComponent = $request->get("slug");
        
        if (filter_var($routeComponent, FILTER_VALIDATE_INT)) {
            $id = (int) $routeComponent;
            $slug = "";
        } else {
            $slug = $routeComponent;
            $id = 0;
        }
        
        // Récupère le produit
        if ($id !== 0) {
            // Récupère le produit par son id
            $this->product = $this->getById($id);
        } else {
            // Récupère la catégorie par son slug
            $this->product = $this->getBySlug($slug);
        }
        
        // Prépare le résultat
        $content = [];
        
        if ($this->product) {
            $content["product"] = $this->product->getRawContent();
            $content["decorators"] = $this->product->getDecorators();
            $content["taxonomies"] = $this->getTaxonomies();
            
            return new View($content, Response::HTTP_OK);
        }
        
        return new View("Le produit n'existe pas ou n'est pas disponible !", Response::HTTP_NOT_FOUND);
    }
        
    /**
    * Récupère le produit par l'intermédiaire de son ID
    * @param int $id
    * @return Article | null
    */
    private function getById(int $id) {
            
        $product = $this->getDoctrine()
            ->getManager()
            ->find(Article::class, $id);
            
        return $product;
    }
        
    /**
    * Retourne le produit par l'intermédiaire du slug
    * @param string $slug
    * @return Article|NULL
    */
    private function getBySlug(string $slug) {
        $product = $this->getDoctrine()
            ->getManager()
            ->getRepository(Article::class)
            ->findOneBy(["slug" => $slug]);
            
        return $product;
    }
    
    private function getTaxonomies(): array {
        return [];
    }
}
