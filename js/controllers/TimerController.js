myApp.controller("TimerController", function ($scope, activitySer, serialGenerator, addHour, $timeout, localStorageService) {

	$scope.timeTotal;
	$scope.counter = 0;

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
             document.getElementById('endDate').value = moment().format();
             
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

	$scope.createActivity = function(activity){
        
        activity.activityId = serialGenerator.generate();
        activity.Responsible = activitySer.authenticationUser.userName;
        console.log(activity);
        activitySer.saveActivity(activity).success(function (data) {
			var time = {};
                time.TimeId = serialGenerator.generate();
                time.StartDate = document.getElementById('startDate').value;
                time.ActivityId = activity.activityId;
                activitySer.saveTime(time);
		});
        
    }

    $scope.valueStartDate = function (){
        document.getElementById('startDate').value = moment().format();
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
          activity.activityId = activitySer.recuperarIdActivity();
          activity.Responsible = activitySer.authenticationUser.userName;
          activity.Status = true;
          activity.StartDate = document.getElementById('startDate').value;
          activity.EndDate = document.getElementById('endDate').value;
          var tempo = document.getElementById('tempo').innerText;
          tempo = tempo.replace("H ", ":");
          tempo = tempo.replace("M ", ":");
          tempo = tempo.replace("S", "");
          activity.Time = tempo 
          activitySer.updateActivity(activity).success(function (data) {
            updateTime();  
			delete $scope.activity;
            document.getElementById('tempo').innerText  = '00H 00M 00S';
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
        time.StartDate = document.getElementById('startDate').value;
        time.EndDate = document.getElementById('endDate').value;
        var dt1 = moment(time.StartDate, "YYYY/MM/DD hh:mm:ss");
        var dt2 = moment(time.EndDate, "YYYY/MM/DD hh:mm:ss");
        // time.ActivityTime = dt2.diff(dt1, 'seconds');
        time.ActivityTime = converterSegundos(dt2.diff(dt1, 'seconds'));
        time.status = true;
        activitySer.updateTime(time);
        
    }

    var continuarActivity = function() {
        var idData = localStorageService.get('continueActivity');
        if(idData != null){
            $scope.activity = idData;
            
            
            var time = {};
            time.TimeId = serialGenerator.generate();
            time.StartDate = moment().format();
            time.ActivityId = activitySer.recuperarIdActivity();;
            activitySer.saveTime(time); 
            document.getElementById('startDate').value = moment().format();
                
            $scope.tagInit = true;
            $scope.tagStop = true;
            $scope.stopped = false;
        }
    }

    var atividadeAberta = function (){
        activitySer.getActivity().success(function (data) {
			var objts = data;
            var resul;
            var timer;
            var item
            // console.log(objts.length);
            var authData = localStorageService.get('authorizationData');
                // console.log(authData.userName);
            for(item in objts){
                for(var teste in objts[item].Times){
                    if(objts[item].Times[teste].status == false && objts[item].Responsible == authData.userName){ //add user
                        timer = objts[item].Times[teste];
                        resul = objts[item];
                    }
                }
            }
            
            if(resul){
                console.log(timer.ActivityTime);
                $scope.activity = resul;
                var dt1 = moment(timer.StartDate, "YYYY/MM/DD hh:mm:ss");
                var dt2 = moment(moment().format(), "YYYY/MM/DD hh:mm:ss");
                var diferenca = dt2.diff(dt1, 'seconds');
                var x = moment.duration(diferenca,'seconds')
                var h = x.hours().toString().length == 2? x.hours() : ("0" + x.hours());
                var m = x.minutes().toString().length == 2? x.minutes() : ("0" + x.minutes());
                var s = x.seconds().toString().length == 2? x.seconds() : ("0" + x.seconds());
                document.getElementById('tempo').innerText  = h + "H " + m + "M " + s + "S";
                $scope.counter = diferenca;
                $scope.tagInit = true;
                $scope.tagStop = true;
                $scope.stopped = false;
                document.getElementById('startDate').value = timer.StartDate;
                localStorageService.set('idActivityData', { idActivity: resul.activityId});
                localStorageService.set('idTimeData', { idTime: timer.TimeId});
                
            }else{
                console.log("sem reg");
            }
		}).error(function (data, status) {
			
		});
    }

	$scope.authentication = activitySer.authenticationUser;

	Authentication();
	// continuarActivity();
    atividadeAberta();
});