/**
 * Created by gabo on 26/07/16.
 */


GSPEMApp.controller('abmDist', function($scope,$filter,$http,$uibModal,toastr,MovPend) {

    $scope.propertyName = 'name';
    $scope.reverse = true;
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
    $scope.numPerPage = 20
    $scope.maxSize = 5;
    $scope.rowDists=0;

    var begin = (($scope.currentPage - 1) * $scope.numPerPage)
        , end = begin + $scope.numPerPage;

    $scope.$watch('currentPage', function() {
        console.log("test");

        var begin = (($scope.currentPage - 1) * $scope.numPerPage)
            , end = begin + $scope.numPerPage;

        if($scope.distribuidores_ori){
            $scope.distribuidores = $scope.distribuidores_ori.slice(begin, end);
        }

    });


    var getData = function() {
        $http.get(Routing.generate('getdistribuidores')
        ).then(function (dist) {

            $scope.distribuidores_ori=dist.data;
            $scope.distribuidores=dist.data;
            console.log(dist.data);

            $scope.rowDists=$scope.distribuidores_ori.length;
            console.log($scope.orders);

            if($scope.distribuidores_ori){
                $scope.distribuidores = $scope.distribuidores_ori.slice(begin, end);
            }
        });
    };
    getData();


    $scope.$watch('filtrodist', function() {

        if ($scope.filtrodist!=undefined){

            $scope.distribuidores=$filter('filter')($scope.distribuidores_ori,$scope.filtrodist);
            if ($scope.filtrodist!=""){
                $scope.rowDists=$scope.distribuidores.length;

                var begin = ((1 - 1) * $scope.numPerPage)
                    , end = begin + $scope.numPerPage;

                if($scope.distribuidores){
                    $scope.distribuidores = $scope.distribuidores.slice(begin, end);
                }
            }else {
                $scope.rowDists=$scope.distribuidores_ori.length;

                var begin = ((1 - 1) * $scope.numPerPage)
                    , end = begin + $scope.numPerPage;

                if($scope.distribuidores_ori){
                    $scope.distribuidores = $scope.distribuidores_ori.slice(begin, end);
                }
            }
        }
    });


    $scope.showAdmin=function (item) {
        var modalInstance = $uibModal.open({
            templateUrl: "dist_admin.html",
            controller: "ModalAdminDistCtrol",
            resolve: {
                item: function () {
                    return item;
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {
            getData()
            //$log.info('Modal dismissed at: ' + new Date());
        });
    }

    $scope.delete = function (id) {
        var result = confirm("Desea eliminar este registro?");
        if (result) {
            $http({
                url: Routing.generate('deletedistribuidores') + '/' + id,
                method: "DELETE",
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            }).then(function (response) {
                    //console.log(response.data);
                    if (!response.data.process) {
                        toastr.warning('Contratista Asignado', 'Atención');
                    } else {
                        getData();
                    }
                },
                function (response) { // optional
                    // failed
                });
        }
    };

    $scope.new = function (item,template , controller) {

        var modalInstance = $uibModal.open({
            templateUrl: "dist_modal.html",
            size:"lg",
            controller: "ModalNewDistCtrol",
            resolve: {
                item: function () {
                    return item;
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {
            getData()
            //$log.info('Modal dismissed at: ' + new Date());
        });
    };

});
GSPEMApp.controller('ModalNewDistCtrol', function($filter,$scope,$http, $uibModalInstance, item,toastr) {
    $scope.item = item;
    $scope.alertDist=true;
    $scope.name="";
    $scope.descript="";
    $scope.email="";
    $scope.web="";
    $scope.tel="";
    $scope.contacto="";
    $scope.obs="";
    $scope.direccion="";
    $scope.emplazamiento="";
    $scope.latitud=0;
    $scope.longitud=0;
    $scope.pais=0;
    $scope.editing=true;
    $scope.id=0;

    //console.log(item);


    var getPaises = function() {
        $http.get(Routing.generate('getpaises')
        ).then(function (dist) {
            $scope.paises=dist.data;
            console.log(dist.data);

        });
    };
    getPaises();


    if(item!=null){

        if (item.coords){
            $scope.alertDist=false;
            $scope.latitud=JSON.parse(item.coords).lat;
            $scope.longitud=JSON.parse(item.coords).lng;
        }else {
            $scope.alertDist=true;
        }

        $scope.editing=false;
        $scope.id=item.id;
        $scope.email=item.email;
        $scope.web=item.web;
        $scope.tel=item.tel;
        $scope.contacto=item.contacto;
        $scope.obs=item.obs;
        $scope.direccion_str=item.dir;
        $scope.pais=item.pais_id;
        $scope.descript=(item.descript!=null)?item.descript:"";
        if($scope.descript==null){
            $scope.descript="";
        }
        $scope.name=item.name;

    }


    $scope.placeChanged=function (place) {
        $scope.alertDist=false;
    }


    $scope.cerrar=function () {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.saveDist= function () {
        if ($scope.name.length == 0) {
            toastr.warning('Complete todos los campos requeridos (*)', 'Atención');
            return false;
        } else {
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
            if ($scope.direccion.formatted_address){
                $scope.countryName= $scope.direccion.formatted_address.split(",")[$scope.direccion.formatted_address.split(",").length-1].toUpperCase().trim();
                $scope.pais_selected=$filter('filter')($scope.paises,{"name":$scope.countryName});

                if ($scope.pais_selected.length==0){
                    toastr.warning('Pais no encontrado en base local', 'Atención');
                    return false
                }
                $scope.pais=$scope.pais_selected[0].id;
            }

            //valido pais

            //$scope.pais_selected=$filter('filter')($scope.paises,$scope.filtrodist);


            $http({
                url: Routing.generate('savedistribuidores')+'/'+$scope.id,
                method: "POST",
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                data: {
                    descript: $scope.descript,
                    dir: $scope.direccion_str,
                    name:$scope.name,
                    email:$scope.email,
                    tel:$scope.tel,
                    contacto:$scope.contacto,
                    obs:$scope.obs,
                    web:$scope.web,
                    pais:$scope.pais,
                    coords:JSON.stringify({lng:$scope.longitud,lat: $scope.latitud})
                },
                transformRequest: function (obj) {
                    var str = [];
                    for (var p in obj)
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                }
            }).then(function (response) {
                    toastr.success('Guardado con éxito', 'Distribuidor');
                    $uibModalInstance.dismiss('cancel');
                },
                function (response) { // optional
                    // failed
                });
        };
    }
});

GSPEMApp.controller('ModalAdminDistCtrol', function($filter,$scope,$http, $uibModalInstance, item,toastr) {
    $scope.item = item;

    $scope.cerrar=function () {
        $uibModalInstance.dismiss('cancel');
    };

});
GSPEMApp.controller('paisesController', function($filter,$uibModal,$scope,$http,toastr) {
    $scope.propertyName = 'name';
    $scope.reverse = true;
    $scope.sortBy = function(propertyName) {
        $scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
        $scope.propertyName = propertyName;
    };

    var getData = function() {
        $http.get(Routing.generate('getpaises')
        ).then(function (dist) {
            $scope.paises=dist.data;
            console.log(dist.data);

        });
    };
    getData();



    $scope.delete = function (id) {
        var result = confirm("Desea eliminar este registro?");
        $scope.url=Routing.generate('updatepais')+"/"+id;
        if (result) {
            $http({
                url: $scope.url,
                method: "DELETE",
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            }).then(function (response) {
                    getData();
                },
                function (response) { // optional
                    // failed
                });
        }
    };

    $scope.new = function (item,template , controller) {

        var modalInstance = $uibModal.open({
            templateUrl: "pais_form.html",
            controller: "ModalPaisCtrl",
            resolve: {
                item: function () {
                    return item;
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {
            getData()
            //$log.info('Modal dismissed at: ' + new Date());
        });
    };
});
GSPEMApp.controller('ModalPaisCtrl', function($filter,$scope,$http, $uibModalInstance, item,toastr) {
    $scope.item = item;

    $scope.name="";

    $scope.descript="";
    $scope.id=0;



    if(item!=null){
        $scope.id=item.id;
        $scope.name=item.name;
        $scope.descript=item.obs;
        $scope.url=Routing.generate('updatepais')+"/"+$scope.id;
    }else {
        $scope.url=Routing.generate('updatepais');
    }

    $scope.savePais= function () {
        if($scope.name.length==0 ||  $scope.descript.length==0 ){
            toastr.warning('Complete todos los campos', 'Atención');
        } else {
            //console.log($scope.typematerial);
            $http({
                url: $scope.url,
                method: "POST",
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                data: {
                    name: $scope.name,
                    descript: $scope.descript,
                },
                transformRequest: function (obj) {
                    var str = [];
                    for (var p in obj)
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                }
            }).then(function (response) {
                    console.log(response);
                    $uibModalInstance.dismiss('cancel');
                },
                function (response) { // optional
                    console.log(response);

                });
        }
    };


    $scope.cerrar=function () {
        $uibModalInstance.dismiss('cancel');
    };

});

