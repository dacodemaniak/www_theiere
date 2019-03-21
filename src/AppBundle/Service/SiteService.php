<?php
namespace AppBundle\Service;

use Doctrine\ORM\EntityManager;

class SiteService {
    /**
     * Gestionnaire d'entité Doctrine
     * @var EntityManager
     */
    private $em;
    
    private $site;
    
    public function __construct(EntityManager $entityManager) {
        $this->em = $entityManager;
        
        $this->site = $entityManager
            ->getRepository("SiteBundle:Site")
            ->find(1);
    }
    
    /**
     * Retourne le tableau de constitution du téléphone
     * @return array
     */
    public function getPhoneNumber(): array {

        
        $phone = $this->site->getContent()->phone;
        
        $publicPhone = "0" . substr($phone, 5, strlen($phone));
        $phone = str_replace(" ", "", $phone);
        
        return [
            "callNumber" => $phone,
            "affNumber"  => $publicPhone
        ];
    }
    
    /**
     * Retourne le titre du site
     * @return string
     */
    public function getSiteTitle(): string {
        
        return $this->site->getContent()->title->fr;
        
    }
    
    /**
     * Retourne le nom court du site
     * @return string
     */
    public function getName(): string {
        return $this->site->getContent()->name;
    }
}