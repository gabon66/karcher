/**
 * Created by gabo on 26/07/16.
 */
GSPEMApp.controller('abmPush', function($filter,$scope,$http,$uibModal,toastr,MovPend) {

    $scope.mensaje="";
    $scope.asunto="";

    $scope.levels=[];




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
                    rol:$scope.levelselected.id,
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


    var geMe = function() {
        $http.get(Routing.generate('getme')
        ).then(function (resp) {
            $scope.me=resp.data;



            if($scope.me.level==1 ){
                $scope.levels.push(
                    {id:0,name:"Todos"},
                    {id:1,name:"Administradores General"},
                    {id:2,name:"Administradores Regionales"},
                    {id:3,name:"Administradores Nacionales"},
                    {id:6,name:"Vendedores"},
                    {id:4,name:"Administradores en Disitribuidoras"},
                    {id:5,name:"Técnicos"}
                );
            }

            if($scope.me.level==2){
                $scope.levels.push(
                    {id:0,name:"Todos"},
                    {id:2,name:"Administradores Regionales"},
                    {id:3,name:"Administradores Nacionales"},
                    {id:6,name:"Vendedores"},
                    {id:4,name:"Administradores en Disitribuidoras"},
                    {id:5,name:"Técnicos"}
                );
            }

            if($scope.me.level==3){
                $scope.levels.push(
                    {id:0,name:"Todos"},
                    {id:3,name:"Administradores Nacionales"},
                    {id:6,name:"Vendedores"},
                    {id:4,name:"Administradores en Disitribuidoras"},
                    {id:5,name:"Técnicos"}
                );
            }

            if($scope.me.level==4){
                $scope.levels.push(
                    {id:0,name:"Todos"},
                    {id:4,name:"Administradores en Disitribuidoras"},
                    {id:5,name:"Técnicos"}
                );
            }

            if($scope.me.level==5){
                $scope.levels.push(
                    {id:0,name:"Todos"},
                    {id:5,name:"Técnicos"}
                );
            }

            $scope.levelselected=$scope.levels[0];
        });
    };
    geMe();

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
