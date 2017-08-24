<?php

namespace KarcherBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;

use KarcherBundle\Entity\Distribuidor;
use KarcherBundle\Entity\MaterialOrigen;

use GSPEM\GSPEMBundle\Entity\Material;
use GSPEM\GSPEMBundle\Entity\StockMaestro;

use GSPEM\GSPEMBundle\Entity\MaterialType;
use GSPEM\GSPEMBundle\Entity\Sitio;
use GSPEM\GSPEMBundle\Entity\SitioType;
use GSPEM\GSPEMBundle\Entity\User;
use GSPEM\GSPEMBundle\Entity\Tarea;
use GSPEM\GSPEMBundle\Entity\Perfiles;
use GSPEM\GSPEMBundle\Entity\Contratista;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Serializer\Serializer;
use Symfony\Component\Serializer\Encoder\XmlEncoder;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\HttpFoundation\Session;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;

class OrderController extends Controller
{
    /**
     * @Method({"GET"})
     * @Route("/karcher/order/new",options = { "expose" = true },name = "getnextorderid")
     */
    public function getNextOrderAction()
    {
        $em = $this->getDoctrine()->getEntityManager();

        $user=$this->get('security.token_storage')->getToken()->getUser();

        $repo =$em->getRepository('KarcherBundle\Entity\Orden');
        $orders=$repo->findAll();

        $repoDist =$em->getRepository('KarcherBundle\Entity\Distribuidor');

        $dist=$repoDist->findOneBy(array("id"=>$user->getIdDistribuidor()));

        $encoders = array(new XmlEncoder(), new JsonEncoder());
        $normalizers = array(new ObjectNormalizer());
        $serializer = new Serializer($normalizers, $encoders);
        return new Response($serializer->serialize(array("next"=>count($orders)+1,"user"=> $user,"dist"=>$dist),"json"),200,array('Content-Type'=>'application/json'));

    }
}
