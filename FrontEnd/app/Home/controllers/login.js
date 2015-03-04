angular.module('Home')

.controller( "loginInit",['$scope','CustomService', function($scope, CustomService) {
	localStorage.clear();
	setTimeout(function(){CustomService.appInit();},1);
	
}])

.controller('loginController',[ '$scope','DataService','UtilitiesService','RequestConstantsFactory','$location','$window',
                                function($scope, DataService, UtilitiesService, RequestConstantsFactory, $location, $window) {

	//Constants needed for requests
	var requestConstants = RequestConstantsFactory['LOGIN'];
	//Constants needed for response
	var responseConstants = RequestConstantsFactory['RESPONSE'];
	//Request Initialization
	var requestData ={};
	$scope.loadingLoginResult = false;
	//Function to be executed after response from the server
	$scope.success = function(data){
		$scope.loadingLoginResult = false;
		if(data.user){
			localStorage.setItem('token',data.token);
			localStorage.setItem('permissionList',data.permissionList);
			$window.location="home.htm";
		}else{
			$scope.loginError = true;
		}
	}
	
	$scope.fail = function(){
		$scope.loadingLoginResult = false;
		$scope.showNetworkError = true;
	}

	//function executed when 'login' is clicked
	$scope.signIn = function(){
		$scope.loginError = false;
		$scope.showNetworkError = false;
		$scope.loadingLoginResult = true;
		//request
		requestData[requestConstants.USER_NAME] = $scope.userName;
		requestData[requestConstants.PASSWORD] = $scope.password;
		//DataService call
		DataService.getLoginDetails(requestData, $scope.success, $scope.fail);
		//temporary have to remove the below code
		//$window.location="home.htm";
	}
}])

