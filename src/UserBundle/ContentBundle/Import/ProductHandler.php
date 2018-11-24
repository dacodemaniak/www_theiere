<?php
/**
* @name ProductHandler Gestionnaire pour une ligne de produit du fichier
* @author IDea Factory (dev-team@ideafactory.fr) - Oct. 2018
* @package ContentBundle\Controller\Import
* @version 1.0.0
*/
namespace ContentBundle\Import;

use ContentBundle\Import\ImportHandler;
use ContentBundle\Entity\Article;
use ContentBundle\Entity\CategorieToArticles;
use ContentBundle\Entity\DecorArticle;

class ProductHandler extends ImportHandler {
	const _SEP = "\n";
	
	/**
	 * Gestionnaire pour le traitement d'une ligne de catégorie
	 * @param array $data
	 */
	public function handle(array $data) {
		echo "Traite un produit ? " . $data[0] . "<br>\n";
		if ($this->emptyCols($data) <= 3) {
			echo "Produit traité : " . $data[0] . "<br>\n";
			// Vérifie l'existence de la catégorie
			if (($product = $this->getProduct($data)) === null) {
				$product = new Article();
				$product->setSlug(strtolower(self::toSlug($data[0])));
				$product->setIsEnabled(1);
			}
			
			$content = [
				"title" => ["fr" => $data[0]],
				"origin" => ["fr" => $data[1]],
				"abstract" => ["fr" => $data[2]],
				"description" => ["fr" => $data[3]],
				"pricing" => $this->_parse($data[4], $this->_vat($data[6]), $data[5]),
				"vat" => $this->_vat($data[6])
			];
			
			$product->setContent(json_encode($content));
			
			// Persiste la donnée
			$this->manager->persist($product);
			
			// Gère le décorateur "images"
			$images  = $this->_parseImages($data[7]);
			if (count($images) > 0) {
				for ($i = 0; $i < count($images); $i++) {
					
					$image = new DecorArticle();
					$image->setArticle($product);
					$image->setDecor($this->getImageDecorator());
					
					// Définit le contenu
					$content = [
						[
							"src" => $images[$i],
							"alt" => $product->getTitle()
						]
					];
					$image->setContent(json_encode($content));
					$this->manager->persist($image);
				}
			}
			
			// Ajoute le produit à la catégorie courante
			$categoryLevel = 2;
			
			$category = $this->pooler->getCurrentCategory(2);
			if ($category === null) {
				$category = $this->pooler->getCurrentCategory(1);
				$categoryLevel = 1;
			}
			
			$this->manager->persist($category);
			$this->pooler->setCurrentCategory($category, $categoryLevel);
			
			// Ajoute le produit à la catégorie
			$productToCategory = new CategorieToArticles();
			$productToCategory->setArticle($product);
			$productToCategory->setCategorie($category);
			//$place = $this->manager->getRepository(CategorieToArticles::class)->count($category->getId());
			$place = 1;
			$productToCategory->setPlace($place);
			
			$this->manager->persist($productToCategory);
			
			$this->manager->flush();
			
		}
		return null; // Arrête la chaîne à ce niveau là
	}
	
	/**
	 * Parse les prix TTC pour retourner la gamme de prix HT selon les quantités
	 * @param string $pricing
	 * @param float $vat
	 */
	private function _parse(string $price, float $vat, string $conditionnement) {
		$pricing = [];
		
		$prices = explode(self::_SEP, $price);
		$packages = explode(self::_SEP, $conditionnement);
		
		for ($i=0; $i < count($prices); $i++) {
			$perQuantities = explode("€", trim($prices[$i]));
			$pricing[] = [
					"ht" => (float) str_replace(",", ".", trim($perQuantities[0])) / (1 + $vat),
					"quantity" => trim($packages[$i]),
					"stock" => 100,
					"maxPerOrder" => 10,
					"thresold" => 10
			];
		}

		
		return $pricing;
	}
	
	/**
	 * Retourne le taux de TVA à partir de la chaîne en entrée
	 * @param string $vat
	 * @return float
	 */
	private function _vat(string $vat): float {
		
		
		if (trim($vat === "")) {
			return 0.2;
		}
		
		$vat = str_replace("%", "", trim($vat));
		
		# begin_debug
		# echo "Traite le taux de TVA : " . $vat . "\n";
		# end_debug
		
		return (float) $vat / 100;
	}
	
	/**
	 * Parse les images importées et retourne un tableau de données
	 * @param string $image
	 * @return array
	 */
	private function _parseImages(string $image): array {
		$images = [];
		
		if (strlen(trim($image)) > 0) {
			$images = explode("|", $image);
			for ($i=0; $i < count($images); $i++) {
				$images[$i] = self::toSlug($images[$i]);
			}
		}
		
		return $images;
	}
}