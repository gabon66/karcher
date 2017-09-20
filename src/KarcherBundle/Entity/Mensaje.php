<?php

namespace KarcherBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Mensaje
 *
 * @ORM\Table(name="mensajes")
 * @ORM\Entity(repositoryClass="KarcherBundle\Repository\MensajeRepository")
 */
class Mensaje
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
     * @ORM\Column(name="from_user", type="integer")
    */
    private $from;

    /**
     * @ORM\Column(name="to_user", type="integer")
     */
    private $to;


    /**
     * @ORM\Column(name="state", type="integer")
     */
    private $state;

    /**
     * @ORM\Column(name="date", type="datetime")
     */
    private $date;

    /**
     * @ORM\Column(name="asunto", type="string")
     */
    private $asunto;

    /**
     * @ORM\Column(name="mensaje", type="string")
     */
    private $mensaje;


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
     * Set from
     *
     * @param integer $from
     *
     * @return Mensaje
     */
    public function setFrom($from)
    {
        $this->from = $from;

        return $this;
    }

    /**
     * Get from
     *
     * @return integer
     */
    public function getFrom()
    {
        return $this->from;
    }

    /**
     * Set to
     *
     * @param integer $to
     *
     * @return Mensaje
     */
    public function setTo($to)
    {
        $this->to = $to;

        return $this;
    }

    /**
     * Get to
     *
     * @return integer
     */
    public function getTo()
    {
        return $this->to;
    }

    /**
     * Set state
     *
     * @param integer $state
     *
     * @return Mensaje
     */
    public function setState($state)
    {
        $this->state = $state;

        return $this;
    }

    /**
     * Get state
     *
     * @return integer
     */
    public function getState()
    {
        return $this->state;
    }

    /**
     * Set date
     *
     * @param \DateTime $date
     *
     * @return Mensaje
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
     * Set asunto
     *
     * @param string $asunto
     *
     * @return Mensaje
     */
    public function setAsunto($asunto)
    {
        $this->asunto = $asunto;

        return $this;
    }

    /**
     * Get asunto
     *
     * @return string
     */
    public function getAsunto()
    {
        return $this->asunto;
    }

    /**
     * Set mensaje
     *
     * @param string $mensaje
     *
     * @return Mensaje
     */
    public function setMensaje($mensaje)
    {
        $this->mensaje = $mensaje;

        return $this;
    }

    /**
     * Get mensaje
     *
     * @return string
     */
    public function getMensaje()
    {
        return $this->mensaje;
    }
}
