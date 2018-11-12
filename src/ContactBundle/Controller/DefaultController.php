<?php

namespace ContactBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use FOS\RestBundle\Controller\Annotations as Rest;
use FOS\RestBundle\Controller\FOSRestController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use FOS\RestBundle\View\View;

class DefaultController extends Controller
{
    /**
     * @Rest\Put("/contact")
     */
    public function indexAction(Request $request)
    {
        $mailer = $this->get("mailer");
        
        $mailContents = [
            "name" => $request->get("name"),
            "email" => $request->get("email"),
            "message" => $request->get("message")
        ];
        
        $message = (new \Swift_Message("Contact depuis le site"))
            ->setFrom("hello@lessoeurstheiere.com")
            ->setTo("natacha@lessoeurstheiere.com")
            ->setTo("jla.webprojet@gmail.com")
            ->setBody(
                $this->renderView(
                    "@Contact/Email/contact.html.twig",
                    $mailContents
                ),
                "text/html"
            );
        
        // Envoi le mail proprement dit
        if ($mailer->send($message) !== 0) {
            // Retourne le message au client
            return new View("Votre message a bien été envoyé.", Response::HTTP_OK);
        } else {
            return new View("Une erreur est survenue lors de l'envoi de votre message.", Response::HTTP_SERVICE_UNAVAILABLE);
        }
    }
}
