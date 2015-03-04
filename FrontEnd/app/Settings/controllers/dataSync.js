angular.module('Settings')

/*
* Controller for initializing the appInit() in custom.js
*/
.controller("dataSyncInit",['$scope','CustomService', function ($scope, CustomService) {

    angular.element(document).ready(function () {
        setTimeout(function () { CustomService.appInit() }, 1);
    });

}])

/*
* Controller for 'dataSyncStatus' table
*/
.controller("dataSyncStatusController",['$scope','DataService','UtilitiesService','RequestConstantsFactory','sharedProperties','$rootScope',
                                         function ($scope, DataService, UtilitiesService,RequestConstantsFactory, sharedProperties, $rootScope) {

    //When the cache expires
    $rootScope.$on('onCacheExpiry', loadStatusData);
    //Setting the scope variable for showing 'spinner' until the data is loaded
    $scope.dataLoaded = false;
    //Loading the options for data - for the myTable directive
    $scope.options = UtilitiesService.getDataTableOptions();
    var errorConstants = RequestConstantsFactory['ERROR_MSGS'];
    var selectedSource;
    var requestData = {};

    //Function executed after the response from the network
    $scope.addData = function (data) {
        try {
        	
            //when data is available, set as false 
            $scope.error = false;
            //If data is loaded, set as true
            $scope.dataLoaded = true;
            $scope.options.aaData = [];
            var dataErrorState;

            if (!data) {
                throw "noDataError";
            }
            if(data.length == 0){
            	  $rootScope.$emit('dataSyncError');
            }
            //For loading the dataSyncStatus table data
            $.each(data, function (key, obj) {
                //Setting the first row of table as default selected(radio button)
                if (!key) {
                    sharedProperties.setDataSourceId(obj.dataSourceId);
                    selectedSource = "<input type='radio' name='statusSelect' ng-checked='true' ng-click=\"tableData('" + obj.dataSourceId + "')\"/>";
                }
                else {
                    selectedSource = "<input type='radio' name='statusSelect' ng-checked='false' ng-click=\"tableData('" + obj.dataSourceId + "')\"/>";
                }
                //error State message
                if (obj.errorState) {
                    dataErrorState = "<span class='error-found'>Error Found</span><a href='#' class='error-link' title='View exception/error report'></a>";
                }
                else {
                    dataErrorState = "<span class='no-error'>No Error</span><a href='#' class='error-link' title='View exception/error report'></a>";
                }
                $scope.options.aaData.push([key + 1, obj.dataSourceName, obj.lastUpdateDate, obj.nextUpdateDate, dataErrorState, selectedSource]);
            })
        } catch (e) {
            $scope.fail(errorConstants.DATA_ERR);
        }
    };
    $scope.fail = function (msg) {
        $scope.error = true;
        $scope.hasErrorMsg = true;
        $rootScope.$emit('dataSyncError');
        	if(msg){
            	if(msg instanceof Object){
            		$scope.errorMsg = (msg.message == "" ? errorConstants.NETWORK_ERR  : msg.status+" : "+msg.message);
            	} else {
                    $scope.errorMsg = msg;
            	}
        	}
    }
  
    //on clicking the radio button
    $scope.syncHistory = function (dataSourceId) {
        //Setting the selected radio button dataSourceId to the shared properties
        sharedProperties.setDataSourceId(dataSourceId);
    }

    //Function calls the dataservice for getting the dataSyncStatus table data
    function loadStatusData() {
        requestData = {};
        //Cache key for the dataSyncStatus table 
        var cacheKey = "syncData" + JSON.stringify(requestData);
        var func = $scope.addData;
        //If cache expires
        if (arguments[1]) {
            //No need to call the success function , so setting the function as null
            if (arguments[1].key == cacheKey) {
                func = null;
            } else {
                return false;
            }
        }
        //data service call to 'dataSyncStatus' table data
        DataService.getSyncStatusData(requestData, func, $scope.fail);
    }

    loadStatusData();

}])

/*
* Controller for 'dataSyncHistory' table
*/
.controller("dataSyncHistoryController",['$scope','DataService','UtilitiesService','sharedProperties','RequestConstantsFactory','$rootScope' ,
                                         function ($scope, DataService, UtilitiesService, sharedProperties, RequestConstantsFactory, $rootScope) {
	
	$rootScope.$on('dataSyncError',function(){
		$scope.fail(errorConstants.DATA_ERR);
	});
    //When the cache expires
    $rootScope.$on('onCacheExpiry', loadSyncHistoryData);
    //Constants needed for requests
    var requestContants = RequestConstantsFactory['DATASYNC'];
    var errorConstants = RequestConstantsFactory['ERROR_MSGS'];
    //Setting the scope variable for showing 'spinner' until the data is loaded
    $scope.dataLoaded = false;
    //Loading the options for data - for the myTable directive
    $scope.options = UtilitiesService.getDataTableOptions();
    var errorState;
    var today = new Date();
    var fromDate;
    var toDate = moment(today).format(window.appConstants.DATE_FORMAT);
    //Function executed after the response from the network
    $scope.addHistoryData = function (data) {
        try {
            //If data is loaded, set as true
            $scope.dataLoaded = true;
            //when data is available, set as false 
            $scope.error = false;
            $scope.options.aaData = [];

            if (!data) {
                throw "noDataError";
            }
            //Pushing the table data
            $.each(data, function (key, obj) {
                if (obj.errorState) {
                    errorState = "<span class='error-found'>Error Found</span><a href='#' class='error-link' title='View exception/error report'></a>";
                }
                else {
                    errorState = "<span class='no-error'>No Error</span><a href='#' class='error-link' title='View exception/error report'></a>";
                }
                $scope.options.aaData.push([key + 1, obj.dateTime, errorState]);
            })
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

    
    //Watching when the selected radio button changes in 'dataSyncStatus' table
    $scope.$watch(function () {
        return sharedProperties.getDataSourceId();
    }, function (newValue) {
        //To show the spinner until the data is loaded
        $scope.dataLoaded = false;
        //calling the function for 'dataSyncHistory' table
        if (newValue) {
        	if($scope.selectRange == "1week")
        		lastWeekHistory();
        	if($scope.selectRange == "1month")
        		lastMonthHistory();
        	if($scope.selectRange == "range"){
        		//To check fromdate and todate is selected
        		($scope.fromDate==undefined || $scope.fromDate==undefined)?($scope.error = true,$scope.specifyRange = true):selectedTimeRangeHitory();
        	}
        	
        }
    })

    //When the 'view history' button is clicked
    $scope.viewDataSyncHistory = function () {
        if ($scope.selectRange == '1week') {
            lastWeekHistory();
        } else if ($scope.selectRange == '1month') {
            lastMonthHistory();
        } else if ($scope.selectRange == 'range') {
            selectedTimeRangeHitory();
        } else {
            return false;
        }
    }

    //For getting from and to date of last week
    var lastWeekHistory = function () {
        //To show the spinner until the data is loaded
        var lastWeek = today.getDay() - 6;
        $scope.dataLoaded = false;
        fromDate = moment(today).weekday(lastWeek).format(window.appConstants.DATE_FORMAT);

        //calling the function for 'dataSyncHistory' table
        loadSyncHistoryData();
    }

    //For getting from and to date of last month
    var lastMonthHistory = function () {
        //To show the spinner until the data is loaded
        $scope.dataLoaded = false;
        var lastMonth = today.getDay() - 30;
        fromDate = moment(today).weekday(lastMonth).format(window.appConstants.DATE_FORMAT);

        //calling the function for 'dataSyncHistory' table
        loadSyncHistoryData();
    }
    //For getting from and to selected time range
    var selectedTimeRangeHitory = function () {
        //setting the fromDate and toDate
        fromDate = $scope.fromDate;
        toDate = $scope.toDate;
        if (fromDate == undefined || toDate == undefined) {
            return false;
        }

        //To show the spinner until the data is loaded
        $scope.dataLoaded = false;
        //calling the function for 'dataSyncHistory' table
        loadSyncHistoryData();
    }
    //Function calls the dataservice for getting the 'dataSyncHistory' table data
    function loadSyncHistoryData() {
        var requestData = {};
        var timeRange = {};
        //request
        requestData[requestContants.DATA_SOURCE_ID] = sharedProperties.getDataSourceId();
        timeRange[requestContants.FROM_DATE] = fromDate;
        timeRange[requestContants.TO_DATE] = toDate;
        requestData[requestContants.TIME_RANGE] = timeRange;
        console.log("requestData", requestData)
        //Cache key for the dataSyncHistory table 
        var cacheKey = "syncHistoryData" + JSON.stringify(requestData);
        var func = $scope.addHistoryData;
        //If cache expires
        if (arguments[1]) {
            //No need to call the success function , so setting the function as null
            if (arguments[1].key == cacheKey) {
                func = null;
            } else {
                return false;
            }
        }
        //data service call to 'dataSyncHistory' table data
        DataService.getSyncHistoryData(requestData, func, $scope.fail);
    }


}])