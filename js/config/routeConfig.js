myApp.config(function ($routeProvider) {
   
   $routeProvider.when("/timer", {
		templateUrl: "js/views/timer.html",
		controller: "TimerController"
	});

    $routeProvider.when("/login", {
		templateUrl: "js/views/login.html",
		controller: "LoginController"
    });
    
    $routeProvider.otherwise(
    { 
        redirectTo: '/timer' 
    });
});
