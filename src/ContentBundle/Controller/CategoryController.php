<?php
/**
* @name CategoryController Service REST pour la récupération des produits par catégories
* @author IDea Factory (dev-team@ideafactory.fr)
* @package ContentBundle\Controller
* @version 1.0.0
* @version 1.0.1
*   Modification du typage pour la récupération des produits pour une catégorie
*/
namespace ContentBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use MenuBundle\Entity\Categorie;
use AppBundle\Service\SiteService;
use ContentBundle\Entity\Article;

use Doctrine\ORM\Mapping\Entity;
use Doctrine\Common\Collections\ArrayCollection;
use Symfony\Component\DependencyInjection\ContainerAwareInterface;


class CategoryController extends Controller implements ContainerAwareInterface {
	
    /**
     * Catégorie traitée
     * @var Categorie
     */
    private $category;
    
    /**
     * Catégorie ancêtre de la catégorie courante
     * @var Categorie
     */
    private $ancestor;
    
    /**
     * Produits de la catégorie courante
     * @var \ContentBundle\Entity\Article[]
     */
    private $categoryProducts;
    
    /**
     * Produits des catégories enfants de la catégorie courante
     * @var \MenuBundle\Entity\Categorie[]
     */
    private $childrenProducts;
    
    /**
     * Catégories parentes de la catégorie courante
     * @var \MenuBundle\Entity\Categorie[]
     */
    private $parentCategories;
    
    /**
     * Service de récupération des données du site
     * @var SiteService
     */
    private $siteService;
    
	/**
	 * Constructeur du contrôleur
	 */
    public function __construct() {
        
    }
	
	/**
	 * @Route("/products/category/{slug}", methods={"GET","HEAD"}, name="products_category")
	 * 
	 * @param Request $request
	 * 
	 * Retourne les produits et éventuellement les sous-catégories à partir d'un identifiant de catégorie
	 */
	public function productFromCategory(Request $request) {
	    $request->setRequestFormat("html");
	    
	    $this->siteService = $this->container->get('site_service');
	    
	    $routeComponent = $request->get("slug");

	    if (filter_var($routeComponent, FILTER_VALIDATE_INT)) {
	        $id = (int) $routeComponent;
	        $slug = "";
	    } else {
	        $slug = $routeComponent;
	        $id = 0;
	    }
	    
	    // Récupère la catégorie
	    if ($id !== 0) {
	        // Récupère la catégorie par son id
	        $this->category = $this->getById($id);
	    } else {
	        // Récupère la catégorie par son slug
	        $this->category = $this->getBySlug($slug);
	    }
	    
	    // Récupère le fil d'ariane de la catégorie courante
	    if ($this->category->hasParent()) {
	        $ancestors = $this->category->getBreadcrumb();
	    }
	    $ancestors[] = $this->category; // Catégorie courante dans le fil d'ariane
	    
	    
	    return $this->render(
	        "@Content/category/products.html.twig",
	        [
	            "currentCategory" => $this->category,
	            "ancestors" => $ancestors,
	            "products" => $this->getCategoryProductsCollection(),
	            "childrenProducts" => $this->getChildrenProductsCollection(),
	            "site" => $this->siteService
	        ]
	    );
	}
	
	
	/**
	 * Récupère la catégorie par l'intermédiaire de son ID
	 * @param int $id
	 * @return Categorie | null
	 */
	private function getById(int $id) {
	    
	    $category = $this->getDoctrine()
	       ->getManager()
	       ->find(Categorie::class, $id);
	    
	    return $category;
	}
	
	/**
	 * Retourne la catégorie par l'intermédiaire du slug
	 * @param string $slug
	 * @return Categorie|NULL
	 */
	private function getBySlug(string $slug) {
	    $category = $this->getDoctrine()
	       ->getManager()
	       ->getRepository(Categorie::class)
	       ->findOneBy(["slug" => $slug]);
	    
	    return $category;
	}
	
	/**
	 * Récupère les produits de la catégorie courante uniquement
	 * @return array
	 */
	private function getCategoryProducts(): array {
	    $products = [];
	    
	    if ($this->category->hasArticles()) {
	        $products = $this->category->getRawArticles();
	    }
	    
	    return $products;
	}
	
	/**
	 * Récupère la liste des produits de la catégorie courante
	 * @return array
	 */
	private function getCategoryProductsCollection(\MenuBundle\Entity\Categorie $category = null): array {
	   $products = [];
	   
	   if ($category === null) {
	       $category = $this->category;
	   }
	   
	   $catToArticles = $category->getArticles();
	    
	    foreach ($catToArticles as $catToArticle) {
	        if ($catToArticle->getArticle()->getIsEnabled()) {
	            $products[] = $catToArticle->getArticle();
	        }
	        
	    }
	    
	    return $products;
	}
	
	/**
	 * Retourne les produits des catégories filles de la catégorie courante
	 * @return array
	 */
	private function getChildrenProducts(\MenuBundle\Entity\Categorie $category = null, array $childrenProducts = null): array {
	    if ($childrenProducts === null) {
	       $childrenProducts = [];
	    }
	    
	    if ($category === null) {
	        $category = $this->category;
	    }
	    
	    if ($category->hasChildren()) {
	        foreach($category->getChildren() as $child) {
	            $childrenProducts[] = [
	                "category" => [
	                    "id" => $child->getId(),
	                    "slug" => $child->getSlug(),
	                    "content" => $child->getRawContent()
	                ],
	                //"category" => $child->getRawContent(),
	                "products" => $child->getRawArticles(),
	                "childrenCategory" => $this->getChildrenProducts($child)
	            ];
	            $this->getChildrenProducts($child, $childrenProducts);
	        }
	    }
	    
	    return $childrenProducts;
	}
	
	private function getChildrenProductsCollection(\MenuBundle\Entity\Categorie $category = null, array $childrenProducts = null): array {
	    if ($childrenProducts === null) {
	        $childrenProducts = [];
	    }
	    
	    if ($category === null) {
	        $category = $this->category;
	    }
	    
	    if ($category->hasChildren()) {
	        foreach($category->getChildren() as $child) {
	            $childrenProducts[] = [
	                "category" => $child,
	                "products" => $this->getCategoryProductsCollection($child),
	                "childrenCategory" => $this->getChildrenProducts($child)
	            ];
	            $this->getChildrenProducts($child, $childrenProducts);
	        }
	    }
	    
	    return $childrenProducts;
	}
	
	/**
	 * Retourne les catégories parentes de la catégorie courante
	 * @return array
	 */
	private function getParentCategories(): array {
	    return $this->category->getAncestorsAsArray();
	}
	
	/**
	 * Retourne le top 10 des ventes
	 * @param ArrayCollection $articles
	 * @return array
	 */
	private function getTopSelling(array $articles): array {
	    $soldedArticles = [];
	    
	    foreach ($articles as $article) {
	        $content = $article->getContent();
	        
	        if (property_exists($content, "sold")) {
	            $soldedArticles[] = [
	                "product" => $article->getRawContent(),
	                "soldQuantity" => $content->sold
	            ];
	        }
	    }
	    
	    // Tri le résultat dans l'odre des quantités vendues
	    uasort($soldedArticles, function($first, $second) {
	        return $first["soldQuantity"] <=> $second["soldQuantity"];
	    });
	        
	    // Récupère les 10 dernières meilleures ventes
	    return array_slice($soldedArticles, 0, 9, true);
	}
}
