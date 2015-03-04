angular.module('AnalyticsApp')

.controller("commonController", ['$scope','$rootScope','$location','$window',function ($scope, $rootScope, $location, $window) {

    window.requestStack = {};
    var idleTimeout = window.appConstants.IDLE_TIMEOUT * 60 * 1000;
	var date = new Date();
	$scope.sessionEndTime = date.getTime() + idleTimeout;
	$scope.$on('$routeChangeStart', function(){
        //Here the page loads
    	var date = new Date();
    	var milliSeconds = date.getTime();
    	if(milliSeconds > $scope.sessionEndTime){
    		$window.location = 'login.htm';
    	}
    	$scope.sessionEndTime = date.getTime() + idleTimeout;
      });
    $scope.periods = window.appConstants.TIME_PERIODS;
    $scope.selected = $scope.periods[0];
    $rootScope.selectedUserMode = window.appConstants.DEFAULT_USER_MODE;
    // This selectedPeriod will be used across the app
    $rootScope.selectedPeriod = $scope.selected.key;
//    default selected date as current date
    var defaultDate = new Date();
    defaultDate = moment(defaultDate).format('MM/DD/YYYY')
    //$rootScope.selectedDate = defaultDate; 
    $rootScope.selectedDate = "04/24/2014"; 

//    $scope.broadcastPeriodChange = function(){
//    	  $rootScope.selectedPeriod = $scope.selected.key;
//    	  $rootScope.selectedDate = $scope.selectedDate;
//    	  $rootScope.$broadcast('periodChange');
//    }
 // broadcast periodChange when filter is clicked
    $scope.broadcastTimeFilterValues = function(){
  	  $rootScope.selectedPeriod = $scope.selected.key;
  	  $rootScope.selectedDate = $scope.selectedDate;
  	  $rootScope.$broadcast('periodChange');
  }
    $scope.userModeSelected = function (selectedUserMode) {
        angular.element('.freeMode').each(function () {
            if (angular.element(this).parent().hasClass('active')) {
                angular.element(this).parent().removeClass('active');
            } else {
                angular.element(this).parent().addClass('active');
            }
        });
        $rootScope.selectedUserMode = selectedUserMode;
        $rootScope.$broadcast('periodChange');
    }

    $rootScope.$on('DWPageChange', function (event, period) {
        setTabsEnable();
    });

    var setTabsEnable = function () {
        $scope.urlIndex = $location.search();
        
        if ($scope.urlIndex.flow == "false") {
            $scope.enable = false;
        }
        else {
            $scope.enable = true;
        }
    }
    setTabsEnable();
}]);
