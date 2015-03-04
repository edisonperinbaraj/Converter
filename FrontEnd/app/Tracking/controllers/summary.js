angular.module('Tracking')

.controller("trackingInitController",['$scope','CustomService','$rootScope','DataService','$rootScope','DataConversionService','UtilitiesService','labelConfigService',
                                      function($scope, CustomService, $rootScope, DataService, $rootScope,DataConversionService, UtilitiesService,labelConfigService)
{
	
	//Used by metrics as well
	$rootScope.title = $scope.Constants[$scope.Constants.SUMMARY_Prefix + 'Title_' + $scope.selectedPeriod];
	//Title changes when time period changes
	$scope.$on('periodChange', function(event, date) {
		$rootScope.title = $scope.Constants[$scope.Constants.SUMMARY_Prefix + 'Title_' + $scope.selectedPeriod];
	});
	$rootScope.currentDate = new Date();
	angular.element(document).ready(function () {
		setTimeout(function(){CustomService.appInit();},1);
	});	
    UtilitiesService.getTotalMemory();
    $rootScope.$broadcast('periodChange');
    
    
    
}])

.controller("acquisitionFunnelController",['$scope','$rootScope','Permission','chartsService','$element','UtilitiesService','RequestConstantsFactory','DataService','DataConversionService','ChartOptionsService','UtilitiesService','StorageService',
                                           function($scope, $rootScope, Permission,chartsService, $element, UtilitiesService, RequestConstantsFactory ,DataService, DataConversionService, ChartOptionsService,UtilitiesService,StorageService){
	
	var errorConstants = RequestConstantsFactory['ERROR_MSGS'];
	$scope.initialFlag = true;
	$scope.$on('periodChange',function(){
	    $scope.dataLoaded = false;
        $scope.error = false;
		loadData();
	});
	//Watch for SummaryExpired
    $rootScope.$on('onCacheExpiry', loadData);
    $scope.dataLoaded = false;
	$scope.visitors = {};
	$scope.cancellations = {};
	$scope.subscriptions = {};
	$scope.registrations = {};
	
	$scope.success = function(funnelData) {
        $scope.dataLoaded = true;
        var funnelConstants = RequestConstantsFactory['WIDGETS']
		try{
			$scope.error = false;
			var funnelData = funnelData[$rootScope.selectedPeriod];
			funnelData.forEach(function(data) {
				//Math.round() is used to rounding off to 2 decimels
				if(data.groupBy == funnelConstants.FUNNEL_VISITORS) {
					$scope.visitors.actualTillDate = Math.round(data.actualTillDate);
				} else if(data.groupBy == funnelConstants.FUNNEL_CANCELLATIONS) {
					$scope.cancellations.churnRate = Math.round(data.churnRate * 100) / 100;
					$scope.cancellations.actualTillDate = data.actualTillDate;
				} else if(data.groupBy == funnelConstants.FUNNEL_SUBSCRIPTION) { 
					$scope.subscriptions.conversionRate = Math.round(data.conversionRate * 100) / 100;
					$scope.subscriptions.actualTillDate = data.actualTillDate;
				} else if(data.groupBy == funnelConstants.FUNNEL_REGISTRATIONS) {
					$scope.registrations.acquisitionRate = Math.round(data.acquisitionRate * 100) / 100;
					$scope.registrations.actualTillDate = data.actualTillDate;
				} else{
					//TO make empty if there is no data available
					$scope.visitors.actualTillDate = [];
					$scope.cancellations.churnRate = "";
					$scope.cancellations.actualTillDate = [];
					$scope.subscriptions.conversionRate = "";
					$scope.subscriptions.actualTillDate = [];
					$scope.registrations.acquisitionRate = "";
					$scope.registrations.actualTillDate = [];
				}
			})
            
		} catch (e) {
			$scope.fail(errorConstants.DATA_ERR);
		}
	}
	
	$scope.sparkLineSuccess = function(sparkLineData){
		 $scope.dataLoaded = true;
	        var funnelConstants = RequestConstantsFactory['WIDGETS']
			try{
				$scope.error = false;
				var sparkLineData = sparkLineData['byWeek'];
				sparkLineData.forEach(function(data) {
					//Math.round() is used to rounding off to 2 decimels
					if(data.groupBy == funnelConstants.FUNNEL_VISITORS) {
						$scope.visitors.weeklyTrend = data.weeklyTrend;
					} else if(data.groupBy == funnelConstants.FUNNEL_CANCELLATIONS) {
						$scope.cancellations.weeklyTrend = data.weeklyTrend;
					} else if(data.groupBy == funnelConstants.FUNNEL_SUBSCRIPTION) {
						$scope.subscriptions.weeklyTrend = data.weeklyTrend;
					} else if(data.groupBy == funnelConstants.FUNNEL_REGISTRATIONS) {
						$scope.registrations.weeklyTrend = data.weeklyTrend;
					} else{
						//TO make empty if there is no data available
						$scope.visitors.weeklyTrend = [];
						$scope.cancellations.weeklyTrend = [];
						$scope.subscriptions.weeklyTrend = [];
						$scope.registrations.weeklyTrend = [];
						
					}
				})

				var chartColors = ['#132d52','#149ae3','#1b6395','#5bc1ff'];
				var lineDatas  = [$scope.visitors.weeklyTrend, $scope.registrations.weeklyTrend, 
				                  $scope.subscriptions.weeklyTrend, $scope.cancellations.weeklyTrend];

	            $('.chart').each(function(index) {
					var sparkleLineChartOptions = ChartOptionsService.getSparkleLineData();
					var sparkleLineData = lineDatas[index];
					var chartOptions = {
							series: [{
								color: chartColors[index],
							}]
					}
					sparkleLineChartOptions = Highcharts.merge(sparkleLineChartOptions, chartOptions);
					chartOBJ = chartsService.sparkleLine.call($(this), sparkleLineData, sparkleLineChartOptions, $scope);
				});
	            
			} catch (e) {
				$scope.fail(errorConstants.DATA_ERR);
			}
	}
	$scope.fail = function (msg) {
        $scope.error = true;
        $scope.hasErrorMsg = true;
        if(msg){
        	if(msg instanceof Object){
        		$scope.errorMsg = (msg.message  == "" ? errorConstants.NETWORK_ERR  : msg.status+" : "+msg.message);
        	} else {
                $scope.errorMsg = msg;
        	}
        }
    }
	
	function loadData(forceSilent) { 
		var requestData = UtilitiesService.getRequestData();
		var func = $scope.success; 
		if($scope.initialFlag == true){
			$scope.initialFlag = false;
			var requestData = UtilitiesService.getInitialRequestData();
		}else if(forceSilent == true){
			var func = null; 
		}
		var cacheKey = "summaryFunnel" + JSON.stringify(requestData);
	    	if (arguments[1]) { 
	    		if (arguments[1].key == cacheKey) { 
	    			func = null; 
	    		} else { 
	    			return false; 
	    		} 
	    	} 
	    var sparkLineRequest = UtilitiesService.getInitialRequestData();
	    var date= new Date(UtilitiesService.dateFormatConvertor($rootScope.selectedDate)); 
	    var startDate = moment(date).startOf('year').format(window.appConstants.DATE_FORMAT);
	    //Setting startDate as start of the selected year
	    sparkLineRequest.timeRanges[0]['periodFrom'] = startDate;
	    sparkLineRequest.timeRanges[0]['reportingInterval'] = "weekly";
	    sparkLineRequest.timeRanges[0]['periodName'] = "byWeek";
	    
    	DataService.getTrackSummaryFunnelData(requestData, func, $scope.fail);
    	DataService.getTrackSummaryFunnelData(sparkLineRequest, $scope.sparkLineSuccess, $scope.fail); 
    	
    } 
    loadData();
    loadData(true);
}])

.controller("acquisitionTrendController",['$scope','$rootScope','chartsService','Permission','$element','DataService','DataConversionService','RequestConstantsFactory','UtilitiesService','StorageService',
                                          function($scope, $rootScope, chartsService, Permission,$element,DataService, DataConversionService, RequestConstantsFactory ,UtilitiesService, StorageService){
	
	var errorConstants = RequestConstantsFactory['ERROR_MSGS'];
	$scope.initialFlag = true;
	 $scope.dataLoaded = false;
	 $scope.chartVariables = $scope.labelConstants;
		 //Watch for SummaryExpired
    $rootScope.$on('onCacheExpiry', loadData);
	$scope.$on('periodChange',function(){
        $scope.error = false;
	    $scope.dataLoaded = false;
		loadData();
	});
    $scope.success = function (acqTrendData) {
    	try{
    		$scope.dataLoaded = true;
    		$scope.error = false;
    		chartOBJ = chartsService.combinedStackedBarLine.call($('#acquisitionTrendChart'), acqTrendData[$rootScope.selectedPeriod], acqTrendData[$rootScope.selectedPeriod].chartOptions, $scope);
    	} catch (e) {
    		console.log(e);
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
  
    
    function loadData(forceSilent) { 
    	var requestData = UtilitiesService.getRequestData();
    	var func = $scope.success; 
    	if($scope.initialFlag == true){
    		$scope.initialFlag = false;
    		var requestData = UtilitiesService.getInitialRequestData();
    	}else if(forceSilent == true){
    		var func = null; 
    	}
    	var cacheKey = "summaryTrend" + JSON.stringify(requestData);
    	if (arguments[1]) { 
    		if (arguments[1].key == cacheKey) { 
    			func = null; 
    		} else { 
    			return false; 
    		} 
    	} 
    	DataService.getTrackSummaryAcqTrend(requestData, func, $scope.fail); 
    } 
    loadData();
    loadData(true);
    
}])

