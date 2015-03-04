angular.module("Settings")

.controller( "labelConfigInit",[ '$scope','CustomService',function($scope, CustomService) {

	angular.element(document).ready(function () {
		setTimeout(function(){CustomService.appInit()},1);
		
	});

}])
.controller("dateConfigController",['$scope','UtilitiesService','DataService','$rootScope','RequestConstantsFactory','Permission',
                                      function($scope, UtilitiesService, DataService, $rootScope, RequestConstantsFactory, Permission){
	 $scope.saveDate = function(){
		 if($scope.selectedDate){
			var selectedDate =  moment($scope.selectedDate).format(window.appConstants.DATE_FORMAT);
			var reqData = {
					"date": selectedDate
			};
			saveSelectedDate(reqData);
		 }
			
	 }
	 $scope.saveDateSuccess = function(data){
		var requestConstants = RequestConstantsFactory['NOTIFICATION'];
		 if(data.status == "OK"){
				UtilitiesService.getNotifyMessage("Date Saved Successfully",requestConstants.SUCCESS);
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
	
	function saveSelectedDate(requestData){
		var func = $scope.saveDateSuccess; 
		DataService.setSelectedDate(requestData, func, $scope.fail);
	}
}])

.controller("labelConfigController",['$scope','UtilitiesService','DataService','$rootScope','RequestConstantsFactory','sharedProperties','Permission','Restangular',
                                      function($scope, UtilitiesService, DataService, $rootScope, RequestConstantsFactory, sharedProperties, Permission,Restangular){
	//When the cache expires
	$rootScope.$on('onCacheExpiry', loadLabelConfigData);
	//Loading constants for the error
	var errorConstants = RequestConstantsFactory['ERROR_MSGS'];
	//This is for loading the table when 'add', 'edit' or 'delete' functionality is done
	$rootScope.$on('labelConfigChange',function(event, data){
		$scope.addData(data);
	});
	$scope.dataLoaded = true;
	$scope.options = UtilitiesService.getDataTableOptions();
	/*//For loading the table data
	$scope.addData = function (data) {
		try {
			tableData = data;
			$scope.dataLoaded = true;
			$scope.error = false;
			if(!data){
				throw "noDataError";
			}else{
				$scope.tableData = data.labelList;
			}
		} catch (e) {
			$scope.fail(errorConstants.DATA_ERR);
		}
	}; */
	$scope.tableData = window.labelConstants;
	$scope.explicitNameList = $rootScope.explicitNameList;
	$scope.keyNames = [];
	 if(!$scope.pageListing){
		 var appName = location.pathname.split('/')[1];
  	     Restangular.all(appName + '/app/Settings/structure.json').getList().then(function (results) {
    	  	$scope.pageListing = results;
    	});
      }
	 setTimeout(function(){
		 $('#tracking').trigger('click')
	 },100);
	
	 $scope.itemSelected = function(item) {
	      var listing;
	      function getPageList(pageList){
	    	  if(pageList){
	  	    	  $.each(pageList,function(key,value){
	  	    	    	if(item.attr('id') == value.id){
	  	    	    		if(value.child){
	  	    	    			listing = value.child;
	  	    	    			setTimeout(function(){
	  	    	    				//For getting the first child selected
	  	    	    				$('#'+value.child[0].id).trigger('click');
	  	    	    			},100);
	  	    	    			$scope.$broadcast('millerSelected', value.child[0].id);
	  	    	    		}
	  	    	    		else{
	  	    	    			$scope.$broadcast('millerSelected', item.attr('id'));
	  	    	    		}
	  	    	    	}
	  	    	    	else{
	  	    	    		getPageList(value.child);
	  	    	    	}
	  	    	    	
	  	    	    })
		      }
	      }
	      getPageList($scope.pageListing);
		  return listing;
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
	$scope.$on("millerSelected", function(event, id){
		var labelPaths = [];
		var selectedModuleData = [];
		var explicitNames = [];
		var keyNames = [];
		$.each($scope.tableData, function(key, eachData){
			// condition for comparing selected miller with id
			if (eachData.key.indexOf(id) !=-1) {
				$.each($scope.explicitNameList, function(nameKey, eachName){
					if(eachData.key == eachName.key){
						keyNames.push(eachName.key);
						explicitNames.push(eachName.value);
					}
				})
				var path = eachData.path;
				labelPaths.push(path);
				selectedModuleData.push(eachData.value);
			}
		})
		
		$scope.labelPaths = labelPaths;
		$scope.defaultNames = selectedModuleData;
		$scope.explicitNames = explicitNames;
		$scope.keyNames = keyNames;
		$scope.$apply();
	});
	
	var requestData = {};
	var cacheKey = "labelConfig" + JSON.stringify(requestData);
	
	//For getting the table data
	function loadLabelConfigData() {
		var func = $scope.addData; 
		if (arguments[1]) { 
			if (arguments[1].key == cacheKey) { 
				func = null; 
			} else { 
				return false; 
			} 
		}
		DataService.getLabelConfig(requestData, func, $scope.fail);
	}
	

	$scope.saveLabel = function(){
		var requestSaveLabel = [];
		$.each($scope.explicitNames, function(nameKey, eachName){
			var value = eachName;
			if(eachName.length == 0){
				var value = $scope.defaultNames[nameKey]
			}
			var tempObj = {
					"key" : $scope.keyNames[nameKey],
					"value" : value
			};
			requestSaveLabel.push(tempObj);
		})
		console.log('requestSaveLabel:', requestSaveLabel);
	}

}])

