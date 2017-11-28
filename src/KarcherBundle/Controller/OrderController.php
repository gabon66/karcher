<?php

namespace KarcherBundle\Controller;

use KarcherBundle\Entity\Orden;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\HttpFoundation\Request;
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
            }else{
                $orders_count=1;
            }
            // traigo todo los datos del centro disitribucion
            $dist=$repoDist->findOneBy(array("id"=>$user->getIdDistribuidor()));

            // traigo todos los usuarios que pertencen a esa sucursal --
            // si soy a
            if($user->getLevel()==5){
                // es tecnico asi que solo puede su propio user
                $users=null;
            }else{
                // es administrador al menos , entoces ve todos los tecs
                $users=$repoUser->findBy(array("idDistribuidor"=>$user->getIdDistribuidor()));
            }

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
            ->select("o.* ,dist.name as dist_name, us_rec.id as rec_id , concat (us_rec.last_name ,' ', us_rec.first_name ) as tecnico_rec,us.id as tecnico_id , concat (us.last_name ,' ', us.first_name ) as tecnico_name,m.name as maquina")
            ->from("orden", "o")
            ->leftJoin("o","users","us","us.id = o.tecnico_id")
            ->leftJoin("o","users","us_rec","us_rec.id = o.rec")
            ->leftJoin("o","distribuidor","dist","dist.id = o.dist_id")
            ->leftJoin("o","materiales","m","m.id = o.maquina_id")
            ->where("o.tipo!=5") // fuera las prospecto
            ->orderBy("o.numero","DESC")
            ->execute();

        $encoders = array(new XmlEncoder(), new JsonEncoder());
        $normalizers = array(new ObjectNormalizer());
        $serializer = new Serializer($normalizers, $encoders);
        return new Response($serializer->serialize($stmt->fetchAll(),"json"),200,array('Content-Type'=>'application/json'));
    }

    /**
     * @Method({"GET"})
     * @Route("/karcher/ordersprosc",options = { "expose" = true },name = "getordersprosc")
     */
    public function getOrdersProscAction()
    {
        $em = $this->getDoctrine()->getEntityManager();

        $stmt = $em->getConnection()->createQueryBuilder()
            ->select("o.* ,dist.name as dist_name, us_rec.id as rec_id , concat (us_rec.last_name ,' ', us_rec.first_name ) as tecnico_rec,us.id as tecnico_id , concat (us.last_name ,' ', us.first_name ) as tecnico_name,m.name as maquina")
            ->from("orden", "o")
            ->leftJoin("o","users","us","us.id = o.tecnico_id")
            ->leftJoin("o","users","us_rec","us_rec.id = o.rec")
            ->leftJoin("o","distribuidor","dist","dist.id = o.dist_id")
            ->leftJoin("o","materiales","m","m.id = o.maquina_id")
            ->where("o.tipo=5") // todas las prospecto
            ->orderBy("o.numero","DESC")
            ->execute();

        $encoders = array(new XmlEncoder(), new JsonEncoder());
        $normalizers = array(new ObjectNormalizer());
        $serializer = new Serializer($normalizers, $encoders);
        return new Response($serializer->serialize($stmt->fetchAll(),"json"),200,array('Content-Type'=>'application/json'));
    }


    /**
     * @Method({"GET"})
     * @Route("/karcher/ordersbymaq/{material}",options = { "expose" = true },name = "getordersbymaq")
     */
    public function getOrdersByMatAction($material)
    {
        $em = $this->getDoctrine()->getEntityManager();

        $stmt = $em->getConnection()->createQueryBuilder()
            ->select("o.* ,us_rec.id as rec_id , concat (us_rec.last_name ,' ', us_rec.first_name ) as tecnico_rec, us.id as tecnico_id , concat (us.last_name ,' ', us.first_name ) as tecnico_name,m.name as maquina")
            ->from("orden", "o")
            ->leftJoin("o","users","us","us.id = o.tecnico_id")
            ->leftJoin("o","users","us_rec","us_rec.id = o.rec")
            ->leftJoin("o","materiales","m","m.id = o.maquina_id")
            ->where("o.maquina_id=".$material)
            ->orderBy("o.numero","DESC")
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
        $repoClient =$em->getRepository('KarcherBundle\Entity\Client');
        $user = $this->get('security.token_storage')->getToken()->getUser();
        $order= new Orden();
        $order->setFing(new \DateTime());
        $order->setNumero($request->get("numero"));
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
            $client=$repoClient->findOneBy(array("id"=>(int)$request->get("client_id")));
            // update datos del cliente
            $client->setName($request->get("cuno"));
            $client->setPhone($request->get("phn"));
            $client->setPhone1($request->get("phn1"));
            $client->setMail($request->get("eml"));
            $client->setContacto($request->get("nme"));
            $client->setPhone1Car($request->get("phncar"));
            $client->setPhone2Car($request->get("phn1car"));

            $em->flush();
        }else{
            // creo nuevo cliente
            $client = new Client();
            $client->setName($request->get("cuno"));

            $client->setPhone1Car($request->get("phncar"));
            $client->setPhone2Car($request->get("phn1car"));


            $client->setPhone($request->get("phn"));
            $client->setPhone1($request->get("phn1"));
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

        $order->setObs($request->get("obs"));

        $order->setPrd($request->get("prd"));
        $em->persist($order);
        $em->flush();

        $encoders = array(new XmlEncoder(), new JsonEncoder());
        $normalizers = array(new ObjectNormalizer());
        $serializer = new Serializer($normalizers, $encoders);
        return new Response($serializer->serialize($order,"json"),200,array('Content-Type'=>'application/json'));



    }



    /**
     * @Method({"PUT"})
     * @Route("/karcher/order/{id}",options = { "expose" = true },name = "putorder")
     */
    public function updateOrderAction(\Symfony\Component\HttpFoundation\Request $request)
    {
        $em = $this->getDoctrine()->getEntityManager();
        $repoOrden = $em->getRepository('KarcherBundle\Entity\Orden');

        $orden=$repoOrden->findOneBy(array("id"=>$request->get("id")));

        if ($orden){

            // si se asigna un tecnico
            if((int)$request->get("tecnico")>0)
            {
                $orden->setTecnicoId($request->get("tecnico"));
                $orden->setEstd($request->get("estado"));

                if($request->get("estado")==2){
                    $orden->setFclose(new \DateTime());
                }
            }else{
                // pasa a pendiente sin tecnico y estado pendiente
                $orden->setTecnicoId(0);
                $orden->setEstd(0);
            }
            $orden->setFmod(new \DateTime());
            $orden->setObs($request->get("obs"));
        }

        $em->flush();

        $encoders = array(new XmlEncoder(), new JsonEncoder());
        $normalizers = array(new ObjectNormalizer());
        $serializer = new Serializer($normalizers, $encoders);
        return new Response($serializer->serialize($orden,"json"),200,array('Content-Type'=>'application/json'));
    }

    /**
     * @Method({"POST"})
     * @Route("/karcher/order/files/{id}",options = { "expose" = true },name = "postorderfiles")
     */
    public function updatePhotoUserAction(Request $request)
    {
        $em = $this->getDoctrine()->getEntityManager();
        $repoOrden = $em->getRepository('KarcherBundle\Entity\Orden');

        $orden=$repoOrden->findOneBy(array("id"=>$request->get("id")));




        $creo=false;
        //mkdir($this->getTmpUploadRootDir().$orden->getId(), 0777, true);
        if (!file_exists($this->getParameter("file_folder_path").$orden->getId())) {
            $creo=true;
            mkdir($this->getParameter("file_folder_path").$orden->getId(), 0777, true);
        }


        $file  =$request->files->get('file');
        $name=$file->getClientOriginalName();


        $date = new \DateTime();

        //$nameImg =$date->getTimestamp()."_".$name;
        $nameImg =$name;
        if ($orden) {
            if ($orden->getFiles()) {
                $files = json_decode($orden->getFiles());
                $files[]=$nameImg;
                $orden->setFiles(json_encode($files));
            } else {
                $files = json_encode(array($nameImg));
                $orden->setFiles($files);
            }
        }
        $em->flush();

        $file->move($this->getParameter("file_folder_path").$orden->getId()."/", $nameImg);

        $encoders = array(new XmlEncoder(), new JsonEncoder());
        $normalizers = array(new ObjectNormalizer());
        $serializer = new Serializer($normalizers, $encoders);
        return new Response($serializer->serialize(array("name"=>$name,"creo"=>$creo,"dir"=>$this->getParameter("file_folder_path").$orden->getId()),"json"),200,array('Content-Type'=>'application/json'));
    }

    protected function getTmpUploadRootDir()
    {
        return __DIR__ . '/../../../../web/upload/';
    }


}
