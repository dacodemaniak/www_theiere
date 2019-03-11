<?php

namespace ContentBundle\Controller;

use MenuBundle\Entity\Categorie;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;

class DefaultController extends Controller
{
    /**
     * Catégorie traitée
     * @var Categorie
     */
    private $category;
    
    /**
     * @Route("/cms/{slug}", methods={"GET","HEAD"}, name="cms_page")
     *
     * @param Request $request
     *
     * Récupère les contenus CMS
     */
    public function cmsContentAction(Request $request) {
        $request->setRequestFormat("html");
        
        $siteService = $this->container->get('site_service');
        
        $routeComponent = $request->get("slug"); // Identifiant de la catégorie concernée
        
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
        
        return $this->render(
            "@Content/cms/cms.html.twig",
            [
                "currentCategory" => $this->category,
                "articles" => $this->getCategoryArticlesCollection(),
                "phone" => $siteService->getPhoneNumber()
            ]
        );
    }
    
    /**
     * Récupère le slider d'images pour la page d'accueil
     */
    public function homeSliderAction()
    {
        return $this->render('ContentBundle:Default:index.html.twig');
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
     * Récupère la liste des produits de la catégorie courante
     * @return array
     */
    private function getCategoryArticlesCollection(\MenuBundle\Entity\Categorie $category = null): array {
        $articles = [];
        
        if ($category === null) {
            $category = $this->category;
        }
        
        $catToArticles = $category->getArticles();
        
        foreach ($catToArticles as $catToArticle) {
            if ($catToArticle->getArticle()->getIsEnabled()) {
                $articles[] = $catToArticle->getArticle();
            }
            
        }
        
        return $articles;
    }
}
