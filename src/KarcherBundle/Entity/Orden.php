<?php

namespace KarcherBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Orden
 *
 * @ORM\Table(name="orden")
 * @ORM\Entity(repositoryClass="KarcherBundle\Repository\OrdenRepository")
 */
class Orden
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
     * @ORM\Column(name="numero", type="string")
     */
    private $numero;

    /**
     * @ORM\Column(name="fing", type="datetime")
     */
    private $fing;

    /**
     * @ORM\Column(name="tipo", type="integer")
     */
    private $tipo;

    /**
     * @ORM\Column(name="ak", type="string")
     */
    private $ak;

    /**
     * @ORM\Column(name="dtr", type="string")
     */
    private $dtr;

    /**
     * @ORM\Column(name="cuno", type="string")
     */
    private $cuno;

    /**
     * @ORM\Column(name="nme", type="string")
     */
    private $phn;

    /**
     * @ORM\Column(name="eml", type="string")
     */
    private $eml;

    /**
     * @ORM\Column(name="prod_id", type="string")
     */
    private $prodId;

    /**
     * @ORM\Column(name="prod_pn", type="string")
     */
    private $prodPn;

    /**
     * @ORM\Column(name="prod_mdl", type="string")
     */
    private $prodMdl;

    /**
     * @ORM\Column(name="prod_sn", type="string")
     */
    private $prodSn;

    /**
     * @ORM\Column(name="acc1", type="string")
     */
    private $acc1;

    /**
     * @ORM\Column(name="acc2", type="string")
     */
    private $acc2;

    /**
     * @ORM\Column(name="acc3", type="string")
     */
    private $acc3;

    /**
     * @ORM\Column(name="acc4", type="string")
     */
    private $acc4;

    /**
     * @ORM\Column(name="acc5", type="string")
     */
    private $acc5;

    /**
     * @ORM\Column(name="acc6", type="string")
     */
    private $acc6;

    /**
     * @ORM\Column(name="acc7", type="string")
     */
    private $acc7;

    /**
     * @ORM\Column(name="img1", type="string")
     */
    private $img1;

    /**
     * @ORM\Column(name="img2", type="string")
     */
    private $img2;

    /**
     * @ORM\Column(name="img3", type="string")
     */
    private $img3;

    /**
     * @ORM\Column(name="prd", type="integer")
     */
    private $prd;

    /**
     * @ORM\Column(name="estd", type="integer")
     */
    private $estd;

    /**
     * @ORM\Column(name="fmod", type="datetime")
     */
    private $fmod;


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
     * Set numero
     *
     * @param string $numero
     *
     * @return Orden
     */
    public function setNumero($numero)
    {
        $this->numero = $numero;

        return $this;
    }

    /**
     * Get numero
     *
     * @return string
     */
    public function getNumero()
    {
        return $this->numero;
    }

    /**
     * Set fing
     *
     * @param \DateTime $fing
     *
     * @return Orden
     */
    public function setFing($fing)
    {
        $this->fing = $fing;

        return $this;
    }

    /**
     * Get fing
     *
     * @return \DateTime
     */
    public function getFing()
    {
        return $this->fing;
    }

    /**
     * Set tipo
     *
     * @param integer $tipo
     *
     * @return Orden
     */
    public function setTipo($tipo)
    {
        $this->tipo = $tipo;

        return $this;
    }

    /**
     * Get tipo
     *
     * @return integer
     */
    public function getTipo()
    {
        return $this->tipo;
    }

    /**
     * Set ak
     *
     * @param string $ak
     *
     * @return Orden
     */
    public function setAk($ak)
    {
        $this->ak = $ak;

        return $this;
    }

    /**
     * Get ak
     *
     * @return string
     */
    public function getAk()
    {
        return $this->ak;
    }

    /**
     * Set dtr
     *
     * @param string $dtr
     *
     * @return Orden
     */
    public function setDtr($dtr)
    {
        $this->dtr = $dtr;

        return $this;
    }

    /**
     * Get dtr
     *
     * @return string
     */
    public function getDtr()
    {
        return $this->dtr;
    }

    /**
     * Set cuno
     *
     * @param string $cuno
     *
     * @return Orden
     */
    public function setCuno($cuno)
    {
        $this->cuno = $cuno;

        return $this;
    }

    /**
     * Get cuno
     *
     * @return string
     */
    public function getCuno()
    {
        return $this->cuno;
    }

    /**
     * Set phn
     *
     * @param string $phn
     *
     * @return Orden
     */
    public function setPhn($phn)
    {
        $this->phn = $phn;

        return $this;
    }

    /**
     * Get phn
     *
     * @return string
     */
    public function getPhn()
    {
        return $this->phn;
    }

    /**
     * Set eml
     *
     * @param string $eml
     *
     * @return Orden
     */
    public function setEml($eml)
    {
        $this->eml = $eml;

        return $this;
    }

    /**
     * Get eml
     *
     * @return string
     */
    public function getEml()
    {
        return $this->eml;
    }

    /**
     * Set prodId
     *
     * @param string $prodId
     *
     * @return Orden
     */
    public function setProdId($prodId)
    {
        $this->prodId = $prodId;

        return $this;
    }

    /**
     * Get prodId
     *
     * @return string
     */
    public function getProdId()
    {
        return $this->prodId;
    }

    /**
     * Set prodPn
     *
     * @param string $prodPn
     *
     * @return Orden
     */
    public function setProdPn($prodPn)
    {
        $this->prodPn = $prodPn;

        return $this;
    }

    /**
     * Get prodPn
     *
     * @return string
     */
    public function getProdPn()
    {
        return $this->prodPn;
    }

    /**
     * Set prodMdl
     *
     * @param string $prodMdl
     *
     * @return Orden
     */
    public function setProdMdl($prodMdl)
    {
        $this->prodMdl = $prodMdl;

        return $this;
    }

    /**
     * Get prodMdl
     *
     * @return string
     */
    public function getProdMdl()
    {
        return $this->prodMdl;
    }

    /**
     * Set prodSn
     *
     * @param string $prodSn
     *
     * @return Orden
     */
    public function setProdSn($prodSn)
    {
        $this->prodSn = $prodSn;

        return $this;
    }

    /**
     * Get prodSn
     *
     * @return string
     */
    public function getProdSn()
    {
        return $this->prodSn;
    }

    /**
     * Set acc1
     *
     * @param string $acc1
     *
     * @return Orden
     */
    public function setAcc1($acc1)
    {
        $this->acc1 = $acc1;

        return $this;
    }

    /**
     * Get acc1
     *
     * @return string
     */
    public function getAcc1()
    {
        return $this->acc1;
    }

    /**
     * Set acc2
     *
     * @param string $acc2
     *
     * @return Orden
     */
    public function setAcc2($acc2)
    {
        $this->acc2 = $acc2;

        return $this;
    }

    /**
     * Get acc2
     *
     * @return string
     */
    public function getAcc2()
    {
        return $this->acc2;
    }

    /**
     * Set acc3
     *
     * @param string $acc3
     *
     * @return Orden
     */
    public function setAcc3($acc3)
    {
        $this->acc3 = $acc3;

        return $this;
    }

    /**
     * Get acc3
     *
     * @return string
     */
    public function getAcc3()
    {
        return $this->acc3;
    }

    /**
     * Set acc4
     *
     * @param string $acc4
     *
     * @return Orden
     */
    public function setAcc4($acc4)
    {
        $this->acc4 = $acc4;

        return $this;
    }

    /**
     * Get acc4
     *
     * @return string
     */
    public function getAcc4()
    {
        return $this->acc4;
    }

    /**
     * Set acc5
     *
     * @param string $acc5
     *
     * @return Orden
     */
    public function setAcc5($acc5)
    {
        $this->acc5 = $acc5;

        return $this;
    }

    /**
     * Get acc5
     *
     * @return string
     */
    public function getAcc5()
    {
        return $this->acc5;
    }

    /**
     * Set acc6
     *
     * @param string $acc6
     *
     * @return Orden
     */
    public function setAcc6($acc6)
    {
        $this->acc6 = $acc6;

        return $this;
    }

    /**
     * Get acc6
     *
     * @return string
     */
    public function getAcc6()
    {
        return $this->acc6;
    }

    /**
     * Set acc7
     *
     * @param string $acc7
     *
     * @return Orden
     */
    public function setAcc7($acc7)
    {
        $this->acc7 = $acc7;

        return $this;
    }

    /**
     * Get acc7
     *
     * @return string
     */
    public function getAcc7()
    {
        return $this->acc7;
    }

    /**
     * Set img1
     *
     * @param string $img1
     *
     * @return Orden
     */
    public function setImg1($img1)
    {
        $this->img1 = $img1;

        return $this;
    }

    /**
     * Get img1
     *
     * @return string
     */
    public function getImg1()
    {
        return $this->img1;
    }

    /**
     * Set img2
     *
     * @param string $img2
     *
     * @return Orden
     */
    public function setImg2($img2)
    {
        $this->img2 = $img2;

        return $this;
    }

    /**
     * Get img2
     *
     * @return string
     */
    public function getImg2()
    {
        return $this->img2;
    }

    /**
     * Set img3
     *
     * @param string $img3
     *
     * @return Orden
     */
    public function setImg3($img3)
    {
        $this->img3 = $img3;

        return $this;
    }

    /**
     * Get img3
     *
     * @return string
     */
    public function getImg3()
    {
        return $this->img3;
    }

    /**
     * Set prd
     *
     * @param integer $prd
     *
     * @return Orden
     */
    public function setPrd($prd)
    {
        $this->prd = $prd;

        return $this;
    }

    /**
     * Get prd
     *
     * @return integer
     */
    public function getPrd()
    {
        return $this->prd;
    }

    /**
     * Set estd
     *
     * @param integer $estd
     *
     * @return Orden
     */
    public function setEstd($estd)
    {
        $this->estd = $estd;

        return $this;
    }

    /**
     * Get estd
     *
     * @return integer
     */
    public function getEstd()
    {
        return $this->estd;
    }

    /**
     * Set fmod
     *
     * @param \DateTime $fmod
     *
     * @return Orden
     */
    public function setFmod($fmod)
    {
        $this->fmod = $fmod;

        return $this;
    }

    /**
     * Get fmod
     *
     * @return \DateTime
     */
    public function getFmod()
    {
        return $this->fmod;
    }
}
