<?php

namespace ContentBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Encoder\JsonDecode;
use Symfony\Component\Serializer\Encoder\JsonEncoder;

/**
 * Decor
 *
 * @ORM\Table(name="decor")
 * @ORM\Entity(repositoryClass="ContentBundle\Repository\DecorRepository")
 */
class Decor
{
    /**
     * @var int
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @var string
     *
     * @ORM\Column(name="slug", type="string", length=75, unique=true)
     */
    private $slug;

    /**
     * @var string
     *
     * @ORM\Column(name="content", type="text", nullable=true)
     */
    private $content;


    /**
     * Get id
     *
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set slug
     *
     * @param string $slug
     *
     * @return Decor
     */
    public function setSlug($slug)
    {
        $this->slug = $slug;

        return $this;
    }

    /**
     * Get slug
     *
     * @return string
     */
    public function getSlug()
    {
        return $this->slug;
    }

    /**
     * Set content
     *
     * @param string $content
     *
     * @return Decor
     */
    public function setContent($content)
    {
        $this->content = $content;

        return $this;
    }

    /**
     * Get content
     *
     * @return string
     */
    public function getContent()
    {
        if ($this->content) {
            $json = new JsonDecode();
            return $json->decode($this->content, JsonEncoder::FORMAT);
        }
    }
    
    public function getRawContent(): array {
        if ($this->content) {
            $json = new JsonDecode(true);
            
            return $json->decode($this->content, JsonEncoder::FORMAT);
        }
        
        return [];
    }
    
    /**
     * Méthode magique pour la récupération d'un contenu spécifique
     * dans le contenu JSON d'un document
     * @param string $methodName
     * @param array $args
     */
    public function __call(string $methodName, array $args) {
        if (($content = $this->getContent()) !== null) {
            preg_match_all('/((?:^|[A-Z])[a-z]+)/', $methodName, $methodComposition);
            
            $composition = $methodComposition[0];
            
            $isGetter = ($composition[0] === "get") ? true : false;
            $hasLang = (count($composition) === 3) ? true : false;
            
            $property = strtolower($composition[1]);
            
            if ($isGetter) {
                if (property_exists($content, $property) && $content->{$property} !== null) {
                    if ($hasLang) {
                        if (property_exists($content->{$property}, strtolower($composition[2]))) {
                            return $content->{$property}->{strtolower($composition[2])};
                        }
                    } else {
                        return $content->{$property};
                    }
                }
            }
        }
        return null;
    }
}

