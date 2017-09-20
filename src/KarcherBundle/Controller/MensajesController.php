<?php

namespace KarcherBundle\Controller;

use KarcherBundle\Entity\Mensaje;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;

use KarcherBundle\Entity\Orden;

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


class MensajesController extends Controller
{

    /**
     * @Method({"GET"})
     * @Route("/karcher/mensajes",options = { "expose" = true },name = "getmimensajes")
     */
    public function getMessagesAction()
    {
        $em = $this->getDoctrine()->getEntityManager();
        $user=$this->get('security.token_storage')->getToken()->getUser();

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

    /**
     * @Method({"POST"})
     * @Route("/karcher/mensajes",options = { "expose" = true },name = "newmessage")
     */
    public function newMessagesAction( \Symfony\Component\HttpFoundation\Request $request)
    {
        $em = $this->getDoctrine()->getEntityManager();
        $userCurrten=$this->get('security.token_storage')->getToken()->getUser();

        // validar perfil y ver a quien van los mensajes


        $repoUser =$em->getRepository('GSPEM\GSPEMBundle\Entity\User');

        $users=$repoUser->findAll();

        foreach ($users as $user){

            //if ($userCurrten->getId()!=$user->getId()){
                $message= new Mensaje();
                $message->setDate(new \DateTime());
                $message->setFrom($userCurrten->getId());
                $message->setState(0);
                $message->setAsunto($request->get("asunto"));
                $message->setMensaje($request->get("mensaje"));
                $message->setTo($user->getId());
                $em->persist($message);
                $em->flush();
            //}

        }




        $encoders = array(new XmlEncoder(), new JsonEncoder());
        $normalizers = array(new ObjectNormalizer());
        $serializer = new Serializer($normalizers, $encoders);
        return new Response($serializer->serialize($message,"json"),200,array('Content-Type'=>'application/json'));
    }


}
