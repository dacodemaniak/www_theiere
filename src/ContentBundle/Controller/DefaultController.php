<?php

namespace ContentBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

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
