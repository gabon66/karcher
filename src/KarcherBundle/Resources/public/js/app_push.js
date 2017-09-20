/**
 * Created by gabo on 26/07/16.
 */
GSPEMApp.controller('abmPush', function($filter,$scope,$http,$uibModal,toastr,MovPend) {

    $scope.mensaje="";
    $scope.asunto="";

    $scope.sendMensaje= function () {
        if ($scope.mensaje.length == 0 ||  $scope.asunto.length==0) {
            toastr.warning('Complete todos los campos requeridos (*)', 'Atención');
            return false;
        } else {

            $http({
                url: Routing.generate('newmessage'),
                method: "POST",
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                data: {
                    mensaje: $scope.mensaje,
                    asunto: $scope.asunto
                },
                transformRequest: function (obj) {
                    var str = [];
                    for (var p in obj)
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                }
            }).then(function (response) {
                    $scope.mensaje="";
                    $scope.asunto="";
                        toastr.success('Mensaje enviado con exito', 'Atención');
                    getMyMessages();
                },
                function (response) { // optional
                    // failed
                });
        };
    }


    var getMyMessages = function() {
        $http.get(Routing.generate('getmimensajes')
        ).then(function (resp) {
            $scope.mensajes=resp.data;
            console.log($scope.mensajes);
        });
    };
    getMyMessages();

    $scope.showMensaje=function (men) {
        var modalInstance = $uibModal.open({
            templateUrl: 'modal_mensaje.html',
            controller: 'ModelMessage',
            resolve: {
                men: function () {
                    return men;
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
        }, function (item) {
        });
    }


});
