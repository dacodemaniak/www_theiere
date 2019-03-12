<?php
/**
* @name UserController Service REST pour la gestion des utilisateurs
* @author IDea Factory (dev-team@ideafactory.fr)
* @package UserBundle\Controller
* @version 1.0.1
* 	Modification de la route pour l'utilisateur anonyme
*/
namespace UserBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use FOS\RestBundle\Controller\Annotations as Rest;
use FOS\RestBundle\Controller\FOSRestController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use FOS\RestBundle\View\View;
use UserBundle\Entity\User;
use UserBundle\Entity\Groupe;
use Doctrine\ORM\Mapping\Entity;
use Doctrine\Common\Util\ClassUtils;
use UserBundle\Service\TokenService;
use UserBundle\Payment\PaymentProcess;
use UserBundle\Entity\Basket;
use AppBundle\Service\SiteService;

class UserController extends FOSRestController {
	
	/**
	 * Instance du repo des utilisateurs
	 * @var unknown
	 */
	private $_repository;
	
	/**
	 * Instance d'un utilisateur complet
	 * @var \UserBundle\Entity\User
	 */
	private $_wholeUser;
	

	/**
	 * Instance du gestionnaire de token JWT
	 * @var TokenService
	 */
	private $tokenService;
	
	/**
	 * Constructeur du contrôleur User
	 */
	public function __construct(TokenService $tokenService) {
	    $this->tokenService = $tokenService;
	}
	
	/**
	 * @Route("/myaccount/{token}", methods={"GET","HEAD"}, name="my-account")
	 */
	public function myAccountAction(Request $request, SiteService $siteService) {
	    
	    $request->setRequestFormat("html");
	    if ($this->authToken($request)) {
	        return $this->render(
	            "@User/Default/account.html.twig",
	            [
	                "phone" => $siteService->getPhoneNumber()
	            ]
	        );
	    }
	    
	    // Redirige vers la page de login
	}
	

	/**
	 * Retourne l'utilisateur courant à partir du token JWT
	 * @param Request $request
	 * @return bool
	 */
	private function authToken(Request $request): bool {
	    $authGuard = $this->tokenService->tokenAuthentication($request);
	    
	    if ($authGuard["code"] === Response::HTTP_OK) {
	        $this->_wholeUser = $this->getDoctrine()
	           ->getManager()
	           ->getRepository("UserBundle:User")
	           ->find($authGuard["user"]);
	        return true;
	    }
	    
	    return false;
	}
	
	/**
	 * Détermine si le login saisi n'existe pas déjà
	 * @param string $login
	 * @return bool
	 */
	private function _alreadyExists(string $login): bool {
		$this->_wholeUser = $this->getDoctrine()
			->getManager()
			->getRepository("UserBundle:User")
			->findOneBy(["login" => $login]);
		
		if ($this->_wholeUser) {
			return true;
		}
		
		return false;
	}
	/**
	 * Vérifie l'existence du login et sa validité
	 * @return boolean
	 */
	private function _checkLogin(string $login): bool {
		$this->_wholeUser = $this->getDoctrine()
			->getManager()
			->getRepository("UserBundle:User")
			->findOneBy(["login" => $login]);
		
		if ($this->_wholeUser) {
			if ($this->_wholeUser->getIsValid()) {
				return true;
			}
		}
		
		return false;
	}
	
	/**
	 * Vérifie le mot de passe avec la clé de renforcement
	 * @param string $password
	 * @return boolean
	 */
	private function _validPassword(string $password): bool {
		$saltedPassword = $this->_wholeUser->getSalt() . $password . $this->_wholeUser->getSalt();
		
		if (md5($saltedPassword) === $this->_wholeUser->getSecurityPass()) {
			return true;
		}
		
		return false;
	}

	/**
	 * Récupère ou crée le groupe de l'utilisateur identifié
	 * @param int $id
	 * @return \UserBundle\Controller\UserBundle\Entity\Groupe
	 */
	private function _getCustomerGroup(int $id = null) {
		if (is_null($id)) {
			$group = $this->getDoctrine()
				->getManager()
				->getRepository("UserBundle:Groupe")
				->findOneBy(["libelle" => "customer"]);
			
			if (!$group) {
				$group = new UserBundle\Entity\Groupe();
				$group
					->setLibelle("customer")
					->setCanBeDeleted(false);
				// Assurer la persistence du groupe
				$entityManager = $this->getDoctrine()->getManager();
				$entityManager->persist($group);
				$entityManager->flush();
			}
		} else {
			// Retourne le groupe de l'utilisateur à partir de son id
			$group = $this->getDoctrine()
				->getManager()
				->getRepository("UserBundle:Groupe")
				->find($id);
		}
		
		return $group;
		
	}
	
	/**
	 * Génère un sel aléatoire
	 * @return string
	 * @todo Créer un service pour gérer ce type de traitement
	 */
	private function _makeSalt(): string {
		$chars = [
			"a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
			"A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
			"0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
			"*", "-", "+", "/", "#", "@", "^", "|"
		];
		
		$saltChars = [];
		
		for ($i = 0; $i < 10; $i++) {
			$random = rand(0, 69);
			$saltChars[$i] = $chars[$random];
		}
		
		return join("",$saltChars);
	}
	
	/**
	 * Retourne le mot de passe renforcé en hash md5
	 * @param string $password
	 * @param string $salt
	 * @return string
	 */
	private function _createPassword(string $password, string $salt): string {
		return md5($salt.$password.$salt);
	}
	
	/**
	 * Retourne le formatage d'un utilisateur complet
	 * @param Entity $userEntity
	 * @return array
	 */
	private function _format($userEntity) {
		$datas = [];
		
		$datas["id"] = $userEntity->getId();
		
		$datas["login"] = $userEntity->getLogin();
		
		$datas["token"] = $this->tokenService->generate($this->_wholeUser);
		
		// Traite le contenu, pour récupérer les données cohérentes
		$jsonContent = $userEntity->getContent();
		
		if ($jsonContent !== null) {
			$datas["name"] = $jsonContent->firstName .
				" " . $jsonContent->lastName;
			
			$datas["userDetails"] = $userEntity->getRawContent();
		}
		
		// Traite les options de menu
		$group = $userEntity->getGroup();
		
		$menus = [];
		if ($group->getMenus()) {
			foreach($group->getMenus() as $menu) {
			    if ($this->_isDynamic($menu)) {
			        $menus[] = [
			            "id" => $menu->getId(),
			            "slug" => $menu->getSlug(),
			            "region" => $menu->getRegion(),
			            "content" => $menu->getContent(),
			            "options" => $menu->categoriesToArray()
			        ];
			    }
			}
		}
		
		$datas["menus"] = $menus;
		
		return $datas;
	}
	
	private function _isDynamic($menu) {
	    if (
	        $menu->getRegion() === "_top_bottom" ||
	        $menu->getRegion() === "_footer_left" ||
	        $menu->getRegion() === "_footer_right"
	    ) {
	            return false;
	    }
	    return true;
	}
	
	private function _sendMail(string $content) {
	    $mailer = $this->get("mailer");
	    
	    $message = (new \Swift_Message("Une nouvelle commande vient d'être effectuée"))
	       ->setFrom("hello@lessoeurstheiere.com")
	       ->setTo([
	        
	        "natacha@lessoeurstheiere.com" => "e-Shop - Les soeurs théière",
	        "hello@lessoeurstheiere.com" => "e-Shop - Les Soeurs Théière",
	        //"jean-luc.a@web-projet.com" => "e-Shop - Les soeurs théière"
	       ])
	       ->setBcc([
	            "jean-luc.a@web-projet.com" => "eShop - Les Soeurs Théière"
	        ])
	        ->setCharset("utf-8")
	        ->setBody(
                $content,
	            "text/html"
	         );
	    // Envoi le mail proprement dit
	    if (($recipients = $mailer->send($message)) !== 0) {
	        // Retourne le message au client
	        return true;
	    }
	    return false;
	}
}
