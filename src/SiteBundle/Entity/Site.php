<?php

namespace SiteBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Encoder\JsonDecode;
use Symfony\Component\Serializer\Encoder\JsonEncoder;

/**
 * Site
 *
 * @ORM\Table(name="site")
 * @ORM\Entity(repositoryClass="SiteBundle\Repository\SiteRepository")
 */
class Site
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
     * @var bool
     *
     * @ORM\Column(name="is_enabled", type="boolean")
     */
    private $isEnabled;


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
     * @return Site
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

    /**
     * Retourne le contenu de l'article sous forme de tableau
     * @return array
     */
    public function getRawContent(): array {
        if ($this->content) {
            
            $json = new JsonDecode(true);
            
            return $json->decode($this->content, JsonEncoder::FORMAT);
        }
        
        return [];
    }
    /**
     * Set isEnabled
     *
     * @param boolean $isEnabled
     *
     * @return Site
     */
    public function setIsEnabled($isEnabled)
    {
        $this->isEnabled = $isEnabled;

        return $this;
    }

    /**
     * Get isEnabled
     *
     * @return bool
     */
    public function getIsEnabled()
    {
        return $this->isEnabled;
    }
}

