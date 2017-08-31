/**
 * Created by gabo on 26/07/16.
 */


GSPEMApp.controller('ordersControl', function($scope,$http,$uibModal,toastr,MovPend) {

    $scope.cargando=true;
    var getOrders = function() {
        $http.get(Routing.generate('getorders')
        ).then(function (data) {
            $scope.cargando=false;
            $scope.orders=data.data;
            console.log($scope.orders);
        });
    };
    getOrders();
});
