<?php
namespace MenuBundle\Category;

/**
* @name CategoryHelper
* @desc Helper sur les catégories
* @author IDea Factory - Déc. 2018 (dev-team@ideafactory.fr)
* @namespace MenuBundle\Category
* @version 1.0.0
*/

use MenuBundle\Entity\Categorie;
use Doctrine\ORM\EntityManager;

class CategoryHelper {
    
    /**
     * Gestionnaire d'entité Doctrine
     * @var \Doctrine\ORM\EntityManager
     */
    private $entityManager;
    
    /**
     * Identifiant de la catégorie concernée
     * @var int
     */
    private $categoryId;
    
    
    /**
     * Catégorie courante
     * @var \MenuBundle\Entity\Categorie
     */
    private $category;
    
    public function __construct(int $categoryId, EntityManager $entityManager) {
        $this->categoryId = $categoryId;
        
        $this->entityManager = $entityManager;
        
        $this->category = $this->getById();
    }
    
    
    public function getCurrentCategory(): \MenuBundle\Entity\Categorie {
        return $this->category;
    }
    
    /**
     * Récupère la catégorie par l'intermédiaire de son ID
     * @param int $id
     * @return Categorie
     */
    private function getById() {
        
        $category = $this->entityManager
            ->find(Categorie::class, $this->categoryId);
        
        return $category;
    }
}