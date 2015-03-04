angular.module('Home')

.controller('changePasswordController',['$scope','DataService','UtilitiesService','RequestConstantsFactory', '$location','$window',
                                        function($scope, DataService, UtilitiesService, RequestConstantsFactory, $location, $window ) {

	//Constants needed for requests
	var requestConstants = RequestConstantsFactory['CHANGE_PASSWORD'];
	//Constants needed for response
	var responseConstants = RequestConstantsFactory['RESPONSE'];
	//Request Initialization
	var requestData ={};
	$scope.loadingChangePwdResult = false;
	
	//Function to be executed after response from the server
	$scope.success = function(data){
		$scope.loadingChangePwdResult = false;
		console.log('$scope.loadingChangePwdResult',data)
		if(data.status==responseConstants.STATUS_OKAY){
			$scope.showNetworkError = false;
//			if(data.updateSuccess == true){
				console.log("success");
				$window.location="home.htm";
//			}else{
//			}
		}else{
			$scope.showNetworkError = true;
		}
	}

	//for validating the passwords
	var validatePasswords = function(){
		if($scope.newPassword == $scope.oldPassword){
			$scope.pwdsCannotSameError = true;
		}else if($scope.newPassword != $scope.confirmPassword){
			$scope.pwdsDoesNotMatchError = true;
		}else{
			loadChangePasswordDetails();
		}
	}
	
	//function executed when 'change' is clicked
	$scope.changePassword = function(){
		$scope.pwdsCannotSameError = false;
		$scope.pwdsDoesNotMatchError = false;
		validatePasswords();
	}
	
	//for loading the changePassword Details
	function loadChangePasswordDetails(){
		$scope.loadingChangePwdResult = true;
		//request
		//requestData[requestConstants.OLD_PASSWORD] = $scope.oldPassword;
		requestData[requestConstants.NEW_PASSWORD] = $scope.newPassword;
		//requestData[requestConstants.CONFIRM_PASSWORD] = $scope.confirmPassword;
		console.log("change Password request:", requestData)
		//DataService call
		DataService.getChangePasswordDetails(requestData, $scope.success, $scope);
		//temporary have to remove the below code
	//	$window.location="home.htm";
	}
}])

