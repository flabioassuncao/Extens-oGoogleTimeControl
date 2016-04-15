var myApp = angular.module('TimeControlEx', ['ngRoute', 'LocalStorageModule']);

myApp.run(['activitySer', function (activitySer) {
    activitySer.fillAuthData();
}]);