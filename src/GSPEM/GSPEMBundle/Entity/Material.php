<?php

namespace GSPEM\GSPEMBundle\Entity;

/**
 * Material
 */
class Material
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
    private $name;

    /**
     * @var string
     */
    private $descript;

    /**
     * @var integer
     */
    private $type;

    /**
     * @var integer
     */
    private $idCustom;

    /**
     * @var string
     */
    private $img;

    /**
     * @var \DateTime
     */
    private $date;


    /**
     * Set name
     *
     * @param string $name
     *
     * @return Material
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
     * @return Material
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
     * @return Material
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
     * Set idCustom
     *
     * @param integer $idCustom
     *
     * @return Material
     */
    public function setIdCustom($idCustom)
    {
        $this->idCustom = $idCustom;

        return $this;
    }

    /**
     * Get idCustom
     *
     * @return integer
     */
    public function getIdCustom()
    {
        return $this->idCustom;
    }

    /**
     * Set img
     *
     * @param string $img
     *
     * @return Material
     */
    public function setImg($img)
    {
        $this->img = $img;

        return $this;
    }

    /**
     * Get img
     *
     * @return string
     */
    public function getImg()
    {
        return $this->img;
    }

    /**
     * Set date
     *
     * @param \DateTime $date
     *
     * @return Material
     */
    public function setDate($date)
    {
        $this->date = $date;

        return $this;
    }

    /**
     * Get date
     *
     * @return \DateTime
     */
    public function getDate()
    {
        return $this->date;
    }
    /**
     * @var string
     */
    private $origen;

    /**
     * @var string
     */
    private $ubicacion;

    /**
     * @var string
     */
    private $referencia;


    /**
     * Set origen
     *
     * @param string $origen
     *
     * @return Material
     */
    public function setOrigen($origen)
    {
        $this->origen = $origen;

        return $this;
    }

    /**
     * Get origen
     *
     * @return string
     */
    public function getOrigen()
    {
        return $this->origen;
    }

    /**
     * Set ubicacion
     *
     * @param string $ubicacion
     *
     * @return Material
     */
    public function setUbicacion($ubicacion)
    {
        $this->ubicacion = $ubicacion;

        return $this;
    }

    /**
     * Get ubicacion
     *
     * @return string
     */
    public function getUbicacion()
    {
        return $this->ubicacion;
    }

    /**
     * Set referencia
     *
     * @param string $referencia
     *
     * @return Material
     */
    public function setReferencia($referencia)
    {
        $this->referencia = $referencia;

        return $this;
    }

    /**
     * Get referencia
     *
     * @return string
     */
    public function getReferencia()
    {
        return $this->referencia;
    }
    /**
     * @var integer
     */
    private $umbralmin;

    /**
     * @var integer
     */
    private $umbralmax;


    /**
     * Set umbralmin
     *
     * @param integer $umbralmin
     *
     * @return Material
     */
    public function setUmbralmin($umbralmin)
    {
        $this->umbralmin = $umbralmin;

        return $this;
    }

    /**
     * Get umbralmin
     *
     * @return integer
     */
    public function getUmbralmin()
    {
        return $this->umbralmin;
    }

    /**
     * Set umbralmax
     *
     * @param integer $umbralmax
     *
     * @return Material
     */
    public function setUmbralmax($umbralmax)
    {
        $this->umbralmax = $umbralmax;

        return $this;
    }

    /**
     * Get umbralmax
     *
     * @return integer
     */
    public function getUmbralmax()
    {
        return $this->umbralmax;
    }
    /**
     * @var string
     */
    private $cod_barra;

    /**
     * @var string
     */
    private $serial_n;

    /**
     * @var string
     */
    private $model;

    /**
     * @var string
     */
    private $pn;


    /**
     * Set codBarra
     *
     * @param string $codBarra
     *
     * @return Material
     */
    public function setCodBarra($codBarra)
    {
        $this->cod_barra = $codBarra;

        return $this;
    }

    /**
     * Get codBarra
     *
     * @return string
     */
    public function getCodBarra()
    {
        return $this->cod_barra;
    }

    /**
     * Set serialN
     *
     * @param string $serialN
     *
     * @return Material
     */
    public function setSerialN($serialN)
    {
        $this->serial_n = $serialN;

        return $this;
    }

    /**
     * Get serialN
     *
     * @return string
     */
    public function getSerialN()
    {
        return $this->serial_n;
    }

    /**
     * Set model
     *
     * @param string $model
     *
     * @return Material
     */
    public function setModel($model)
    {
        $this->model = $model;

        return $this;
    }

    /**
     * Get model
     *
     * @return string
     */
    public function getModel()
    {
        return $this->model;
    }

    /**
     * Set pn
     *
     * @param string $pn
     *
     * @return Material
     */
    public function setPn($pn)
    {
        $this->pn = $pn;

        return $this;
    }

    /**
     * Get pn
     *
     * @return string
     */
    public function getPn()
    {
        return $this->pn;
    }
    /**
     * @var integer
     */
    private $pn_number;


    /**
     * Set pnNumber
     *
     * @param integer $pnNumber
     *
     * @return Material
     */
    public function setPnNumber($pnNumber)
    {
        $this->pn_number = $pnNumber;

        return $this;
    }

    /**
     * Get pnNumber
     *
     * @return integer
     */
    public function getPnNumber()
    {
        return $this->pn_number;
    }
}
