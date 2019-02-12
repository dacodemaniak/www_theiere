<?php

namespace UserBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Serializer\Encoder\JsonDecode;
use Symfony\Component\Serializer\Encoder\JsonEncoder;

/**
 * Basket
 *
 * @ORM\Table(name="orders")
 * @ORM\Entity(repositoryClass="UserBundle\Repository\BasketRepository")
 */
class Basket
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
     * @ORM\Column(name="reference", type="string", length=75, unique=true)
     */
    private $reference;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="convertdate", type="date")
     */
    private $convertDate;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="converttime", type="time")
     */
    private $convertTime;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="validationdate", type="datetime", nullable=true)
     */
    private $validationDate;

    /**
     * @var string
     *
     * @ORM\Column(name="paymentmode", type="string", length=2)
     */
    private $paymentMode;

    /**
     * @var float
     *
     * @ORM\Column(name="fulltaxtotal", type="float")
     */
    private $fullTaxTotal;

    /**
     * @var string
     *
     * @ORM\Column(name="content", type="text")
     */
    private $content;

    /**
     * @ORM\ManyToOne(targetEntity=User::class, inversedBy="orders")
     */
    protected $user;
    
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
     * Set reference
     *
     * @param void
     *
     * @return Basket
     */
    public function setReference(String $reference): self
    {   
        $this->reference = $reference;

        return $this;
    }

    /**
     * Get reference
     *
     * @return string
     */
    public function getReference()
    {
        return $this->reference;
    }

    /**
     * Set convertDate
     *
     * @param \DateTime $convertDate
     *
     * @return Basket
     */
    public function setConvertDate(\DateTime $convertDate)
    {
        $this->convertDate = $convertDate;

        return $this;
    }

    /**
     * Get convertDate
     *
     * @return \DateTime
     */
    public function getConvertDate()
    {
        return $this->convertDate;
    }

    /**
     * Set convertTime
     *
     * @param \DateTime $convertTime
     *
     * @return Basket
     */
    public function setConvertTime(\DateTime $convertTime)
    {
        $this->convertTime = $convertTime;

        return $this;
    }

    /**
     * Get convertTime
     *
     * @return \DateTime
     */
    public function getConvertTime()
    {
        return new \DateTime($this->convertTime);
    }

    /**
     * Set validationDate
     *
     * @param \DateTime $validationDate
     *
     * @return Basket
     */
    public function setValidationDate(\DateTime $validationDate)
    {
        $this->validationDate = $validationDate;

        return $this;
    }

    /**
     * Get validationDate
     *
     * @return \DateTime
     */
    public function getValidationDate()
    {
        return new \DateTime($this->validationDate);
    }

    /**
     * Set paymentMode
     *
     * @param string $paymentMode
     *
     * @return Basket
     */
    public function setPaymentMode($paymentMode)
    {
        $this->paymentMode = $paymentMode;

        return $this;
    }

    /**
     * Get paymentMode
     *
     * @return string
     */
    public function getPaymentMode()
    {
        return $this->paymentMode;
    }

    /**
     * Set fullTaxTotal
     *
     * @param float $fullTaxTotal
     *
     * @return Basket
     */
    public function setFullTaxTotal($fullTaxTotal)
    {
        $this->fullTaxTotal = $fullTaxTotal;

        return $this;
    }

    /**
     * Get fullTaxTotal
     *
     * @return float
     */
    public function getFullTaxTotal()
    {
        return $this->fullTaxTotal;
    }

    /**
     * Set content
     *
     * @param string $content
     *
     * @return Basket
     */
    public function setContent(Request $content)
    {
        $orderContent = [
            "basket" => $content->get("basket"),
            "deliveryAddress" => $content->get("deliveryAddress"),
            "carrier" => $content->get("carrier"),
            "carryingType" => $content->get("carryingType")
        ];
        
        $this->content = json_encode($orderContent);

        return $this;
    }

    /**
     * Get content
     *
     * @return string
     */
    public function getContent()
    {
        if ($this->content !== null) {
            $json = new JsonDecode();
            return $json->decode($this->content, JsonEncoder::FORMAT);
        }
        
        return null;
    }
    
    /**
     * Définit le propriétaire de la commande
     * @param User $user
     */
    public function setUser(User $user): self {
        $this->user = $user;
        return $this;
    }
    
    public function getUser(): User {
        return $this->user;
    }
    
    public function getDeliveryAddress(): string {
        return $this->getContent() !== null ? $this->getContent()->deliveryAddress : "";
    }
    
    public function getCarrier(): string {
        return $this->getContent() !== null ? $this->getContent()->carrier : "";
    }
    
    public function getCarryingMode(): string {
        return $this->getContent() !== null ? $this->getContent()->carryingType : "";
    }
    
    public function getBasket() {
        return $this->getContent() !== null ? $this->getContent()->basket : "";
    }
}

