/**
 * Created by gabo on 26/07/16.
 */


GSPEMApp.controller('newOrder', function($scope,focus,$http,$filter,$uibModal,toastr,MovPend) {



    var cleanAll=function () {
        $scope.orderUsersDist=[];
        $scope.newNumOrder="";
        $scope.distName="";
        $scope.userName="";
        $scope.checkingOrden=true;
        $scope.ordenValid=false;

        // DATOS MAQUINA
        $scope.parte="";
        $scope.modelo="";
        $scope.barra="16672290010427";
        $scope.serie="";
        $scope.maquina_id=0;


        // DATOS CLIENTES
        $scope.cliente_id=0;
        $scope.cliente="";
        $scope.contacto="";
        $scope.phone="";
        $scope.mail="";


        $scope.acc1="";
        $scope.acc2="";
        $scope.acc3="";
        $scope.acc4="";
        $scope.acc5="";
        $scope.acc6="";
        $scope.acc7="";
        $scope.acc8="";

        $scope.obs="";
    }

    cleanAll();

    $scope.date = $filter('date')(new Date(), 'dd-MM-yyyy hh:mm');
    $scope.step=0;

    $scope.orderType=[];
    $scope.orderPriori=[];
    $scope.orderEstados=[];
    $scope.orderUsersDist=[];


    $scope.orderType.push({id:1,name:'Garantía'});
    $scope.orderType.push({id:2,name:'Reparación'});
    $scope.orderType.push({id:3,name:'Presupuesto'});
    $scope.orderType.push({id:4,name:'Pre-Entrega'});
    $scope.orderType.push({id:5,name:'Prospecto'});

    $scope.orderPriori.push({id:1,name:"Baja"});
    $scope.orderPriori.push({id:2,name:"Media"});
    $scope.orderPriori.push({id:3,name:"Alta"});

    $scope.orderEstados.push({id:0,name:"Pendiente"});
    $scope.orderEstados.push({id:1,name:"Proceso"});
    $scope.orderUsersDist.push({id:0,name:"Sin Asignar"});


    $scope.ordertype=$scope.orderType[0];
    $scope.orderpri=$scope.orderPriori[0];
    $scope.orderest=$scope.orderEstados[0];
    $scope.ordertec=$scope.orderUsersDist[0];

    
    

    
    $scope.down = function(e) {
        //console.log(e.keyCode);
    };

    
    
    $scope.nextStep=function () {
        if ($scope.step<4){
            $scope.step=$scope.step+1;
            if ($scope.step==1){
                focus('barra');
            }
        }

    };

    $scope.backStep=function () {
        if ($scope.step>=1){
            $scope.step=$scope.step-1;
            if ($scope.step==1){
                focus('barra');
            }
        }
    };

    $scope.checkBarra=function () {

        $scope.serie= $scope.barra.substring(8,$scope.barra.length);
        $http.get(Routing.generate('getmaterialesbynumber')+"/"+$scope.barra.substring(0,8)+"/"+$scope.barra).then(function (response) {
            console.log(response.data);
            if (response.data.material!=null){
                $scope.maquina=response.data.material;
                $scope.maquina_name=$scope.maquina.name;
                $scope.modelo=$scope.maquina.name;
                $scope.maquina_id=$scope.maquina.id
                $scope.parte=$scope.maquina.pn;
            }
            if (response.data.cliente!=null){

                $scope.client_from_old_orden=response.data.cliente;
                $scope.cliente_id=$scope.client_from_old_orden.id;
                $scope.cliente=$scope.client_from_old_orden.name;
                $scope.contacto=$scope.client_from_old_orden.contacto;
                $scope.phone=$scope.client_from_old_orden.phone;
                $scope.mail=$scope.client_from_old_orden.mail;

            }
        });
    }

    var getNewOrder = function() {
        $http.get(Routing.generate('getnextorderid')
        ).then(function (orden) {
            $scope.checkingOrden=false;
            console.log(orden);
            if(orden.data.dist){
                if (orden.data.dist.dir){
                    $scope.ordenValid=true;
                    $scope.countryName= orden.data.dist.dir.split(",")[orden.data.dist.dir.split(",").length-1].toUpperCase().trim();


                    $scope.newNumOrder=$scope.countryName.substring(0,2)+ ("0000"+orden.data.user.idDistribuidor).slice(-4)+("0000"+orden.data.next).slice(-4)
                    $scope.distName=orden.data.dist.name;
                    $scope.distId =orden.data.dist.id;

                    $scope.userName=orden.data.user.lastName + " "+orden.data.user.name;
                    $scope.userName_id=orden.data.user.id;
                    $scope.user_level=orden.data.user.level;
                    //agrego los usuarios del centro de dist.
                    if (orden.data.usersDist){
                        for (var e = 0; e < orden.data.usersDist.length; e++) {
                            $scope.orderUsersDist.push({"id": orden.data.usersDist[e].id,
                                "name":orden.data.usersDist[e].lastName + " "+orden.data.usersDist[e].name})
                        }
                    }else {
                        // sin usuarios , es 1 solo user por dist , puede ser 1 tecnico o 1 persona trabajndo
                        $scope.orderUsersDist.push({"id": 1,
                            "name":"Autoasignar"})
                    }

                    // validaciones para vendedor:
                    if($scope.user_level==6){
                        //asigno prospecto
                        $scope.ordertype=$scope.orderType[4];
                        $scope.orderUsersDist=[];
                        $scope.orderUsersDist.push({"id":$scope.userName_id,
                            "name":$scope.userName})
                        $scope.ordertec=$scope.orderUsersDist[0];
                    }


                }else {
                    $scope.ordenValid=false;
                    $scope.errorMsg="No tiene una dirección valida asiganada a su punto de distribución";
                }
            }else {
                // si no tiene dist es que no pertence a ningun centro de disitribucion con lo cual no puede cargar una orden
                $scope.ordenValid=false;
                $scope.errorMsg="No tiene punto de distribución asociado para cargar ordenes.";
            }
        })
    }
    getNewOrder();



    $scope.save=function () {

        if ($scope.maquina_id==0){
            $scope.step=1;
            toastr.error('No se asigno ninguna maquina', 'Orden');
            return false;
        }

        if ($scope.cliente.length==0 && $scope.telefono.length==0){
            $scope.step=2;
            toastr.error('Complete los datos del cliente', 'Orden');
            return false;
        }


        if($scope.ordertec.name=='Autoasignar'){
            $scope.ordertec.id=$scope.userName_id;
        }

        $http({
            url: Routing.generate('postneworder'),
            method: "POST",
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            data: {
                tipo:  $scope.ordertype.id,
                numero:$scope.newNumOrder,
                dtr: $scope.distName,
                distId: $scope.distId,
                cuno: $scope.cliente,
                eml: $scope.mail,
                phn: $scope.phone,
                nme: $scope.contacto,
                client_id:$scope.cliente_id,
                tecnico: $scope.ordertec.id,
                estado:$scope.orderest.id,
                obs:$scope.obs,

                barra: $scope.barra,
                serial: $scope.serie,
                pn: $scope.parte,
                modelo: $scope.modelo,
                maquina_id: $scope.maquina_id,

                acc1: $scope.acc1,
                acc2: $scope.acc2,
                acc3: $scope.acc3,
                acc4: $scope.acc4,
                acc5: $scope.acc5,
                acc6: $scope.acc6,
                acc7: $scope.acc7,
                acc8: $scope.acc8,

                prd: $scope.orderpri.id

            },
            transformRequest: function (obj) {
                var str = [];
                for (var p in obj)
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                return str.join("&");
            }
        }).then(function (response) {
                $scope.step=0;
                $scope.showBarCode($scope.newNumOrder);
                toastr.success('Generada con éxito', 'Orden');
                cleanAll();
                getNewOrder();
            },
            function (response) { // optional
                // failed
            });
    }

    $scope.changeTec=function () {
        $scope.orderest=$scope.orderEstados[0];
    }

    $scope.findClient=function () {
        var modalInstance = $uibModal.open({
            templateUrl: 'cli_list.html',
            controller: 'ModalClientList',

        });

        modalInstance.result.then(function (selectedItem) {

            $scope.selected = selectedItem;

        }, function (item) {
            console.log(item);
            if (angular.isObject(item)){
                console.log(item);
                $scope.cliente_id=item.id;
                $scope.cliente=item.name;
                $scope.contacto=item.contacto;
                $scope.telefono=item.phone;
                $scope.mail=item.mail;
            }


            $scope.cargando=true;
            //getClients()
            //$log.info('Modal dismissed at: ' + new Date());
        });
    }


    $scope.showBarCode=function (order) {
        var modalInstance = $uibModal.open({
            templateUrl: 'modal_barcode.html',
            controller: 'ModalBarCode',
            resolve: {
                order: function () {
                    return order;
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
        }, function (item) {
        });
    }


});

GSPEMApp.controller('ModalClientList', function($filter,$scope,$http, $uibModalInstance,toastr) {

    var getClients = function() {
        $http.get(Routing.generate('getclientes')
        ).then(function (clientes) {
            $scope.clientes=clientes.data;

        });
    };
    getClients();

    $scope.cerrar=function () {
        $uibModalInstance.dismiss('cancel');
    };


    $scope.propertyName = 'name';
    $scope.reverse = true;
    $scope.sortBy = function(propertyName) {
        $scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
        $scope.propertyName = propertyName;
    };

    $scope.select=function (cli) {
        $uibModalInstance.dismiss(cli);
    }



});


GSPEMApp.controller('ModalBarCode', function($filter,$scope,$http, $uibModalInstance,toastr,order) {


    var demoCtrl = this;
    var defaultInputs = [];

    defaultInputs['code39'] = 'Hello World';
    defaultInputs['i25'] = '010101';

    demoCtrl.textField = defaultInputs['code39'];

    demoCtrl.hex = '#03A9F4';
    demoCtrl.rgb = { r: 0, g: 0, b: 0 };
    demoCtrl.colorBarcode = getBarcodeColor;
    demoCtrl.colorBackground = [255, 255, 255];
    $scope.value = order;


    $scope.cerrar=function () {
        $uibModalInstance.dismiss('cancel');
    };
    function getBarcodeColor() {
        if(demoCtrl.showHex) {
            return demoCtrl.hex;
        } else {
            return [demoCtrl.rgb.r, demoCtrl.rgb.g, demoCtrl.rgb.b];
        }
    }
    $scope.print = function() {
        var printContents = document.getElementById('printable').innerHTML;
        var popupWin = window.open('', '_blank', 'width=300,height=100');
        popupWin.document.open();
        popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" href="style.css" /></head><body onload="window.print()">' + printContents + '</body></html>');
        popupWin.document.close();
    }

});


