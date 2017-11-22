<?php

namespace KarcherBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;

use KarcherBundle\Entity\Client;

use KarcherBundle\Entity\Orden;


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
use Symfony\Component\Validator\Constraints\DateTime;
use Symfony\Component\HttpFoundation\Request;

class MovilController extends Controller
{

    /**
     * @Method({"POST"})
     * @Route("/movil/login",options = { "expose" = true },name = "login_mov")
     */
    public function loginAction(\Symfony\Component\HttpFoundation\Request $request)
    {
        $em = $this->getDoctrine()->getEntityManager();
        $factory = $this->get('security.encoder_factory');
        $user=null;

        $repo =$em->getRepository('GSPEM\GSPEMBundle\Entity\User');

        $user_temp = $repo->findOneBy(array("username"=>$request->get("username")));

        //$user['username']=$request->get("username");
        if($user_temp instanceof User){
            $encoder = $factory->getEncoder($user_temp);
            $encodedPasswordToken = $encoder->encodePassword($request->get('password'), $user_temp->getSalt());

            if ($user_temp->getPassword()===$encodedPasswordToken){

                $dateTime=new \DateTime();
                $hash=hash('ripemd160', $dateTime->getTimestamp());
                $user_temp->setTokenLogin($hash);
                $em->flush();
                $user=$user_temp;
            }
        }

        $encoders = array(new XmlEncoder(), new JsonEncoder());
        $normalizers = array(new ObjectNormalizer());
        $serializer = new Serializer($normalizers, $encoders);
        return new Response($serializer->serialize($user,"json"),200,array('Content-Type'=>'application/json'));
    }


    /**
     * @Method({"PUT"})
     * @Route("/movil/user/token",options = { "expose" = true },name = "login_mov")
     */
    public function putTokenAction(\Symfony\Component\HttpFoundation\Request $request)
    {
        $em = $this->getDoctrine()->getEntityManager();
        $user=$this->getUserLoged();

        $user->setTokenPush($request->get("token"));
        $em->flush();

        $encoders = array(new XmlEncoder(), new JsonEncoder());
        $normalizers = array(new ObjectNormalizer());
        $serializer = new Serializer($normalizers, $encoders);
        return new Response($serializer->serialize($user,"json"),200,array('Content-Type'=>'application/json'));
    }


    /**
     * @Method({"GET"})
     * @Route("/movil/user",options = { "expose" = true },name = "demo")
     */
    public function userTestAction()
    {
        $em = $this->getDoctrine()->getEntityManager();

        $request = Request::createFromGlobals();
        $demo=$request->headers->get('demo');

        var_dump($demo);

        $encoders = array(new XmlEncoder(), new JsonEncoder());
        $normalizers = array(new ObjectNormalizer());


        $serializer = new Serializer($normalizers, $encoders);
        $dateTime=new \DateTime();
        $hash=hash('ripemd160', $dateTime->getTimestamp());

        return new Response($serializer->serialize(array("mensaje"=>$demo),"json"),200,array('Content-Type'=>'application/json'));

    }

    /**
     * @Method({"GET"})
     * @Route("/movil/order/new",options = { "expose" = true },name = "getnextorderidmovil")
     */
    public function getNextOrderAction()
    {
        $em = $this->getDoctrine()->getEntityManager();
        $orders_count=0;

        $user=$this->getUserLoged();

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


    private function getUserLoged(){
        $em = $this->getDoctrine()->getEntityManager();
        $request = Request::createFromGlobals();
        $token=$request->headers->get('token');
        $repo =$em->getRepository('GSPEM\GSPEMBundle\Entity\User');

        $user_temp = $repo->findOneBy(array("token_login"=>$token));
        return $user_temp;
    }


    /**
     * @Method({"GET"})
     * @Route("/movil/material/pn/{number}/{barra}")
     */
    public function getMaterialByNumberAction($number,$barra)
    {
        $client=null;
        $material=null;

        $em = $this->getDoctrine()->getEntityManager();
        $encoders = array(new XmlEncoder(), new JsonEncoder());
        $normalizers = array(new ObjectNormalizer());
        $repo =$em->getRepository('GSPEM\GSPEMBundle\Entity\Material');

        $repoOrder =$em->getRepository('KarcherBundle\Entity\Orden');
        $repoClient =$em->getRepository('KarcherBundle\Entity\Client');


        $orden=$repoOrder->findOneBy(array("maquinaBarra"=>$barra));

        if(!empty($orden)){

            $client_id=$orden->getClientId();
            $client=$repoClient->findOneBy(array("id"=>$client_id));
        }

        $material = $repo->findOneBy(array("pn_number"=>$number));
        $serializer = new Serializer($normalizers, $encoders);
        return new Response($serializer->serialize(array("material"=>$material,"cliente"=>$client),"json"),200,array('Content-Type'=>'application/json'));
    }


    /**
     * @Method({"GET"})
     * @Route("/movil/clientes")
     */
    public function getClientsAction()
    {
        $em = $this->getDoctrine()->getEntityManager();

        $repo =$em->getRepository('KarcherBundle\Entity\Client');

        $encoders = array(new XmlEncoder(), new JsonEncoder());
        $normalizers = array(new ObjectNormalizer());

        $serializer = new Serializer($normalizers, $encoders);

        return new Response($serializer->serialize($repo->findAll(),"json"),200,array('Content-Type'=>'application/json'));
    }


    /**
     * @Method({"POST"})
     * @Route("/movil/order")
     */
    public function saveNewOrderAction(\Symfony\Component\HttpFoundation\Request $request)
    {
        $em = $this->getDoctrine()->getEntityManager();
        $repoClient =$em->getRepository('KarcherBundle\Entity\Client');
        $user = $this->getUserLoged();
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
            $client->setMail($request->get("eml"));
            $client->setContacto($request->get("nme"));

            $em->flush();
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
     * @Route("/movil/order/{id}")
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
     * @Method({"GET"})
     * @Route("/movil/orders")
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
     * @Route("/movil/orderscustom/{count}/{state}")
     */
    public function getOrdersPendingAction($count,$state)
    {
        $em = $this->getDoctrine()->getEntityManager();
        $user=$this->getUserLoged();
        $stmt = $em->getConnection()->createQueryBuilder()
            ->select("o.* ,dist.name as dist_name, us_rec.id as rec_id , concat (us_rec.last_name ,' ', us_rec.first_name ) as tecnico_rec,us.id as tecnico_id , concat (us.last_name ,' ', us.first_name ) as tecnico_name,m.name as maquina")
            ->from("orden", "o")
            ->leftJoin("o","users","us","us.id = o.tecnico_id")
            ->leftJoin("o","users","us_rec","us_rec.id = o.rec")
            ->leftJoin("o","distribuidor","dist","dist.id = o.dist_id")
            ->leftJoin("o","materiales","m","m.id = o.maquina_id")
            ->where("o.tipo!=5") // fuera las prospecto
            ->andWhere("o.dist_id =".$user->getIdDistribuidor())
            ->andWhere("o.estd =".$state)
            ->orderBy("o.numero","DESC")
            ->setMaxResults($count)
            ->execute();

        $encoders = array(new XmlEncoder(), new JsonEncoder());
        $normalizers = array(new ObjectNormalizer());
        $serializer = new Serializer($normalizers, $encoders);
        return new Response($serializer->serialize($stmt->fetchAll(),"json"),200,array('Content-Type'=>'application/json'));
    }

    /**
     * @Method({"GET"})
     * @Route("/movil/mensajes")
     */
    public function getMessagesAction()
    {
        $em = $this->getDoctrine()->getEntityManager();
        $user=$this->getUserLoged();

        $stmt = $em->getConnection()->createQueryBuilder()
            ->select("m.* ,CONCAT(us.last_name ,' ' ,us.first_name ) as origen")
            ->from("KARCHER.mensajes", "m")
            ->leftJoin("m", "KARCHER.users", "us", "us.id = m.from_user")
            ->where("m.to_user=".$user->getId())
            ->orderBy("m.date","DESC")
            ->execute();

        $encoders = array(new XmlEncoder(), new JsonEncoder());
        $normalizers = array(new ObjectNormalizer());
        $serializer = new Serializer($normalizers, $encoders);
        return new Response($serializer->serialize($stmt->fetchAll(),"json"),200,array('Content-Type'=>'application/json'));
    }


}
