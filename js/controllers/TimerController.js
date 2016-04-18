myApp.controller("TimerController", function ($scope, activitySer, addHour, $timeout, localStorageService) {

	$scope.timeTotal;
	$scope.counter = 0;
    var teste;
    $scope.Duration = "00H 00M 00S";

	$scope.timeTotal = function(){
        var total = "00:00:00";
        for(var i = 0; i < $scope.act.length; i++){
            var hora = $scope.act[i];
            total = addHour.addHoras(total, hora.Time, false);
        }
        return total;
    }
    
    $scope.stopped = true;
    var vm = this;
    vm.Total = 0;
    $scope.onTimeout = function(){
        if(!$scope.stopped){
            $scope.counter++;
            mytimeout = $timeout($scope.onTimeout,1000);
        }
    }
    
    var mytimeout = $timeout($scope.onTimeout,1000);
    $scope.takeAction = function(){
        if(!$scope.stopped){
            $timeout.cancel(mytimeout);
             $scope.tagStart = true;
             $scope.tagStop = false;
             $scope.EndDate = moment().format();
             
        }
        else
        {
            mytimeout = $timeout($scope.onTimeout,1000);
        }
            $scope.stopped=!$scope.stopped;
    }
    
    $scope.timeTotal = function(){
        var total = "00:00:00";
        for(var i = 0; i < $scope.act.length; i++){
            var hora = $scope.act[i];
            total = addHour.addHoras(total, hora.Time, false);
        }
        return total;
    }

	var Authentication = function (){
		activitySer.verificarAuthen();
	}

	$scope.logOut = function () {
		activitySer.logOut();
	}

	$scope.createActivity = function(activityLink){

        if(activityLink){
            var activity = {};
            activity.Link = $scope.activityLink;
            activity.Responsible = activitySer.authenticationUser.userName;
            activitySer.saveActivity(activity).success(function (data) {
                var time = {};
                    time.StartDate = $scope.StartDate;
                    time.ActivityTime = "00:00:00";
                    time.ActivityId = data.ActivityId;
                    activitySer.saveTime(time);
            });
        }
    }

    $scope.linkPage = function () {
        chrome.tabs.getSelected(null,function(tab) {
            document.getElementById('activityLink').value = tab.url;
        });
    }

    $scope.valueStartDate = function (){
        $scope.StartDate = moment().format(); 
    }

    $scope.HideStart = function(){
        if($scope.tagInit == true){
            $scope.tagInit = false;
            $scope.tagAstart = false;
            $scope.tagStart = false;
        }
        else{
            $scope.tagInit = true;
            $scope.tagAstart = true;
            $scope.tagStop = true;
            
        }  
    }

    $scope.updateActivity = function(activity)
    {
          activity.ActivityId = activitySer.recuperarIdActivity();
          activity.Responsible = activitySer.authenticationUser.userName;
          
          activitySer.updateActivity(activity).success(function (data) {
            updateTime();  
			delete $scope.activity;
            delete $scope.activityLink;
            $scope.Duration = '00H 00M 00S';
            $scope.counter = 0;
		});
            
    }

    var converterSegundos = function (s){
              
        function duas_casas(numero){
            if (numero <= 9){
                numero = "0"+numero;
            }
            return numero;
        }

        var hora = duas_casas(Math.round(s/3600));
        var minuto = duas_casas(Math.floor((s%3600)/60));
        var segundo = duas_casas((s%3600)%60);
                
        var formatado = hora+":"+minuto+":"+segundo;
                
        return formatado;
    }

    var updateTime = function () {
        var time = {};
        time.TimeId = activitySer.recuperarIdTime();
        time.StartDate = $scope.StartDate;
        time.EndDate = $scope.EndDate;
        var dt1 = moment(time.StartDate, "YYYY/MM/DD hh:mm:ss");
        var dt2 = moment(time.EndDate, "YYYY/MM/DD hh:mm:ss");
        time.ActivityTime = converterSegundos(dt2.diff(dt1, 'seconds'));
        time.status = true;
        activitySer.updateTime(time);
        
    }

    var atividadeAberta = function (){
        var user = activitySer.authenticationUser.userName;
        if(user){
            activitySer.getActivity().success(function (data) {
    			var objts = data, resul, timer, item;
                var authData = localStorageService.get('authorizationData');
                for(item in objts){
                    for(var teste in objts[item].Times){
                        if(objts[item].Times[teste].Status == false && objts[item].Responsible == authData.userName){ //add user
                            timer = objts[item].Times[teste];
                            resul = objts[item];
                        }
                    }
                }
                
                if(resul){
                    $scope.activity = resul;
                    $scope.activityLink = resul.Link;
                    var dt1 = moment(timer.StartDate, "YYYY/MM/DD hh:mm:ss");
                    var dt2 = moment(moment().format(), "YYYY/MM/DD hh:mm:ss");
                    var diferenca = dt2.diff(dt1, 'seconds');
                    var x = moment.duration(diferenca,'seconds')
                    var h = x.hours().toString().length == 2? x.hours() : ("0" + x.hours());
                    var m = x.minutes().toString().length == 2? x.minutes() : ("0" + x.minutes());
                    var s = x.seconds().toString().length == 2? x.seconds() : ("0" + x.seconds());
                    $scope.counter = diferenca;
                    $scope.tagInit = true;
                    $scope.tagStop = true;
                    $scope.stopped = false;
                    $scope.StartDate = timer.StartDate;
                    localStorageService.set('idActivityData', { idActivity: resul.ActivityId});
                    localStorageService.set('idTimeData', { idTime: timer.TimeId});
                    
                }else{
                    chrome.tabs.getSelected(null,function(tab) {
                        $scope.activityLink =  tab.url;
                    });
                }
    		}).error(function (data, status) {
    			
    		});
        }
    }

	$scope.authentication = activitySer.authenticationUser;

	Authentication();
    atividadeAberta();
});