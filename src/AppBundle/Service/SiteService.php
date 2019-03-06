<?php
namespace AppBundle\Service;

use Doctrine\ORM\EntityManager;

class SiteService {
    /**
     * Gestionnaire d'entité Doctrine
     * @var EntityManager
     */
    private $em;
    
    public function __construct(EntityManager $entityManager) {
        $this->em = $entityManager;
    }
    
    public function getPhoneNumber(): array {
        $site = $this->em
            ->getRepository("SiteBundle:Site")
            ->find(1);
        
        $phone = $site->getContent()->phone;
        
        $publicPhone = "0" . substr($phone, 5, strlen($phone));
        $phone = str_replace(" ", "", $phone);
        
        return [
            "callNumber" => $phone,
            "affNumber"  => $publicPhone
        ];
    }
}