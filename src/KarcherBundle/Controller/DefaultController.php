<?php

namespace KarcherBundle\Controller;

use KarcherBundle\Entity\Distribuidor;
use KarcherBundle\Entity\MaterialOrigen;
use KarcherBundle\Entity\Pais;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;

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


class DefaultController extends Controller
{
    /**
     * @Route("/")
     */
    public function indexAction()
    {
        //die('test');

        $user=$this->get('security.token_storage')->getToken()->getUser();
        //var_dump($user->getRoles()[0]);
        //var_dump($this->getUsersToShowMovs());

        if($user->getRoles()[0]!='ROLE_ADMIN'){
        }
        if ($user->getRoles()[0]!='ROLE_ADMIN'){

            $em = $this->getDoctrine()->getEntityManager();

            $repo =$em->getRepository('GSPEM\GSPEMBundle\Entity\Perfiles');
            $profile=$repo->findOneBy(array("id"=>$user->getView()));


            return $this->render('KarcherBundle:Default:index.html.twig',array("user"=>"user","access"=>json_decode($profile->getAccess()),"level"=>$user->getLevel()));
        }else {
            return $this->render('KarcherBundle:Default:index.html.twig',array("user"=>"admin"));
        }
    }

    /**
     * @Method({"GET"})
     * @Route("/karcher/distribuidores",options = { "expose" = true },name = "getdistribuidores")
     */
    public function getDistribuidoresAction()
    {
        $em = $this->getDoctrine()->getEntityManager();


        $stmt = $em->getConnection()->createQueryBuilder()
            ->select("dist.id as id ,p.name as pais ,p.id as pais_id,dist.tel as tel , dist.contacto as contacto, dist.email as email , dist.web as web, dist.name as name , dist.descript as descript , dist.dir as dir , dist.coords as coords")
            ->from("KARCHER.distribuidor", "dist")
            ->leftJoin("dist","paises","p","dist.pais=p.id")
            ->orderBy("name")
            ->execute();

        $encoders = array(new XmlEncoder(), new JsonEncoder());
        $normalizers = array(new ObjectNormalizer());

        $serializer = new Serializer($normalizers, $encoders);

        return new Response($serializer->serialize($stmt->fetchAll(),"json"),200,array('Content-Type'=>'application/json'));
    }

    /**
     * @Method({"POST"})
     * @Route("/karcher/distribuidores/{id}",defaults={"id" = 0},options = { "expose" = true },name = "savedistribuidores")
     */
    public function saveDistribuidoresAction(\Symfony\Component\HttpFoundation\Request $request)
    {

        $em = $this->getDoctrine()->getEntityManager();
        //$data=json_decode($request->getContent(),true);
        $repo =$em->getRepository('KarcherBundle\Entity\Distribuidor');
        $id=$request->get("id");
        if ($id!=0){
            // update
            $dist=$repo->findOneBy(array("id"=>$id));
        } else{
            // new
            $dist = new Distribuidor();
        }
        $dist->setName($request->get("name"));
        $dist->setDescript($request->get("descript"));
        $dist->setDir($request->get("dir"));
        $dist->setCoords($request->get("coords"));
        $dist->setEmail($request->get("email"));
        $dist->setWeb($request->get("web"));
        $dist->setTel($request->get("tel"));
        $dist->setContacto($request->get("contacto"));
        $dist->setPais($request->get("pais"));


        if ($id==0){
            $em->persist($dist);
        }
        $em->flush();

        $encoders = array(new XmlEncoder(), new JsonEncoder());
        $normalizers = array(new ObjectNormalizer());

        $serializer = new Serializer($normalizers, $encoders);
        return new Response($serializer->serialize($dist,"json"),200,array('Content-Type'=>'application/json'));
    }


    /**
     * @Method({"DELETE"})
     * @Route("/karcher/distribuidores/{id}",options = { "expose" = true },name = "deletedistribuidores")
     */
    public function deleteDistribuidoresAction($id)
    {
        $em = $this->getDoctrine()->getEntityManager();
        $repo = $em->getRepository('KarcherBundle\Entity\Distribuidor');

        $dist = $repo->findOneBy(array("id" => $id));
        $em->remove($dist);
        $em->flush();
        $encoders = array(new XmlEncoder(), new JsonEncoder());
        $normalizers = array(new ObjectNormalizer());

        $serializer = new Serializer($normalizers, $encoders);
        return new Response($serializer->serialize(array("process"=>true),"json"),200,array('Content-Type'=>'application/json'));
    }

    /**
     * @Method({"GET"})
     * @Route("/karcher/users",options = { "expose" = true },name = "getusers")
     */
    public function getUsersAction()
    {
        $em = $this->getDoctrine()->getEntityManager();

        $stmt = $em->getConnection()->createQueryBuilder()
            ->select("u.id as id,u.level as  level , u.bosses as bosses ,dis.id as disid , dis.name as distribuidor ,p.name as profilename  ,p.id as profileid ,u.mail as mail ,u.disabled as disabled ,u.username as username ,u.first_name as name ,u.phone as phone, u.last_name as lastName ")
            ->from("users", "u")
            ->leftJoin("u", "perfiles", "p", "u.view_type = p.id")
            ->leftJoin("u", "distribuidor", "dis", "u.id_distribuidor = dis.id")
            ->addOrderBy("u.last_name")
            ->addOrderBy("u.first_name")
            ->execute();

        $encoders = array(new XmlEncoder(), new JsonEncoder());
        $normalizers = array(new ObjectNormalizer());

        $serializer = new Serializer($normalizers, $encoders);
        return new Response($serializer->serialize($stmt->fetchAll(),"json"),200,array('Content-Type'=>'application/json'));

    }

    /**
     * @Method({"POST"})
     * @Route("/karcher/user/{id}",defaults={"id" = 0},options = { "expose" = true },name = "saveuser")
     */
    public function saveUserAction(\Symfony\Component\HttpFoundation\Request $request)
    {
        $em = $this->getDoctrine()->getEntityManager();
        $factory = $this->get('security.encoder_factory');

        if($request->get("id")>0){
            $repo =$em->getRepository('GSPEM\GSPEMBundle\Entity\User');
            $user = $repo->findOneBy(array("id"=>$request->get("id")));
        }else{
            $user = new User();
            $user->setCreatedAt( new \DateTime());
        }


        $user->setModifiedAt(new \DateTime());
        $user->setName($request->get("nombre"));
        $user->setLastName($request->get("apellido"));
        $user->setUsername ($request->get("username"));
        $user->setContratista($request->get("contratista"));
        $user->setIdDistribuidor($request->get("id_dist"));

        if(!empty($request->get("level"))){
            $user->setLevel($request->get("level"));
        }


        if($request->get('password')!=""){
            $encoder = $factory->getEncoder($user);
            $encodedPasswordToken = $encoder->encodePassword($request->get('password'), $user->getSalt());
            $user->setPassword ($encodedPasswordToken);
        }

        $user->setDisabled(0);
        $user->setPhone($request->get("phone"));
        $user->setMail($request->get("mail"));
        $user->setView($request->get("view"));

        if(!$request->get("id")){
            $em->persist($user);
        }
        $em->flush();


        $encoders = array(new XmlEncoder(), new JsonEncoder());
        $normalizers = array(new ObjectNormalizer());

        $serializer = new Serializer($normalizers, $encoders);
        return new Response($serializer->serialize(array("process"=>true),"json"),200,array('Content-Type'=>'application/json'));

    }


    /**
     * @Method({"DELETE"})
     * @Route("/karcher/distribuidores/{id}",options = { "expose" = true },name = "deletedistribuidores")
     */
    public function deleteUserAction($id)
    {
        $em = $this->getDoctrine()->getEntityManager();
        $repo = $em->getRepository('KarcherBundle\Entity\Distribuidor');

        $dist = $repo->findOneBy(array("id" => $id));
        $em->remove($dist);
        $em->flush();
        $encoders = array(new XmlEncoder(), new JsonEncoder());
        $normalizers = array(new ObjectNormalizer());

        $serializer = new Serializer($normalizers, $encoders);
        return new Response($serializer->serialize(array("process"=>true),"json"),200,array('Content-Type'=>'application/json'));
    }


    /**
     * @Method({"GET"})
     * @Route("/karcher/materiales",options = { "expose" = true },name = "getmateriales")
     */
    public function getMaterialesAction(){
        $em = $this->getDoctrine()->getEntityManager();

        $stmt = $em->getConnection()->createQueryBuilder()
            ->select("m.id as id ,m.model as model   ,  m.serial_n as serial , m.cod_barra as barra , m.pn as pn,  m.umbralmax as umbralmax , m.umbralmin as umbralmin,   m.referencia as referencia ,m.ubicacion as ubicacion , 
            m.origen as origen ,mo.id as origen_id ,mt.id as type_id, m.id_custom as idCustom , m.descript as descript ,mt.name  as type , m.name as name")
            ->from("materiales", "m")
            ->leftJoin("m", "materiales_type", "mt", "m.type = mt.id")
            ->leftJoin("m", "materiales_origen", "mo", "m.origen = mo.id")
            ->orderBy('m.name', 'ASC')
            ->execute();
        $encoders = array(new XmlEncoder(), new JsonEncoder());
        $normalizers = array(new ObjectNormalizer());

        $serializer = new Serializer($normalizers, $encoders);
        return new Response($serializer->serialize($stmt->fetchAll(),"json"),200,array('Content-Type'=>'application/json'));
    }



    /**
     * @Method({"GET"})
     * @Route("/karcher/material/pn/{number}/{barra}",options = { "expose" = true },name = "getmaterialesbynumber")
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
     * @Method({"POST"})
     * @Route("/karcher/material/{id}",defaults={"id" = 0},options = { "expose" = true },name = "savematerial")
     */

    public function saveMaterialesAction(\Symfony\Component\HttpFoundation\Request $request){
        $em = $this->getDoctrine()->getEntityManager();
        $repo =$em->getRepository('GSPEM\GSPEMBundle\Entity\Material');
        $result=true;


        if($request->get("id")>0){
            $material = $repo->findOneBy(array("id"=>$request->get("id")));
        }else{
            $material = new Material();
            $stock = new StockMaestro();
        }

        $material->setName($request->get("name"));
        $material->setDescript($request->get("descript"));
        //$material->setOrigen($request->get("origen"));
        //$material->setUbicacion($request->get("ubicacion"));
        $material->setDate(new \DateTime());
        $material->setType($request->get("type"));
        $material->setCodBarra($request->get("barra"));
        $material->setSerialN($request->get("serial_n"));
        $material->setPn($request->get("pn"));
        $material->setModel($request->get("model"));
        $material->setOrigen($request->get("origen"));
        $pn_number=str_replace(".","",$request->get("pn"));
        $material->setPnNumber(preg_replace("/[^0-9,.]/", "", $pn_number));
        //$material->setReferencia($request->get("referencia"));
        //$material->setIdCustom($request->get("id_custom"));
        //$material->setUmbralmin($request->get("umbralmin"));
        //$material->setUmbralmax($request->get("umbralmax"));

        if(!$request->get("id")){
            $em->persist($material);
        }

        $em->flush();


        $encoders = array(new XmlEncoder(), new JsonEncoder());
        $normalizers = array(new ObjectNormalizer());
        $serializer = new Serializer($normalizers, $encoders);
        return new Response($serializer->serialize($material,"json"),200,array('Content-Type'=>'application/json'));
    }


    /*public function deleteMaterialAction(\Symfony\Component\HttpFoundation\Request $request){
        $em = $this->getDoctrine()->getEntityManager();

        $repo =$em->getRepository('GSPEM\GSPEMBundle\Entity\Material');
        $repoData = $repo->findOneBy(array("id"=>$request->get("id")));
        $em->remove($repoData);
        $em->flush();
        $encoders = array(new XmlEncoder(), new JsonEncoder());
        $normalizers = array(new ObjectNormalizer());

        $serializer = new Serializer($normalizers, $encoders);
        return new Response($serializer->serialize(array("process"=>true),"json"),200,array('Content-Type'=>'application/json'));
    }*/


    /**
     * @Method({"GET"})
     * @Route("/karcher/paises",options = { "expose" = true },name = "getpaises")
     */

    public function getPaisesAction(){
        $em = $this->getDoctrine()->getEntityManager();

        $repo =$em->getRepository('KarcherBundle\Entity\Pais');

        $encoders = array(new XmlEncoder(), new JsonEncoder());
        $normalizers = array(new ObjectNormalizer());

        $serializer = new Serializer($normalizers, $encoders);

        return new Response($serializer->serialize($repo->findAll(),"json"),200,array('Content-Type'=>'application/json'));

    }
    /**
     * @Method({"POST","DELETE"})
     * @Route("/karcher/pais/{id}",defaults={"id" = 0},options = { "expose" = true },name = "updatepais")
     */
    public function savePaisAction(\Symfony\Component\HttpFoundation\Request $request){
        $em = $this->getDoctrine()->getEntityManager();

        if($request->get("id")>0){
            $repo =$em->getRepository('KarcherBundle\Entity\Pais');
            $pais = $repo->findOneBy(array("id"=>$request->get("id")));
        }else{
            $pais = new Pais();
        }

        if($request->getMethod()=="DELETE"){
                $em->remove($pais);
        }else{
            $pais->setName($request->get("name"));
            $pais->setObs($request->get("descript"));

            if(!$request->get("id")){
                $em->persist($pais);
            }
        }

        $em->flush();
        $encoders = array(new XmlEncoder(), new JsonEncoder());
        $normalizers = array(new ObjectNormalizer());
        $serializer = new Serializer($normalizers, $encoders);
        return new Response($serializer->serialize($pais,"json"),200,array('Content-Type'=>'application/json'));
    }



    /**
     * @Method({"GET"})
     * @Route("/karcher/materiales/origen",options = { "expose" = true },name = "getmaterialesorigen")
     */

    public function getMaterialesOrigenAction(){
        $em = $this->getDoctrine()->getEntityManager();

        $repo =$em->getRepository('KarcherBundle\Entity\MaterialOrigen');

        $encoders = array(new XmlEncoder(), new JsonEncoder());
        $normalizers = array(new ObjectNormalizer());

        $serializer = new Serializer($normalizers, $encoders);

        return new Response($serializer->serialize($repo->findAll(),"json"),200,array('Content-Type'=>'application/json'));

    }


    /**
     * @Method({"POST","DELETE"})
     * @Route("/karcher/origen/{id}",defaults={"id" = 0},options = { "expose" = true },name = "savematerialorigen")
     */
    public function saveMaterialesOrigenAction(\Symfony\Component\HttpFoundation\Request $request){
        $em = $this->getDoctrine()->getEntityManager();


        if($request->get("id")>0){
            $repo =$em->getRepository('KARCHERBundle\Entity\MaterialOrigen');
            $material_ori = $repo->findOneBy(array("id"=>$request->get("id")));
        }else{
            $material_ori = new MaterialOrigen();
        }

        if($request->getMethod()=="DELETE"){
            $em->remove($material_ori);
        }else{
            $material_ori->setName($request->get("name"));

            $material_ori->setDescript($request->get("descript"));

            if(!$request->get("id")){
                $em->persist($material_ori);
            }
        }

        $em->flush();
        $encoders = array(new XmlEncoder(), new JsonEncoder());
        $normalizers = array(new ObjectNormalizer());
        $serializer = new Serializer($normalizers, $encoders);
        return new Response($serializer->serialize($material_ori,"json"),200,array('Content-Type'=>'application/json'));
    }

    /**
     * @Method({"POST"})
     * @Route("/karcher/origendelete/{id}",defaults={"id" = 0},options = { "expose" = true },name = "deletematerialorigen")
     */
    public function deleteMaterialOrigenAction(\Symfony\Component\HttpFoundation\Request $request){
        $em = $this->getDoctrine()->getEntityManager();


        $repo =$em->getRepository('KarcherBundle\Entity\MaterialOrigen');
        $repoData = $repo->findOneBy(array("id"=>$request->get("id")));
        $em->remove($repoData);
        $em->flush();
        $encoders = array(new XmlEncoder(), new JsonEncoder());
        $normalizers = array(new ObjectNormalizer());

        $serializer = new Serializer($normalizers, $encoders);
        return new Response($serializer->serialize(array("process"=>true),"json"),200,array('Content-Type'=>'application/json'));
    }

}