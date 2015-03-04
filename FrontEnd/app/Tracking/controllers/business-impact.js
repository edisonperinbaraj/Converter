angular.module('Tracking')

.controller("businessImpactInitController",['$scope','CustomService','DataService' ,'DataConversionService','$rootScope','UtilitiesService',
                                            function ($scope, CustomService, DataService, DataConversionService,$rootScope, UtilitiesService) {
    angular.element(document).ready(function () {

        var chartOBJ = {};
        var classNames = [];
        $('.newSubsTrendTab .tabItem').on('click', function () {
            if ($(this).hasClass('active')) {
                return false;
            }
            $(this).addClass('active').siblings('li').removeClass('active');
            $('.subsTrendCohort, #subsTrendCohort, .subsTrendChart, #subsTrendChart').toggleClass('hidden');
            $('.deepDive2, #deepDive2, .deepDive1, #deepDive1').toggleClass('hidden');
        });
        setTimeout(function () { CustomService.appInit(); }, 1000);
    });
    UtilitiesService.getTotalMemory();
    $rootScope.$broadcast('periodChange');
}])

.controller("businessImpactMatricesController",['$scope','$rootScope','Permission','MenuService','NetworkService','DataService','RequestConstantsFactory','UtilitiesService','sharedProperties','$location','DataConversionService','StorageService',
                                                function ($scope, $rootScope,Permission, MenuService, NetworkService, DataService, RequestConstantsFactory ,UtilitiesService, sharedProperties, $location, DataConversionService, StorageService) {
	
	var errorConstants = RequestConstantsFactory['ERROR_MSGS'];
	$scope.initialFlag = true;
	$scope.dataLoaded = false;
    $scope.urlIndex = $location.search();
    $scope.menuType = [];
    $scope.menuData = [];
    $scope.userSettings = {};
    $scope.menu = MenuService.getMenu(5, $scope);
    //Setting shared property value when the widget is selected
    $scope.selected = MenuService.widgetSelected;
    $scope.menu.getUserSettings("BI",
								function (userSettingsData) {
								    $scope.userSettings = userSettingsData;
								});
    $rootScope.$on('onCacheExpiry', loadData);
    $scope.$on('periodChange',function(){
	    $scope.dataLoaded = false;
        $scope.error = false;
		loadData();
	});
    $scope.$on('menuSave', function () {
        $scope.menu.saveMenu("BI", "Business Impact", $scope.userSettings);
    });

    $scope.success = function (trackSummaryBI) {
    	$scope.dataLoaded = true;
        try {
            $scope.error = false;
            if (trackSummaryBI[$rootScope.selectedPeriod].length == 0)
                throw { message: "Selected period data not available!", type: "internal" };
            $scope.businessImpact = trackSummaryBI[$rootScope.selectedPeriod];
            $scope.menu.setData($scope.businessImpact);
            $scope.forecastText = $scope.Constants[$scope.Constants.BI_Prefix + 'forecast_' + $scope.selectedPeriod];
            $scope.vsLastText = $scope.Constants[$scope.Constants.BI_Prefix + 'vsLast_' + $scope.selectedPeriod];
            $scope.vsLastYearText = $scope.Constants[$scope.Constants.BI_Prefix + 'vsLastYear_' + $scope.selectedPeriod];
        } catch (e) {
        	console.log('IT FAIL')
        	$scope.fail(errorConstants.DATA_ERR);
        }
    }
    $scope.fail = function (msg) {
        $scope.error = true;
        $scope.hasErrorMsg = true;
        $rootScope.$emit('businessImpactDataError');
        if(msg){
        	if(msg instanceof Object){
        		$scope.errorMsg = (msg.message == "" ? errorConstants.NETWORK_ERR  : msg.status+" : "+msg.message);
        	} else {
                $scope.errorMsg = msg;
        	}
        }
    }

//    //Watching the value of shared property
//    $scope.$watch(
//		function () {
//		    return sharedProperties.getSubGroupBy();
//		},
//		function (newValue) {
//			console.log("iiiiiii1", newValue)
//		    loadData();
//		}
//	);

    function loadData(forceSilent) {
    	var requestData = {"groupBy": "BI"};
    	var utilData = UtilitiesService.getRequestData();
		var func = $scope.success; 
    	if($scope.initialFlag == true){
    		$scope.initialFlag = false;
			var utilData = UtilitiesService.getInitialRequestData();
		}else if(forceSilent == true){
    		var func = null; 
		}
		requestData = angular.extend({}, utilData, requestData);
		var cacheKey = "BIM" + JSON.stringify(requestData);
    	if (arguments[1]) {
    		if (arguments[1].key == cacheKey) {
    			func = null;
    		} else {
    			return false;
    		}
    	}
    	DataService.getTrackSummaryDataBI(requestData, func, $scope.fail);
    }
    loadData();
	loadData(true);
}])

.controller("businessImpactSummaryController",['$scope','$rootScope','Permission','DataService','sharedProperties','RequestConstantsFactory','DataConversionService','UtilitiesService','StorageService',
                                               function ($scope, $rootScope,Permission, DataService, sharedProperties, RequestConstantsFactory,DataConversionService, UtilitiesService, StorageService) {
	var errorConstants = RequestConstantsFactory['ERROR_MSGS'];
    $scope.businessImpactSummary = {};
	$scope.dataLoaded = false;
	$scope.$on('periodChange',function(){
	    $scope.dataLoaded = false;
        $scope.error = false;
		loadData();
	});
    $scope.$on('dataReady', loadData);
    $rootScope.$on('onCacheExpiry', loadData);
    
    $rootScope.$on('businessImpactDataError',function(){
		$scope.fail(errorConstants.DATA_ERR);
	})
    $scope.success = function (businessImpactSummary) {
        try {
        	$scope.dataLoaded = true;
            $scope.error = false;
            businessImpactSummary[$rootScope.selectedPeriod].forEach(function (data) {
                if (data.subGroupBy == sharedProperties.getSubGroupBy()) {
                    $scope.businessImpactSummary = data;
                }
            });
            $scope.forecastText = $scope.Constants[$scope.Constants.BI_Prefix + 'summary_forecast_' + $rootScope.selectedPeriod];
            $scope.toLastText = $scope.Constants[$scope.Constants.BI_Prefix + 'comparedLast_' + $rootScope.selectedPeriod];
            $scope.toLastLYText = $scope.Constants[$scope.Constants.BI_Prefix + 'comparedLastYear_' + $rootScope.selectedPeriod];
        } catch (e) {
        	$scope.fail(errorConstants.DATA_ERR);
        }
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

    function loadData() {
    	var requestData = {"groupBy": "BI"};
        var utilData = UtilitiesService.getRequestData();
        requestData = angular.extend({}, utilData, requestData);
        var cacheKey = "BIM" + JSON.stringify(requestData);
    	var func = $scope.success;
    	if (arguments[1]) {
    		if (arguments[1].key == cacheKey) {
    			func = null;
    		} else {
    			return false;
    		}
    	}
    	DataService.getTrackSummaryDataBI(requestData, func, $scope.fail);
    }
}])

.controller("businessImpactTrendController",['$scope','$rootScope','chartsService','Permission','DataService','RequestConstantsFactory','UtilitiesService','DataConversionService','sharedProperties',
                                             function ($scope, $rootScope, chartsService, Permission,DataService, RequestConstantsFactory,UtilitiesService, DataConversionService, sharedProperties) {
	
	var errorConstants = RequestConstantsFactory['ERROR_MSGS'];
	$scope.dataLoaded = false;
	$scope.$on('periodChange',function(){
	    $scope.dataLoaded = false;
        $scope.error = false;
		loadData();
	});
    $scope.$on('dataReady', loadData);
    $rootScope.$on('onCacheExpiry', loadData);
    $rootScope.$on('businessImpactDataError',function(){
		$scope.fail(errorConstants.DATA_ERR);
	})
    $scope.success = function (businessImpactTrendData) {
        try {
        	$scope.dataLoaded = true;
            $scope.error = false;
            chartOBJ = chartsService.splineArea.call($('#subsTrendChart'), businessImpactTrendData[$rootScope.selectedPeriod], businessImpactTrendData[$rootScope.selectedPeriod].chartOptions, $scope);
        } catch (e) {
        	$scope.fail(errorConstants.DATA_ERR);
        }
    }
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

    function loadData() {
    	var requestData = UtilitiesService.getRequestData();
    	requestData['groupBy'] = sharedProperties.getSubGroupBy();
    	var cacheKey = "BITrend" + JSON.stringify(requestData);
    	var func = $scope.success;
    	if (arguments[1]) {
    		if (arguments[1].key == cacheKey) {
    			func = null;
    		} else {
    			return false;
    		}
    	}
    	if(sharedProperties.getSubGroupBy() != null){
    		console.log('API CALL')
        	DataService.getBusinessImpactTrendData(requestData, func, $scope.fail);
    	}
    }

}])

.controller("businessImpactDeepDiveController",['$scope','$rootScope','DataService','Permission','sharedProperties','RequestConstantsFactory','DataConversionService','UtilitiesService',
                                                function ($scope, $rootScope, DataService, Permission, sharedProperties, RequestConstantsFactory , DataConversionService, UtilitiesService) {
	
	var errorConstants = RequestConstantsFactory['ERROR_MSGS'];
	$scope.dataLoaded = false;
    $scope.options = UtilitiesService.getDataTableOptions();
    $rootScope.$on('onCacheExpiry', loadData);
    $scope.$on('periodChange',function(){
	    $scope.dataLoaded = false;
        $scope.error = false;
		loadData();
	});
    $scope.$on('dataReady', function(){
        $scope.trigger = false;
        $scope.$apply();
        loadData();
    });
    
    $rootScope.$on('businessImpactDataError',function(){
		$scope.fail(errorConstants.DATA_ERR);
	})
    $scope.addData = function (data) {
    	console.log("DDDDD:", data, $rootScope.selectedPeriod)
        try {
        	$scope.dataLoaded = true;
        	//data = data[$rootScope.selectedPeriod];
            $scope.error = false;
            $scope.options.aaData = [];
            if (data.length == 0)
                throw "noDataError";
            var countWidget = 0;
            var aoColumns = [];
        	var aaData = [];
        	var selectedData = [];
        	$.each(data[$rootScope.selectedPeriod], function(key, eachData){
        		if(eachData.groupBy == sharedProperties.getSubGroupBy()){
            		selectedData = eachData.deepDive;
            		countWidget++;
        		}
        	})
        	
        	if(countWidget==0){
        		$scope.hasNoDeepDive = true;
        	}
        	if(selectedData.length!=0){
            	$.each(selectedData, function(key, value){
            		var tempObj = {
            				"sTitle": value.field
            		};
            		aaData.push(value.value);
            		aoColumns.push(tempObj);
            	})
        	}
            $scope.options.aoColumns = aoColumns;
            $scope.options.aaData = aaData;
            $scope.trigger = true;
        } catch (e) {
        	$scope.fail(errorConstants.DATA_ERR);
        }
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
    function loadData() {
		$scope.hasNoDeepDive = false;
    	var requestData = UtilitiesService.getRequestData();
    	requestData['groupBy'] = sharedProperties.getSubGroupBy();
    	var cacheKey = "BID" + JSON.stringify(requestData);
    	var func = $scope.addData;
    	if (arguments[1]) {
    		if (arguments[1].key == cacheKey) {
    			func = null;
    		} else {
    			return false;
    		}
    	}
    	//$scope.addData("initial");
    	DataService.getBusinessImpactDeepDiveTableData(requestData, func, $scope.fail);

    }
  //  loadData();
}])