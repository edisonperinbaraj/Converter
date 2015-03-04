angular.module("Settings")

.controller("auditTrailInit",['$scope','CustomService', function($scope, CustomService) {

	angular.element(document).ready(function () {
		setTimeout(function(){CustomService.appInit()},1);
	});

}])
.controller("auditTrailController",['$scope','UtilitiesService','DataService','RequestConstantsFactory',
                                    function($scope, UtilitiesService, DataService, RequestConstantsFactory ) {

	//Constants needed for requests
	var requestContants = RequestConstantsFactory['AUDIT_TRAIL'];
	var errorConstants = RequestConstantsFactory['ERROR_MSGS'];
	//Setting the scope variable for showing 'spinner' until the data is loaded
	$scope.dataLoaded = false;
	//Loading the options for data - for the myTable directive
	$scope.options = UtilitiesService.getDataTableOptions();
	var requestData = {};
	var listOfUsers = [];
	var listOfModules = [];
	var listOfActivities = [];
	//When the filter button is clicked
	$scope.auditTrailFilter = function() {
		listOfUsers = [];
		listOfModules = [];
		listOfActivities = [];
		$.each($scope.moduleList, function(index, module){
			if(module.selected ==  true){
				listOfModules.push(module.moduleId);
			}
		})
		$.each($scope.activityList, function(index, activity){
			if(activity.selected ==  true){
				listOfActivities.push(activity.activityId);
			}
		})
		$.each($scope.userList, function(index, user){
			if(user.selected ==  true){
				listOfUsers.push(user.userId);
			}
		})
		//request
		console.log("$scope.fromDate", $scope.fromDate, $scope.toDate)
		if($scope.fromDate){
			var fromDate =  moment($scope.fromDate).format(window.appConstants.DATE_FORMAT);
		}else {
			var fromDate = "";
		}
		if($scope.toDate){
			var toDate = moment($scope.toDate).format(window.appConstants.DATE_FORMAT);
		}else {
			var toDate = "";
		}
		var timeRange = {};
		requestData[requestContants.LIST_OF_MODULES] = listOfModules;
		requestData[requestContants.FROM_DATE] = fromDate;
		requestData[requestContants.TO_DATE] = toDate;
		requestData[requestContants.CHANGED_BY] = listOfUsers;
		requestData[requestContants.LIST_OF_ACTIVITIES] = listOfActivities;
		loadAuditTrailList(requestData);
	}
	$scope.fail = function (msg) {
        $scope.error = true;
        $scope.hasErrorMsg = true;
        if(msg){
        	if(msg instanceof Object){
        		$scope.errorMsg = (msg.message == "" ? errorConstants.NETWORK_ERR  : msg.status+" : "+msg.message);
        	} else {
                $scope.errorMsg = msg;
        	}
        }
    }
	//Function executed after the response from the network
	$scope.addData = function (data) {
		try {
			//when data is available, set as false 
			$scope.error = false;
			//If data is loaded, set as true
			$scope.dataLoaded = true;
			$scope.options.aaData = [];
			if(data.length == 0){
				$scope.options.aaData.push(['', '', '', '', '' ]);
			}
			//For loading the AuditTrailList table data
			$.each(data.auditList, function (key, obj) {
				$scope.options.aaData.push([key+1, obj.moduleName, obj.activity, obj.date, obj.changedBy ]);
			})
		} catch (e) {
			$scope.fail(errorConstants.DATA_ERR);
		}
	};
	$scope.auditFilterData = [];
	$scope.addData($scope.auditFilterData);
	/*
	 * Function for loading moduleList and activityList for setup
	 * Function executed after the response from the network
	 */
	$scope.success = function (data) {
		try {
			//when data is available, set as false 
			$scope.error = false;
			//If data is loaded, set as true
			$scope.dataLoaded = true;
			
			if(!data){
				throw "noDataError";
			}
			
			$scope.activityList = data.activityList;
			//$scope.users = data.userList;
			$scope.moduleList = data.moduleList;
			
		} catch (e) {
			$scope.fail(errorConstants.DATA_ERR);
		}
	};
	
	/*
	 * Function for loading userList for setup
	 * Function executed after the response from the network
	 */
	$scope.userListSuccess = function (data) {
		try {
			//when data is available, set as false 
			$scope.error = false;
			//If data is loaded, set as true
			$scope.dataLoaded = true;
			$scope.userList = data;
			if(!data){
				throw "noDataError";
			}
		} catch (e) {
			$scope.fail(errorConstants.DATA_ERR);
		}
	};
	//Function calls the dataservice for getting the AuditTrailList table data
	function loadAuditTrailList(requestData) {
		var cacheKey = "auditTrailList" + JSON.stringify(requestData);
		console.log("requestData:", requestData);
		var func = $scope.addData; 
		if (arguments[1]) { 
			if (arguments[1].key == cacheKey) { 
				func = null; 
			} else { 
				return false; 
			} 
		}
		DataService.getAuditTrailList(requestData, func, $scope.fail);
	}

	//Function calls the dataservice for getting the AuditTrailList userlist data for setup
	function loadUserListForSetup(){
		var cacheKey = "auditTrailUserList";
		var func = $scope.userListSuccess;
		if (arguments[1]) { 
			if (arguments[1].key == cacheKey) { 
				func = null; 
			} else { 
				return false; 
			} 
		}
		DataService.getUserList(func, $scope.fail);
	}
	//Function calls the dataservice for getting the AuditTrailList data for setup
	function auditTrailSetUp() {
		requestData = {};
		var cacheKey = "auditTrailSetUp" + JSON.stringify(requestData);
		var func = $scope.success; 
		if (arguments[1]) { 
			if (arguments[1].key == cacheKey) { 
				func = null; 
			} else { 
				return false; 
			} 
		}
		DataService.getAuditTrailSetUp(requestData, func, $scope.fail);
	}
	loadUserListForSetup();
	auditTrailSetUp();
}])