/**
 * Created by gabo on 26/07/16.
 */


GSPEMApp.controller('newOrder', function($scope,focus,$http,$filter,$uibModal,toastr,MovPend) {

    $scope.newNumOrder="";
    $scope.distName="";
    $scope.userName="";
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
        console.log(e.keyCode);
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
        console.log($scope.barra);
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
});
