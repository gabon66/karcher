/**
 * Created by gabo on 26/07/16.
 */
GSPEMApp.controller('abmUsuarios', function($scope,$filter,$http,$uibModal,toastr,MovPend) {



    $scope.propertyName = ['lastName','name'];
    $scope.reverse = false;
    $scope.reverse_combined = false;


    $scope.sortBy = function(propertyName) {
        if (angular.isArray(propertyName) && angular.isArray(propertyName)){
            $scope.reverse = ($scope.propertyName[0] === propertyName[0]) ? !$scope.reverse : false;
            $scope.reverse_combined =($scope.reverse_combined)? false:true;
            console.log($scope.reverse_combined);
            $scope.reverse =($scope.reverse_combined)? false:true;
            console.log($scope.reverse);

        }else {
            $scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
        }
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
    $scope.numPerPage = 10
    $scope.maxSize = 5;
    $scope.rowUsers=0;

    var begin = (($scope.currentPage - 1) * $scope.numPerPage)
        , end = begin + $scope.numPerPage;

    $scope.$watch('currentPage', function() {
        console.log("test");

        var begin = (($scope.currentPage - 1) * $scope.numPerPage)
            , end = begin + $scope.numPerPage;

        if($scope.users_ori){
            $scope.users = $scope.users_ori.slice(begin, end);
        }

    });



    var gerPerfiles = function() {
        $http.get(Routing.generate('get_perfiles')
        ).then(function (perfiles) {
            $scope.perfiles=perfiles.data;
            ////console.log($scope.perfiles);
            $scope.profileselected=$scope.perfiles[0];
        });
    };
    gerPerfiles();

    var getPuntos = function() {
        $http.get(Routing.generate('getdistribuidores')
        ).then(function (dists) {
            $scope.dists=dists.data;
            ////console.log($scope.perfiles);
            $scope.distselected=$scope.dists[0];
        });
    };
    getPuntos()


    var getUsuarios = function() {
        $http.get(Routing.generate('getusers')
        ).then(function (users) {

            $scope.users_ori=users.data;
            $scope.users=users.data;
            $scope.rowUsers=$scope.users_ori.length;
            console.log($scope.orders);

            if($scope.users_ori){
                $scope.users = $scope.users_ori.slice(begin, end);
            }

        });
    };
    getUsuarios();


        $scope.deleteUser = function (id) {
            var result = confirm("Desea eliminar un usuario?");
            if (result) {
            $http({
                url: Routing.generate('delete_usuario'),
                method: "POST",
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                data: {
                    id:id,
                },
                transformRequest: function (obj) {
                    var str = [];
                    for (var p in obj)
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                }
            }).then(function (response) {
                    getUsuarios();
                },
                function (response) { // optional
                    // failed
                });
            }
        };

    var getPaises = function() {
        $http.get(Routing.generate('getpaises')
        ).then(function (dist) {

            $scope.paises=dist.data;
            //$scope.paisselected=$scope.paises[0];
        });
    };
    getPaises();



    $scope.$watch('filtro', function() {

        if ($scope.filtro!=undefined){

            $scope.users=$filter('filter')($scope.users_ori,$scope.filtro);
            if ($scope.filtrodist!=""){
                $scope.rowUsers=$scope.users.length;

                var begin = ((1 - 1) * $scope.numPerPage)
                    , end = begin + $scope.numPerPage;

                if($scope.users){
                    $scope.users = $scope.users.slice(begin, end);
                }
            }else {
                $scope.rowUsers=$scope.users_ori.length;

                var begin = ((1 - 1) * $scope.numPerPage)
                    , end = begin + $scope.numPerPage;

                if($scope.users_ori){
                    $scope.users = $scope.users_ori.slice(begin, end);
                }
            }
        }
    });



    $scope.chaneStateUser=function (id,state) {
        var stateUser=1;
        if(state=="1"){
             stateUser=0;
        }
        $http({
            url: Routing.generate('save_users_state'),
            method: "POST",
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            data: {
                id:id,
                state: stateUser
            },
            transformRequest: function (obj) {
                var str = [];
                for (var p in obj)
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                return str.join("&");
            }
        }).then(function (response) {
                getUsuarios();
            },
            function (response) { // optional
                // failed
            });
    };


    $scope.new = function (item,template , controller) {
        if (item==null){
            item={};
        }
        item.perfiles=$scope.perfiles;
        item.dists=$scope.dists;
        item.paises=$scope.paises;
        item.usersbyroles=$scope.usersbyroles;
        item.contratistas=$scope.contratistas;
        var modalInstance = $uibModal.open({
            templateUrl: template,
            controller: controller,
            size:"lg",
            resolve: {
                item: function () {
                    return item;
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {
            getUsuarios();
            //$log.info('Modal dismissed at: ' + new Date());
        });
    };
});



GSPEMApp.controller('ModalNewUserCtrl', function($filter,$scope,$http,$uibModal, $uibModalInstance, item,toastr) {
    $scope.usersbyroles=[];

    $scope.item = item;
    $scope.perfiles=item.perfiles;


    $scope.paises=item.paises;
    $scope.paisselected=item.paises[0];

    $scope.paisesenabled=false;
    $scope.distenabled=true;





    $scope.dists=[];
    $scope.dists=item.dists;

    $scope.dists_ori=item.dists;



    $scope.contratistas=item.contratistas;

    $scope.usersbyroles=item.usersbyroles;
    //console.log($scope.usersbyroles);
    $scope.contratistaenabled=false;
    $scope.levels=[];
    $scope.levels.push(
        {id:1,name:"Administrador General"},
        {id:2,name:"Administrador Regional"},
        {id:3,name:"Administrador Nacional"},
        {id:6,name:"Vendedor"},
        {id:4,name:"Administrador en Disitribuidora"},
        {id:5,name:"Técnico"}
        );

    $scope.levelselected=$scope.levels[0];
    //$scope.contratistaselected=$scope.contratistas[0];

    $scope.profileselected=$scope.perfiles[0];
    $scope.distsselected=$scope.dists[0];


    $scope.type=1;
    $scope.pass="";
    $scope.passedite=true;
    $scope.bosseselected=[];

    $scope.fixIE = function(){
        //code to check if IE so the other browsers don't get this ugly hack.
        var selectLists = document.querySelectorAll(".selectList");
        for(var x = 0;x  < selectLists.length; x++){
            selectLists[x].parentNode.insertBefore(selectLists[x], selectLists[x]);
        }
    };

    $scope.editPass=function () {
        if($scope.passedite){
            $scope.passedite=false;
        }else {
            $scope.passedite=true;
        }
    }


    if(item.id!=null){
        $scope.profileselected=$filter('filter')($scope.perfiles,{"id":item.profileid})[0];
        $scope.paisselected=$filter('filter')($scope.paises,{"id":item.pais})[0];

        $scope.levelselected=$filter('filter')($scope.levels,{"id":item.level})[0];
        if (item.disid!=0){
            $scope.distsselected=$filter('filter')($scope.dists,{"id":item.disid})[0];
        }
        if(item.contratistaid==0){
            $scope.contratistaenabled=false
        }else {
            if(item.contratistaid>0){
                $scope.contratistaenabled=true;
                $scope.contratistaselected= $filter('filter')($scope.contratistas,{"id":item.contratistaid})[0];
            }else {
                $scope.contratistaenabled=false
            }
        }
        $scope.id=item.id;
        $scope.nombre=item.name;
        $scope.apellido=item.lastName;
        $scope.perfil=item.view;
        $scope.user=item.username;
        $scope.phone=item.phone;
        $scope.mail=item.mail;
    }else {
        //console.log("new");
        $scope.nombre="";
        $scope.descript="";
        $scope.id=0;
        $scope.precio=0;
        $scope.precio1=0;
        $scope.perfil=1;
    }

    $scope.updateCon=function () {
        //console.log($scope.contratistaselected);
    }


    $scope.cerrar=function () {
        $uibModalInstance.dismiss('cancel');
    };


    $scope.checkRol=function () {
        $scope.distenabled=false;
        $scope.paisesenabled=false;
        console.log($scope.levelselected);
        if ($scope.levelselected.id==1){
            //admin gral.
            $scope.distenabled=false;
            $scope.paisesenabled=false;
        }
        if ($scope.levelselected.id==2){
            //admin reg.
            $scope.distenabled=false;
            $scope.paisesenabled=false;
        }

        if ($scope.levelselected.id==3){
            //admin nac.
            $scope.distenabled=false;
            $scope.paisesenabled=true;
        }

        if ($scope.levelselected.id==4 || $scope.levelselected.id==5 || $scope.levelselected.id==6 ){
            //admin dist.
            $scope.distenabled=true;
            $scope.paisesenabled=true;
        }

    }

    $scope.filterDist=function () {
        // filtros las dist por pais

        $scope.dists=$filter('filter')($scope.dists_ori,{"pais_id":$scope.paisselected.id});
        if ($scope.dists.length>0){
            $scope.distsselected=$scope.dists[0];
        }
    }


    $scope.saveUser= function () {

        if ($scope.nombre.length == 0 || $scope.user.length == 0  || $scope.mail.length == 0 ) {
            toastr.warning('Complete todos los campos requeridos (*)', 'Atención');
            return false;
        }

        if(!$scope.passedite){
            if($scope.pass.length <6){
                toastr.warning('La clave no puede ser menor a 6 digitos', 'Atención');
                return false;
            }
        }else{
            $scope.pass="";
        }

        if($scope.mail.search("@")< 0 || $scope.mail.indexOf(".com")< 0){
            toastr.warning('Mail invalido', 'Atención');
            return false;
        }


        if($scope.contratistaenabled){

            $scope.contrat= $scope.contratistaselected.id;
        }else {
            $scope.contrat = 0;
        }

        if (!$scope.distsselected){
            $scope.distsselected={id:0}
        }

        if (!$scope.paisselected){
            $scope.paisselected={id:0}
        }


        $http({
            url: Routing.generate('saveuser')+'/'+$scope.id,
            method: "POST",
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            data: {
                nombre: $scope.nombre,
                apellido: $scope.apellido,
                id_dist:$scope.distsselected.id,
                username:$scope.user,
                password:$scope.pass,
                phone:$scope.phone,
                contratista: $scope.contrat,
                mail:$scope.mail,
                pais:$scope.paisselected.id,
                view:$scope.profileselected.id,
                level:$scope.levelselected.id,
            },
            transformRequest: function (obj) {
                var str = [];
                for (var p in obj)
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                return str.join("&");
            }
        }).then(function (response) {
                ////console.log(response);
                $uibModalInstance.dismiss('cancel');
            },
            function (response) { // optional
                // failed
            });
    };

    $scope.findDist=function(){
        var modalInstance = $uibModal.open({
            templateUrl: 'dist_list.html',
            controller: 'ModalDistList',

        });

        modalInstance.result.then(function (selectedItem) {

            $scope.selected = selectedItem;

        }, function (item) {
            console.log(item);

            $scope.cargando=true;
            //getClients()
            //$log.info('Modal dismissed at: ' + new Date());
        });
    };
});

GSPEMApp.controller('ModalDistList', function($filter,$scope,$http, $uibModalInstance,toastr) {


    $scope.cerrar=function () {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.propertyName = 'name';
    $scope.reverse = true;
    $scope.sortBy = function(propertyName) {
        $scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
        $scope.propertyName = propertyName;
    };

    $scope.select=function (cli) {
        $uibModalInstance.dismiss(cli);
    }

});
