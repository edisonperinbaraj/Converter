angular.module('DecisionWorkbench')

.controller( "buildDoInit",['$scope','DataService','CustomService','ChartOptionsService','$rootScope',
                            function($scope, DataService, CustomService, ChartOptionsService, $rootScope) {
	//In utilities.js - DWPageChange
	$rootScope.$broadcast('DWPageChange', "changed");
	angular.element(document).ready(function () {
		setTimeout(function(){CustomService.appInit()},1);
	});

}])
.controller("modalController",['$scope','$rootScope','RequestConstantsFactory','DataService','DataConversionService','UtilitiesService','$element',
                               '$timeout',function($scope,$rootScope,RequestConstantsFactory, DataService,DataConversionService, UtilitiesService, $element, $timeout){

	var dOptionId;
	var currentData;
	$scope.dataLoaded = false;
	$scope.radioValue = 'selected';
	$scope.savingDO = false;
	var requestConstants = RequestConstantsFactory['NOTIFICATION'];
	var errorConstants = RequestConstantsFactory['ERROR_MSGS'];

	$rootScope.$on('TableData', function(obj, data){
		currentData = data;
	});
	$scope.options = UtilitiesService.getDataTableOptions();
	
	//edit DO Action success
	$scope.success = function (data) {
		try {
			$scope.dataLoaded = true;
			$scope.error = false;
			$scope.modifyTableData = data;
			if( $scope.modifyTableData.doDetails.doId == $scope.currentIndex)
			{	
				$scope.modifyData = $scope.modifyTableData.doDetails;
				dOptionId = data['doDetails'].doId;	
			}
			else{
				$scope.modifyData = "";
				dOptionId = "";
			}
			$("select").trigger('change');
		} catch (e) {
			$scope.fail(errorConstants.DATA_ERR);
		}
	}

	$scope.$on('decisionModify',function(object,index){
		$scope.showError = false;
		$scope.$apply();
		$scope.currentIndex = index;
		$scope.requestData = {
				"doId": index,
				"periodName":$rootScope.selectedPeriod
		};
		loadDecisionOptionsTable();
	});

	$scope.$on('decisionValidate',function(object,index){
		$scope.showError = false;
		$scope.error = false;
		$scope.$apply();
		$scope.validateIndex = index;
		getCurrentData();
	});

	function getCurrentData(){
		$.each(currentData, function(key, obj){
			if(obj.doId == $scope.validateIndex){
				$scope.currentData  = obj;
				var temp = obj.targetconvList;
				$scope.currentData.targetconvList = temp.replace(/<br>/g, ",").replace(/\,$/g, "");
				$scope.$apply();
			}
		})

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

	$scope.addValidateData = function (data) {
		if(data.status == 'OK'){
			$scope.options.aaData = [];
			$.each(data, function(key, obj){
				obj.convUpliftAchieved.trend == '+ve' ? $scope.img = "<img  src='images/arrow-up-green.png'/>"
					: $scope.img = "<img  src='images/arrow-red.png' />";
				$scope.options.aaData.push([key+1,obj.convActivityList,obj.channel,obj.tenure,obj.startDate,$scope.img+obj.convUpliftAchieved.value,$scope.img+obj.convUpliftExpected.value,obj.newSubs.subsAchieved,obj.newSubs.subsExpected]);
				$scope.error = false;
			});
			$timeout(function(){
				$(window).trigger('resize');
			},1);
			$scope.showError = false;
			$scope.dataLoaded = true;
		}
		else{
			$scope.showError = true;
			$scope.dataLoaded = true;
		}

	};
	$scope.showTable = function(){
		$scope.show = false;
	}
	
	//validateDO 
	$scope.validateFilter = function(fromDate, toDate){
		var fromDate =  moment(fromDate).format(window.appConstants.DATE_FORMAT);
		var toDate =  moment(toDate).format(window.appConstants.DATE_FORMAT);
		$scope.show = true;
		var convActivityList = [];
		var allCombination;
		$.each($scope.currentData.convAct, function(key, convAct){
			var tempObj = {
					"convActivityId": convAct.convActivityId,
			};
			convActivityList.push(tempObj);
		});
		allCombination = ("$scope.radioValue=='all'"?true:false);
		$scope.validateRequestData = {
				"doId": $scope.validateIndex,
				"periodName":$rootScope.selectedPeriod,
				"filter" : {
					"convActivityList" :convActivityList,
					//"convActivityAllCombination":allCombination,
					"execDtUpperBound" : fromDate,
					"execDtLowerBound" : toDate
				}
		};
		console.log("ppp $scope.validateRequestData:", $scope.validateRequestData)
		loadDecisionOptionsTableValidate();
	}

	//To save the DO, after it is edited -- editDOSaveAction
	$scope.saveDecisionOptions = function(){
		if(!userGroupForm.checkValidity()){
			$scope.savingDO = false;
			return false;
		}
		else{
			$scope.savingDO = true;
			var requestDoSave = {};
			var userGroup = [];
			$.each( $('#modifyDialog [type="number"]'), function(key, text){
				var tempObj = {
						"groupId" : text.id,
						"userCount" : text.value
				};
				userGroup.push(tempObj);
			});
			var channelId = $scope.selectChannel;
			if($scope.selectChannel == null){
				channelId = "";
			}
			var requestDoSave = {
					"doId": dOptionId,
					"channelId": channelId,
					"userGroupList" : userGroup,
					"periodName": $rootScope.selectedPeriod
			};
			loadReviewDecisionOptionsTable(requestDoSave);
		}
	};

	$scope.buildDoTable = function(result) {
		UtilitiesService.getNotifyMessage("DO Saved Successfully",requestConstants.SUCCESS);
		$scope.savingDO = false;
		if(result.status == 'OK'){
			$scope.showError= true;
			$rootScope.$broadcast("builddoTableData", result);
			$('#mask, .window').hide();
		}
		else{
			$scope.showError= true;
		}
	}

	function loadDecisionOptionsTableValidate() {
		var func = $scope.addValidateData; 
		var cacheKey = "DWDecisionTableValidate" + JSON.stringify($scope.validateRequestData);
		if (arguments[1]) { 
			if (arguments[1].key == cacheKey) { 
				func = null; 
			} else { 
				return false; 
			} 
		}
		DataService.getDecisionOptionsValidateData($scope.validateRequestData, func, $scope.fail);
	}
	
	//For populating the edit DO popup
	function loadDecisionOptionsTable() {
		var func = $scope.success; 
		var cacheKey = "DWDecisionTableModify" + JSON.stringify($scope.requestData);
		if (arguments[1]) { 
			if (arguments[1].key == cacheKey) { 
				func = null; 
			} else { 
				return false; 
			} 
		}
		DataService.getDecisionOptionsModifyData($scope.requestData, func, $scope.fail);
	}

	function loadReviewDecisionOptionsTable(requestData) {
		var rEG = UtilitiesService.getRequestData();
		var func = $scope.buildDoTable; 
		if (arguments[1]) { 
			if (arguments[1].key == cacheKey) { 
				func = null; 
			} else { 
				return false; 
			} 
		}
		DataService.editDOSaveAction(requestData, func, $scope.fail);
	}
}])


.controller( "achievementUpliftController",['$scope','DataService','chartsService','$rootScope','CustomService','ChartOptionsService','DataConversionService','UtilitiesService','RequestConstantsFactory',
                                  	function($scope, DataService, chartsService, $rootScope,CustomService,ChartOptionsService,DataConversionService,UtilitiesService,RequestConstantsFactory) {

	var errorConstants = RequestConstantsFactory['ERROR_MSGS'];
	$scope.dataLoaded = false;
	var requestData = {
			"groupBy" : "cmpgnView",
	};
	var utilData = UtilitiesService.getRequestData();
	requestData = angular.extend({}, utilData, requestData);
	$scope.showChart = false;
	var buildDoChartOptions = ChartOptionsService.getBuildDoData();
	$scope.success = function (builddoChart) {
		$scope.currentAchievableChart = builddoChart;
		try {
			$scope.dataLoaded = true;
			var buildDoChartOptions = ChartOptionsService.getBuildDoData();
			$scope.$on('doInitialSelected',function(index, data ,selectedIndex){
				$scope.showChart = true;
				var achievableUplift = DataConversionService.toGetAchievableUplift(data, selectedIndex, $scope.currentAchievableChart['paidUsers']);
				buildDoChartOptions.xAxis.categories[4] = "Conv Uplift "+ selectedIndex;
				if(achievableUplift.data)
					chartsService.waterfall.call($("#buildDoChart"), achievableUplift,buildDoChartOptions, $scope);	
				else
					$scope.error = true;
			});
			setTimeout(function(){
				$rootScope.$broadcast('chartLoaded')
			},1);
		} catch (e) {
			$scope.fail(errorConstants.DATA_ERR);
		}
	}
	$scope.fail = function (msg) {
		$scope.error = true;
		$scope.hasErrorMsg = true;
		$rootScope.$emit('chartError');
		if(msg){
			if(msg instanceof Object){
				$scope.errorMsg = (msg.message == "" ? errorConstants.NETWORK_ERR  : msg.status+" : "+msg.message);
			} else {
				$scope.errorMsg = msg;
			}
		}
	}
	function loadData() {
		var func = $scope.success; 
		DataService.getBuildDoChartData(requestData, func,$scope.fail);
	}
	loadData();

	$scope.$on('doSelected',loadCombinedDO);
	$scope.addChart = function(data){
		$rootScope.chartLoading = false;
		$scope.showChart = true;
		$scope.currentData =  data;
		var achievableUplift = DataConversionService.toGetChartFromCombinedDO($scope.currentData, $scope.currentAchievableChart['paidUsers']);
		buildDoChartOptions.xAxis.categories[4] = "Conv Uplift "+ data.doId;
		
		if(achievableUplift.data)
			chartsService.waterfall.call($("#buildDoChart"), achievableUplift, buildDoChartOptions, $scope);	
        else
            $scope.error = true;
	}
	
	function loadCombinedDO(event, selectedIndex){
		console.log("ppp getCombinedDO", selectedIndex)
		var requestData = {
				"doIdList":selectedIndex
		};
		var func = $scope.addChart; 
		DataService.getCombinedDO(requestData, func,$scope.fail);
	}
}])

.controller( "reviewPanel", ['$scope','$rootScope','RequestConstantsFactory','DataService','UtilitiesService','$compile','$element','$location','sharedProperties',
                             	function($scope, $rootScope, RequestConstantsFactory, DataService, UtilitiesService, $compile, $element, $location, sharedProperties) {

	var errorConstants = RequestConstantsFactory['ERROR_MSGS'];
	$scope.dataLoaded = false;
	$scope.reviewPaneloptions = {
			"columns": [
			            { "width": "30px" },
			            { "width": "80px" },
			            null
			            ],
			            sScrollY : '60px',
			            bPaginate: false,
			            bScrollCollapse: true,
			            dom: '<"dataTableContainer"t><"dataTablePaginateContainer"p>'
	};
	$scope.isDataInReviewPanelTable = false;
	$scope.options = UtilitiesService.getDataTableOptions();
	$.extend(true,$scope.options,$scope.reviewPaneloptions);
	$scope.addData = function (data) {
		try{
			var obj = data;
			$scope.options.aaData = [];
			if(data.length == 0){
				$scope.options.aaData.push(['','','']);
			}
			if(data.length){
				$scope.isDataInReviewPanelTable = true;
				$.each(data, function(key, obj){
					$scope.options.aaData.push(["<input type='checkbox' ng-model='tableData["+key+"].selected'>",
					                            obj.number,
					                            "<img  src='images/arrow-up-green.png'/>"+obj.uplift+" / "+obj.newSubs]);
				})
			}
			$scope.dataLoaded = true;
		}
		catch(e){
			$scope.fail(errorConstants.DATA_ERR);
		}
	};

	$scope.reviewTableData = [];
	$scope.addData($scope.reviewTableData);
	$scope.removeSelected = function() {
		$scope.isDataInReviewPanelTable = false;
		var reviewTableData = [];
		angular.forEach($scope.reviewTableData, function(eachRow) {
			if(eachRow.selected == false) {
				reviewTableData.push(eachRow);
			}
		});
		$scope.reviewTableData = reviewTableData;
		$scope.addData(reviewTableData);
	};
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
	//adds the selected dos to the review panel
	$scope.addSelectedDOs = function() {
		var expectedNewSub;
		if($rootScope.selectDOs.length > 0) {
			var selectedDO = {
					"number" : "",
					"uplift" : 0,
					"newSubs" : 0,
					"selected" : true
			};
			angular.forEach($rootScope.selectDOs, function(DO) {

				if(selectedDO.number == "") {
					selectedDO.number = selectedDO.number + DO.doId;
				} else {
					selectedDO.number = selectedDO.number + ", " + DO.doId;
				}
				selectedDO.uplift = (parseInt(selectedDO.uplift) + parseInt(DO.convUplift.value)) + "%";
				expectedNewSub = UtilitiesService.getIntFromString(DO.expectedNewSub);
				selectedDO.newSubs = selectedDO.newSubs + expectedNewSub;
			});
			selectedDO.newSubs = UtilitiesService.getLocaleString(selectedDO.newSubs)
			//adds the selected DOs to the review panel
			var hasDO = false;
			angular.forEach($scope.reviewTableData, function(DO) {
				var selectedNumber = selectedDO.number.split(", ");
				var doNumber = DO.number.split(", ");
				if(UtilitiesService.containsAll(selectedNumber, doNumber)){
					hasDO = true;
				}
			});
			if(!hasDO) {
				$scope.reviewTableData.push(selectedDO);
				$scope.addData($scope.reviewTableData);
			}
		}
	};

	function onSaveSuccess() {
		$scope.dataLoaded = true;
		$location.path("/review-do");
	}

	$scope.save = function() {
		$scope.dataLoaded = false;
		var request = {
				"doIdList": [        
				             ],
				             "filter": "executed"
		}
		$scope.reviewTableData.forEach(function(doObj){
			var singleDOArray = [];
			doObj.number.split(",").forEach(function(doNumber){
				var reviewedDOObj = {};
				reviewedDOObj["doId"] = doNumber.trim();
				singleDOArray.push(reviewedDOObj);
			});
			request.doIdList.push(singleDOArray);
		});
		sharedProperties.setReviewDORequest(request);
		console.log("ppp getReviewDORequest:", sharedProperties.getReviewDORequest())
		onSaveSuccess();
		//DataService.saveSelectedDO(request, $scope, onSaveSuccess);
	}

}])

.controller("buildDoTableController",['$scope', '$element','$rootScope','$location','RequestConstantsFactory','DataService','sharedProperties','UtilitiesService','DataConversionService',
                                      function($scope, $element, $rootScope, $location, RequestConstantsFactory, DataService, sharedProperties, UtilitiesService, DataConversionService) {

	var errorConstants = RequestConstantsFactory['ERROR_MSGS'];
	var notifyRequestConstants = RequestConstantsFactory['NOTIFICATION'];
	$scope.dataLoaded = false;
	$scope.options= UtilitiesService.getDataTableOptions();
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
	$rootScope.$on('chartError',function(){
		$scope.fail(errorConstants.DATA_ERR);
	})
	$scope.$on('chartLoaded', function () {
		$rootScope.chartLoading = false;
		var selectedIndex = [];
		var actualData = [];
		$rootScope.selectDOs = [];
		$rootScope.$on('builddoTableData', function (event, tableData) {
			$scope.addData(tableData);
		});
		$scope.addData = function (data) {
			UtilitiesService.getNotifyMessage(window.notifyConstants.NOTIFY_DW_DO_UPDATED,notifyRequestConstants.SUCCESS);
			$scope.dataLoaded = true;
			if(!data)
				throw "noDataError";
			$rootScope.$broadcast('TableData', data);
			actualData = data;
			try {
				$scope.error = false;
				$scope.options.aaData = [];
				selectedIndex = [];
				$rootScope.selectDOs = [];
				$.each(data, function(key, obj){
					if(obj.checked) {
						$rootScope.selectDOs.push(obj);
						selectedIndex.push(obj.doId);
					}
					obj.convUplift.trend == '+ve' ? $scope.img = "<img  src='images/arrow-up-green.png'/>"
						: $scope.img = "<img  src='images/arrow-red.png' />";
					$scope.options.aaData.push([obj.doId,obj.targetconvList,obj.channelList,obj.userGroup,obj.expectedNewSub,obj.usersTargetted,$scope.img+obj.convUplift.value,"<a href='#' data-modal='#modifyDialog' name='modal' data-id='"+obj.doId+"' class='edit'"
					                            +"title='Edit'></a><a title='Validate' href='#' data-modal='#dialog' data-id='"+obj.doId+"'"
					                            +"name='modal' class='save'> </a> <input type='checkbox' id='DORow_"+obj.doId+"' ng-checked='"+obj.checked+"' ng-disabled='otherData' data-id='"+obj.doId+"' ng-click=\"tableData('"+obj.doId+"')\"/>"]);
				})
				$rootScope.$broadcast('doInitialSelected', data, selectedIndex);
			} catch (e) {
				$scope.fail(errorConstants.DATA_ERR);
			}
		};
		$scope.getDONumber = function(doId) {
			$rootScope.dosUpdated = true;
			actualData.forEach(function(data){
				if(doId == data.doId) {
					if($('#DORow_'+ doId).is(':checked')) {
						$rootScope.selectDOs.push(data);
						selectedIndex.push(doId);
					} else {
						$rootScope.selectDOs = $rootScope.selectDOs.filter(function( obj ) {
							return obj.doId != doId;
						});
						selectedIndex = [];
						$rootScope.selectDOs.forEach(function(DO){
							selectedIndex.push(DO.doId);
						});
					}
				}
			});
			$rootScope.chartLoading = true;
			$rootScope.$broadcast('doSelected', selectedIndex);
		}
		
		$scope.$watch(
				function () {
				    return sharedProperties.getRequestDO();
				},
				function (newValue) {
					//Check and proceed after newValue is not empty 
					if(!UtilitiesService.isObjectEmpty(newValue)){
					    loadData();
					}
				}
			);
		
		function loadData() {
			var urlIndex = $location.search();
			if(!UtilitiesService.isObjectEmpty(sharedProperties.getRequestDO())){
				var requestData = sharedProperties.getRequestDO();
				sharedProperties.setRequestDO("");
			}else{
				var periodDataObj = {"periodName": $rootScope.selectedPeriod,"reportingInterval":"weekly"};
				console.log('periodDataObj',periodDataObj)
				var requestData = {
						"mode": "freemium",
						"timeRange": UtilitiesService.getSelectedPeriodRequestData(),
						"filter": {
							"listOfUserGroups": [],
							"listOfConvActivity": [],
							"convUplift": {},
						}
				};
			}
			
			
			var func = $scope.addData; 
			if (arguments[1]) { 
				if (arguments[1].key == cacheKey) { 
					func = null; 
				} else { 
					return false; 
				} 
			}
			DataService.getBuilddoDecision(requestData, func, $scope.fail);
		}
		loadData();
	});
}])


