/**
 * Created by gabo on 26/07/16.
 */


GSPEMApp.controller('ordersHistorico', function($filter,$scope,$http,$uibModal,toastr,MovPend) {

    $scope.sortBy = function(propertyName) {
        $scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
        $scope.propertyName = propertyName;
    };


    $scope.setPage = function (pageNo) {
        $scope.currentPage = pageNo;
    };

    $scope.pageChanged = function() {
        //$log.log('Page changed to: ' + $scope.currentPage);
    };

    $scope.maxSize = 5;
    $scope.bigTotalItems = 175;
    $scope.bigCurrentPage = 1;

    $scope.filteredTodos = []
    $scope.currentPage = 1
    $scope.numPerPage = 8
    $scope.maxSize = 5;
    $scope.rowOrders=0;

    $scope.orders=[];
    $scope.orders.push({id:"asd"});

    var begin = (($scope.currentPage - 1) * $scope.numPerPage)
        , end = begin + $scope.numPerPage;

    $scope.$watch('currentPage', function() {
        console.log("test");

        var begin = (($scope.currentPage - 1) * $scope.numPerPage)
            , end = begin + $scope.numPerPage;

        if($scope.orders_ori){
            $scope.orders = $scope.orders_ori.slice(begin, end);
        }

    });


    $scope.filters=[];
    $scope.orderType=[];
    $scope.orderPriori=[];
    $scope.orderEstados=[];
    $scope.orderUsersDist=[];



    $scope.cargando=true;


    var getOrders = function() {
        $http.get(Routing.generate('getorders')
        ).then(function (data) {
            $scope.cargando=false;
            $scope.orders=data.data;
            $scope.orders_ori=data.data;
            $scope.rowOrders=$scope.orders_ori.length;
            console.log($scope.orders);


            if($scope.orders_ori){
                $scope.orders = $scope.orders_ori.slice(begin, end);
            }
        });
    };
    getOrders();


    $scope.exportar=function (name) {
        debugger
        var blob = new Blob([document.getElementById('exportable').innerHTML], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
        });
        saveAs(blob, "Reporte_"+name+".xls");
    };


    $scope.numPages = function () {
        return Math.ceil($scope.orders.length / $scope.numPerPage);
    };


    $scope.$watch('filtromaterial', function() {

        if ($scope.filtromaterial!=undefined){

            $scope.orders=$filter('filter')($scope.orders_ori,$scope.filtromaterial);
            if ($scope.filtromaterial!=""){
                $scope.rowOrders=$scope.orders.length;

                var begin = ((1 - 1) * $scope.numPerPage)
                    , end = begin + $scope.numPerPage;

                if($scope.orders){
                    $scope.orders = $scope.orders.slice(begin, end);
                }
            }else {
                $scope.rowOrders=$scope.orders_ori.length;

                var begin = ((1 - 1) * $scope.numPerPage)
                    , end = begin + $scope.numPerPage;

                if($scope.orders_ori){
                    $scope.orders = $scope.orders_ori.slice(begin, end);
                }
            }
        }

    });






    $scope.showOrder=function (order) {
        var modalInstance = $uibModal.open({
            templateUrl: 'modal_orders.html',
            controller: 'ModalOrders',
            size:"lg",
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





    function initController() {
        // initialize to page 1
        vm.setPage(1);
    }




});

GSPEMApp.controller('ModalOrders', function($filter,$scope,$http, $uibModalInstance,toastr,order) {

    $scope.order=order;

    $scope.orderType=[];
    $scope.orderPriori=[];
    $scope.orderEstados=[];
    $scope.orderUsersDist=[];


    $scope.orderType.push({id:1,name:'Garantía'});
    $scope.orderType.push({id:2,name:'Reparación'});
    $scope.orderType.push({id:3,name:'Presupuesto'});
    $scope.orderType.push({id:4,name:'Pre-Entrega'});

    $scope.orderPriori.push({id:1,name:"Baja"});
    $scope.orderPriori.push({id:2,name:"Media"});
    $scope.orderPriori.push({id:3,name:"Alta"});

    $scope.orderEstados.push({id:0,name:"Pendiente"});
    $scope.orderEstados.push({id:1,name:"Proceso"});
    $scope.orderUsersDist.push({id:0,name:"Sin Asignar"});


    $scope.ordertype=$filter('filter')($scope.orderType,{"id":$scope.order.tipo})[0].name;
    $scope.orderpri=$filter('filter')($scope.orderPriori,{"id":$scope.order.prd})[0].name;
    $scope.orderest=$scope.orderEstados[0];
    $scope.ordertec=$scope.orderUsersDist[0];


    $scope.cerrar=function () {
        $uibModalInstance.dismiss('cancel');
    };


});
