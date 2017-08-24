<?php

namespace GSPEM\GSPEMBundle\Entity;

/**
 * Sitio
 */
class Sitio
{
    /**
     * @var int
     */
    private $id;


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
     * @var string
     */
    private $lat;

    /**
     * @var string
     */
    private $long;

    /**
     * @var string
     */
    private $descript;

    /**
     * @var int
     */
    private $type;


    /**
     * Set lat
     *
     * @param string $lat
     *
     * @return Sitio
     */
    public function setLat($lat)
    {
        $this->lat = $lat;

        return $this;
    }

    /**
     * Get lat
     *
     * @return string
     */
    public function getLat()
    {
        return $this->lat;
    }

    /**
     * Set long
     *
     * @param string $long
     *
     * @return Sitio
     */
    public function setLong($long)
    {
        $this->long = $long;

        return $this;
    }

    /**
     * Get long
     *
     * @return string
     */
    public function getLong()
    {
        return $this->long;
    }

    /**
     * Set descript
     *
     * @param string $descript
     *
     * @return Sitio
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
     * Set type
     *
     * @param integer $type
     *
     * @return Sitio
     */
    public function setType($type)
    {
        $this->type = $type;

        return $this;
    }

    /**
     * Get type
     *
     * @return integer
     */
    public function getType()
    {
        return $this->type;
    }
    /**
     * @var string
     */
    private $direccion;


    /**
     * Set direccion
     *
     * @param string $direccion
     *
     * @return Sitio
     */
    public function setDireccion($direccion)
    {
        $this->direccion = $direccion;

        return $this;
    }

    /**
     * Get direccion
     *
     * @return string
     */
    public function getDireccion()
    {
        return $this->direccion;
    }
    /**
     * @var string
     */
    private $name;


    /**
     * Set name
     *
     * @param string $name
     *
     * @return Sitio
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
     * @var string
     */
    private $emplazamiento;


    /**
     * Set emplazamiento
     *
     * @param string $emplazamiento
     *
     * @return Sitio
     */
    public function setEmplazamiento($emplazamiento)
    {
        $this->emplazamiento = $emplazamiento;

        return $this;
    }

    /**
     * Get emplazamiento
     *
     * @return string
     */
    public function getEmplazamiento()
    {
        return $this->emplazamiento;
    }
}
