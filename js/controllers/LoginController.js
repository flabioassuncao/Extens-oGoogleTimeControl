myApp.controller("LoginController", function ($scope, activitySer, $location) {
    
    $scope.alert = true;
    $scope.login = function (loginData) {
        activitySer.login(loginData).success(function (response) {

            $location.path('/timer');

        }).error(function (data) {
            $scope.alert = false;
			$scope.message = "Verifique seus dados!";
		});
    };
});