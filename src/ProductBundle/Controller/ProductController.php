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
     * @Rest\Put("/price/{slug}")
     */
    public function updatePriceAction(Request $request) {
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
        
        if ($this->product) {
            if ($request->get('declinaison')) {
                $declinaison = $request->get('declinaison');
            } else {
                $declinaison = 0;
            }
            
            $content = $this->product->getRawContent();
            
            if ($content) {
                $ht = $request->get('ttc') / (1 + $content->vat);
                $content["pricing"][$declinaison]["ht"] = $ht;
                $this->product->setContent(json_encode($content));
                $manager = $this->getDoctrine()
                    ->getManager();
                $manager->persist($this->product);
                $manager->flush();
                return new View("Le prix du produit " . $this->product->getTitleFr() . " a été mis à jour à " . $ht . " € HT" , Response::HTTP_OK);
            } else {
                return new View("Le prix du produit n'a pas pu être mis à jour", Response::HTTP_NO_CONTENT);
            }
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
}
