<?php

namespace KarcherBundle\Controller;

use KarcherBundle\Entity\Orden;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;

use KarcherBundle\Entity\Distribuidor;
use KarcherBundle\Entity\MaterialOrigen;
use KarcherBundle\Entity\Client;

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
        $orders_count=0;
        $user=$this->get('security.token_storage')->getToken()->getUser();

        $repo =$em->getRepository('KarcherBundle\Entity\Orden');
        $repoDist =$em->getRepository('KarcherBundle\Entity\Distribuidor');
        $repoUser =$em->getRepository('GSPEM\GSPEMBundle\Entity\User');

        if ($user->getIdDistribuidor()){
            $orders=$repo->findBy(array("distId"=>$user->getIdDistribuidor()));
            if($orders!=null){
                $orders_count=count($orders)+1;
            }
            // traigo todo los datos del centro disitribucion
            $dist=$repoDist->findOneBy(array("id"=>$user->getIdDistribuidor()));

            // traigo todos los usuarios que pertencen a esa sursal
            $users=$repoUser->findBy(array("idDistribuidor"=>$user->getIdDistribuidor()));
        }


        $encoders = array(new XmlEncoder(), new JsonEncoder());
        $normalizers = array(new ObjectNormalizer());
        $serializer = new Serializer($normalizers, $encoders);
        return new Response($serializer->serialize(array("usersDist"=>$users,"next"=>$orders_count,"user"=> $user,"dist"=>$dist),"json"),200,array('Content-Type'=>'application/json'));
    }


    /**
     * @Method({"GET"})
     * @Route("/karcher/orders",options = { "expose" = true },name = "getorders")
     */
    public function getOrdersAction()
    {
        $em = $this->getDoctrine()->getEntityManager();

        $stmt = $em->getConnection()->createQueryBuilder()
            ->select("*")
            ->from("orden", "o")
            ->leftJoin("o","users","us","us.id = o.tecnico_id")
            ->execute();

        $encoders = array(new XmlEncoder(), new JsonEncoder());
        $normalizers = array(new ObjectNormalizer());
        $serializer = new Serializer($normalizers, $encoders);
        return new Response($serializer->serialize($stmt->fetchAll(),"json"),200,array('Content-Type'=>'application/json'));
    }


    /**
     * @Method({"POST"})
     * @Route("/karcher/order",options = { "expose" = true },name = "postneworder")
     */
    public function saveNewOrderAction(\Symfony\Component\HttpFoundation\Request $request)
    {
        $em = $this->getDoctrine()->getEntityManager();

        $user = $this->get('security.token_storage')->getToken()->getUser();
        $order= new Orden();
        $order->setFing(new \DateTime());
        $order->setTipo($request->get("tipo"));
        $order->setRec($user->getId());
        $order->setAk("AR");
        $order->setDtr($request->get("dtr"));
        $order->setDistId($request->get("distId"));

        // si se asigna un tecnico
        if((int)$request->get("tecnico")>0)
        {
            // si viene con tecnico puede que venga con etado en proceso
            $order->setTecnicoId($request->get("tecnico"));
            $order->setEstd($request->get("estado"));
        }else{
            // si no, es pendiente
            $order->setEstd(0);
        }


        // cliente
        $order->setCuno($request->get("cuno"));
        $order->setEml($request->get("eml"));
        $order->setPhn($request->get("phn"));
        $order->setNme($request->get("nme"));


        if ($request->get("client_id")){
            $order->setClientId((int)$request->get("client_id"));
        }else{
            // creo nuevo cliente
            $client = new Client();
            $client->setName($request->get("cuno"));
            $client->setPhone($request->get("phn"));
            $client->setMail($request->get("eml"));
            $client->setContacto($request->get("nme"));
            $em->persist($client);
            $em->flush();
            $order->setClientId($client->getId());
        }


        // maquina
        $order->setMaquinaBarra($request->get("barra"));
        $order->setProdSn($request->get("serial"));
        $order->setProdMdl($request->get("modelo"));
        $order->setProdPn($request->get("pn"));
        $order->setMaquinaId((int)$request->get("maquina_id"));


        $order->setAcc1($request->get("acc1"));
        $order->setAcc2($request->get("acc2"));
        $order->setAcc3($request->get("acc3"));
        $order->setAcc4($request->get("acc4"));
        $order->setAcc5($request->get("acc5"));
        $order->setAcc6($request->get("acc6"));
        $order->setAcc7($request->get("acc7"));
        $order->setAcc8($request->get("acc8"));





        $order->setPrd($request->get("prd"));
                $em->persist($order);
        $em->flush();

        $encoders = array(new XmlEncoder(), new JsonEncoder());
        $normalizers = array(new ObjectNormalizer());
        $serializer = new Serializer($normalizers, $encoders);
        return new Response($serializer->serialize($order,"json"),200,array('Content-Type'=>'application/json'));



    }



    }
