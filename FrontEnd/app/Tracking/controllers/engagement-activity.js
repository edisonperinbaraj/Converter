angular.module('Tracking')

.controller("engagementActivityInitController",['$scope' ,'CustomService','DataService','$rootScope','UtilitiesService',
                                                function ($scope, CustomService, DataService, $rootScope, UtilitiesService) {

    angular.element(document).ready(function () {
        var chartOBJ = {};
        var classNames = [];
        $('.acquisitiontabs .heatMap').on('click', function () {
            var btn = $(this);
            if (btn.hasClass('active')) {
                return false;
            }
            btn.addClass('active').siblings('li').removeClass('active');
        });
        setTimeout(function () { CustomService.appInit(); }, 1);
    });
    UtilitiesService.getTotalMemory();
    $rootScope.$broadcast('periodChange');

}])

.controller("engagementScoreController",['$scope' ,'$rootScope','chartsService','DataService','Permission','CustomService','$location','ChartOptionsService','DataConversionService','RequestConstantsFactory','UtilitiesService',
                                         function ($scope, $rootScope, chartsService, DataService, Permission, CustomService, $location, ChartOptionsService, DataConversionService, RequestConstantsFactory, UtilitiesService) {
    var errorConstants = RequestConstantsFactory['ERROR_MSGS'];
    var requestConstants = RequestConstantsFactory['REQUEST'];
    $scope.initialFlag = true;
    $scope.dataLoaded = false;
    $rootScope.$on('onCacheExpiry', loadData);
    $scope.$on('periodChange',function(){
	    $scope.dataLoaded = false;
        $scope.error = false;
		loadData();
	});
   // $scope.$on('dataReady', loadData);

    $scope.success = function (engagementScore) {
        try {
            $scope.dataLoaded = true;
            if (!engagementScore[$rootScope.selectedPeriod]) {
                $scope.error = true;
            }
            else {
                $scope.error = false;
                var scoreChartOptions = ChartOptionsService.getEngagementActivityScoreData();
                chartOBJ = chartsService.line.call($('#scoreChart'), engagementScore[$rootScope.selectedPeriod], scoreChartOptions, $scope);
                loadDonutChart(engagementScore['engagementScore']);
            }
        } catch (e) {
            $scope.fail(errorConstants.DATA_ERR);
        }
    }
    $scope.fail = function (msg) {
        $scope.error = true;
        $scope.hasErrorMsg = true;
        if (msg) {
            if (msg instanceof Object) {
                $scope.errorMsg = (msg.message == "" ? errorConstants.NETWORK_ERR : msg.status+" : "+msg.message);
            } else {
                $scope.errorMsg = msg;
            }
        }
    }
    


    function loadDonutChart(engagementScore) {
        $scope.engagementScore = engagementScore;

        var options = {
            percentage: $scope.engagementScore.score,
            radius: 80,
            width: 28,
            number: $scope.engagementScore.score,
            text: '',
            colors: ['#F6F6F6', '#0070C0'],
            duration: 500
        };
        CustomService.addDonutCircle('engagementScore', options);
    }

    function loadData(forceSilent) {
    	var queryDate =  moment($rootScope.selectedDate).format(window.appConstants.DATE_FORMAT);
    	var requestData = {"timeRanges": [{"maxRows": requestConstants.EA_SCORE_MAX_ROWS}, 
    	                                  {"maxRows": requestConstants.EA_SCORE_MAX_ROWS}, 
    	                                  {"maxRows": requestConstants.EA_SCORE_MAX_ROWS}, 
    	                                  {"maxRows": requestConstants.EA_SCORE_MAX_ROWS}],
    	                                   "queryDate" : queryDate};
    	var utilData = UtilitiesService.getRequestData();
    	var func = $scope.success;
    	if($scope.initialFlag == true){
    		$scope.initialFlag = false;
    		var requestData = {
    		    				"timeRanges": [
    		    				               {"maxRows": requestConstants.EA_SCORE_MAX_ROWS
    		    				               }],
    		   				            	"queryDate" : queryDate
    		    		};
    		var utilData = UtilitiesService.getInitialRequestData();
    	}else if(forceSilent == true){
    		var func = null; 
    	}
    	$.extend(true, requestData, utilData);
    	var cacheKey = "EAScore" + JSON.stringify(requestData);
    	if (arguments[1]) {
    		if (arguments[1].key == cacheKey) {
    			func = null;
    		} else {
    			return false;
    		}
    	}
    	DataService.getEngagementActivityScoreData(requestData, func, $scope.fail);
    }
    loadData(true);
}])

.controller("engagementActivityMatricesController",['$scope','$rootScope','MenuService','Permission','RequestConstantsFactory','NetworkService','DataService','$location','sharedProperties','DataConversionService','UtilitiesService',
                                                    function ($scope, $rootScope, MenuService, Permission, RequestConstantsFactory, NetworkService, DataService, $location, sharedProperties, DataConversionService, UtilitiesService) {
    var errorConstants = RequestConstantsFactory['ERROR_MSGS'];
    var requestConstants = RequestConstantsFactory['REQUEST'];
    $scope.initialFlag = true;
    $scope.dataLoaded = false;
    $scope.urlIndex = $location.search();
    $scope.select = $scope.urlIndex.currentlySelected;
    $scope.menuType = [];
    $scope.menuData = [];
    $scope.val1 = false;
    $scope.val2 = true;
    $scope.userSettings = {};
    var eaScoreWidget = {};
    $scope.menu = MenuService.getMenu(4, $scope, 'engmtScore');

    $scope.menu.getUserSettings("EA",
			function (userSettingsData) {
			    $scope.userSettings = userSettingsData;
			});

    //Watch for SummaryExpired
    $rootScope.$on('onCacheExpiry', loadData);

    $scope.$on('periodChange',function(){
	    $scope.dataLoaded = false;
        $scope.error = false;
		loadData();
	});
    $scope.$on('menuSave', function () {
        $scope.menu.saveMenu("EA", "Engagement Activity", $scope.userSettings);
    });

    $scope.success = function (engagementActivity) {
        try {
            $scope.dataLoaded = true;
            $scope.error = false;
            
            if (engagementActivity[$rootScope.selectedPeriod].length == 0)
                throw { message: "Selected period data not available!", type: "internal" };
                
            engagementActivity = engagementActivity[$rootScope.selectedPeriod];
            if(eaScoreWidget){
            	//to avoid repeated adding of eascore widget
    			var updateWidgets = true;
            	$.each(engagementActivity, function(key, obj){
            		if(obj.subgroupName == "EA Score"){
            			updateWidgets = false;
            		}
            	})
            	if(updateWidgets){
                	engagementActivity.push(eaScoreWidget);
            	}
            }
            $scope.engagementActivity = engagementActivity;
            $scope.menu.setData($scope.engagementActivity);
        } catch (e) {
        	$scope.fail(errorConstants.DATA_ERR);
        }
    }
    
    $scope.eaScoreSuccess = function(eaScore){
    	eaScore = eaScore['engagementScore'];
    	var tempObj = {
    		"actualToDate":eaScore.score,
    		"subgroupName":"EA Score",
    		"subGroupBy":"enScore",
    		"monthlyAvg":eaScore.versusLastMonth
    	};
    	eaScoreWidget = tempObj;
    }
    
    $scope.fail = function (msg) {
        $scope.error = true;
        $scope.hasErrorMsg = true;
        $rootScope.$emit('EngagementActivityDataError');
        if (msg) {
            if (msg instanceof Object) {
                $scope.errorMsg = (msg.message == "" ? errorConstants.NETWORK_ERR : msg.status+" : "+msg.message);
            } else {
                $scope.errorMsg = msg;
            }
        }
    }
//    $scope.$watch(
//			function () {
//			    return sharedProperties.getSubGroupBy();
//			},
//			function (newValue) {
//				console.log("iiiiiii3", newValue)
//			    loadData();
//			}
//	);
//    
    function loadData(forceSilent) {
    	var queryDate =  moment($rootScope.selectedDate).format(window.appConstants.DATE_FORMAT);
    	var requestData = {"groupBy": "EA"};
    	var requestDataEAScoreWidget = {"timeRanges": [{"maxRows": requestConstants.EA_SCORE_MAX_ROWS}, 
    	         	                                  {"maxRows": requestConstants.EA_SCORE_MAX_ROWS}, 
    	        	                                  {"maxRows": requestConstants.EA_SCORE_MAX_ROWS}, 
    	        	                                  {"maxRows": requestConstants.EA_SCORE_MAX_ROWS}],
    	        	                                   "queryDate" : queryDate};
    	var utilData = UtilitiesService.getRequestData();
		var func = $scope.success; 
    	if($scope.initialFlag == true){
    		$scope.initialFlag = false;
    		var requestDataEAScoreWidget = {
    				"timeRanges": [
    				               {"maxRows": requestConstants.EA_SCORE_MAX_ROWS
    				               }],
   				            	"queryDate" : queryDate
    		};
			var utilData = UtilitiesService.getInitialRequestData();
		}else if(forceSilent == true){
    		var func = null; 
		}
        requestData = $.extend(true, requestData, utilData);
        requestDataEAScoreWidget = $.extend(true, requestDataEAScoreWidget, utilData);
		var cacheKey = "EAM" + JSON.stringify(requestData);
        if (arguments[1]) {
            if (arguments[1].key == cacheKey) {
                func = null;
            } else {
                return false;
            }
        }
        DataService.getEngagementActivityScoreData(requestDataEAScoreWidget, $scope.eaScoreSuccess, $scope.fail);
        DataService.getTrackSummaryEngagementActivity(requestData, func, $scope.fail);

    }
    loadData(true);
}])

.controller("engagementActivitySummaryController",['$scope','$rootScope','DataService','Permission','sharedProperties','RequestConstantsFactory','UtilitiesService',
                                                   function ($scope, $rootScope, DataService, Permission, sharedProperties, RequestConstantsFactory, UtilitiesService) {
    var errorConstants = RequestConstantsFactory['ERROR_MSGS'];
    $scope.dataLoaded = false;
    //Watch for SummaryExpired
    $rootScope.$on('onCacheExpiry', loadData);
    $scope.$on('periodChange',function(){
	    $scope.dataLoaded = false;
        $scope.error = false;
		loadData();
	});
    $scope.$on('dataReady', loadData);
    $rootScope.$on('EngagementActivityDataError',function(){
		$scope.fail(errorConstants.DATA_ERR);
	})
    $scope.success = function (engagementActivitySummary) {
        try {
            $scope.dataLoaded = true;
            if (engagementActivitySummary[$rootScope.selectedPeriod].length == 0) {
                $scope.error = true;
            }
            else {
                $scope.error = false;
                engagementActivitySummary[$rootScope.selectedPeriod].forEach(function (data) {
                    if (data.subGroupBy == sharedProperties.getSubGroupBy()) {
                        $scope.engagementActivitySummary = data;
                    }
                });
                $scope.heading = sharedProperties.getHeading();
                $scope.forecastText = $scope.Constants[$scope.Constants.EA_Prefix + 'summary_forecast_' + $rootScope.selectedPeriod];
                $scope.toLastText = $scope.Constants[$scope.Constants.EA_Prefix + 'comparedLast_' + $rootScope.selectedPeriod];
                $scope.toLastLYText = $scope.Constants[$scope.Constants.EA_Prefix + 'comparedLastYear_' + $rootScope.selectedPeriod];
            }
        } catch (e) {
            $scope.fail(errorConstants.DATA_ERR);
        }

    }
    $scope.fail = function (msg) {
        $scope.error = true;
        $scope.hasErrorMsg = true;
        if (msg) {
            if (msg instanceof Object) {
                $scope.errorMsg = (msg.message == "" ? errorConstants.NETWORK_ERR : msg.status+" : "+msg.message);
            } else {
                $scope.errorMsg = msg;
            }
        }
    }
    function loadData() {
        var requestData = UtilitiesService.getRequestData();
        requestData['groupBy'] = 'EA';
        var cacheKey = "EAM" + JSON.stringify(requestData);
        var func = $scope.success;
        if (arguments[1]) {
            if (arguments[1].key == cacheKey) {
                func = null;
            } else {
                return false;
            }
        }
        DataService.getTrackSummaryEngagementActivity(requestData, func, $scope.fail);
    }
    loadData();
}])

.controller("engagementActivityTrendController",[ '$scope','$rootScope','chartsService','Permission','DataService','ChartOptionsService','RequestConstantsFactory','sharedProperties','UtilitiesService',
                                                  function ($scope, $rootScope, chartsService, Permission, DataService, ChartOptionsService, RequestConstantsFactory, sharedProperties, UtilitiesService) {
    var errorConstants = RequestConstantsFactory['ERROR_MSGS'];
    var requestConstants = RequestConstantsFactory['REQUEST'];
    $scope.dataLoaded = false;
    $rootScope.$on('onCacheExpiry', loadData);
    $scope.$on('periodChange',function(){
	    $scope.dataLoaded = false;
        $scope.error = false;
		loadData();
	});
   $scope.$on('dataReady', loadData);
    $rootScope.$on('EngagementActivityDataError',function(){
		$scope.fail(errorConstants.DATA_ERR);
	})
    $scope.success = function (engagementActivityTrend) {
        try {
            $scope.dataLoaded = true;
            if (!engagementActivityTrend[$rootScope.selectedPeriod]) {
                $scope.error = true;
            }
            else {
                $scope.error = false;
                var trendChartOptions = ChartOptionsService.getEngagementActivityTrendData();
                chartOBJ = chartsService.splineArea.call($('#trendChart'), engagementActivityTrend[$rootScope.selectedPeriod], trendChartOptions, $scope);
                $scope.heading = sharedProperties.getHeading();
            }
        } catch (e) {
            $scope.fail(errorConstants.DATA_ERR);
        }
    }
    $scope.fail = function (msg) {
        $scope.error = true;
        $scope.hasErrorMsg = true;
        $scope.dataLoaded = true;
        if (msg) {
            if (msg instanceof Object) {
                $scope.errorMsg = (msg.message == "" ? errorConstants.NETWORK_ERR : msg.status+" : "+msg.message);
            } else {
                $scope.errorMsg = msg;
            }
        }
    }
    
    function loadData() {
    	var queryDate =  moment($rootScope.selectedDate).format(window.appConstants.DATE_FORMAT);
    	var requestData = {"timeRanges": [{"maxRows": requestConstants.EA_SCORE_MAX_ROWS}, 
    	                                  {"maxRows": requestConstants.EA_SCORE_MAX_ROWS}, 
    	                                  {"maxRows": requestConstants.EA_SCORE_MAX_ROWS}, 
    	                                  {"maxRows": requestConstants.EA_SCORE_MAX_ROWS}],
    	                                   "queryDate" : queryDate};
    //	var requestData = {"timeRanges": [{"maxRows": "5"}, {"maxRows": "5"}, {"maxRows": "5"}, {"maxRows": "5"}]};
        var utilData = UtilitiesService.getRequestData();
        requestData['groupBy'] = sharedProperties.getSubGroupBy();
        $.extend(true, requestData, utilData);
        var cacheKey = "EATrend" + JSON.stringify(requestData);
        var func = $scope.success;
        if (arguments[1]) {
            if (arguments[1].key == cacheKey) {
                func = null;
            } else {
                return false;
            }
        }
        if(sharedProperties.getSubGroupBy() != null){
            DataService.getEngagementActivityTrendData(requestData, func, $scope.fail);
    	}
    }
  loadData();
}])

.controller("engagementActivityDeepDiveController",['$scope' ,'$rootScope','chartsService','DataService','Permission','DataConversionService','RequestConstantsFactory','UtilitiesService','sharedProperties',
                                                    function ($scope, $rootScope, chartsService, DataService, Permission, DataConversionService, RequestConstantsFactory, UtilitiesService, sharedProperties) {
    var errorConstants = RequestConstantsFactory['ERROR_MSGS'];
    $scope.initialFlag = true;
    $scope.dataLoaded = false;
    $scope.$on('periodChange',function(){
	    $scope.dataLoaded = false;
        $scope.error = false;
		loadData();
	});
    $rootScope.$on('onCacheExpiry', loadData);
    $scope.$on('dataReady', loadData);
    $rootScope.$on('EngagementActivityDataError',function(){
		$scope.fail(errorConstants.DATA_ERR);
	})
    $scope.$watch(
			function () {
			    return sharedProperties.getSubGroupBy();
			},
			function (newValue) {
			    loadData();
			}
	);

    $scope.success = function (engagementActivityDeepDive) {
        try {
            engagementActivityDeepDive = DataConversionService.toGetEngagementActivityDeepDiveData(engagementActivityDeepDive);
            $scope.dataLoaded = true;
        	//console.log("iiiii:", engagementActivityDeepDive[$rootScope.selectedPeriod].moduleData)
            $scope.error = false;
            chartOBJ = chartsService.treemap.call($('.heatMap1'), engagementActivityDeepDive[$rootScope.selectedPeriod].moduleData, null, $scope);
           // chartOBJ = chartsService.treemap.call($('.heatMap2'), engagementActivityDeepDive[$rootScope.selectedPeriod].activityData, null, $scope);
            $scope.heading = sharedProperties.getHeading();
        } catch (e) {
            $scope.fail(errorConstants.DATA_ERR);
        }
    }
    $scope.fail = function (msg) {
        $scope.error = true;
        $scope.hasErrorMsg = true;
        if (msg) {
            if (msg instanceof Object) {
                $scope.errorMsg = (msg.message == "" ? errorConstants.NETWORK_ERR : msg.status+" : "+msg.message);
            } else {
                $scope.errorMsg = msg;
            }
        }
    }

    function loadData(forceSilent) {
        var requestData = {"groupBy": "enLevel"};
        var func = $scope.success;
        var utilData = UtilitiesService.getRequestData();
    	if($scope.initialFlag == true){
    		$scope.initialFlag = false;
			var utilData = UtilitiesService.getInitialRequestData();
		}else if(forceSilent == true){
    		var func = null; 
		}
        $.extend(true, requestData, utilData);
        var cacheKey = "EADD" + JSON.stringify(requestData);
        if (arguments[1]) {
            if (arguments[1].key == cacheKey + requestData.groupBy) {
                func = null;
            } else {
                return false;
            }
        }
        DataService.getEngagementActivityDeepDiveData(requestData, func, $scope.fail);
    }
    loadData(true);
}])

.controller("engagementModuleController", ['$scope','$rootScope','DataService','DataConversionService','Permission','RequestConstantsFactory','UtilitiesService','sharedProperties',
											function ($scope, $rootScope, DataService, DataConversionService, Permission, RequestConstantsFactory, UtilitiesService, sharedProperties) {
    var errorConstants = RequestConstantsFactory['ERROR_MSGS'];
    $scope.initialFlag = true;
    $scope.dataLoaded = false;
    $scope.options = UtilitiesService.getDataTableOptions();
    $rootScope.$on('onCacheExpiry', loadData);
    $scope.$on('periodChange',function(){
	    $scope.dataLoaded = false;
        $scope.error = false;
		loadData();
	});
    $scope.$on('dataReady', loadData);
    $rootScope.$on('EngagementActivityDataError',function(){
		$scope.fail(errorConstants.DATA_ERR);
	})
//    success function for module engagement table
    $scope.addData = function (_data) {
        try {
			 console.log("ppp success:", _data)
            data = _data[$rootScope.selectedPeriod];
            $scope.dataLoaded = true;
            $scope.error = false;
            $scope.heading = sharedProperties.getHeading();
            $scope.subGroupBy = sharedProperties.getSubGroupBy();
            $scope.options.aaData = [];
            $.each(data, function (key, obj) {
            	if(obj.moduleName == $scope.subGroupBy){
            		// $.each(obj.engagementScore, function (event, value) {
            			 $scope.options.aaData.push([obj.engagementScore.userGroup,
            			                             obj.engagementScore.uniqueUsers,
            			                             obj.engagementScore.actuals,
            			                             obj.engagementScore.vsLastPeriod, 
            			                             obj.engagementScore.vsSamePeriodLastYear]);
            		// })
            	 }
            })
            $scope.timePeriodText = $scope.Constants[$scope.Constants.BI_Prefix + 'DeepDive_' + $scope.selectedPeriod];
            $scope.sameLastYearText = $scope.Constants[$scope.Constants.BI_Prefix + 'sameLastYearText_' + $scope.selectedPeriod];
        } catch (e) {
            $scope.fail(errorConstants.DATA_ERR);
        }

    };
    $scope.fail = function (msg) {
        $scope.error = true;
        $scope.hasErrorMsg = true;
        if (msg) {
            if (msg instanceof Object) {
                $scope.errorMsg = (msg.message == "" ? errorConstants.NETWORK_ERR : msg.status+" : "+msg.message);
            } else {
                $scope.errorMsg = msg;
            }
        }
    }
   /* $scope.$watch(
			function () {
			    return sharedProperties.getSubGroupBy();
			},
			function (newValue) {
				 $scope.addData();
			}
	);*/
    //var requestData = {"timeRanges": [{"maxRows": "5"}, {"maxRows": "5"}, {"maxRows": "5"}, {"maxRows": "5"}]};
    function loadData(forceSilent) {
    	var requestData = UtilitiesService.getRequestData();
        var func = $scope.addData;
        if($scope.initialFlag == true){
    		$scope.initialFlag = false;
			var requestData = UtilitiesService.getInitialRequestData();
		}else if(forceSilent == true){
    		var func = null; 
		}
        var cacheKey = "EAMC" + JSON.stringify(requestData);
        if (arguments[1]) {
            if (arguments[1].key == cacheKey) {
                func = null;
            } else {
                return false;
            }
        }
        DataService.getTrackModuleEngagementTableData(requestData, func, $scope.fail);
    }
    loadData(true);
}])

