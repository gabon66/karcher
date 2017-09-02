/**
 * Created by gabo on 26/07/16.
 */


GSPEMApp.controller('ordersControl', function($scope,$http,$uibModal,toastr,MovPend) {

    $scope.sortBy = function(propertyName) {
        $scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
        $scope.propertyName = propertyName;
    };

    $scope.cargando=true;
    var getOrders = function() {
        $http.get(Routing.generate('getorders')
        ).then(function (data) {
            $scope.cargando=false;
            $scope.orders=data.data;
            console.log($scope.orders);
        });
    };
    getOrders();


    $scope.edit=function (item) {
        var modalInstance = $uibModal.open({
            templateUrl: 'modal_orden.html',
            controller: 'ModalOrden',
            resolve: {
                item: function () {
                    return item;
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            //$scope.selected = selectedItem;
        }, function () {
            //$scope.cargando=true;
            getOrders();
            //$log.info('Modal dismissed at: ' + new Date());
        });
    }
});

GSPEMApp.controller('ModalOrden', function($filter,$scope,$http, $uibModalInstance,toastr,item) {
    $scope.orden=item;
    $scope.orderUsersDist=[];
    $scope.orderUsersDist.push({id:0,name:"Sin Asignar"});
    $scope.orderEstados=[];
    $scope.orderEstados.push({id:0,name:"Pendiente"});
    $scope.orderEstados.push({id:1,name:"Proceso"});
    $scope.orderEstados.push({id:2,name:"Cerrada"});
    $scope.orderest=$scope.orderEstados[0];
    $scope.ordertec=$scope.orderUsersDist[0];

    $scope.cerrar=function () {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.changeTec=function () {
        $scope.orderest=$scope.orderEstados[0];
    }

    var getDataUtil = function() {
        $http.get(Routing.generate('getnextorderid')
        ).then(function (orden) {
            if(orden.data.dist){


                //agrego los usuarios del centro de dist.
                for (var e = 0; e < orden.data.usersDist.length; e++) {
                    $scope.orderUsersDist.push({"id": orden.data.usersDist[e].id,
                        "name":orden.data.usersDist[e].lastName + " "+orden.data.usersDist[e].name})

                }

            }else {
                // si no tiene dist es que no pertence a ningun centro de disitribucion con lo cual no puede cargar una orden
                $scope.ordenValid=false;
            }

        })
    }
    getDataUtil();

});
