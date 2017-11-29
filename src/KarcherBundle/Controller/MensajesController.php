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
     * @Route("/karcher/me",options = { "expose" = true },name = "getme")
     */
    public function getMeAction()
    {
        $user=$this->get('security.token_storage')->getToken()->getUser();
        $encoders = array(new XmlEncoder(), new JsonEncoder());
        $normalizers = array(new ObjectNormalizer());
        $serializer = new Serializer($normalizers, $encoders);
        return new Response($serializer->serialize($user,"json"),200,array('Content-Type'=>'application/json'));
    }


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
        $userCurrent=$this->get('security.token_storage')->getToken()->getUser();

        // validar perfil y ver a quien van los mensajes

        $repoUser =$em->getRepository('GSPEM\GSPEMBundle\Entity\User');

        if ($userCurrent->getLevel()==1){
            // admin gral para todos todos
            if($request->get("rol")==0){
                $users=    $repoUser->findBy(array('level'=>array(1,2,3,4,5,6)));
            }else{
                $users=    $repoUser->findBy(array('level'=>array($request->get("rol"))));
            }
        }
        if ($userCurrent->getLevel()==2){
            if($request->get("rol")==0) {
                // admin regional , por ahora a todos los usuarios
                $users = $repoUser->findBy(array('level' => array(2, 3, 4, 5, 6)));
            }else{
                $users=    $repoUser->findBy(array('level'=>array($request->get("rol"))));
            }
        }

        if ($userCurrent->getLevel()==3){
            if($request->get("rol")==0) {
                // admin nacional , aca filtro por pais.
                $users = $repoUser->findBy(array('level' => array(3, 4, 5, 6), 'idPais' => $userCurrent->getPais()));
            }else{
                $users = $repoUser->findBy(array('level' => array($request->get("rol")), 'idPais' => $userCurrent->getPais()));
            }
        }

        if ($userCurrent->getLevel()==4){
            if($request->get("rol")==0) {
                // admin disitri aca filtro tambien por distribuidor
                $users = $repoUser->findBy(array('level' => array(4, 5), 'idDistribuidor' => $userCurrent->getIdDistribuidor()));
            }else{
                $users = $repoUser->findBy(array('level' => array($request->get("rol")), 'idDistribuidor' => $userCurrent->getIdDistribuidor()));
            }
        }

        $message=null;
        foreach ($users as $user){
            $message = new Mensaje();
            if ($user->getId()==$userCurrent->getId()){
                $message->setDate(new \DateTime());
                $message->setFrom($userCurrent->getId());
                $message->setState(0);
                $message->setAsunto($request->get("asunto"));
                $message->setMensaje($request->get("mensaje"));
                $message->setTo($user->getId());
                if(!empty($user->getTokenPush())){
                    $this->notifiUser($user->getTokenPush(),$request->get("asunto"),$request->get("mensaje"));
                }
                $em->persist($message);
                $em->flush();
            }
        }

        $encoders = array(new XmlEncoder(), new JsonEncoder());
        $normalizers = array(new ObjectNormalizer());
        $serializer = new Serializer($normalizers, $encoders);
        return new Response($serializer->serialize($message,"json"),200,array('Content-Type'=>'application/json'));
    }


    public function notifiUser($token , $title ,$messageContent )
    {
        $tokens=array($token);

        $message=array('body'=>$messageContent,'title'=>$title,'sound'=>'default');
        //$message=array('body'=>$title." ".$messageContent,'sound'=>'default');

        $fields=array('registration_ids'=>$tokens,
            'notification'=>$message);

        $headers= array("Authorization:key = ".$this->getParameter("push_key"),
            "Content-Type: application/json");

        $ch = \curl_init($this->getParameter("push_url"));
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($fields));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt ($ch, CURLOPT_SSL_VERIFYHOST, 0);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        $output = curl_exec($ch);
        //var_dump($output);
        curl_close($ch);
     }


}
