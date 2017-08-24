<?php

namespace GSPEM\GSPEMBundle\Entity;

/**
 * StockMaestro
 */
class StockMaestro
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
     * @var int
     */
    private $material;

    /**
     * @var int
     */
    private $cant;


    /**
     * Set material
     *
     * @param \int $material
     *
     * @return StockMaestro
     */
    public function setMaterial($material)
    {
        $this->material = $material;

        return $this;
    }

    /**
     * Get material
     *
     * @return \int
     */
    public function getMaterial()
    {
        return $this->material;
    }

    /**
     * Set cant
     *
     * @param \int $cant
     *
     * @return StockMaestro
     */
    public function setCant($cant)
    {
        $this->cant = $cant;

        return $this;
    }

    /**
     * Get cant
     *
     * @return \int
     */
    public function getCant()
    {
        return $this->cant;
    }
}
