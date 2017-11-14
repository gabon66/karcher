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

        $encoder = $factory->getEncoder($user_temp);
        $encodedPasswordToken = $encoder->encodePassword($request->get('password'), $user_temp->getSalt());

        if ($user_temp->getPassword()===$encodedPasswordToken){
            $user=$user_temp;
        }

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

        $encoders = array(new XmlEncoder(), new JsonEncoder());
        $normalizers = array(new ObjectNormalizer());

        $serializer = new Serializer($normalizers, $encoders);

        return new Response($serializer->serialize(array("mensaje"=>"hols"),"json"),200,array('Content-Type'=>'application/json'));

    }

}
