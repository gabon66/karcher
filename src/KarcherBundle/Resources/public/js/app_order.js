/**
 * Created by gabo on 26/07/16.
 */


GSPEMApp.controller('newOrder', function($scope,focus,$http,$filter,$uibModal,toastr,MovPend) {

    $scope.newNumOrder="";
    $scope.distName="";
    $scope.userName="";


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
    $scope.telefono="";
    $scope.mail="";


    $scope.acc1="";
    $scope.acc2="";
    $scope.acc3="";
    $scope.acc4="";
    $scope.acc5="";
    $scope.acc6="";
    $scope.acc7="";
    $scope.acc8="";


    $scope.date = $filter('date')(new Date(), 'dd-MM-yyyy hh:mm');
    $scope.step=0;

    $scope.orderType=[];
    $scope.orderPriori=[];
    $scope.orderType.push({id:1,name:'Garantía'});
    $scope.orderType.push({id:2,name:'Reparación'});
    $scope.orderType.push({id:3,name:'Presupuesto'});
    $scope.orderType.push({id:4,name:'Pre-Entrega'});

    $scope.orderPriori.push({id:1,name:"Baja"});
    $scope.orderPriori.push({id:2,name:"Media"});
    $scope.orderPriori.push({id:3,name:"Alta"});

    $scope.ordertype=$scope.orderType[0];
    $scope.orderpri=$scope.orderPriori[0];



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

            if (response.data.material!=null){
                $scope.maquina=response.data.material;
                $scope.maquina_name=$scope.maquina.name;
                $scope.maquina_id=$scope.maquina.id
                $scope.parte=$scope.maquina.pn;
            }
            if (response.data.cliente!=null){

                $scope.client_from_old_orden=response.data.cliente;
                $scope.cliente_id=$scope.client_from_old_orden.id;
                $scope.cliente=$scope.client_from_old_orden.name;
                $scope.contacto=$scope.client_from_old_orden.contacto;
                $scope.telefono=$scope.client_from_old_orden.phone;
                $scope.mail=$scope.client_from_old_orden.mail;

            }
        });
    }

    var getNewOrder = function() {
        $http.get(Routing.generate('getnextorderid')
        ).then(function (orden) {
            console.log(orden);
            $scope.newNumOrder=("0000"+orden.data.user.idDistribuidor).slice(-4)+("0000"+orden.data.next).slice(-4)
            $scope.distName=orden.data.dist.name;
            $scope.userName=orden.data.user.lastName + " "+orden.data.user.name;
        })
    }
    getNewOrder();


    $scope.save=function () {
        $http({
            url: Routing.generate('postneworder'),
            method: "POST",
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            data: {
                tipo:  $scope.ordertype.id,
                dtr: $scope.distName,

                cuno: $scope.cliente,
                eml: $scope.mail,
                phn: $scope.phone,
                nme: $scope.contacto,
                client_id:$scope.client_id,

                barra: $scope.barra,
                serial: $scope.serial_n,
                pn: $scope.parte,
                modelo: $scope.modelo,

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
                toastr.success('Generada con éxito', 'Orden');
            },
            function (response) { // optional
                // failed
            });
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

    $scope.cerrar=function () {

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


