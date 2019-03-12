<?php

namespace ContactBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use AppBundle\Service\SiteService;

class DefaultController extends Controller
{
    
    /**
     * @Route("/contact", methods={"GET","HEAD"}, name="contact")
     */
    public function showAction(Request $request) {
        $request->setRequestFormat("html");
        
        $siteService = $this->container->get("site_service");
        
        return $this->render(
            "@Contact/contact.html.twig",
            [
                "phone" => $siteService->getPhoneNumber()
            ]
        );
    }
}
