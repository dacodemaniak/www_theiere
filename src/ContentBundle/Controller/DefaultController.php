<?php

namespace ContentBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;

class DefaultController extends Controller
{
    

    
    /**
     * Récupère le slider d'images pour la page d'accueil
     */
    public function homeSliderAction()
    {
        return $this->render('ContentBundle:Default:index.html.twig');
    }
}
