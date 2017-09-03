/**
 * Created by gabo on 26/07/16.
 */


GSPEMApp.controller('ordersControl', function($filter,$scope,$http,$uibModal,toastr,MovPend) {

    $scope.sortBy = function(propertyName) {
        $scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
        $scope.propertyName = propertyName;
    };


    $scope.filters=[];
    $scope.orderType=[];
    $scope.orderPriori=[];
    $scope.orderEstados=[];
    $scope.orderUsersDist=[];

    $scope.filters.push({id:0,name:'Estado'});
    $scope.filters.push({id:1,name:'Tipo'});
    $scope.filters.push({id:2,name:'Prioridad'});

    $scope.filtersSelected=$scope.filters[0];


    $scope.orderType.push({id:9,name:'Todos'});
    $scope.orderType.push({id:1,name:'Garantía'});
    $scope.orderType.push({id:2,name:'Reparación'});
    $scope.orderType.push({id:3,name:'Presupuesto'});
    $scope.orderType.push({id:4,name:'Pre-Entrega'});


    $scope.orderPriori.push({id:9,name:"Todas"});
    $scope.orderPriori.push({id:1,name:"Baja"});
    $scope.orderPriori.push({id:2,name:"Media"});
    $scope.orderPriori.push({id:3,name:"Alta"});

    $scope.orderEstados.push({id:9,name:"Todos"});
    $scope.orderEstados.push({id:0,name:"Pendiente"});
    $scope.orderEstados.push({id:1,name:"Proceso"});
    $scope.orderEstados.push({id:2,name:"Cerrada"});

    $scope.orderUsersDist.push({id:0,name:"Sin Asignar"});


    $scope.ordertype=$scope.orderType[0];
    $scope.orderpri=$scope.orderPriori[0];
    $scope.orderest=$scope.orderEstados[0];
    $scope.ordertec=$scope.orderUsersDist[0];


    $scope.cargando=true;
    var getOrders = function() {
        $http.get(Routing.generate('getorders')
        ).then(function (data) {
            $scope.cargando=false;
            $scope.orders=data.data;
            $scope.orders_ori=data.data;
            console.log($scope.orders);
        });
    };
    getOrders();


    $scope.filterBy=function (key) {
        $scope.orders=$scope.orders_ori;

        if (key=='estado'){
            if ($scope.orderest.id!=9){
                $scope.orders=$filter('filter')($scope.orders_ori,{"estd":$scope.orderest.id});
            }
        }

        if (key=='pri'){
            if ($scope.orderpri.id!=9){

                $scope.orders=$filter('filter')($scope.orders_ori,{"prd":$scope.orderpri.id});
            }
        }

        if (key=='tipo'){
            if ($scope.ordertype.id!=9){
                $scope.orders=$filter('filter')($scope.orders_ori,{"tipo":$scope.ordertype.id});
            }
        }


    }



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
    console.log($scope.orden);
    $scope.orderUsersDist=[];
    $scope.orderUsersDist.push({id:0,name:"Sin Asignar"});
    $scope.orderEstados=[];
    $scope.orderEstados.push({id:0,name:"Pendiente"});
    $scope.orderEstados.push({id:1,name:"Proceso"});
    $scope.orderEstados.push({id:2,name:"Cerrada"});

    if ($scope.orden.estd!=null && $scope.orden.estd!=0 ){
        $scope.orderest=$scope.orderEstados[$scope.orden.estd];
    }else {
        $scope.orderest=$scope.orderEstados[0];
    }





    $scope.cerrar=function () {
        $uibModalInstance.dismiss('cancel');
    };



    $scope.changeTec=function () {
        if ($scope.ordertec.id==0){
            $scope.orderest=$scope.orderEstados[0];
        }
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
                if ($scope.orden.tecnico_id!=null){
                    $scope.ordertec=$filter('filter')($scope.orderUsersDist,{"id":$scope.orden.tecnico_id})[0];
                }else {
                    $scope.ordertec=$scope.orderUsersDist[0];
                }


            }else {
                // si no tiene dist es que no pertence a ningun centro de disitribucion con lo cual no puede cargar una orden
                $scope.ordenValid=false;
            }

        })
    }
    getDataUtil();


    $scope.save=function () {
        $http({
            url: Routing.generate('putorder')+"/"+$scope.orden.id,
            method: "PUT",
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            data: {
                tecnico: $scope.ordertec.id,
                estado:$scope.orderest.id,
                obs:$scope.orden.obs,
            },
            transformRequest: function (obj) {
                var str = [];
                for (var p in obj)
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                return str.join("&");
            }
        }).then(function (response) {
                $scope.step=0;
                toastr.success('Actializada con éxito', 'Orden');
                $uibModalInstance.dismiss('cancel');
            },
            function (response) { // optional
                // failed
            });
    }


});
