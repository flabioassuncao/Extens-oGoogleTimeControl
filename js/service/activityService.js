myApp.factory("activitySer", function ($http, config, $q, localStorageService, $location) {

	var _authenticationUser = {
		isAuth: false,
		userName: "",
		useRefreshTokens: false
	};

	var _login = function (loginData) {
	
		return $http.post("http://localhost:5000/Account/Login", loginData).success(function (response) {
				localStorageService.set('authorizationData', { userName: loginData.Email, authenticationUser: true });

				_authenticationUser.isAuth = true;
				_authenticationUser.userName = loginData.Email;
				_authenticationUser.useRefreshTokens = false;
		}).error(function (err, status) {
			_logOut();
		});
	}

	var _logOut = function () {

		localStorageService.remove('authorizationData');

		var authen = localStorageService.get('authorizationData');


		_authenticationUser.isAuth = false;
		_authenticationUser.userName = "";
		_authenticationUser.useRefreshTokens = false;
		$location.path('/login');
	};

	var _verificarAuthen = function () {

		var authen = localStorageService.get('authorizationData');


        if(authen == null)
             $location.path('/login');
    }

    var _saveActivity = function (activity) {
		return $http.post(config.baseUrl + "/Activity", activity).success(function (response) {
                localStorageService.set('idActivityData', { idActivity: activity.activityId});
        }).error(function (err, status) {
           
        });
	};

	var _saveTime = function (time) {
        return $http.post(config.baseUrl + "/Activity/SaveTime", time).success(function (response) {
                localStorageService.set('idTimeData', { idTime: time.TimeId});
        }).error(function (err, status) {
           
        });
    }

    var _recuperarIdActivity = function() {
        
        var idData = localStorageService.get('idActivityData');
        return idData.idActivity;
    }

    var _recuperarIdTime = function(){
        var idTimeData = localStorageService.get('idTimeData');
        return idTimeData.idTime;
    }

    var _updateActivity = function (activity) {
		return $http.put(config.baseUrl + "/Activity", activity);
	};

	var _updateTime = function(time) {
        return $http.put(config.baseUrl + "/Activity/UpdateTime", time);
    };

    var _getActivity = function () {
		return $http.get(config.baseUrl + "/Activity");
	};

	var _fillAuthData = function () {

        var authData = localStorageService.get('authorizationData');
        if (authData) {
            _authenticationUser.isAuth = true;
            _authenticationUser.userName = authData.userName;
            _authenticationUser.useRefreshTokens = false;
        }

    };

	return {
		login: _login,
		logOut: _logOut,
		verificarAuthen: _verificarAuthen,
        authenticationUser: _authenticationUser,
        saveActivity: _saveActivity,
        saveTime: _saveTime,
        recuperarIdActivity: _recuperarIdActivity,
        recuperarIdTime: _recuperarIdTime,
        updateActivity: _updateActivity,
        updateTime: _updateTime,
        getActivity: _getActivity,
        fillAuthData: _fillAuthData
	};

});
