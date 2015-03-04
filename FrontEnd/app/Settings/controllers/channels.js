angular.module("Settings")

.controller( "channelsInit",[ '$scope','CustomService',function($scope, CustomService) {

	angular.element(document).ready(function () {
		setTimeout(function(){CustomService.appInit()},1);
	});

}])
.controller("channelsInfoController",['$scope','UtilitiesService','DataService','$rootScope','RequestConstantsFactory','sharedProperties',
                                      function($scope, UtilitiesService, DataService, $rootScope, RequestConstantsFactory, sharedProperties){
	
	//When the cache expires
	$rootScope.$on('onCacheExpiry', loadChannelInfoData);
	//Loading constants for the request
	var requestConstants = RequestConstantsFactory['CHANNELS'];
	var errorConstants = RequestConstantsFactory['ERROR_MSGS'];
	//This is for loading the table when 'add', 'edit' or 'delete' functionality is done
	$rootScope.$on('channelsDataChange',function(event, data){
		$scope.addData(data);
	});

	var tableData = {}; 
	var editChannelsSaveRequest = {};
	var editRequest = {};
	$scope.dataLoaded = false;
	$scope.options = UtilitiesService.getDataTableOptions();

	//For loading the table data
	$scope.addData = function (data) {
		try {
			tableData = data;
			$scope.dataLoaded = true;
			$scope.error = false;
			$scope.options.aaData = [];

			if(!data){
				throw "noDataError";
			}
			$.each(data.channelList, function (key, obj) {
				if($scope.isChannelsEditable){
					$scope.options.aaData.push([key+1, obj.channelType, UtilitiesService.getLocaleString(obj.estimateCost), obj.estimateTime, obj.lastModifiedDate, obj.lastModifiedBy,"<a class='editleft' title='Edit' name='modal' href='#' data-id='"+obj.channelId+"' data-modal='#channelEditDialog'></a>"
					                            +"<a class='delete' title='Delete' name='modal' data-id='"+obj.channelId+"' href='#' data-modal='#deleteChannelDialog'></a>","<input type='radio' name='defaultChannel' ng-modal='channelDefault' data-id='"+obj.channelId+"' ng-checked='"+obj.defaultChannel+"' ng-click=\"tableData('"+obj.channelId+"')\"/>"]);
				}else{
					$scope.options.aaData.push([key+1, obj.channelType, obj.estimateCost, obj.estimateTime, obj.lastModifiedDate, obj.lastModifiedBy]);
				}
				//set the default channel
				if(obj.defaultChannel == true){
					sharedProperties.setDefaultChannelId(obj.channelId);
				}
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
	//On clicking the radio button
	$scope.channelsInfo = function(channelId){
		
		sharedProperties.setDefaultChannelId(channelId);
		$.each(tableData.channelList, function (key, eachRow) {
			if(eachRow.channelId == channelId){
				//Request
				editChannelsSaveRequest[requestConstants.CHANNEL_ID] = channelId;
				editChannelsSaveRequest[requestConstants.CHANNEL_TYPE] = eachRow.channelType;
				editChannelsSaveRequest[requestConstants.ESTIMATE_COST] = eachRow.estimateCost;
				editChannelsSaveRequest[requestConstants.ESTIMATE_TIME] = eachRow.estimateTime;
				editChannelsSaveRequest[requestConstants.LAST_MODIFIED_DATE] = eachRow.lastModifiedDate;
				editChannelsSaveRequest[requestConstants.LAST_MODIFIED_BY] = eachRow.lastModifiedBy;
				editChannelsSaveRequest[requestConstants.DEFAULT_CHANNEL] = true;
				editRequest['channel'] = editChannelsSaveRequest;
			}
		})
		$rootScope.$broadcast('defaultChannelChanged', editRequest);
	}
	
	var requestData = {};
	var cacheKey = "channelsInfo" + JSON.stringify(requestData);
	
	//For getting the table data
	function loadChannelInfoData() {
		var func = $scope.addData; 
		if (arguments[1]) { 
			if (arguments[1].key == cacheKey) { 
				func = null; 
			} else { 
				return false; 
			} 
		}
		DataService.getChannelInfoData(requestData, func, $scope.fail);
	}

	loadChannelInfoData();

}])

.controller("channelsModalController",[ 'DataService','$scope','$timeout','$rootScope','UtilitiesService','RequestConstantsFactory','sharedProperties','$element',
                                        function(DataService,$scope, $timeout, $rootScope, UtilitiesService, RequestConstantsFactory, sharedProperties, $element){
	
	var requestConstants = RequestConstantsFactory['CHANNELS'];
	var errorConstants = RequestConstantsFactory['ERROR_MSGS'];
	//on clicking the edit button
	$rootScope.$on('channelEdit', loadEditModalData)
	//on clicking the delete button
	$rootScope.$on('channelDelete', getDeleteChannelId)
	//on clicking the radio button
	$rootScope.$on('defaultChannelChanged', function(event, requestData){
		channelsEditSave(requestData);
	})
	//on clicking the add button
	$rootScope.$on('loadAddChannel', loadAddChannelDialog)
	
	$scope.dataLoaded = true;
	$scope.savingChannels = false;
	var channelId;
	var deleteRequest = {};
	var addChannelsRequest = {};
	var editChannelsSaveRequest = {};
	var notifyRequestConstants = RequestConstantsFactory['NOTIFICATION'];
	
	$scope.userListSuccess = function(userList){
		var lastModifiedBy = [];
		$.each(userList, function(key, eachList){
			lastModifiedBy.push(eachList.userName);
		})
		$scope.users = lastModifiedBy;
	}
	//Set the datas to scope to populate the edit channel modal
	$scope.modalSuccess = function (tableData) {
		try {
			$scope.dataLoaded = true;
			$scope.error = false;
			if(!tableData){
				throw "noDataError";
			}
			
			$.each(tableData.channelList, function(index, eachRow){
				if(eachRow.channelId == channelId){
					$scope.channelType = eachRow.channelType;
					$scope.estimateCost = UtilitiesService.getIntFromString(eachRow.estimateCost);
					$scope.estimateTime = parseInt(eachRow.estimateTime);
					$scope.lastModifiedDate = eachRow.lastModifiedDate;
					//$scope.lastModifiedBy = eachRow.lastModifiedBy;
					$.each($scope.users, function(key, eachUser){
						if(eachUser == eachRow.lastModifiedBy){
							$scope.lastModifiedBy = $scope.users[key];
						}
					})
					
				}
			});
			$element.find(":selected").trigger('change');
		} catch (e) {
			$scope.fail(errorConstants.DATA_ERR);
		}
	};
	 $scope.fail = function (msg) {
	        $scope.error = true;
	        $scope.hasErrorMsg = true;
	        $scope.savingChannels = false;
	        if(msg){
	        	if(msg instanceof Object){
	        		$scope.errorMsg = (msg.message == "" ? errorConstants.NETWORK_ERR  : msg.status+" : "+msg.message);
	        	} else {
	                $scope.errorMsg = msg;
	        	}
	        }
	    }
	//Creating request when add button is clicked in 'add' modal
	$scope.addChannel = function(){
		$scope.savingChannels = true;
		if(!$scope.addChannelForm.$valid){
			$('form').addClass("formError");
			$scope.savingChannels = false;
			return false;
		}else{
			$('form').removeClass("formError");
		}
		$scope.dataLoaded = false;
		var lastModifiedDate = moment($scope.addLastModifiedDate).format(window.appConstants.DATE_FORMAT);
		var addRequest = {};
		//Request
		addChannelsRequest[requestConstants.CHANNEL_TYPE] = $scope.addChannelType;
		addChannelsRequest[requestConstants.ESTIMATE_COST] = $scope.addEstimateCost.toString();
		addChannelsRequest[requestConstants.ESTIMATE_TIME] = $scope.addEstimateTime.toString();
		addChannelsRequest[requestConstants.LAST_MODIFIED_DATE] = lastModifiedDate;
		addChannelsRequest[requestConstants.LAST_MODIFIED_BY] = $scope.addLastModifiedBy;
		addChannelsRequest[requestConstants.DEFAULT_CHANNEL] = false;
		addRequest['channel'] = addChannelsRequest;
		//function call
		addChannels(addRequest);
	};

	//Creating request when  save button is clicked in 'edit' modal
	$scope.channelEditSave = function() {
		$scope.savingChannels = true;
		if(!$scope.channelEditForm.$valid){
			$('form').addClass("formError");
			$scope.savingChannels = false;
			return false;
		}else{
			$('form').removeClass("formError");
		}
		$scope.dataLoaded = false;
		var lastModifiedDate = moment($scope.lastModifiedDate).format(window.appConstants.DATE_FORMAT);
		var defaultChannel = sharedProperties.getDefaultChannelId();
		var editRequest = {};
		//Request
		editChannelsSaveRequest[requestConstants.CHANNEL_ID] = channelId;
		editChannelsSaveRequest[requestConstants.CHANNEL_TYPE] = $scope.channelType;
		editChannelsSaveRequest[requestConstants.ESTIMATE_COST] = $scope.estimateCost;
		editChannelsSaveRequest[requestConstants.ESTIMATE_TIME] = $scope.estimateTime;
		editChannelsSaveRequest[requestConstants.LAST_MODIFIED_DATE] = lastModifiedDate;
		editChannelsSaveRequest[requestConstants.LAST_MODIFIED_BY] = $scope.lastModifiedBy;
		editChannelsSaveRequest[requestConstants.DEFAULT_CHANNEL] = channelId==defaultChannel?true:false;
		editRequest['channel'] = editChannelsSaveRequest;
		//function call
		channelsEditSave(editRequest);
	};

	//When 'ok' button is clicked in delete modal
	$scope.deleteChannel = function(){
		$scope.savingChannels = true;
		deleteChannels(deleteRequest);
	}

	//Common success function for add, edit and delete channel
	$scope.success = function (data) {
		try {
			$scope.dataLoaded = true;
			if(!data){
				throw "noDataError";
			}
			if(data.status == 'OK'){
				$scope.showError = false;
				UtilitiesService.getNotifyMessage("Channels Updated Successfully",notifyRequestConstants.SUCCESS);
				$scope.savingChannels = false;
				$rootScope.$broadcast('channelsDataChange', data);
				$('#mask, .window').hide();
			}
			else {
				$scope.showError = true;
				$scope.savingChannels = false;
			}
			
		} catch (e) {
			UtilitiesService.throwError(e);
		}
	};

	/*------For add, edit and delete network calls------*/
	//to add the channel
	function addChannels(requestData){
		var func = $scope.success;
		DataService.addChannels(requestData, func, $scope.fail);
	}

	//to save the edited channel
	function channelsEditSave(requestData){
		var func = $scope.success;
		DataService.editChannelsSave(requestData, func, $scope.fail);
	}

	//to delete the particular channel
	function deleteChannels(requestData){
		var func = $scope.success;
		DataService.deleteChannels(requestData, func, $scope.fail);
	}

	/*--------For modal data-------*/
	//To get the data for edit channel modal 
	function loadEditModalData(object, id) {
		$scope.error = false;
		$scope.showError = false;
		$scope.savingChannels = false;
		$scope.$apply();
		var requestData = {};
		channelId = id;
		var func = $scope.modalSuccess;
		DataService.getChannelInfoData(requestData, func, $scope.fail);
	}

	//To get the data for delete channel modal 
	function getDeleteChannelId(object, id) {
		$scope.error = false;
		$scope.showError = false;
		$scope.savingChannels = false;
		$scope.$apply();
		deleteChannelId = id;
		deleteRequest[requestConstants.CHANNEL_ID] = deleteChannelId;
	}
	//To load add channel modal 
	function loadAddChannelDialog() {
		$scope.error = false;
		$scope.showError = false;
		$scope.savingChannels = false;
		$scope.$apply();
		$scope.$apply();
	}
	//Function calls the dataservice for getting the last modifiedby userlist data for setup
	function loadUserListForSetup(){
		var cacheKey = "channelUserList";
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
	loadUserListForSetup();
}])