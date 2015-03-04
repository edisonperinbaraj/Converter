angular.module('Home')

.service("DataService",['RequestConstantsFactory','NetworkService','UtilitiesService','StorageService','$timeout',
                        function(RequestConstantsFactory, NetworkService, UtilitiesService, StorageService, $timeout) {
	
	function postRequestWS(url, reqData, success, fail, beforeSuccess) {
		var requestWS = function() {
			NetworkService.post(url, reqData).then(function(result){
				if(result){
					var data = beforeSuccess(result);
					if(success instanceof Function) {
						success(data);
					}
				}else{
					fail(result);
				}
			}, function(response) {
				if(fail instanceof Function) {
			    	fail(response);
                }
			});
		}
		return requestWS;
	}
	/*------------------ login Page ----------------------*/
	this.getLoginDetails = function(reqData, success, fail) {
		var requestWS = postRequestWS(
				RequestConstantsFactory['LOGIN_URL'], 
				reqData,
				success, 
				fail,
				function(result) {
					var cData = result;
					return cData;
				}
		);
		requestWS();
	};
	
	/*------------------ change password Page ----------------------*/
	this.getChangePasswordDetails = function(reqData, success, scope){
		var requestWS = function() {
			NetworkService.post(RequestConstantsFactory['CHANGE_PASS_URL'], reqData, scope).then(function(result){
				console.log("result:", result)
				if(!result)
					throw {message: "No Response from Server!", type: "internal"};
				if(success instanceof Function)
					success(result);
			}).catch(function(e){

				UtilitiesService.throwError(scope,e);
			});
		}
		requestWS();
	};
	
}])