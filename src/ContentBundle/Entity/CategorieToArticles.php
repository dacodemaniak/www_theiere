<?php

namespace ContentBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use \MenuBundle\Entity\Categorie;

/**
 * CategorieToArticles
 *
 * @ORM\Table(name="categorietoarticles")
 * @ORM\Entity(repositoryClass="ContentBundle\Repository\CategorieToArticlesRepository")
 */
class CategorieToArticles
{
    /**
     * @var int
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @var int
     *
     * @ORM\Column(name="place", type="smallint")
     */
    private $place;

    /**
     * @ORM\ManyToOne(targetEntity=Categorie::class, inversedBy="articles")
     */
    protected $category;
    
    /**
     * @ORM\ManyToOne(targetEntity=Article::class)
     */
    protected $article;
    

    /**
     * Get id
     *
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set place
     *
     * @param integer $place
     *
     * @return MenuToCategories
     */
    public function setPlace($place)
    {
        $this->place = $place;

        return $this;
    }

    /**
     * Get place
     *
     * @return int
     */
    public function getPlace()
    {
        return $this->place;
    }
    
    /**
     * Définit la catégorie de l'association
     * @param \MenuBundle\Entity\Categorie $categorie
     * @return \ContentBundle\Entity\CategorieToArticle
     */
    public function setCategorie($category) {
    	$this->category = $category;
    	
    	return $this;
    }
    
    /**
     * Retourne la catégorie de l'association
     * @return \MenuBundle\Entity\Categorie
     */
    public function getCategorie(): \MenuBundle\Entity\Categorie {
    	return $this->category;
    }
    
    
    /**
     * Définit l'article de l'association
     * @param \ContentBundle\Entity\Article $article
     * @return \ContentBundle\Entity\CategorieToArticles
     */
    public function setArticle($article): \ContentBundle\Entity\CategorieToArticles {
    	$this->article = $article;
    	return $this;
    }
    
    /**
     * Retourne l'article de l'association
     * @return \ContentBundle\Entity\Article
     */
    public function getArticle(): \ContentBundle\Entity\Article {
    	return $this->article;
    }
}

