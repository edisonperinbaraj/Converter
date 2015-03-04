angular.module('AnalyticsApp')

.service('NetworkService', ['$http','UtilitiesService','$q','$location',function($http, UtilitiesService, $q,$location) {
	
	this.get = function(url, scope){
		// $http returns a promise, which has a then function, which also returns a promise
		//Define headers in Options here
        var options = {
            headers: {},
        };
		if(localStorage.getItem('token')){
			options = {
		            headers: {"AuthToken":localStorage.getItem('token')},
		        };
		}
		var deferred = $q.defer();
		var promise = $http.get(url, options).then(function (response) {
        
			// The then function here is an opportunity to modify the response

			console.log('RESPONSE',response)
			// The return value gets picked up by the then in the controller.
			if(response.status == 200) {
				if(response.headers('AuthToken')){
					localStorage.setItem('token', response.headers('AuthToken'));
				}
				deferred.resolve(response.data);
			}else {
				console.info('DATA FETCH IS NOT SUCCESS!!!', response);
				deferred.resolve(response);
			}
		}, function(response){
//	code for 401
//			if(response.status == 401) {
//			location.replace('/dollarConvertor/login.htm');
//			}
            deferred.reject(response);
        }).catch(function(e){
            UtilitiesService.throwError(undefined, {message: "Network Error?! [NTWRK-SRVC]", type: "internal"});
        });
      
	  // Return the promise to the data service
      return deferred.promise;
	};
	
	this.post = function(url, data, scope) {
		// $http returns a promise, which has a then function, which also returns a promise
        //Define headers in Options here
        var options = {
            headers: {},
        };
		if(localStorage.getItem('token')){
			options = {
		           headers: {"AuthToken":localStorage.getItem('token')},
		        };
		}
		console.log("AuthToken", localStorage.getItem('token'))
        var deferred = $q.defer();
		var promise = $http.post(url, data, options).then(function (response) {
			// The then function here is an opportunity to modify the response
			// The return value gets picked up by the then in the controller.
			if(response.status == 200) {
				if(response.headers('AuthToken')){
					localStorage.setItem('token', response.headers('AuthToken'));
				}
				deferred.resolve(response.data);
			}else {
				console.info('DATA FETCH IS NOT SUCCESS!!!', response);
				deferred.resolve(response);
			}
		}, function(response){
			//		code for 401
//			if(response.status == 401) {
//				location.replace('/dollarConvertor/login.htm');
//			}
            deferred.reject(response);
        }).catch(function(e){
            UtilitiesService.throwError(undefined, {message: "Network Error?! [NTWRK-SRVC]", type: "internal"});
        });
		// Return the promise to the data service

		return deferred.promise;
	};
	
}])


//Defered notify - additional implementation possible for logging.