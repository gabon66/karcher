/**
 * Created by gabo on 26/07/16.
 */
GSPEMApp.controller('abmClientes', function($rootScope,$filter,$scope,$http,$uibModal,toastr,MovPend) {
    $scope.animationsEnabled = false;

    $scope.cargando=true;

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
    $scope.numPerPage = 10
    $scope.maxSize = 5;
    $scope.rowClients=0;

    var begin = (($scope.currentPage - 1) * $scope.numPerPage)
        , end = begin + $scope.numPerPage;

    $scope.$watch('currentPage', function() {

        var begin = (($scope.currentPage - 1) * $scope.numPerPage)
            , end = begin + $scope.numPerPage;

        if($scope.clientes_ori){
            $scope.clientes = $scope.clientes_ori.slice(begin, end);
        }
    });


    var getClients = function() {
        $http.get(Routing.generate('getclientes')
        ).then(function (clientes) {

            $scope.clientes=clientes.data;
            $scope.clientes_ori=clientes.data;
            $scope.rowClients=$scope.clientes_ori.length;
            console.log($scope.orders);
            if($scope.clientes_ori){
                $scope.clientes = $scope.clientes_ori.slice(begin, end);
            }
        });
    };
    getClients();



    $scope.$watch('filtro', function() {

        if ($scope.filtro!=undefined){

            $scope.clientes=$filter('filter')($scope.clientes_ori,$scope.filtro);
            if ($scope.filtrodist!=""){
                $scope.rowClients=$scope.clientes.length;

                var begin = ((1 - 1) * $scope.numPerPage)
                    , end = begin + $scope.numPerPage;

                if($scope.clientes){
                    $scope.clientes = $scope.clientes.slice(begin, end);
                }
            }else {
                $scope.rowClients=$scope.clientes_ori.length;

                var begin = ((1 - 1) * $scope.numPerPage)
                    , end = begin + $scope.numPerPage;

                if($scope.clientes_ori){
                    $scope.clientes = $scope.clientes_ori.slice(begin, end);
                }
            }
        }
    });



    $scope.new = function (item) {

        var modalInstance = $uibModal.open({
            templateUrl: 'cli_modal.html',
            controller: 'ModalNewCli',
            resolve: {
                item: function () {
                    return item;
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {
            $scope.cargando=true;
            getClients()
            //$log.info('Modal dismissed at: ' + new Date());
        });
    };


    $scope.deleteCli= function (id) {
        //console.log("delete");
        var result = confirm("Desea eliminar este registro?");
        if (result) {
            $http({
                url: Routing.generate('deleteclient') + "/" + id,
                method: "DELETE",
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                transformRequest: function (obj) {
                    var str = [];
                    for (var p in obj)
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                }
            }).then(function (response) {
                    getClients();
                },
                function (response) { // optional
                    // failed
                });
        }
    };

});
GSPEMApp.controller('ModalNewCli', function($filter,$scope,$http, $uibModalInstance, item,toastr) {
    $scope.item = item;
    $scope.editing=true;
    $scope.name="";
    $scope.obs="";
    $scope.mail="";
    $scope.mail1="";
    $scope.phone="";
    $scope.phone1="";
    $scope.phonecar="";
    $scope.phone1car="";
    $scope.direccion="";
    $scope.latitud=0;
    $scope.longitud=0;
    $scope.contacto="";
    $scope.id=0;

    if(item!=null){

        if (item.coord){
            $scope.alertDist=false;
            $scope.latitud=JSON.parse(item.coord).lat;
            $scope.longitud=JSON.parse(item.coord).lng;
        }else {
            $scope.alertDist=true;
        }

        $scope.name=item.name;
        $scope.obs=item.obs;
        $scope.mail=item.mail;
        $scope.mail1=item.mail1;
        $scope.phone=item.phone;
        $scope.contacto=item.contacto;
        $scope.phone1=item.phone1;
        $scope.phonecar=item.phone1Car;
        $scope.phone1car=item.phone2Car;
        $scope.direccion_str=item.dir;
        $scope.id=item.id;
        $scope.editing=false;
    }

    $scope.cerrar=function () {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.placeChanged=function (place) {
        $scope.alertDist=false;
    }

    $scope.saveCliente= function () {
        if ($scope.name.length == 0) {
            toastr.warning('Complete todos los campos requeridos (*)', 'Atención');
            return false;
        }

        if ($scope.direccion &&  $scope.direccion.geometry){
            $scope.latitud  = $scope.direccion.geometry.location.lat()
            $scope.longitud = $scope.direccion.geometry.location.lng()
            $scope.direccion_str=$scope.direccion.formatted_address;
        }else{
            if ($scope.id){
                if(!$scope.latitud){
                    toastr.warning('Complete con una direccion valida', 'Atención');
                    return false
                }
            }else {
                toastr.warning('Complete con una direccion valida', 'Atención');
                return false
            }
        }

        //console.log($scope.direccion_str);

        $http({
            url: Routing.generate('saveclient')+"/"+$scope.id,
            method: "POST",
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            data: {
                name: $scope.name,
                mail: $scope.mail,
                mail1: $scope.mail1,
                phone: $scope.phone,
                phone1: $scope.phone1,
                phonecar: $scope.phonecar,
                phone1car: $scope.phone1car,
                contacto: $scope.contacto,
                obs: $scope.obs,
                id:$scope.id,
                coords:JSON.stringify({lng:$scope.longitud,lat: $scope.latitud}),
                dir: $scope.direccion_str
            },
            transformRequest: function (obj) {
                var str = [];
                for (var p in obj)
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                return str.join("&");
            }
        }).then(function (response) {
                    toastr.success('Guardado con éxito', 'Cliente');
                    $uibModalInstance.dismiss('cancel');
            },
            function (response) { // optional
                // failed
            });
    };

});
