/**
 * Created by gabo on 26/07/16.
 */

GSPEMApp.controller('abmStockMovSitio', function($rootScope,$scope,$http,$uibModal,toastr ,MovPend,$filter) {
    $scope.animationsEnabled = false;
    $scope.stockPendiente=[];
    $scope.cargando=true;
    $rootScope.sitioselect;

    var getSitios = function() {
        $http.get(Routing.generate('get_sitios')
        ).then(function (sitios) {
            $scope.sitios=sitios.data;

            $scope.sitios.unshift({id:0,name:""});
            $scope.sitiosstock=$scope.sitios[0];
            $scope.cargando=false;
        });
    };
    getSitios();




    $scope.$watch( $rootScope.autocompleteSelected, function() {
            console.log($rootScope.autocompleteSelected);
    }, true);





    var getStock = function() {
        $http.get(Routing.generate('get_stock_user')
        ).then(function (stock) {
            $scope.stock=stock.data;
            for (var a = 0; a < $scope.stock.length; a++) {
                $scope.stock[a].referencia=angular.fromJson($scope.stock[a].referencia);
            }
            ////console.log($scope.stock);
        });
    };
    getStock();


    $scope.cancelStock=function (item) {
        item.stock=item.stock_ori;
        $scope.stockPendienteTemp=[];
        item.new_stock=0;
        item.showcancel=false;
        for (var a = 0; a < $scope.stockPendiente.length; a++) {
            if($scope.stockPendiente[a].id==item.id){
                existe=true;
                $scope.stockPendiente[a].stock= parseInt($scope.stockPendiente[a].stock) +parseInt(item.cant);
            }else {
                $scope.stockPendienteTemp.push($scope.stockPendiente[a]);
            }
        }
        $scope.stockPendiente=$scope.stockPendienteTemp;
    }


    $scope.setStock=function (item) {
      ////console.log(item.cant);

        if(item.cant=="" || item.cant==undefined){
            item.cant=1;
        }

        if(item.cant>0){

            if(parseInt(item.cant)>parseInt(item.stock)){
                toastr.warning('Indique numero menor o igual al stock maestro', 'Atención');
            }else {
                item.showcancel=true;
                if(!item.stock_ori){
                    item.stock_ori=item.stock;
                }
                item.stock=parseInt(item.stock) - parseInt(item.cant) ;
                item.new_stock=item.stock;

                if ($scope.stockPendiente.length>0){
                    var existe=false;
                    for (var a = 0; a < $scope.stockPendiente.length; a++) {
                        if($scope.stockPendiente[a].id==item.id){
                            existe=true;
                            $scope.stockPendiente[a].stock= parseInt($scope.stockPendiente[a].stock) +parseInt(item.cant);
                        }
                    }
                    if(!existe){
                        $scope.stockPendiente.push({id:item.id,descript:item.descript, referencia:item.referencia,idCustom:item.idCustom ,name:item.name , stock:item.cant})
                    }
                }else {
                    $scope.stockPendiente.push({id:item.id,descript:item.descript, referencia:item.referencia,idCustom:item.idCustom ,name:item.name , stock:item.cant})
                }
            }
        }
    };


    $scope.confirmar=function () {

        if(angular.isObject($rootScope.autocompleteSelected)){
            confirmar_stock_user();
            confirmar_mov_stoc_sitio();
        }

    }


    var confirmar_stock_user=function () {
        $http({
            url: Routing.generate('set_stock_user'),
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            data: {
                items:$scope.stock
            }
        }).then(function (response) {
                //console.log(response);
                //getStock();
                //toastr.success('Guardado con éxito', 'Stock');
            },
            function (response) { // optional
                // failed
            });
    }

    var confirmar_mov_stoc_sitio=function () {
        $http({
            url: Routing.generate('set_stock_sitio'),
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            data: {
                sitio:$rootScope.autocompleteSelected.originalObject.id,
                items:$scope.stockPendiente
            }
        }).then(function (response) {
                //console.log(response);
                $scope.stockPendiente=[];
                getStock();
                toastr.success('Guardado con éxito', 'Stock');
            },
            function (response) { // optional
                // failed
            });
    }



});