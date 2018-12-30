<?php
namespace ContentBundle\Menu;

/**
 * @name MenuBuilder
 * @desc Implémentation de knpMenu pour la génération du menu principal
 * @author IDea Factory - Déc. 2018 (dev-team@ideafactory.fr)
 * @namespace ContentBundle\Menu
 * @version 1.0.0
 */

use Knp\Menu\FactoryInterface;
use Symfony\Component\DependencyInjection\ContainerAwareInterface;
use Symfony\Component\DependencyInjection\ContainerAwareTrait;

class MenuBuilder implements ContainerAwareInterface {
    
    use ContainerAwareTrait;
    
    /**
     * Menu principal de l'application
     * @var unknown
     */
    private $menu;
    
    public function categoriesMenu(FactoryInterface $factory, array $options) {
        $this->menu = $factory->createItem("root");
        
        $this->menu->setChildrenAttribute("class", "navbar-nav mr-auto");
        
        // Récupérer les options du menu des Catégories : slug = _top_bottom
        $this->options();
        
        return $this->menu;
        
    }
    
    /**
     * Ajoute les éléments au menu principal des catégories
     * @todo Ajouter la route correspondante
     */
    private function options() {
        $entityManager = $this->container->get('doctrine')->getManager();
        
        $topBottomMenu = $entityManager->getRepository("MenuBundle:Menu")->findOneBySlug("categories");
        
        
        $options = $topBottomMenu->categoriesToArray();
        
        foreach ($options as $option) {
            $this->menu->addChild(
                $option["content"]["title"]["fr"]
            )
            ->setLinkAttribute("class", "nav-link")
            ->setAttribute("dropdown", true);
            
            if (array_key_exists("nodes", $option)) {
                foreach ($option["nodes"] as $node) {                  
                    $this->menu[$option["content"]["title"]["fr"]]->addChild(
                        array_key_exists("fr", $node["content"]["title"]) ? $node["content"]["title"]["fr"] : $node["content"]["title"][0]["fr"],
                        [
                            "route" => "products_category",
                            "routeParameters" => ["slug" => $node["id"]]
                        ]
                    )
                    ->setLinkAttribute("class", "nav-link");
                    
                }
            }
        }
        
        
    }
}

