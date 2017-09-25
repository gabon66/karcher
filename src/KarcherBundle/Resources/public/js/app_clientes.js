/**
 * Created by gabo on 26/07/16.
 */
GSPEMApp.controller('abmClientes', function($rootScope,$filter,$scope,$http,$uibModal,toastr,MovPend) {
    $scope.animationsEnabled = false;

    $scope.cargando=true;

    var getClients = function() {
        $http.get(Routing.generate('getclientes')
        ).then(function (clientes) {
            $scope.clientes=clientes.data;

        });
    };
    getClients();


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

    $scope.name="";
    $scope.obs="";
    $scope.mail="";
    $scope.mail1="";
    $scope.phone="";
    $scope.phone1="";
    $scope.contacto="";
    $scope.id=0;

    if(item!=null){

        $scope.name=item.name;
        $scope.obs=item.obs;
        $scope.mail=item.mail;
        $scope.mail1=item.mail1;
        $scope.phone=item.phone;
        $scope.contacto=item.contacto;
        $scope.phone1=item.phone1;
        $scope.id=item.id;
        $scope.editing=false;
    }

    $scope.cerrar=function () {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.saveCliente= function () {
        if ($scope.name.length == 0) {
            toastr.warning('Complete todos los campos requeridos (*)', 'Atención');
            return false;
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
                contacto: $scope.contacto,
                obs: $scope.obs,
                id:$scope.id
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
