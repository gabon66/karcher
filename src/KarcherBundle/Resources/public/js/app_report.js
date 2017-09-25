/**
 * Created by gabo on 26/07/16.
 */

GSPEMApp.controller('reportOrders', function($scope,$http,$filter,$uibModal,toastr,MovPend) {

    $scope.orders_pend=0;
    $scope.orders_proc=0;
    $scope.orders_closed=0;

    $scope.sortBy = function(propertyName) {
        $scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
        $scope.propertyName = propertyName;
    };
    var getOrders = function() {
        $http.get(Routing.generate('getorders')
        ).then(function (data) {
            $scope.cargando=false;
            $scope.orders=data.data;
            $scope.orders_pend=$filter('filter')($scope.orders,{"estd":0});
            $scope.orders_proc=$filter('filter')($scope.orders,{"estd":1});
            $scope.orders_closed=$filter('filter')($scope.orders,{"estd":2});

        });
    };
    getOrders();

    var getOrdersProsc = function() {
        $http.get(Routing.generate('getordersprosc')
        ).then(function (data) {
            $scope.cargando=false;
            $scope.orders_prosp=data.data;

        });
    };
    getOrdersProsc();



    $scope.exportar=function (name) {

        var blob = new Blob([document.getElementById('exportable').innerHTML], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
        });
        saveAs(blob, "Reporte_"+name+".xls");
    };
});
