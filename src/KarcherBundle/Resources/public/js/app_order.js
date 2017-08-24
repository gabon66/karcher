/**
 * Created by gabo on 26/07/16.
 */


GSPEMApp.controller('newOrder', function($scope,$http,$filter,$uibModal,toastr,MovPend) {

    $scope.newNumOrder="";
    $scope.distName="";
    $scope.userName="";
    $scope.date = $filter('date')(new Date(), 'dd-MM-yyyy hh:mm');


    var getNewOrder = function() {
        $http.get(Routing.generate('getnextorderid')
        ).then(function (orden) {
            console.log(orden);
            $scope.newNumOrder=("0000"+orden.data.user.idDistribuidor).slice(-4)+("0000"+orden.data.next).slice(-4)
            $scope.distName=orden.data.dist.name;
            $scope.userName=orden.data.user.lastName + " "+orden.data.user.name;
        })
    }
    getNewOrder();
});
