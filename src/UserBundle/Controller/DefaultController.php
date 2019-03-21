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
use AppBundle\Service\SiteService;

class DefaultController extends Controller
{
	
	/**
	 * @Route("/signin/{from}", defaults={"_format"="html", "from"="anywhere"}, methods={"GET","HEAD"}, name="signin-form")
	 */
	public function showFormAction(Request $request, SiteService $siteService) {
	    $request->setRequestFormat("html");
	    
	    //$siteService = $this->container->get('site_service');
	    
	    return $this->render(
	        "@User/Default/index.html.twig",
	        [
	            "site" => $siteService
	        ]
	    );
	}
    
}
