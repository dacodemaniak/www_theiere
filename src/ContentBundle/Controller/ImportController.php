<?php
namespace ContentBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use ContentBundle\Entity\Article;
use ContentBundle\Import\CategoryPooler;
use ContentBundle\Import\CategoryHandler;
use ContentBundle\Import\SubCategoryHandler;
use ContentBundle\Import\ProductHandler;

class ImportController extends Controller {
	
	/**
	 * Pooler de catégories
	 * @var ContentBundle\Import\CategoryPooler
	 */
	private $categoryPooler;
	
	/**
	 * @Route("/products/import/", name="articles_import")
	 * @Method({"GET"})
	 */
	public function importArticleAction(Request $request)
	{
		// Définit la catégorie racine de l'importation
		$categoryRepository = $this->getDoctrine()->getRepository("MenuBundle:Categorie");
		$this->categoryPooler = new CategoryPooler($categoryRepository->find(5), $this->getDoctrine()->getManager());
		
		$handle = $this->_open();
		
		// Incrément de lignes lues
		$row = 1;
		
		// Import du fichier CSV
		if ( $handle ) { // Lecture du fichier, à adapter
			while (($data = fgetcsv($handle, 1000, "\t")) !== FALSE) { // Eléments séparés par un point-virgule, à modifier si necessaire
				if ($row > 1) {
					$count = count($data);
					
					for ($i=0; $i < $count; $i++) {
						$datas[] = $data[$i];
					}
					
					echo "*********************************<br>\n";
					var_dump($datas);
					echo "<br>\n*******************************<br>\n";
					
					// Entre dans la chaîne de responsabilités
					$categoryHandler = new CategoryHandler($this->categoryPooler);
					$subCategoryHandler = new SubCategoryHandler($this->categoryPooler);
					$productHandler = new ProductHandler($this->categoryPooler);
					$categoryHandler->setNext($subCategoryHandler)->setNext($productHandler);
					$categoryHandler->handle($datas);
					
					$datas = [];
				}
				$row++;
			}
			fclose($handle);
		}
		
		// Renvoi la réponse (ici affiche un simple OK pour l'exemple)
		return new JsonResponse("Importation terminée ! ");
	}
	
	/**
	 * Ouvre le fichier d'import en lecture
	 * @return resource | boolean
	 */
	private function _open() {
		$path = __DIR__ . "/../Resources/_csv/sale.csv";
		
		return fopen($path, "r");
	}
	
	/**
	 * Crée le hash de contrôle à partir des données transmises
	 * @param array $data
	 * @return string
	 */
	private function _makeHash(array $data): string {
		$_entry = mb_strtoupper(trim($data[2]) . 
				trim($data[1]) . 
				trim($data[0]) . 
				trim($data[3])
		);
		$_hash = md5($_entry);
		
		if (($fh = fopen(__DIR__ . "/../Resources/_csv/hash.log", "a+")) !== false) {
			fwrite($fh, $_entry . " <=> " . $_hash . "\n");
			fclose($fh);
		} else {
			die("Impossible d'ouvrir le fichier de log");
		}
		return $_hash;
		
		/*return md5(strtoupper(
				$data[2] .
				$data[1] .
				$data[0] .
				$data[3]
		));
		*/
	}
	
	/**
	 * Traitement des données lues sous forme de Chain of Responsibilities
	 * @param array $data
	 * @return
	 */
	private function _check(array $data) {
		
	}
}