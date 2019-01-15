<?php

namespace ContentBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Encoder\JsonDecode;
use Symfony\Component\Serializer\Encoder\JsonEncoder;

/**
 * DecorArticle
 *
 * @ORM\Table(name="articletodecors")
 * @ORM\Entity(repositoryClass="ContentBundle\Repository\DecorArticleRepository")
 */
class DecorArticle
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
     * @ORM\Column(name="content", type="text", nullable=true)
     */
    private $content;

    /**
     * @ORM\ManyToOne(targetEntity=Article::class, inversedBy="decors")
     */
    protected $article;

    /**
     * @ORM\ManyToOne(targetEntity=Decor::class)
     */
    protected $decor;
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
     * Set content
     *
     * @param string $content
     *
     * @return DecorArticle
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
    	$json = new JsonDecode();
    	return $json->decode($this->content, JsonEncoder::FORMAT);
    }
    
    /**
     * Retourne le contenu d'un décorateur sous la forme d'un tableau associatif
     * @return array
     */
    public function getRawContent(): array {
        if ($this->content) {
            $json = new JsonDecode(true);
            
            return $json->decode($this->content, JsonEncoder::FORMAT);
        }
        
        return [];
    }
    
    public function setArticle(\ContentBundle\Entity\Article $article): DecorArticle {
    	$this->article = $article;
    	return $this;
    }
    
    public function setDecor(\ContentBundle\Entity\Decor $decor): DecorArticle {
    	$this->decor = $decor;
    	return $this;
    }
    
    /**
     * Retourne un des éléments de décors pour un article
     * @return Decor
     */
    public function getDecor(): Decor {
        return $this->decor;
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
                if (is_array($content)) {
                    $content = $content[0];
                }
                
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
        return "";
    }
}

