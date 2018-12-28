<?php

namespace MenuBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class DefaultController extends Controller
{
    /**
     * Affiche le menu pied de page gauche
     */
    public function leftFooterMenuAction()
    {
        $menu = $this->getBySlug("informations");
        
        return $this->render(
            "@FooterMenu/footermenu.html.twig",
            [
                "slug" => $menu->getSlug(),
                "headerMenu" => $menu->getContent(),
                "options" => $menu->categoriesToArray()
            ]
        );
    }

    /**
     * Affiche le menu pied de page centre
     * @todo Contrôler la présence d'un utilisateur connecté avant de gérer l'option de menu
     */
    public function centerFooterMenuAction()
    {
        $menu = $this->getBySlug("my_account");
        
        return $this->render(
            "@FooterMenu/footermenu.html.twig",
            [
                "slug" => $menu->getSlug(),
                "headerMenu" => $menu->getContent(),
                "options" => $menu->categoriesToArray()
            ]
            );
    }
    
    /**
     * Affiche le menu pied de page droite
     */
    public function rightFooterMenuAction()
    {
        $menu = $this->getBySlug("qui_sommes_nous");
        
        return $this->render(
            "@FooterMenu/footermenu.html.twig",
            [
                "slug" => $menu->getSlug(),
                "headerMenu" => $menu->getContent(),
                "options" => $menu->categoriesToArray()
            ]
            );
    }
    
    /**
     * Retourne le menu par l'intermédiaire du slug
     * @param string $slug
     * @return \MenuBundle\Entity\Menu|NULL
     */
    private function getBySlug(string $slug) {
        $menu = $this->getDoctrine()
            ->getManager()
            ->getRepository(\MenuBundle\Entity\Menu::class)
            ->findOneBy(["slug" => $slug]);
        
        return $menu;
    }
}