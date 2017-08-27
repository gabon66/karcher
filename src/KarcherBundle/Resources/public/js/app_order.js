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
    $scope.barra="16672290";
    $scope.serie="";

    // DATOS CLIENTES

    $scope.cliente="";
    $scope.contacto="";
    $scope.telefono="";
    $scope.mail="";


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


        $http.get(Routing.generate('getmaterialesbynumber')+"/"+$scope.barra).then(function (material) {
            if (material.data!=null){
                $scope.maquina=material.data;
                console.log($scope.maquina);
                $scope.parte=$scope.maquina.pn;

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
            url: Routing.generate('delete_materiales_type'),
            method: "POST",
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            data: {
                id: id
            },
            transformRequest: function (obj) {
                var str = [];
                for (var p in obj)
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                return str.join("&");
            }
        }).then(function (response) {
                getTypes();
            },
            function (response) { // optional
                // failed
            });
    }

});
