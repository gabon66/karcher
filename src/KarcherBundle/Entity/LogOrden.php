<?php

namespace KarcherBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * LogOrden
 *
 * @ORM\Table(name="log_orden")
 * @ORM\Entity(repositoryClass="KarcherBundle\Repository\LogOrdenRepository")
 */
class LogOrden
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
     * @ORM\Column(name="img", type="string")
     */
    private $img;

    /**
     * @ORM\Column(name="user", type="integer")
     */
    private $user;

    /**
     * @ORM\Column(name="obs", type="string")
     */
    private $obs;

    /**
     * @ORM\Column(name="date", type="datetime")
     */
    private $date;

    /**
     * @ORM\Column(name="estado", type="integer")
     */
    private $estado;

        /**
         * @ORM\Column(name="orden_id", type="integer")
         */
    private $ordenId;

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
     * Set img
     *
     * @param string $img
     *
     * @return LogOrden
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
     * Set user
     *
     * @param integer $user
     *
     * @return LogOrden
     */
    public function setUser($user)
    {
        $this->user = $user;

        return $this;
    }

    /**
     * Get user
     *
     * @return integer
     */
    public function getUser()
    {
        return $this->user;
    }

    /**
     * Set obs
     *
     * @param string $obs
     *
     * @return LogOrden
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
     * Set date
     *
     * @param \DateTime $date
     *
     * @return LogOrden
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
     * Set estado
     *
     * @param integer $estado
     *
     * @return LogOrden
     */
    public function setEstado($estado)
    {
        $this->estado = $estado;

        return $this;
    }

    /**
     * Get estado
     *
     * @return integer
     */
    public function getEstado()
    {
        return $this->estado;
    }

    /**
     * Set ordenId
     *
     * @param integer $ordenId
     *
     * @return LogOrden
     */
    public function setOrdenId($ordenId)
    {
        $this->ordenId = $ordenId;

        return $this;
    }

    /**
     * Get ordenId
     *
     * @return integer
     */
    public function getOrdenId()
    {
        return $this->ordenId;
    }
}
