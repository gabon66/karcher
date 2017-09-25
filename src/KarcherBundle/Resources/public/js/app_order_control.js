/**
 * Created by gabo on 26/07/16.
 */


GSPEMApp.controller('ordersControl', function($filter,$scope,$http,$uibModal,toastr,MovPend) {


    $scope.propertyName='fing';
    $scope.reverse=true;
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
            console.log($scope.filtromaterial)

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


    $scope.filterBy=function (key) {
        $scope.orders=$scope.orders_ori;
        var todos=true;

        if (key=='estado'){
            if ($scope.orderest.id!=9){
                $scope.orders=$filter('filter')($scope.orders_ori,{"estd":$scope.orderest.id});
                todos=false;
            }
        }

        if (key=='pri'){
            if ($scope.orderpri.id!=9){
                $scope.orders=$filter('filter')($scope.orders_ori,{"prd":$scope.orderpri.id});
                todos=false;
            }
        }

        if (key=='tipo'){
            if ($scope.ordertype.id!=9){
                $scope.orders=$filter('filter')($scope.orders_ori,{"tipo":$scope.ordertype.id});
                todos=false;
            }
        }
        if (!todos){
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





    function initController() {
        // initialize to page 1
        vm.setPage(1);
    }

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
                if (orden.data.usersDist){
                    for (var e = 0; e < orden.data.usersDist.length; e++) {
                        $scope.orderUsersDist.push({"id": orden.data.usersDist[e].id,
                            "name":orden.data.usersDist[e].lastName + " "+orden.data.usersDist[e].name})

                    }

                    if ($scope.orden.tecnico_id!=null){
                        $scope.ordertec=$filter('filter')($scope.orderUsersDist,{"id":$scope.orden.tecnico_id})[0];
                    }else {
                        $scope.ordertec=$scope.orderUsersDist[0];
                    }
                } else {
                    // sin usuarios , es 1 solo user por dist , puede ser 1 tecnico o 1 persona trabajndo
                    $scope.orderUsersDist.push({"id": 1,
                        "name":"Autoasignada"})
                    if ($scope.orden.tecnico_id!=null){
                        $scope.ordertec=$scope.orderUsersDist[1];
                    }else {
                        $scope.ordertec=$scope.orderUsersDist[0];
                    }
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
