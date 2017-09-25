<?php

namespace KarcherBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Distribuidor
 *
 * @ORM\Table(name="distribuidor")
 * @ORM\Entity(repositoryClass="KarcherBundle\Repository\DistribuidorRepository")
 */
class Distribuidor
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
     * @ORM\Column(name="name", type="string")
     */
    private $name;

    /**
     * @ORM\Column(name="descript", type="string")
     */
    private $descript;

    /**
     * @ORM\Column(name="coords", type="string")
     */
    private $coords;


    /**
     * @ORM\Column(name="dir", type="string")
     */
    private $dir;

    /**
     * @ORM\Column(name="email", type="string")
     */
    private $email;

    /**
     * @ORM\Column(name="web", type="string")
     */
    private $web;


    /**
     * @ORM\Column(name="tel", type="string")
     */
    private $tel;


    /**
     * @ORM\Column(name="obs", type="string")
     */
    private $obs;


    /**
     * @ORM\Column(name="contacto", type="string")
     */
    private $contacto;

    /**
     * @ORM\Column(name="pais", type="integer")
     */
    private $pais;


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
     * Set name
     *
     * @param string $name
     *
     * @return Distribuidor
     */
    public function setName($name)
    {
        $this->name = $name;

        return $this;
    }

    /**
     * Get name
     *
     * @return string
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * Set descript
     *
     * @param string $descript
     *
     * @return Distribuidor
     */
    public function setDescript($descript)
    {
        $this->descript = $descript;

        return $this;
    }

    /**
     * Get descript
     *
     * @return string
     */
    public function getDescript()
    {
        return $this->descript;
    }

    /**
     * Set dir
     *
     * @param string $dir
     *
     * @return Distribuidor
     */
    public function setDir($dir)
    {
        $this->dir = $dir;

        return $this;
    }

    /**
     * Get dir
     *
     * @return string
     */
    public function getDir()
    {
        return $this->dir;
    }

    /**
     * Set coords
     *
     * @param string $coords
     *
     * @return Distribuidor
     */
    public function setCoords($coords)
    {
        $this->coords = $coords;

        return $this;
    }

    /**
     * Get coords
     *
     * @return string
     */
    public function getCoords()
    {
        return $this->coords;
    }

    /**
     * Set email
     *
     * @param string $email
     *
     * @return Distribuidor
     */
    public function setEmail($email)
    {
        $this->email = $email;

        return $this;
    }

    /**
     * Get email
     *
     * @return string
     */
    public function getEmail()
    {
        return $this->email;
    }

    /**
     * Set web
     *
     * @param string $web
     *
     * @return Distribuidor
     */
    public function setWeb($web)
    {
        $this->web = $web;

        return $this;
    }

    /**
     * Get web
     *
     * @return string
     */
    public function getWeb()
    {
        return $this->web;
    }

    /**
     * Set tel
     *
     * @param string $tel
     *
     * @return Distribuidor
     */
    public function setTel($tel)
    {
        $this->tel = $tel;

        return $this;
    }

    /**
     * Get tel
     *
     * @return string
     */
    public function getTel()
    {
        return $this->tel;
    }

    /**
     * Set obs
     *
     * @param string $obs
     *
     * @return Distribuidor
     */
    public function setObs($obs)
    {
        $this->obs = $obs;

        return $this;
    }

    /**
     * Get obs
     *
     * @return string
     */
    public function getObs()
    {
        return $this->obs;
    }

    /**
     * Set contacto
     *
     * @param string $contacto
     *
     * @return Distribuidor
     */
    public function setContacto($contacto)
    {
        $this->contacto = $contacto;

        return $this;
    }

    /**
     * Get contacto
     *
     * @return string
     */
    public function getContacto()
    {
        return $this->contacto;
    }

    /**
     * Set pais
     *
     * @param integer $pais
     *
     * @return Distribuidor
     */
    public function setPais($pais)
    {
        $this->pais = $pais;

        return $this;
    }

    /**
     * Get pais
     *
     * @return integer
     */
    public function getPais()
    {
        return $this->pais;
    }
}
