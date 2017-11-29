<?php

namespace KarcherBundle\Controller;

use KarcherBundle\Entity\Client;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
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
class ClientesController extends Controller
{

    /**
     * @Method({"GET"})
     * @Route("/karcher/clientes",options = { "expose" = true },name = "getclientes")
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
     * @Route("/karcher/clientes/{id}",defaults={"id" = 0},options = { "expose" = true },name = "saveclient")
     */
    public function saveClientesAction(\Symfony\Component\HttpFoundation\Request $request)
    {

        $em = $this->getDoctrine()->getEntityManager();
        //$data=json_decode($request->getContent(),true);
        $repo =$em->getRepository('KarcherBundle\Entity\Client');
        $id=$request->get("id");
        if ($id!=0){
            // update
            $client=$repo->findOneBy(array("id"=>$id));
        } else{
            // new
            $client = new Client();
        }
        $client->setName($request->get("name"));
        $client->setPhone($request->get("phone"));
        $client->setMail($request->get("mail"));
        $client->setObs($request->get("obs"));
        $client->setPhone1($request->get("phone1"));
        $client->setPhone1Car($request->get("phonecar"));
        $client->setPhone2Car($request->get("phone1car"));
        $client->setContacto($request->get("contacto"));
        $client->setCoord($request->get("coords"));
        $client->setDir($request->get("dir"));

        if ($id==0){
            $em->persist($client);
        }
        $em->flush();

        $encoders = array(new XmlEncoder(), new JsonEncoder());
        $normalizers = array(new ObjectNormalizer());

        $serializer = new Serializer($normalizers, $encoders);
        return new Response($serializer->serialize($client,"json"),200,array('Content-Type'=>'application/json'));
    }


    /**
     * @Method({"DELETE"})
     * @Route("/karcher/clientes/{id}",options = { "expose" = true },name = "deleteclient")
     */
    public function deleteClientAction($id)
    {
        $em = $this->getDoctrine()->getEntityManager();
        $repo = $em->getRepository('KarcherBundle\Entity\Client');

        $row = $repo->findOneBy(array("id" => $id));
        $em->remove($row);
        $em->flush();
        $encoders = array(new XmlEncoder(), new JsonEncoder());
        $normalizers = array(new ObjectNormalizer());

        $serializer = new Serializer($normalizers, $encoders);
        return new Response($serializer->serialize(array("process"=>true),"json"),200,array('Content-Type'=>'application/json'));
    }


}
