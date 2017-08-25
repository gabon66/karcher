/**
 * Created by gabo on 26/07/16.
 */


GSPEMApp.factory('typesService', function($http) {
    return {
        async: function() {
            return $http.get(Routing.generate('get_materiales_type'));
        }
    };
});
GSPEMApp.factory('origenService', function($http) {
    return {
        async: function() {
            return $http.get(Routing.generate('getmaterialesorigen'));
        }
    };
});

GSPEMApp.controller('abmMaterial', function($scope,$http,$uibModal,toastr,origenService,typesService, $rootScope,MovPend) {
    $scope.animationsEnabled = false;
    $scope.cargando=true;
    var getTypes=function () {
        typesService.async().then(function(data) {
            $scope.types=data.data;
            $rootScope.typesMaterial= data;
        });
    }

    var getOrigenes=function () {
        origenService.async().then(function(data) {
            $scope.origenes=data.data;
            $rootScope.origenesMaterial= data;
        });
    }





    $scope.propertyName = 'id';
    $scope.reverse = true;
    $scope.sortBy = function(propertyName) {
        $scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
        $scope.propertyName = propertyName;
    };


    var getMateriales = function() {
        $http.get(Routing.generate('getmateriales')
        ).then(function (materiales) {
            $scope.materiales=materiales.data;
            $scope.cargando=false;


        });
    };
    getTypes();
    getOrigenes();
    getMateriales();



    $scope.new = function (item,template , controller) {
        //console.log(controller);
        var modalInstance = $uibModal.open({
            templateUrl: template,
            controller: controller,
            resolve: {
                item: function () {
                    return item;
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {
            getTypes();
            getOrigenes();
            getMateriales();
            //$log.info('Modal dismissed at: ' + new Date());
        });
    };

    


    $scope.deleteMaterial= function (id) {
        //console.log("delete");
        $http({
            url: Routing.generate('delete_materiales'),
            method: "POST",
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            data: {
                id: id
            },
            transformRequest: function (obj) {
                var str = [];
                for (var p in obj)
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                return str.join("&");
            }
        }).then(function (response) {
                getMateriales();


            },
            function (response) { // optional
                // failed
            });
    };

    $scope.deleteTipoMaterial= function (id) {

        // validar que no se este usando este tipo:
        var existe= false;

        angular.forEach($scope.materiales, function(value, key) {

            if(value.type_id==id){
                existe=true;
            }
        });

        if(existe){
            toastr.error('Tipo de Material ya asignado', 'Error');
            return false;
        }else{
            $http({
                url: Routing.generate('delete_materiales_type'),
                method: "POST",
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                data: {
                    id: id
                },
                transformRequest: function (obj) {
                    var str = [];
                    for (var p in obj)
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                }
            }).then(function (response) {
                    getTypes();
                },
                function (response) { // optional
                    // failed
                });
        }
    };

    $scope.deleteOrigenMaterial= function (id) {

        // validar que no se este usando este tipo:
        var existe= false;

        angular.forEach($scope.materiales, function(value, key) {

            if(value.type_id==id){
                existe=true;
            }
        });

        if(existe){
            toastr.error('Origen de Material ya asignado', 'Error');
            return false;
        }else{
            $http({
                url: Routing.generate('deletematerialorigen')+"/"+id,
                method: "POST",
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                data: {
                    id: id
                },
                transformRequest: function (obj) {
                    var str = [];
                    for (var p in obj)
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                }
            }).then(function (response) {
                    getOrigenes();
                },
                function (response) { // optional
                    // failed
                });
        }
    };

});
GSPEMApp.controller('ModelNewMaterialCtrl', function($filter,$scope,$http, $uibModalInstance, item,toastr,$rootScope) {
    $scope.item = item;




    $scope.materialDescript=[];

    $scope.materialDescript.push({id:1,name:"Maquina"});
    $scope.materialDescript.push({id:3,name:"Accesorio"});
    $scope.materialDescript.push({id:2,name:"Complemento"});
    $scope.materialDescriptSelected=$scope.materialDescript[0];


    $scope.referencia={ref1:"",ref2:""};

    $scope.types=$rootScope.typesMaterial.data;
    $scope.origenes=$rootScope.origenesMaterial.data;

    $scope.name="";
    $scope.descript="";
    $scope.serial_n="";
    $scope.model="";

    $scope.barra="";
    $scope.pn="";

    $scope.id=0;
    $scope.id_custom="";

    $scope.type_default=$scope.types[0];
    $scope.origen_default=$scope.origenes[0];

    // $scope.typematerial=1;


    if(item!=null){
        $scope.id=item.id;
        $scope.serial_n=item.serial
        $scope.name=item.name;
        $scope.model=item.model;

        $scope.barra=item.barra;
        $scope.pn=item.pn;

        $scope.materialDescriptSelected=$filter('filter')($scope.materialDescript,{"name":item.descript})[0];
        $scope.typematerial=$filter('filter')($scope.types,{"id":item.type_id})[0];
        $scope.origenmaterial=$filter('filter')($scope.origenes,{"id":item.origen_id})[0];
        //console.log($scope.typematerial);
    }else {
        $scope.typematerial=$scope.type_default;
        $scope.origenmaterial=$scope.origen_default;
    }





    $scope.cerrar=function () {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.saveMaterial= function () {
        //console.log($scope.typematerial);

        if($scope.typematerial != undefined){
            $scope.typeidmat=$scope.typematerial.id;
        }

        if($scope.origenmaterial != undefined){
            $scope.origenidmat=$scope.origenmaterial.id;
        }
        if ($scope.name.length == 0) {
            toastr.warning('Complete todos los campos requeridos (*)', 'Atención');
        } else {
            $http({
                url: Routing.generate('savematerial')+'/'+$scope.id,
                method: "POST",
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                data: {
                    name: $scope.name,
                    descript: $scope.materialDescriptSelected.name,
                    type: $scope.typeidmat,
                    origen: $scope.origenidmat,
                    barra: $scope.barra,
                    serial_n: $scope.serial_n,
                    model: $scope.model,
                    pn: $scope.pn,
                },
                transformRequest: function (obj) {
                    var str = [];
                    for (var p in obj)
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                }
            }).then(function (response) {
                        $uibModalInstance.dismiss('cancel');
                },
                function (response) { // optional
                    // failed
                });
        };
    }
    
});

GSPEMApp.controller('ModelNewTypeCtrl', function($filter,$scope,$http, $uibModalInstance, item ,toastr) {
    $scope.item = item;
    
    $scope.name="";

    $scope.descript="";
    $scope.id=0;



    if(item!=null){
        $scope.id=item.id;
        $scope.name=item.name;
        $scope.descript=item.descript;

    }


    $scope.cerrar=function () {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.saveType= function () {

        if($scope.name.length==0 ||  $scope.descript.length==0 ){
            toastr.warning('Complete todos los campos', 'Atención');
        } else {
            //console.log($scope.typematerial);
            $http({
                url: Routing.generate('save_materiales_type'),
                method: "POST",
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                data: {
                    name: $scope.name,
                    descript: $scope.descript,
                    id:$scope.id,
                },
                transformRequest: function (obj) {
                    var str = [];
                    for (var p in obj)
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                }
            }).then(function (response) {
                    //console.log(response);
                    $uibModalInstance.dismiss('cancel');
                },
                function (response) { // optional
                    // failed
                });
            }
        };

});

GSPEMApp.controller('ModalNewOrigenCtrl', function($filter,$scope,$http, $uibModalInstance, item ,toastr) {
    $scope.item = item;

    $scope.name="";

    $scope.descript="";
    $scope.id=0;



    if(item!=null){
        $scope.id=item.id;
        $scope.name=item.name;
        $scope.descript=item.descript;

    }


    $scope.cerrar=function () {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.saveOrigen= function () {
    console.log("asdasd");
        if($scope.name.length==0 ||  $scope.descript.length==0 ){
            toastr.warning('Complete todos los campos', 'Atención');
        } else {
            //console.log($scope.typematerial);
            $http({
                url: Routing.generate('savematerialorigen'),
                method: "POST",
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                data: {
                    name: $scope.name,
                    descript: $scope.descript,
                    id:$scope.id,
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

});