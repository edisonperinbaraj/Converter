angular.module('Settings')

.service("DataService",['RequestConstantsFactory' ,'EnabledCacheInfoFactory','DataConversionService','NetworkService','UtilitiesService','StorageService','$timeout',
                        function(RequestConstantsFactory, EnabledCacheInfoFactory, DataConversionService, NetworkService, UtilitiesService, StorageService, $timeout){
	/*------------------ Generic ----------------------*/
	function sendRequest(cacheKey, cacheName, success, requestWS) {
		var isGlobalCacheEnabled = window.appConstants.IS_ENABLE_GLOBAL_CACHE;
		try {
			var dataInfo = StorageService.info(cacheKey, StorageService.getCache(cacheName));
			var data = StorageService.get(cacheKey, StorageService.getCache(cacheName));
			if(!dataInfo || !isGlobalCacheEnabled) {
				requestWS();
			} else {
				if(success instanceof Function) {
					success(data);
				}
			}
		} catch(e) {
			UtilitiesService.throwError({message: "Not found in Cache!", type: "internal"});
			$timeout(requestWS, 1);
		}
	}

	function getRequestWS(url, success, fail, beforeSuccess) {
		var requestWS = function() {
			NetworkService.get(url).then(function(result){
				if(result.status == 'OK'){
					var data = beforeSuccess(result);
					if(success instanceof Function) {
						success(data);
					}
				}else{
					fail(result);
				}
			}, function(response) {
				if(fail instanceof Function) {
					fail(response);
				}
			});
		}
		return requestWS;
	}
	function postRequestWS(url, reqData, success, fail, beforeSuccess) {
		var requestWS = function() {
			NetworkService.post(url, reqData).then(function(result){
				if(result.status == 'OK'){
					var data = beforeSuccess(result);
					if(success instanceof Function) {
						success(data);
					}
				}else{
					fail(result);
				}
			}, function(response) {
				if(fail instanceof Function) {
					fail(response);
				}
			});
		}
		return requestWS;
	}


	/*------------------ dataSync Page ----------------------*/
	this.getSyncStatusData = function(reqData, success, fail){
		var isCacheEnabled = EnabledCacheInfoFactory['DATASYNC'].DATA_SYNC_STATUS;
		var cacheKey = "syncData" + JSON.stringify(reqData);
		var requestWS = getRequestWS(
				RequestConstantsFactory['SETTINGS_URL'].DATA_SYNC_STATUS, 
				success, 
				fail,
				function(result) {
					var cData = result.dataSyncStatusList; 
					if(isCacheEnabled){
						StorageService.put(cacheKey, cData, StorageService.getCache("settingsDataCache"));
					}
					return cData;
				}
		);
		if(isCacheEnabled){
			sendRequest(cacheKey, "settingsDataCache", success, requestWS);
		} else {
			requestWS();
		}
	};

	this.getSyncHistoryData = function(reqData, success, fail){
		var isCacheEnabled = EnabledCacheInfoFactory['DATASYNC'].DATA_SYNC_HISTORY;
		var cacheKey = "syncHistoryData" + JSON.stringify(reqData);
		var requestWS = postRequestWS(
				RequestConstantsFactory['SETTINGS_URL'].DATA_SYNC_HISTORY, 
				reqData,
				success, 
				fail,
				function(result) {
					var cData = result.dataSyncList; 
					if(isCacheEnabled){
						StorageService.put(cacheKey, cData, StorageService.getCache("settingsDataCache"));
					}
					return cData;
				}
		);
		if(isCacheEnabled){
			sendRequest(cacheKey, "settingsDataCache", success, requestWS);
		}else{
			requestWS();
		}
	};

	/*------------------ channels Page ----------------------*/
	this.getChannelInfoData = function(reqData, success, fail){
		var isCacheEnabled = EnabledCacheInfoFactory['CHANNELS'].CHANNEL_INFO_TABLE;
		var cacheKey = "channelsInfo";
		var requestWS = getRequestWS(
				RequestConstantsFactory['SETTINGS_URL'].CHANNELS_LIST, 
				success, 
				fail,
				function(result) {
					var cData = result; 
					if(isCacheEnabled){
						StorageService.put(cacheKey, cData, StorageService.getCache("settingsChannelsCache"));
					}
					return cData;
				}
		);
		if(isCacheEnabled){
			sendRequest(cacheKey, "settingsChannelsCache", success, requestWS);
		}else{
			requestWS();
		}

	};

	this.addChannels = function(reqData, success, fail){
		var isCacheEnabled = EnabledCacheInfoFactory['CHANNELS'].ADD_CHANNEL;
		var cacheKey = "channelsInfo";
		var requestWS = postRequestWS(
				RequestConstantsFactory['SETTINGS_URL'].CHANNELS_ADD, 
				reqData,
				success, 
				fail,
				function(result) {
					var cData = result; 
					//isCacheEnabled should not be checked here
					StorageService.put(cacheKey, cData, StorageService.getCache("settingsChannelsCache"));
					return cData;
				}
		);
		if(isCacheEnabled){
			sendRequest(cacheKey, "settingsChannelsCache", success, requestWS);
		}else{
			requestWS();
		}
	};
	this.editChannelsSave = function(reqData, success, fail){
		var isCacheEnabled = EnabledCacheInfoFactory['CHANNELS'].EDIT_CHANNEL;
		var cacheKey = "channelsInfo";
		var requestWS = postRequestWS(
				RequestConstantsFactory['SETTINGS_URL'].CHANNELS_EDIT, 
				reqData,
				success, 
				fail,
				function(result) {
					var cData = result; 
					//isCacheEnabled should not be checked here
					StorageService.put(cacheKey, cData, StorageService.getCache("settingsChannelsCache"));
					return cData;
				}
		);
		if(isCacheEnabled){
			sendRequest(cacheKey, "settingsChannelsCache", success, requestWS);
		}else{
			requestWS();
		}
	};

	this.deleteChannels = function(reqData, success, fail){
		var isCacheEnabled = EnabledCacheInfoFactory['CHANNELS'].DELETE_CHANNEL;
		var cacheKey = "channelsInfo";
		var requestWS = postRequestWS(
				RequestConstantsFactory['SETTINGS_URL'].CHANNELS_DELETE, 
				reqData,
				success, 
				fail,
				function(result) {
					var cData = result; 
					//isCacheEnabled should not be checked here
					StorageService.put(cacheKey, cData, StorageService.getCache("settingsChannelsCache"));
					return cData;
				}
		);
		if(isCacheEnabled){
			sendRequest(cacheKey, "settingsChannelsCache", success, requestWS);
		}else{
			requestWS();
		}
	};

	/*------------------ models Page ----------------------*/
	this.getUploadModelsData = function(reqData, success, fail){
		var isCacheEnabled = EnabledCacheInfoFactory['MODELS'].UPDATE_MODEL_TABLE;
		var cacheKey = "uploadModels" + JSON.stringify(reqData);
		var requestWS = getRequestWS(
				RequestConstantsFactory['SETTINGS_URL'].MODELS_LIST, 
				success, 
				fail,
				function(result) {
					var cData = result.modelList; 
					if(isCacheEnabled){
						StorageService.put(cacheKey, cData, StorageService.getCache("settingsModelsCache"));
					}
					return cData;
				}
		);
		if(isCacheEnabled){
			sendRequest(cacheKey, "settingsModelsCache", success, requestWS);
		}else{
			requestWS();
		}
	};

	this.getViewModelsData = function(reqData, success, fail){
		var isCacheEnabled = EnabledCacheInfoFactory['MODELS'].VIEW_MODEL_TABLE;
		var cacheKey = "viewModels" + JSON.stringify(reqData);
		var requestWS = postRequestWS(
				RequestConstantsFactory['SETTINGS_URL'].MODELS_HISTORY_LIST, 
				reqData,
				success, 
				fail,
				function(result) {
					var cData = result.modelVersionsList; 
					if(isCacheEnabled){
						StorageService.put(cacheKey, cData, StorageService.getCache("settingsModelsCache"));
					}
					return cData;
				}
		);
		if(isCacheEnabled){
			sendRequest(cacheKey, "settingsModelsCache", success, requestWS);
		}else{
			requestWS();
		}
	};

	this.addModel = function(reqData, success, fail){
		var isCacheEnabled = EnabledCacheInfoFactory['MODELS'].ADD_MODEL;
		var cacheKey = "addModel" + JSON.stringify(reqData);
		var requestWS = postRequestWS(
				RequestConstantsFactory['SETTINGS_URL'].ADD_MODELS, 
				reqData,
				success, 
				fail,
				function(result) {
					var result = {
							"status": "OK",
							"message": "Request processed successfully",
							"modelId": "mod001",
							"modelName" : "Segmentation",
							"modelDetails" : "xyz",
							"modelVersion" : "0.1"
					};
					var cData = result; 
					if(isCacheEnabled){
						StorageService.put(cacheKey, cData, StorageService.getCache("settingsModelsCache"));
					}
					return cData;
				}
		);
		if(isCacheEnabled){
			sendRequest(cacheKey, "settingsModelsCache", success, requestWS);
		}else{
			requestWS();
		}
	};

	this.getModelDetails = function(reqData, success, fail){
		var isCacheEnabled = EnabledCacheInfoFactory['MODELS'].MODEL_DETAILS;
		var cacheKey = "modelDetails" + JSON.stringify(reqData);
		var requestWS = getRequestWS(
				RequestConstantsFactory['SETTINGS_URL'].MODEL_DETAILS, 
				success, 
				fail,
				function(result) {
					var cData = result; 
					if(isCacheEnabled){
						StorageService.put(cacheKey, cData, StorageService.getCache("settingsModelsCache"));
					}
					return cData;
				}
		);
		if(isCacheEnabled){
			sendRequest(cacheKey, "settingsModelsCache", success, requestWS);
		}else{
			requestWS();
		}
	};



	/*--------------------- goals Page --------------------------*/
	this.getGoalTableData = function(reqData, success, fail){
		var isCacheEnabled = EnabledCacheInfoFactory['GOALS'].GOALS_TABLE;
		var cacheKey = "goalTable";
		var requestWS = postRequestWS(
				//'http://172.24.144.129:9000/aquaws/getRolledUpTarget.php',
				RequestConstantsFactory['SETTINGS_URL'].GOALS_LIST, 
				reqData,
				success, 
				fail,
				function(result) {
	//				var result = {"status":"OK","message":"Request Processed Successfully","targetList":{"rangeId":"yr_2014","revenue":0,"newSubscribers":0,"registrations":0,"arpu":0,"netNewSubscribers":0,"cancels":0,"engScore":0,"sendArchives":0,"sendVideo":0,"multipleAppUsers":0,"sendAudio":0,"sendPdf":0,"workSpaceShare":0,"premiumDelivery":0,"children":[{"rangeId":"qtr1_2014","revenue":0,"newSubscribers":0,"registrations":0,"arpu":0,"netNewSubscribers":0,"cancels":0,"engScore":0,"sendArchives":0,"sendVideo":0,"multipleAppUsers":0,"sendAudio":0,"sendPdf":0,"workSpaceShare":0,"premiumDelivery":0,"children":[{"rangeId":"mth1_2014","revenue":0,"newSubscribers":0,"registrations":0,"arpu":0,"netNewSubscribers":0,"cancels":0,"engScore":0,"sendArchives":0,"sendVideo":0,"multipleAppUsers":0,"sendAudio":0,"sendPdf":0,"workSpaceShare":0,"premiumDelivery":0,"children":[]},{"rangeId":"mth2_2014","revenue":0,"newSubscribers":0,"registrations":0,"arpu":0,"netNewSubscribers":0,"cancels":0,"engScore":0,"sendArchives":0,"sendVideo":0,"multipleAppUsers":0,"sendAudio":0,"sendPdf":0,"workSpaceShare":0,"premiumDelivery":0,"children":[]},{"rangeId":"mth3_2014","revenue":0,"newSubscribers":0,"registrations":0,"arpu":0,"netNewSubscribers":0,"cancels":0,"engScore":0,"sendArchives":0,"sendVideo":0,"multipleAppUsers":0,"sendAudio":0,"sendPdf":0,"workSpaceShare":0,"premiumDelivery":0,"children":[]}]},{"rangeId":"qtr2_2014","revenue":0,"newSubscribers":0,"registrations":0,"arpu":0,"netNewSubscribers":0,"cancels":0,"engScore":0,"sendArchives":0,"sendVideo":0,"multipleAppUsers":0,"sendAudio":0,"sendPdf":0,"workSpaceShare":0,"premiumDelivery":0,"children":[{"rangeId":"mth4_2014","revenue":0,"newSubscribers":0,"registrations":0,"arpu":0,"netNewSubscribers":0,"cancels":0,"engScore":0,"sendArchives":0,"sendVideo":0,"multipleAppUsers":0,"sendAudio":0,"sendPdf":0,"workSpaceShare":0,"premiumDelivery":0,"children":[]},{"rangeId":"mth5_2014","revenue":0,"newSubscribers":0,"registrations":0,"arpu":0,"netNewSubscribers":0,"cancels":0,"engScore":0,"sendArchives":0,"sendVideo":0,"multipleAppUsers":0,"sendAudio":0,"sendPdf":0,"workSpaceShare":0,"premiumDelivery":0,"children":[]},{"rangeId":"mth6_2014","revenue":0,"newSubscribers":0,"registrations":0,"arpu":0,"netNewSubscribers":0,"cancels":0,"engScore":0,"sendArchives":0,"sendVideo":0,"multipleAppUsers":0,"sendAudio":0,"sendPdf":0,"workSpaceShare":0,"premiumDelivery":0,"children":[]}]},{"rangeId":"qtr3_2014","revenue":0,"newSubscribers":0,"registrations":0,"arpu":0,"netNewSubscribers":0,"cancels":0,"engScore":0,"sendArchives":0,"sendVideo":0,"multipleAppUsers":0,"sendAudio":0,"sendPdf":0,"workSpaceShare":0,"premiumDelivery":0,"children":[{"rangeId":"mth7_2014","revenue":0,"newSubscribers":0,"registrations":0,"arpu":0,"netNewSubscribers":0,"cancels":0,"engScore":0,"sendArchives":0,"sendVideo":0,"multipleAppUsers":0,"sendAudio":0,"sendPdf":0,"workSpaceShare":0,"premiumDelivery":0,"children":[]},{"rangeId":"mth8_2014","revenue":0,"newSubscribers":0,"registrations":0,"arpu":0,"netNewSubscribers":0,"cancels":0,"engScore":0,"sendArchives":0,"sendVideo":0,"multipleAppUsers":0,"sendAudio":0,"sendPdf":0,"workSpaceShare":0,"premiumDelivery":0,"children":[]},{"rangeId":"mth9_2014","revenue":0,"newSubscribers":0,"registrations":0,"arpu":0,"netNewSubscribers":0,"cancels":0,"engScore":0,"sendArchives":0,"sendVideo":0,"multipleAppUsers":0,"sendAudio":0,"sendPdf":0,"workSpaceShare":0,"premiumDelivery":0,"children":[]}]},{"rangeId":"qtr4_2014","revenue":0,"newSubscribers":0,"registrations":0,"arpu":0,"netNewSubscribers":0,"cancels":0,"engScore":0,"sendArchives":0,"sendVideo":0,"multipleAppUsers":0,"sendAudio":0,"sendPdf":0,"workSpaceShare":0,"premiumDelivery":0,"children":[{"rangeId":"mth10_2014","revenue":0,"newSubscribers":0,"registrations":0,"arpu":0,"netNewSubscribers":0,"cancels":0,"engScore":0,"sendArchives":0,"sendVideo":0,"multipleAppUsers":0,"sendAudio":0,"sendPdf":0,"workSpaceShare":0,"premiumDelivery":0,"children":[]},{"rangeId":"mth11_2014","revenue":0,"newSubscribers":0,"registrations":0,"arpu":0,"netNewSubscribers":0,"cancels":0,"engScore":0,"sendArchives":0,"sendVideo":0,"multipleAppUsers":0,"sendAudio":0,"sendPdf":0,"workSpaceShare":0,"premiumDelivery":0,"children":[]},{"rangeId":"mth12_2014","revenue":0,"newSubscribers":0,"registrations":0,"arpu":0,"netNewSubscribers":0,"cancels":0,"engScore":0,"sendArchives":0,"sendVideo":0,"multipleAppUsers":0,"sendAudio":0,"sendPdf":0,"workSpaceShare":0,"premiumDelivery":0,"children":[]}]}]}};
					var cData = DataConversionService.toGetTargetsTableData(result.targetList); 
					if(!isCacheEnabled){
						StorageService.put(cacheKey, cData, StorageService.getCache("settingsGoalsCache"));
					}
					return cData;
				}
		);
		if(isCacheEnabled){
			sendRequest(cacheKey, "settingsGoalsCache", success, requestWS, fail);
		}else{
			requestWS();
		}

	};
	this.editGoalsSave = function(reqData, success, fail){
		var isCacheEnabled = EnabledCacheInfoFactory['GOALS'].EDIT_GOALS;
		var cacheKey = "goalTable";
		var requestWS = postRequestWS(
				RequestConstantsFactory['SETTINGS_URL'].GOALS_EDIT, 
				reqData,
				success, 
				fail,
				function(result) {
					var cData = result; 
					//isCacheEnabled should not be checked here
					StorageService.put(cacheKey, cData, StorageService.getCache("settingsGoalsCache"));
					return cData;
				}
		);
		if(isCacheEnabled){
			sendRequest(cacheKey, "settingsGoalsCache", success, requestWS);
		}else{
			requestWS();
		}
	};
	this.getTargetGridDateRange = function(reqData, success, fail){
		var isCacheEnabled = EnabledCacheInfoFactory['GOALS'].EDIT_GOALS;
		var cacheKey = "targetGrid";
		var requestWS = getRequestWS(
				RequestConstantsFactory['SETTINGS_URL'].GET_TARGET_GRID_DATE_RANGE, 
				success, 
				fail,
				function(result) {
					var cData = result; 
					//isCacheEnabled should not be checked here
					StorageService.put(cacheKey, cData, StorageService.getCache("settingsGoalsCache"));
					return cData;
				}
		);
		if(isCacheEnabled){
			sendRequest(cacheKey, "settingsGoalsCache", success, requestWS);
		}else{
			requestWS();
		}
//		var result = {"status":"OK","message":"Request Processed Successfully","dateRangeList":[{"startDate":"03-09-2014","endDate":"03-15-2014","rangeId":"wk10_2014"},{"startDate":"03-16-2014","endDate":"03-22-2014","rangeId":"wk11_2014"},{"startDate":"03-23-2014","endDate":"03-29-2014","rangeId":"wk12_2014"},{"startDate":"03-30-2014","endDate":"04-05-2014","rangeId":"wk13_2014"},{"startDate":"04-06-2014","endDate":"04-12-2014","rangeId":"wk14_2014"},{"startDate":"04-13-2014","endDate":"04-19-2014","rangeId":"wk15_2014"},{"startDate":"04-20-2014","endDate":"04-26-2014","rangeId":"wk17_2014"},{"startDate":"04-27-2014","endDate":"05-03-2014","rangeId":"wk18_2014"},{"startDate":"05-04-2014","endDate":"05-10-2014","rangeId":"wk19_2014"},{"startDate":"01-05-2014","endDate":"01-11-2014","rangeId":"wk1_2014"},{"startDate":"05-11-2014","endDate":"05-17-2014","rangeId":"wk20_2014"},{"startDate":"05-18-2014","endDate":"05-24-2014","rangeId":"wk21_2014"},{"startDate":"05-25-2014","endDate":"05-31-2014","rangeId":"wk22_2014"},{"startDate":"06-01-2014","endDate":"06-07-2014","rangeId":"wk23_2014"},{"startDate":"06-08-2014","endDate":"06-14-2014","rangeId":"wk24_2014"},{"startDate":"06-15-2014","endDate":"06-21-2014","rangeId":"wk25_2014"},{"startDate":"06-22-2014","endDate":"06-28-2014","rangeId":"wk26_2014"},{"startDate":"06-29-2014","endDate":"07-05-2014","rangeId":"wk27_2014"},{"startDate":"07-06-2014","endDate":"07-12-2014","rangeId":"wk28_2014"},{"startDate":"07-13-2014","endDate":"07-19-2014","rangeId":"wk29_2014"},{"startDate":"01-12-2014","endDate":"01-18-2014","rangeId":"wk2_2014"},{"startDate":"07-20-2014","endDate":"08-26-2014","rangeId":"wk30_2014"},{"startDate":"07-27-2014","endDate":"08-02-2014","rangeId":"wk31_2014"},{"startDate":"08-03-2014","endDate":"08-09-2014","rangeId":"wk32_2014"},{"startDate":"08-10-2014","endDate":"08-16-2014","rangeId":"wk33_2014"},{"startDate":"08-17-2014","endDate":"08-23-2014","rangeId":"wk34_2014"},{"startDate":"08-24-2014","endDate":"08-30-2014","rangeId":"wk35_2014"},{"startDate":"08-31-2014","endDate":"09-06-2014","rangeId":"wk36_2014"},{"startDate":"09-17-2014","endDate":"09-13-2014","rangeId":"wk37_2014"},{"startDate":"09-14-2014","endDate":"09-20-2014","rangeId":"wk38_2014"},{"startDate":"09-21-2014","endDate":"09-27-2014","rangeId":"wk39_2014"},{"startDate":"01-19-2014","endDate":"01-25-2014","rangeId":"wk3_2014"},{"startDate":"09-28-2014","endDate":"10-04-2014","rangeId":"wk40_2014"},{"startDate":"10-05-2014","endDate":"10-11-2014","rangeId":"wk41_2014"},{"startDate":"10-12-2014","endDate":"10-18-2014","rangeId":"wk42_2014"},{"startDate":"10-19-2014","endDate":"10-25-2014","rangeId":"wk43_2014"},{"startDate":"10-26-2014","endDate":"11-01-2014","rangeId":"wk44_2014"},{"startDate":"11-02-2014","endDate":"11-08-2014","rangeId":"wk45_2014"},{"startDate":"11-09-2014","endDate":"11-15-2014","rangeId":"wk46_2014"},{"startDate":"11-16-2014","endDate":"11-22-2014","rangeId":"wk47_2014"},{"startDate":"11-23-2014","endDate":"11-29-2014","rangeId":"wk48_2014"},{"startDate":"11-30-2014","endDate":"12-06-2014","rangeId":"wk49_2014"},{"startDate":"01-26-2014","endDate":"02-01-2014","rangeId":"wk4_2014"},{"startDate":"12-07-2014","endDate":"12-13-2014","rangeId":"wk50_2014"},{"startDate":"12-14-2014","endDate":"12-20-2014","rangeId":"wk51_2014"},{"startDate":"12-21-2014","endDate":"12-27-2014","rangeId":"wk52_2014"},{"startDate":"12-28-2014","endDate":"01-03-2015","rangeId":"wk53_2014"}]};
//		success(result.dateRangeList);
	};
	
	this.getListTarget = function(reqData, success, fail){
		var tempRequest = {"year":2015};
		var isCacheEnabled = EnabledCacheInfoFactory['GOALS'].TARGET_INITIAL_DATA;
		var cacheKey = "targetGridInitialData";
		var requestWS = postRequestWS(
				RequestConstantsFactory['SETTINGS_URL'].GET_TARGET_GRID, 
				tempRequest,
				success, 
				fail,
				function(result) {
					var cData = result; 
					//isCacheEnabled should not be checked here
					StorageService.put(cacheKey, cData, StorageService.getCache("settingsGoalsCache"));
					return cData;
				}
		);
		if(isCacheEnabled){
			sendRequest(cacheKey, "settingsGoalsCache", success, requestWS);
		}else{
			requestWS();
		}
//		var result = {
//			    "status": "OK",
//			    "message": "Request was processed successfully",
//			    "targetList": [
//			        {
//			            "rangeId": "wk10_2014",
//			            "revenue": "7",
//			            "newSubscribers": "5",
//			            "registrations": "6",
//			            "cancels": "2",
//			            "uniqueVisitors": "7",
//			            "netNewSubscribers": "5",
//			            "arpu": "1",
//			            "eaScore": "3",
//			            "sendArchives": "8",
//			            "sendVideo": "11",
//			            "multiAppUsers": "4",
//			            "sendAudio": "9",
//			            "sendPdf": "10",
//			            "workSpaceShare": "12",
//			            "premiumDelivery": "12"
//			        }
//			    ]
//			}
//		success(result.targetList);
	};
	this.saveTargetGridData = function(reqData, success, fail){
		var requestWS = postRequestWS(
				RequestConstantsFactory['SETTINGS_URL'].SAVE_TARGET_GRID, 
				reqData,
				success, 
				fail,
				function(result) {
					var cData = result; 
					return cData;
				}
		);
		requestWS();
	}

	/*------------------ users Page - user module ----------------------*/
	this.getUsersListData = function(reqData, success, fail){
		var isCacheEnabled = EnabledCacheInfoFactory['USERS'].USER_LIST_TABLE;
		var cacheKey = "userList";
		var requestWS = getRequestWS(
				RequestConstantsFactory['SETTINGS_URL'].USERS_LIST, 
				success, 
				fail,
				function(result) {
					var cData = result; 
					if(isCacheEnabled){
						StorageService.put(cacheKey, cData, StorageService.getCache("settingsUsersCache"));
					}
					return cData;
				}
		);
		if(isCacheEnabled){
			sendRequest(cacheKey, "settingsUsersCache", success, requestWS);
		}else{
			requestWS();
		}

	};

	this.addUsers = function(reqData, success, fail){
		var isCacheEnabled = EnabledCacheInfoFactory['USERS'].USER_ADD;
		var cacheKey = "userList";
		var requestWS = postRequestWS(
				RequestConstantsFactory['SETTINGS_URL'].USERS_ADD, 
				reqData,
				success, 
				fail,
				function(result) {
					var cData = result; 
					//isCacheEnabled should not be checked here
					StorageService.put(cacheKey, cData, StorageService.getCache("settingsUsersCache"));
					return cData;
				}
		);
		if(isCacheEnabled){
			sendRequest(cacheKey, "settingsUsersCache", success, requestWS);
		}else{
			requestWS();
		}
	};

	this.editUsersSave = function(reqData, success, fail){
		var isCacheEnabled = EnabledCacheInfoFactory['USERS'].USER_EDIT;
		var cacheKey = "userList";
		var requestWS = postRequestWS(
				RequestConstantsFactory['SETTINGS_URL'].USERS_EDIT, 
				reqData,
				success, 
				fail,
				function(result) {
					var cData = result; 
					//isCacheEnabled should not be checked here
					StorageService.put(cacheKey, cData, StorageService.getCache("settingsUsersCache"));
					return cData;
				}
		);
		if(isCacheEnabled){
			sendRequest(cacheKey, "settingsUsersCache", success, requestWS);
		}else{
			requestWS();
		}
	};


	this.deleteUser = function(reqData, success, fail){
		var isCacheEnabled = EnabledCacheInfoFactory['USERS'].USER_DELETE;
		var cacheKey = "userList";
		var requestWS = postRequestWS(
				RequestConstantsFactory['SETTINGS_URL'].USERS_DELETE, 
				reqData,
				success, 
				fail,
				function(result) {
					var cData = result; 
					//isCacheEnabled should not be checked here
					StorageService.put(cacheKey, cData, StorageService.getCache("settingsUsersCache"));
					return cData;
				}
		);
		if(isCacheEnabled){
			sendRequest(cacheKey, "settingsUsersCache", success, requestWS, fail);
		}else{
			requestWS();
		}
	};

	/*----------------users page - role module-----------------*/

	this.getRolesListData = function(reqData, success, fail){
		var isCacheEnabled = EnabledCacheInfoFactory['USERS'].ROLE_LIST_TABLE;
		var cacheKey = "roleList" ;
		var requestWS = getRequestWS(
				RequestConstantsFactory['SETTINGS_URL'].ROLES_LIST, 
				success, 
				fail,
				function(result) {
					var cData = result;
					if(isCacheEnabled){
						StorageService.put(cacheKey, cData, StorageService.getCache("settingsUsersCache"));
					}
					return cData;
				}
		);
		if(isCacheEnabled){
			sendRequest(cacheKey, "settingsUsersCache", success, requestWS);
		}else{
			requestWS();
		}
	};

	this.addRoles = function(reqData, success, fail){
		var isCacheEnabled = EnabledCacheInfoFactory['USERS'].ROLE_ADD;
		var cacheKey = "roleList";
		var requestWS = postRequestWS(
				RequestConstantsFactory['SETTINGS_URL'].ROLE_ADD, 
				reqData,
				success, 
				fail,
				function(result) {
					var cData = result; 
					//isCacheEnabled should not be checked here
					StorageService.put(cacheKey, cData, StorageService.getCache("settingsUsersCache"));
					return cData;
				}
		);
		if(isCacheEnabled){
			sendRequest(cacheKey, "settingsUsersCache", success, requestWS);
		}else{
			requestWS();
		}
	};

	this.editRolesSave = function(reqData, success, fail){
		var isCacheEnabled = EnabledCacheInfoFactory['USERS'].ROLE_EDIT;
		var cacheKey = "roleList" ;
		var requestWS = postRequestWS(
				RequestConstantsFactory['SETTINGS_URL'].ROLE_EDIT, 
				reqData,
				success, 
				fail,
				function(result) {
					var cData = result; 
					//isCacheEnabled should not be checked here
					StorageService.put(cacheKey, cData, StorageService.getCache("settingsUsersCache"));
					return cData;
				}
		);
		if(isCacheEnabled){
			sendRequest(cacheKey, "settingsUsersCache", success, requestWS);
		}else{
			requestWS();
		}
		 
	};

	this.deleteRole = function(reqData, success, fail){
		var isCacheEnabled = EnabledCacheInfoFactory['USERS'].ROLE_DELETE;
		var cacheKey = "roleList";
		var requestWS = postRequestWS(
				RequestConstantsFactory['SETTINGS_URL'].ROLE_DELETE, 
				reqData,
				success, 
				fail,
				function(result) {
					var cData = result; 
					//isCacheEnabled should not be checked here
					StorageService.put(cacheKey, cData, StorageService.getCache("settingsUsersCache"));
					return cData;
				}
		);
		if(isCacheEnabled){
			sendRequest(cacheKey, "settingsUsersCache", success, requestWS);
		}else{
			requestWS();
		}

	};

	this.getPermissionForRole = function(reqData, success, fail){
		var isCacheEnabled = EnabledCacheInfoFactory['USERS'].ROLE_PERMISSION;
		var cacheKey = "permissionRole" + JSON.stringify(reqData);
		var requestWS = postRequestWS(
				RequestConstantsFactory['SETTINGS_URL'].USERS_PERMISSION_ROLES, 
				reqData,
				success, 
				fail,
				function(result) {
					var cData = DataConversionService.toGetPermissionsForRole(result.permissionsList);
					if(isCacheEnabled){
						StorageService.put(cacheKey, cData, StorageService.getCache("settingsUsersCache"));
					}
					return cData;
				}
		);
		if(isCacheEnabled){
			sendRequest(cacheKey, "settingsUsersCache", success, requestWS);
		}else{
			requestWS();
		}
	};

	this.updatePermissionForRole = function(reqData, success, fail){
		var isCacheEnabled = EnabledCacheInfoFactory['USERS'].ROLE_PERMISSION_UPDATE;
		var cacheKey = "updatePermissionForRole";
		var requestWS = postRequestWS(
				RequestConstantsFactory['SETTINGS_URL'].USERS_UPATE_PERMISSION_ROLES, 
				reqData,
				success, 
				fail,
				function(result) {
					var cData = result;
					if(isCacheEnabled){
						StorageService.put(cacheKey, cData, StorageService.getCache("settingsUsersCache"));
					}
					return cData;
				}
		);
		if(isCacheEnabled){
			sendRequest(cacheKey, "settingsUsersCache", success, requestWS);
		}else{
			requestWS();
		}

	};



	/*------------------ audit Trail Page ----------------------*/
	//get Filter setup data
	this.getAuditTrailSetUp = function(reqData, success, fail){
		var isCacheEnabled = EnabledCacheInfoFactory['AUDIT_TRAIL'].AUDIT_TRAIL_SETUP;
		var cacheKey = "auditTrailSetUp" + JSON.stringify(reqData);
		var requestWS = getRequestWS(
				RequestConstantsFactory['SETTINGS_URL'].AUDIT_TRAIL_SETUP, 
				success, 
				fail,
				function(result) {
					var cData = result; 
					if(isCacheEnabled){
						StorageService.put(cacheKey, cData, StorageService.getCache("settingsAuditTrailCache"));
					}
					return cData;
				}
		);
		if(isCacheEnabled){
			sendRequest(cacheKey, "settingsAuditTrailCache", success, requestWS);
		}else{
			requestWS();
		}

	};
	//get AuditTrail UserList data for setup 
	this.getUserList = function(success, fail){
		var isCacheEnabled = EnabledCacheInfoFactory['AUDIT_TRAIL'].AUDIT_TRAIL_USERLIST_SETUP;
		var cacheKey = "auditTrailUserList";
		var requestWS = getRequestWS(
				RequestConstantsFactory['SETTINGS_URL'].USERS_LIST, 
				success, 
				fail,
				function(result) {
					var cData = DataConversionService.toGetAuditTrailUserList(result); 
					if(isCacheEnabled){
						StorageService.put(cacheKey, cData, StorageService.getCache("settingsAuditTrailCache"));
					}
					return cData;
				}
		);
		if(isCacheEnabled){
			sendRequest(cacheKey, "settingsAuditTrailCache", success, requestWS);
		}else{
			requestWS();
		}

	};
	//get AuditTrailList data
	this.getAuditTrailList = function(reqData, success, fail){
		var isCacheEnabled = EnabledCacheInfoFactory['AUDIT_TRAIL'].AUDIT_TRAIL_LIST_TABLE;
		var cacheKey = "auditTrailList" + JSON.stringify(reqData);
		var requestWS = postRequestWS(
				RequestConstantsFactory['SETTINGS_URL'].AUDIT_TRAIL_LIST, 
				reqData,
				success, 
				fail,
				function(result) {
					var cData = result; 
					if(isCacheEnabled){
						StorageService.put(cacheKey, cData, StorageService.getCache("settingsAuditTrailCache"));
					}
					return cData;
				}
		);
		if(isCacheEnabled){
			sendRequest(cacheKey, "settingsAuditTrailCache", success, requestWS);
		}else{
			requestWS();
		}

	};
	/*------------------ Label Config ----------------------*/

	this.getLabelConfig = function(reqData, success, fail){
//		var isCacheEnabled = EnabledCacheInfoFactory['LABEL_CONFIG'].LIST_TABLE;
//		var cacheKey = "labelConfigList" + JSON.stringify(reqData);
//		var requestWS = postRequestWS(
//		RequestConstantsFactory['SETTINGS_URL'].AUDIT_TRAIL_LIST, 
//		reqData,
//		success, 
//		fail,
//		function(result) {
//		var cData = result; 
//		if(isCacheEnabled){
//		StorageService.put(cacheKey, cData, StorageService.getCache("settingsLabelConfigCache"));
//		}
//		return cData;
//		}
//		);
//		if(isCacheEnabled){
//		sendRequest(cacheKey, "settingsLabelConfigCache", success, requestWS);
//		}else{
//		requestWS();
//		}
		var result = {
			    "status": "OK",
			    "message": "Request Processed Successfully",
			    "labelList": {
			        "track_tab": "Track",
			        "summary_tab": "Summary",
			        "business_impact_tab": "Business Impact",
			        "engagement_activity_tab": "Engagement Activity",
			        "user_group_tab": "User Group",
			        "home_tab": "Home",
			        "decision_workbench_tab": "Decision Workbench",
			        "index_tab": "Find New Decision Options",
			        "reviewdo_tab": "Review Panel",
			        "settings_tab": "Settings",
			        "track_summary_funnel_title": "Funnel",
			        "track_summary_trend_title": "Trend",
			        "track_summary_funnel_visitors": "Visitors",
			        "track_summary_funnel_registrations": "Registrations",
			        "track_summary_metrics_title": "Metrics",
			        "track_summary_funnel_subscriptions": "Subscriptions",
			        "track_summary_funnel_cancellations": "Cancellations",
			        "track_summary_metrics_businessImpact": "Business Impact",
			        "track_summary_metrics_engagementMetrics": "Engagement Metrics",
			        "track_summary_metrics_userGroup": "User Group",
			        "track_summary_funnel_acquisistionRate": "Acquisition Rate",
			        "track_summary_funnel_conversionRate": "Conversion Rate",
			        "track_summary_funnel_churnRate": "Churn Rate",
			        "track_summary_trend_chart_title": "Revenues vs. Subcriptions/Cancellations",
			        "track_summary_trend_chart_left_title": "Revenue ($)",
			        "track_summary_trend_chart_right_title": "New Paid Users",
			        "track_BI_key_business_metrics_title": "Key Business Metrics",
			        "track_BI_summary_title": "Summary",
			        "track_BI_trend_title": "Trend",
			        "track_BI_deep_dive_title": "Deep Dive",
			        "track_BI_deep_dive_user_group_column": "User Group",
			        "track_BI_deep_dive_wtd_actual_column": "WTD Actual",
			        "track_BI_deep_dive_forecast_this_column": "Forecast this",
			        "track_BI_deep_dive_target_this_column": "Target this",
			        "track_BI_deep_dive_difference_from_target_column": "Difference from Target",
			        "track_BI_trend_chart_title": "Number of Users",
			        "track_EA_engagement_score_title": "Engagement Score",
			        "track_EA_engagement_score_trend_title": "Engagement Score Trend",
			        "track_EA_key_engagement_activity_matrices_title": "Key Engagement Activity Matrices",
			        "track_EA_summary_title": "Summary",
			        "track_EA_trend_title": "Trend",
			        "track_EA_deep_dive_title": "Deep Dive",
			        "track_EA_deep_dive_moduleEngagement": "Module Engagement",
			        "track_EA_deep_dive_conversionWeightage": "Conversion Weightage",
			        "track_EA_deep_dive_moduleEngagement_module_column": "Module",
			        "track_EA_deep_dive_moduleEngagement_engagement_level_column": "Engagement Level",
			        "track_EA_deep_dive_moduleEngagement_engagement_score_column": "Engagement Score",
			        "track_EA_deep_dive_moduleEngagement_no_of_users": "No Of Users",
			        "track_UG_trend_chart_title": "Number of Users",
			        "track_UG_usergroup_metrics_title": "User Group Metrics",
			        "track_UG_summary_title": "Summary",
			        "track_UG_trend_title": "User Group Acquisition Trend",
			        "track_UG_deep_dive_user_group_column": "User Groups",
			        "track_UG_deep_dive_active_users_column": "Active Users",
			        "track_UG_deep_dive_average_login_column": "Average Logins",
			        "track_UG_deep_dive_recurring_booking_column": "Recurring Booking",
			        "track_UG_deep_dive_arpu_column": "ARPU",
			        "track_UG_deep_dive_engagement_level_column": "Engagement Level",
			        "track_UG_deep_dive_engagement_score": "Engagement Score",
			        "dw_index_title": "Set Goals",
			        "dw_index_waterfall_chart_title": "Paid User Acquisition",
			        "dw_index_showing_data_title": "Showing data for the ",
			        "dw_index_bubblechart_1_title": "Top and Least Engaged Activities",
			        "dw_index_bubblechart_2_title": "Top and Least Engaged User Group",
			        "dw_index_show_best_do_button_text": "Show Best Decision Options",
			        "dw_index_set_filters_button_text": "Set Filters",
			        "dw_builddo_title": "Build Decision Options",
			        "dw_builddo_waterfall_chart_title": "Achievable Uplift",
			        "dw_builddo_review_panel_title": "Review Panel",
			        "dw_builddo_decision_options_title": "Decision Options",
			        "dw_builddo_remove_selection_btn_text": "Save & View Review Panel",
			        "dw_builddo_review_panel_save_btn_text": "Remove Selection",
			        "dw_reviewdo_title": "Review Decision Options",
			        "dw_reviewdo_waterfall_chart_title": "Achievable Uplift",
			        "dw_reviewdo_bubble_chart_title": "Time & Cost Comparison",
			        "dw_reviewdo_decision_options_title": "Decision Options",
			        "dw_filters_title": "Filters",
			        "dw_filters_user_group_title": "User Group",
			        "dw_filters_conversion_activity_title": "Conversion Activity",
			        "dw_filters_conversion_uplift_title": "Conversion Uplift",
			        "dw_filters_active_till_date_title": "Active Till Date",
			        "dw_filters_show_do_button_text": "Show Decision Options",
			        "dw_filters_clear_filter_button_text": "Clear Filter",
			        "dw_filters_close_filter_button_text": "Close Filter",
			        "dw_filters_builddo_text": "Current Selection"
			    }
			};
		success(result);

	};

	this.setSelectedDate = function(reqData, success, fail){
		var requestWS = postRequestWS(
				RequestConstantsFactory['SETTINGS_URL'].LABEL_CONFIG_SET_DATE, 
				reqData,
				success, 
				fail,
				function(result) {
					var cData = result; 
					return cData;
				}
		);
		var result = {
				"status":"OK",
				"message":"Request processed successfully"
		};
		success(result);
		//requestWS();

	};

}])