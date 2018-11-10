<?php
/**
* @name CategoryPooler Pool des catégories à traiter
* @author IDea Factory (dev-team@ideafactory.fr) - Oct. 2018
* @package ContentBundle/Controller/Import
* @version 1.0.0
*/
namespace ContentBundle\Import;

use MenuBundle\Entity\Categorie;
use ContentBundle\Entity\Decor;

class CategoryPooler {
	
	/**
	 * Stockage des catégories par niveau
	 * @var Categorie[]
	 */
	private $pooler;
	
	/**
	 * Gestionnaire d'entité Doctrine
	 * @var unknown
	 */
	private $manager;

	/**
	 * Décorateur d'images pour un produit
	 * @var ContentBundle\Entity\Decor
	 */
	private $imageDecorator;
	
	/**
	 * Définit la catégorie racine pour l'importation de données
	 * @param MenuBundle\Entity\Categorie $rootCategorie
	 */
	public function __construct(\MenuBundle\Entity\Categorie $rootCategorie, $manager) {
		$this->pooler["root"] = $rootCategorie;
		$this->manager = $manager;
		
		// Instancie le décorteur images
		$repository = $this->manager->getRepository(Decor::class);
		$decors = $repository->findBySlug("images-produits");
		
		$this->imageDecorator = $decors[0];
	}
	
	/**
	 * Retourne le gestionnaire d'entité Doctrine
	 * @return Doctrine
	 */
	public function getManager() {
		return $this->manager;
	}
	
	/**
	 * Retourne le décorateur Images
	 * @return ContentBundle\Decor
	 */
	public function getImageDecorator(): Decor {
		return $this->imageDecorator;
	}
	
	/**
	 * Retourne la catégorie racine de l'importation
	 * @return MenuBundle\Entity\Categorie
	 */
	public function getRootCategory(): \MenuBundle\Entity\Categorie {
		return $this->pooler["root"];
	}
	
	/**
	 * Définit la catégorie courante de l'importation
	 * @param MenuBundle\Entity\Categorie $category
	 */
	public function setCurrentCategory(Categorie $category, int $level) {
		$this->pooler["level_" . $level] = $category;
	}
	
	/**
	 * Retourne la catégorie courante pour l'importation des données
	 * @return MenuBundle\Entity\Categorie
	 */
	public function getCurrentCategory(int $level) {
		if (array_key_exists("level_" . $level, $this->pooler))
			return $this->pooler["level_" . $level];
		
		return null;
	}
}