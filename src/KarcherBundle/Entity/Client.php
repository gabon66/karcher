<?php

namespace KarcherBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Client
 *
 * @ORM\Table(name="clients")
 * @ORM\Entity(repositoryClass="KarcherBundle\Repository\ClientRepository")
 */
class Client
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
     * @ORM\Column(name="contacto", type="string")
     */
    private $contacto;

    /**
     * @ORM\Column(name="mail", type="string")
     */
    private $mail;

    /**
     * @ORM\Column(name="mail1", type="string")
     */
    private $mail1;

    /**
     * @ORM\Column(name="phone", type="string")
     */
    private $phone;

    /**
     * @ORM\Column(name="phone1", type="string")
     */
    private $phone1;

    /**
     * @ORM\Column(name="phone_car", type="string")
     */
    private $phone1Car;

    /**
     * @ORM\Column(name="phone1_car", type="string")
     */
    private $phone2Car;

    /**
     * @ORM\Column(name="obs", type="string")
     */
    private $obs;


    /**
     * @ORM\Column(name="coords", type="string")
     */
    private $coord;

    /**
     * @ORM\Column(name="dir", type="string")
     */
    private $dir;

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
     * @return Client
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
     * Set mail
     *
     * @param string $mail
     *
     * @return Client
     */
    public function setMail($mail)
    {
        $this->mail = $mail;

        return $this;
    }

    /**
     * Get mail
     *
     * @return string
     */
    public function getMail()
    {
        return $this->mail;
    }

    /**
     * Set mail1
     *
     * @param string $mail1
     *
     * @return Client
     */
    public function setMail1($mail1)
    {
        $this->mail1 = $mail1;

        return $this;
    }

    /**
     * Get mail1
     *
     * @return string
     */
    public function getMail1()
    {
        return $this->mail1;
    }

    /**
     * Set phone
     *
     * @param string $phone
     *
     * @return Client
     */
    public function setPhone($phone)
    {
        $this->phone = $phone;

        return $this;
    }

    /**
     * Get phone
     *
     * @return string
     */
    public function getPhone()
    {
        return $this->phone;
    }

    /**
     * Set phone1
     *
     * @param string $phone1
     *
     * @return Client
     */
    public function setPhone1($phone1)
    {
        $this->phone1 = $phone1;

        return $this;
    }

    /**
     * Get phone1
     *
     * @return string
     */
    public function getPhone1()
    {
        return $this->phone1;
    }

    /**
     * Set obs
     *
     * @param string $obs
     *
     * @return Client
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
     * @return Client
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
     * Set phone1Car
     *
     * @param integer $phone1Car
     *
     * @return Client
     */
    public function setPhone1Car($phone1Car)
    {
        $this->phone1Car = $phone1Car;

        return $this;
    }

    /**
     * Get phone1Car
     *
     * @return integer
     */
    public function getPhone1Car()
    {
        return $this->phone1Car;
    }

    /**
     * Set phone2Car
     *
     * @param integer $phone2Car
     *
     * @return Client
     */
    public function setPhone2Car($phone2Car)
    {
        $this->phone2Car = $phone2Car;

        return $this;
    }

    /**
     * Get phone2Car
     *
     * @return integer
     */
    public function getPhone2Car()
    {
        return $this->phone2Car;
    }

    /**
     * Set coord
     *
     * @param string $coord
     *
     * @return Client
     */
    public function setCoord($coord)
    {
        $this->coord = $coord;

        return $this;
    }

    /**
     * Get coord
     *
     * @return string
     */
    public function getCoord()
    {
        return $this->coord;
    }

    /**
     * Set dir
     *
     * @param string $dir
     *
     * @return Client
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
}
