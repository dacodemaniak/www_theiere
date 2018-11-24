<?php

namespace ContentBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;

class DefaultController extends Controller
{
    /**
     * @Route("/content")
     */
    public function indexAction()
    {
        return $this->render('ContentBundle:Default:index.html.twig');
    }
}
