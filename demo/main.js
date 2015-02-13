angular.module("demo", ["ig-carousel"])
    .run(["$rootScope", function($rootScope) {
        console.log("Demo running");
    }]);

angular.module("demo")
.controller("mainController", ["$scope", function($scope) {
    console.log("Main controller running");
    $scope.items = [1,2,3,4,5];
}]);