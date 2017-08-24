/**
 * Created by gabo on 26/07/16.
 */


GSPEMApp.controller('abmDist', function($scope,$http,$uibModal,toastr,MovPend) {

    $scope.propertyName = 'name';
    $scope.reverse = true;
    $scope.sortBy = function(propertyName) {
        $scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
        $scope.propertyName = propertyName;
    };

    var getData = function() {
        $http.get(Routing.generate('getdistribuidores')
        ).then(function (dist) {

                $scope.distribuidores=dist.data;
                console.log(dist.data);

        });
    };
    getData();


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
        $http({
            url: Routing.generate('deletedistribuidores')+'/'+id,
            method: "DELETE",
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        }).then(function (response) {
                //console.log(response.data);
                if (!response.data.process){
                    toastr.warning('Contratista Asignado', 'Atención');
                }else {
                    getData();
                }
            },
            function (response) { // optional
                // failed
            });
    };

    $scope.new = function (item,template , controller) {

        var modalInstance = $uibModal.open({
            templateUrl: "dist_modal.html",
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



    $scope.name="";
    $scope.descript="";
    $scope.email="";
    $scope.web="";

    $scope.direccion="";
    $scope.emplazamiento="";
    $scope.latitud=0;
    $scope.longitud=0;
    $scope.editing=true;
    $scope.id=0;

    //console.log(item);




    if(item!=null){
        $scope.latitud=JSON.parse(item.coords).lat;
        $scope.longitud=JSON.parse(item.coords).lng;
        $scope.editing=false;
        $scope.id=item.id;
        $scope.email=item.email;
        $scope.web=item.web;
        $scope.direccion_str=item.dir;
        $scope.descript=(item.descript!=null)?item.descript:"";
        if($scope.descript==null){
            $scope.descript="";
        }
        $scope.name=item.name;

    }


    $scope.placeChanged=function (place) {
    }


    $scope.cerrar=function () {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.saveDist= function () {
        if ($scope.name.length == 0) {
            toastr.warning('Complete todos los campos requeridos (*)', 'Atención');
            return false;
        } else {
            if ($scope.direccion){
                $scope.latitud  = $scope.direccion.geometry.location.lat()
                $scope.longitud = $scope.direccion.geometry.location.lng()
                $scope.direccion_str=$scope.direccion.formatted_address;
            }else{
                if($scope.id==0){
                    toastr.warning('Complete con una direccion valida', 'Atención');
                    return false
                }
            }

            //console.log($scope.direccion_str);

            $http({
                url: Routing.generate('savedistribuidores')+'/'+$scope.id,
                method: "POST",
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                data: {
                    descript: $scope.descript,
                    dir: $scope.direccion_str,
                    name:$scope.name,
                    email:$scope.email,
                    web:$scope.web,
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



