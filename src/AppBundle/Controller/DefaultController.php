<?php

namespace AppBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;

class DefaultController extends Controller
{
	/**
	 * @Route("/", defaults={"_format"="html"})
	 */
	public function indexAction(Request $request) {
	    $request->setRequestFormat("html");
		return $this->render("@App/Default/index.html.twig");
	}
    
}
