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
    $scope.rowMateriales=0;

    $scope.orders=[];
    $scope.orders.push({id:"asd"});

    var begin = (($scope.currentPage - 1) * $scope.numPerPage)
        , end = begin + $scope.numPerPage;

    $scope.$watch('currentPage', function() {
        console.log("test");

        var begin = (($scope.currentPage - 1) * $scope.numPerPage)
            , end = begin + $scope.numPerPage;

        if($scope.materiales_ori){
            $scope.materiales = $scope.materiales_ori.slice(begin, end);
        }

    });


    $scope.filters=[];
    $scope.orderType=[];
    $scope.orderPriori=[];
    $scope.orderEstados=[];
    $scope.orderUsersDist=[];



    $scope.cargando=true;


    var getMateriales = function() {
        $http.get(Routing.generate('getmateriales')
        ).then(function (materiales) {
            $scope.materiales=materiales.data;
            $scope.materiales_ori=materiales.data;
            $scope.cargando=false;
            $scope.rowMateriales=$scope.materiales_ori.length;
            if($scope.materiales_ori){
                $scope.materiales = $scope.materiales_ori.slice(begin, end);
            }

        });
    };
    getMateriales();



    $scope.numPages = function () {
        return Math.ceil($scope.orders.length / $scope.numPerPage);
    };


    $scope.$watch('filtromaterial', function() {

        if ($scope.filtromaterial!=undefined){

            $scope.materiales=$filter('filter')($scope.materiales_ori,$scope.filtromaterial);
            if ($scope.filtromaterial!=""){
                $scope.rowMateriales=$scope.materiales.length;

                var begin = ((1 - 1) * $scope.numPerPage)
                    , end = begin + $scope.numPerPage;

                if($scope.materiales){
                    $scope.materiales = $scope.materiales.slice(begin, end);
                }
            }else {
                $scope.rowMateriales=$scope.materiales_ori.length;

                var begin = ((1 - 1) * $scope.numPerPage)
                    , end = begin + $scope.numPerPage;

                if($scope.materiales_ori){
                    $scope.materiales = $scope.materiales_ori.slice(begin, end);
                }
            }
        }

    });






    $scope.showOrders=function (maquina) {
        var modalInstance = $uibModal.open({
            templateUrl: 'modal_orders.html',
            controller: 'ModalOrders',
            size:"lg",
            resolve: {
                maquina: function () {
                    return maquina;
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

GSPEMApp.controller('ModalOrders', function($filter,$scope,$http, $uibModalInstance,toastr,maquina) {
    $scope.maquina=maquina;
    $scope.orders=0;

    $scope.currentPage = 1
    $scope.numPerPage = 6
    $scope.maxSize = 5;
    $scope.rowOrders=0;

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

    $scope.cargando=true;
    var getOrders = function() {
        $http.get(Routing.generate('getordersbymaq')+"/"+$scope.maquina.id
        ).then(function (data) {
            $scope.cargando=false;
            $scope.orders=data.data;
            $scope.orders_ori=data.data;
            $scope.rowOrders=$scope.orders_ori.length;
            console.log($scope.orders);


            if($scope.orders_ori){
                $scope.orders = $scope.orders_ori.slice(begin, end);
            }
            //console.log($scope.orders);
        });
    };
    getOrders();

    $scope.cerrar=function () {
        $uibModalInstance.dismiss('cancel');
    };


});
