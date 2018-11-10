<?php
/**
 * @name DefaultController Récupération des informations relatives à l'utilisateur anonyme
 * @author IDea Factory (dev-team@ideafactory.fr) - Oct. 2018
 * @package UserBundle\Controller
 * @version 1.0.0
 */
namespace UserBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;

class DefaultController extends Controller
{
	/**
	 * Instance d'un utilisateur complet
	 * @var unknown
	 */
	private $_wholeUser;
	
	/**
	 * @Route("/user")
	 */
    public function indexAction()
    {

    }
    
}
