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
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class DefaultController extends Controller
{
	
	/**
	 * @Route("/signin/{from}", defaults={"_format"="html", "from"="anywhere"}, methods={"GET","HEAD"}, name="signin-form")
	 */
	public function showFormAction(Request $request) {
	    $request->setRequestFormat("html");
	    
	    return $this->render(
	        "@User/Default/index.html.twig"
	    );
	}
    
}
