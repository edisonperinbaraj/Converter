angular.module("Settings")

.controller("goalsInit",['$scope','CustomService','$rootScope', function ($scope, CustomService,$rootScope) {

	angular.element(document).ready(function () {
		setTimeout(function () { CustomService.appInit() }, 1);
	});

}])

.controller("businessImpactTargetController",['$scope','$q','ngTreetableParams','DataService','RequestConstantsFactory','$rootScope',
                                              function ($scope, $q, ngTreetableParams, DataService, RequestConstantsFactory , $rootScope) {

	$scope.dataLoaded = false;
	$rootScope.$on('targetTableData',function(event,data){
		$scope.addData(data);
	});
	$rootScope.$on('targetTableError', function (event, data) {
		$scope.fail(data);
	});
	//Constants needed for requests
	var requestContants = RequestConstantsFactory['GOALS'];
	var errorConstants = RequestConstantsFactory['ERROR_MSGS'];
	var today = new Date();
	//Getting today's date in needed format
	var toDate = moment(today).endOf('year').format(window.appConstants.DATE_FORMAT);
	var fromDate =  moment(today).startOf('year').format(window.appConstants.DATE_FORMAT);

	$scope.addData = function (data) {
		$scope.deferred.resolve(data);
		$scope.error = false;
		$scope.dataLoaded = true;
	};
	$scope.goalValues = new ngTreetableParams({
		getNodes: function (parent) {
			$scope.deferred = $q.defer();
			return parent ? parent.children : $scope.deferred.promise;
		},
		getTemplate: function (node) {
			return 'tree_node';
		}
	});

	$scope.fail = function (msg) {
		$scope.error = true;
		$scope.dataLoaded = true;
		$scope.hasErrorMsg = true;
		if(msg){
			if(msg instanceof Object){
				$scope.errorMsg = (msg.message == "" ? errorConstants.NETWORK_ERR  : msg.status+" : "+msg.message);
			} else {
				$scope.errorMsg = msg;
			}
		}
	}
}])

.controller("EngagementActivityTargetController",['$scope','$q','ngTreetableParams','DataService','RequestConstantsFactory','$rootScope',
                                                  function ($scope, $q, ngTreetableParams, DataService, RequestConstantsFactory , $rootScope) {

	$scope.dataLoaded = false;
	$rootScope.$on('targetTableData',function(event,data){
		$scope.addData(data);
	});
	$rootScope.$on('targetTableError', function (event, data) {
		$scope.fail(data);
	});
	//Constants needed for requests
	var requestContants = RequestConstantsFactory['GOALS'];
	var errorConstants = RequestConstantsFactory['ERROR_MSGS'];
	var today = new Date();
	//Getting today's date in needed format
	var toDate = moment(today).endOf('year').format(window.appConstants.DATE_FORMAT);
	var fromDate =  moment(today).startOf('year').format(window.appConstants.DATE_FORMAT);

	$scope.addData = function (data) {
		$scope.deferred.resolve(data);
		$scope.error = false;
		$scope.dataLoaded = true;
	};

	$scope.goalValues = new ngTreetableParams({
		getNodes: function (parent) {
			$scope.deferred = $q.defer();
			return parent ? parent.children : $scope.deferred.promise;
		},
		getTemplate: function (node) {
			return 'EA_tree_node';
		}
	});

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
}])


.controller("goalsModalController",['$scope','$rootScope','DataService','UtilitiesService','RequestConstantsFactory',
                                    function ($scope,$rootScope,DataService,UtilitiesService, RequestConstantsFactory ) {
	var container = $('#addGoalsDialog');
	var constants = RequestConstantsFactory['GOALS'];
	var requestConstants = RequestConstantsFactory['NOTIFICATION'];
	var errorConstants = RequestConstantsFactory['ERROR_MSGS'];
	var today = new Date();
	var gridInitialData;
	//Getting today's date in needed format
	var toDate = moment(today).endOf('year').format(window.appConstants.DATE_FORMAT);
	var fromDate =  moment(today).startOf('year').format(window.appConstants.DATE_FORMAT);
	//When editgoals modal is clicked
	$rootScope.$on('goalEdit', loadEditGoalData);
	$scope.dataLoaded = true;
	$scope.savingGoals = false;
	$scope.isValid = true;
	var goalId;
	var editGoalsSaveRequest = {};
	//sucess function for users
	$scope.success = function (data) {
		try {
			$scope.dataLoaded = true;
			$scope.error = false;
			if (!data) {
				throw "noDataError";
			}
			if (data.status == 'OK') {
				$rootScope.$broadcast('goalsDataChange', data);
				$('#mask, .window').hide();
				$scope.savingGoals = false;
				UtilitiesService.getNotifyMessage("Goals Updated Successfully",requestConstants.SUCCESS);
			}
			else{
				$scope.showError = true;
				$scope.savingGoals = false;
			}
		} catch (e) {
			$scope.fail(errorConstants.DATA_ERR);
		}
	};
	$scope.saveGridSuccess = function(data){
		if (data.status == 'OK') {
			UtilitiesService.getNotifyMessage("Submitted data saved successfully!!!",requestConstants.SUCCESS);
		}else{
			UtilitiesService.getNotifyMessage("Problem in saving the data",requestConstants.SUCCESS);
		}
	}

	$scope.fail = function (msg) {
		$scope.error = true;
		$scope.hasErrorMsg = true;
		$scope.savingGoals = false;
		if(msg){
			if(msg instanceof Object){
				$scope.errorMsg = (msg.message == "" ? errorConstants.NETWORK_ERR  : msg.status+" : "+msg.message);
			} else {
				$scope.errorMsg = msg;
			}
		}
	}

	var targetItems = [];
	$rootScope.$on('getGridData', loadGridData);
	$scope.gridDateRangeSuccess = function(result){
		//For the sheet - target 
		$.each(result.dateRangeList, function(key , week){
			var tempObj =  {
		            "rangeId": week.rangeId,
		            "startDate": week.startDate,
					"endDate": week.endDate,
		            "revenue": 0.00,
		            "newSubscribers": 0.00,
		            "registrations": 0.00,
		            "netNewSubscribers":0.00,
		            "arpu": 0.00,
		            "engScore": 0.00,
		            "sendArchives": 0.00,
		            "sendVideo": 0.00,
		            "multipleAppUsers": 0.00,
		            "sendAudio": 0.00,
		            "sendPdf": 0.00,
		            "workSpaceShare": 0.00,
		        };
			targetItems.push(tempObj);
		})
		loadGridInitialData();
	}

	//When the initial data request for the grid is successful
	$scope.gridInitialDataSuccess = function(result){
		$.each(targetItems, function(key, eachRange){
			$.each(result.targetList, function(value, eachData){
				if(eachData.rangeId == eachRange.rangeId){
					eachRange['revenue'] = parseInt(eachData.revenue);
					eachRange['newSubscribers'] = parseInt(eachData.newSubscribers);
					eachRange['registrations'] = parseInt(eachData.registrations);
					eachRange['netNewSubscribers'] = parseInt(eachData.netNewSubscribers);
					eachRange['arpu'] = parseInt(eachData.arpu);
					eachRange['engScore'] = parseInt(eachData.engScore);
					eachRange['sendArchives'] = parseInt(eachData.sendArchives);
					eachRange['sendVideo'] = parseInt(eachData.sendVideo);
					eachRange['multipleAppUsers'] = parseInt(eachData.multipleAppUsers);
					eachRange['sendAudio'] = parseInt(eachData.sendAudio);
					eachRange['sendPdf'] = parseInt(eachData.sendPdf);
					eachRange['workSpaceShare'] = parseInt(eachData.workSpaceShare);
				}
			})
		})
		//for taking clone and changes should not be affected in copied data
		gridInitialData = angular.copy(targetItems);
	}

	$scope.items = targetItems;
	$scope.afterRender = function() {
		$('.header-grouping').remove();
		container.find('.wtHolder.ht_master thead tr').before('<tr class="header-grouping"><th colspan=3></th><th colspan=7>Business Metrics</th><th colspan=8>Engagament Metrics</th></tr>');
		container.find('.ht_clone_top thead').find('tr:nth-child(1)').before('<tr class="header-grouping"><th colspan=3></th><th colspan=7>Business Metrics</th><th colspan=8>Engagament Metrics</th></tr>');
	};
	$scope.beforeRender = function(){
		$('.ht_clone_top .header-grouping').remove();
	}

	//When save button is clicked in the Target grid template
	$scope.saveTargetGrid = function(){
		var isValid = true;
		var isEdited = false;
		var editedRows = [];
		var oldEditedKey = -1;
		var requestData = angular.copy($scope.items);
		$.each(requestData, function(key, object){
			var columnIndex = 1;
			$.each(object, function(columnHead, column){
				//ColumnIndex less than 2, so that 1st 3 read only columns can be ignored for validation
				if(columnIndex > window.appConstants.TARGET_GRID_READONLY_COLUMNS && typeof(column) != 'number' && column.length > 0){
					isValid = false;
				}
				//Checking if the initial data is changed
				if(column != gridInitialData[key][columnHead]){
					//This check for removing multiple entry of keys
					if(oldEditedKey != key){
						//Getting the keys of only edited data rows
						editedRows.push(key);
					}
					oldEditedKey = key;
					isEdited = true;
				}
				columnIndex++;
			})
		})
		if(isValid && isEdited){
			var editedRowDatas = [];
			$('#mask, .window').hide();
			$scope.isValid = true;
			//To get only the edited row of data
			$.each(editedRows, function(key, value){
				editedRowDatas.push(requestData[value]);
			})
			var request = {
				"targetList" : editedRowDatas
			};
//			request for save should not contain start date and end date
			$.each(editedRowDatas,function(key,value){
				delete value['startDate'];
				delete value['endDate'];
			})
			DataService.saveTargetGridData(request, $scope.saveGridSuccess, $scope.fail);
			UtilitiesService.getNotifyMessage("Submitted data saved successfully!!!",requestConstants.SUCCESS);
		}else{
			$scope.isValid = false;
		}
	}
	//Set the datas to scope to populate the edit goals modal
	$scope.editGoalsSuccess = function (goalTableData) {
		try {
			$scope.dataLoaded = true;
			$scope.error = false;
			if (!goalTableData) {
				throw "noDataError";
			}
			//Set the scope variables to show data in editGoal modal
			getGoalValues(goalTableData);
		} catch (e) {
			$scope.fail(errorConstants.DATA_ERR);
		}
	};  


	//Creating request when  save button is clicked in 'edit' modal
	$scope.editGoalsSave = function(){
		$scope.savingGoals = true;
		if(!editGoalsForm.checkValidity()){
			$scope.savingGoals = false;
			return false;
		}
		$scope.dataLoaded = false;
		//Request
		editGoalsSaveRequest[constants.GOAL_ID] = goalId;
		editGoalsSaveRequest[constants.GOAL_PERIOD] = $scope.time;
		editGoalsSaveRequest[constants.REVENUE] = $scope.revenue;
		editGoalsSaveRequest[constants.NPU] = $scope.NPU;
		editGoalsSaveRequest[constants.CONV_RATE] = $scope.conversionRate;
		editGoalsSaveRequest[constants.NEW_SIGNUPS] = $scope.newSignUp;
		editGoalsSaveRequest[constants.PAGE_VIEWS] = $scope.pageView;
		//function call
		goalsEditSave(editGoalsSaveRequest);
	}

	// To iterate throw the tree and get the goals row data
	function getGoalValues(goalTableChildData){
		$.each(goalTableChildData, function (index, eachRow) {
			if (eachRow.goalId == goalId) {
				$scope.time = eachRow.goalPeriod;
				$scope.revenue = UtilitiesService.getIntFromString(eachRow.revenue);
				$scope.NPU = UtilitiesService.getIntFromString(eachRow.npu);
				$scope.conversionRate = eachRow.convRate;
				$scope.newSignUp = UtilitiesService.getIntFromString(eachRow.newSignUps);
				$scope.pageView = UtilitiesService.getIntFromString(eachRow.pageViews);
				$scope.$apply();
			}
			else{ 
				if(eachRow.children){
					getGoalValues(eachRow.children);
				}
			}
		});
	}
	/*--------For modal data-------*/
	// To get the data for edit users modal 
	function loadEditGoalData(object, id) {
		$scope.showError = false;
		$scope.savingGoals = false;
		$scope.error = false;
		$scope.$apply();
		var requestData = {};
		var timeRange = {};
		timeRange[constants.FROM_DATE] = fromDate;
		timeRange[constants.TO_DATE] = toDate;
		requestData[constants.TIME_RANGE] = timeRange;
		goalId = id;
		var func = $scope.editGoalsSuccess;
		DataService.getGoalTableData(requestData, func, $scope.fail);
	}
	//to save the edited goals
	function goalsEditSave(requestData) {
		var func = $scope.success;
		DataService.editGoalsSave(requestData, func, $scope.fail);
	}
	function loadGridData(){
		var requestData = {}; 
		var func = $scope.gridDateRangeSuccess;
		if (arguments[1]) {
			if (arguments[1].key == cacheKey) {
				func = null;
			} else {
				return false;
			}
		}
		DataService.getTargetGridDateRange(requestData, func, $scope.fail);
	}

	function loadGridInitialData() {
		var requestData = {}; 
		var func = $scope.gridInitialDataSuccess;
		if (arguments[1]) {
			if (arguments[1].key == cacheKey) {
				func = null;
			} else {
				return false;
			}
		}
		DataService.getListTarget(requestData, func, $scope.fail);
	}
}])


.controller("goalsFilterController",[ '$scope','fileUpload','UtilitiesService','RequestConstantsFactory','$rootScope','DataService',
                                      function($scope, fileUpload , UtilitiesService, RequestConstantsFactory, $rootScope,DataService){
	var requestConstants = RequestConstantsFactory['GOALS'];
	var requestData = {};
	$scope.getGridData = function(){
		$rootScope.$broadcast('getGridData');
	}
	var now = moment();
	$scope.year = parseInt(UtilitiesService.getYear(now));
	$scope.yearList = [$scope.year-1,$scope.year,$scope.year+1,$scope.year+2];
	$scope.setSelectedYear = function(){
		if($scope.selectedYear){
			requestData[requestConstants.YEAR] = $scope.selectedYear;
			loadTargetTableData();
		}
	}
	$scope.addData = function (data) {
		$rootScope.$broadcast('targetTableData',data);
	};
	$scope.fail = function (msg) {
		$rootScope.$broadcast('targetTableError',msg);
	}
	function loadTargetTableData() {
		//request
		if(!$scope.selectedYear){
			requestData[requestConstants.YEAR] = $scope.year;
		}
		var func = $scope.addData;
		if (arguments[1]) {
			if (arguments[1].key == cacheKey) {
				func = null;
			} else {
				return false;
			}
		}
		DataService.getGoalTableData(requestData, func, $scope.fail);
	}
	loadTargetTableData();

}])