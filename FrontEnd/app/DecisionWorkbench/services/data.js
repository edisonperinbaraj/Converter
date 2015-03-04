angular.module('DecisionWorkbench')

.service("DataService",['RequestConstantsFactory','NetworkService','UtilitiesService','$timeout','StorageService','DataConversionService','$rootScope',
                        function(RequestConstantsFactory, NetworkService, UtilitiesService, $timeout, StorageService, DataConversionService,$rootScope) {

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
	this.setDOSettings = function(reqData, success, fail) {
		NetworkService.post(RequestConstantsFactory['DECISION_URL'].DO_SETTINGS, reqData).then(function(result){
			UtilitiesService.validateResponse(result);
			success(result);
		},function(response){
			fail(response);
		}).catch(function(e){
			UtilitiesService.throwError(e);
		});

	};

	this.getDecisionOptionsValidateData = function(reqData, success, fail) {
		var cacheKey = "DWDecisionTableValidate" + JSON.stringify(reqData);
		var requestWS = postRequestWS(
				RequestConstantsFactory['DECISION_URL'].VALIDATE_DO, 
				reqData,
				success, 
				fail,
				function(result) {
					var cData = DataConversionService.toGetBuildDoDecisionValidateData(result);
						StorageService.put(cacheKey, cData, StorageService.getCache("decision-workbench-builddoCache"));
					return cData;
				}
		);
		requestWS();
	};



	this.getDecisionOptionsModifyData = function(reqData, success, fail) {
		var cacheKey = "DWDecisionTableModify" + JSON.stringify(reqData);
		var requestWS = postRequestWS(
				RequestConstantsFactory['DECISION_URL'].EDIT_DO, 
				reqData,
				success, 
				fail,
				function(result) {
					var cData = result;
						StorageService.put(cacheKey, cData, StorageService.getCache("decision-workbench-builddoCache"));
					return cData;
				}
		);
		sendRequest(cacheKey, "decision-workbench-builddoCache", success, requestWS);
	};

	this.getFilterData = function(reqData, success, fail) {

		var cacheKey = "DWFilter" + JSON.stringify(reqData);
		var requestWS = postRequestWS(
				RequestConstantsFactory['DECISION_URL'].GET_DO_SETTINGS, 
				reqData,
				success, 
				fail,
				function(result) {
					var cData = result;
						//StorageService.put(cacheKey, cData, StorageService.getCache("decision-workbench-indexCache"));
					return cData;
				}
		);
		sendRequest(cacheKey, "decision-workbench-indexCache", success, requestWS);
	};

	this.getSetGoalsChartData = function(reqData, success, fail) {

		var cacheKey = "DWIndex" + JSON.stringify(reqData);
		var requestWS = postRequestWS(
				RequestConstantsFactory['DECISION_URL'].NEW_DECISION_OPTION, 
				reqData,
				success, 
				fail,
				function(result) {
					var cData = DataConversionService.toGetSetGoalsChartData(result);
						StorageService.put(cacheKey, cData, StorageService.getCache("decision-workbench-indexCache"));
					return cData;
				}
		);
		sendRequest(cacheKey, "decision-workbench-indexCache", success, requestWS);
	};
	this.getBuildDoChartData = function(reqData, success, fail) {
		
		var cacheKey = "DWAchievementUplift" + JSON.stringify(reqData);
		var requestWS = postRequestWS(
				RequestConstantsFactory['DECISION_URL'].NEW_DECISION_OPTION, 
				reqData,
				success, 
				fail,
				function(result) {
					var cData = DataConversionService.toGetBuildDoChartData(result);
						StorageService.put(cacheKey, cData, StorageService.getCache("decision-workbench-builddoCache"));
					return cData;
				}
		);
		sendRequest(cacheKey, "decision-workbench-builddoCache", success, requestWS);
	};
	
	this.getCombinedDO = function(reqData, success, fail) {
		var cacheKey = "CombinedDO" + JSON.stringify(reqData);
		var requestWS = postRequestWS(
				RequestConstantsFactory['DECISION_URL'].GET_COMBINED_DO_DETAILS, 
				reqData,
				success, 
				fail,
				function(result) {
					var cData = DataConversionService.toGetBuildDoChartData(result);
					return cData;
				}
		);
		sendRequest(cacheKey, "decision-workbench-reviewdoCache", success, requestWS);
		/*var result = {
				"doId": "4",
				"targetConvActivityList": 
				{
					"convActivityId": "files_sent_archival_flag",
					"convActivityName": "Search"
				},
				"channelList": 
				{
					"channelId": "ch1",
					"channelName": "Recipient Page"
				},
				"userGroupList": 
				{
					"groupId": "UsrGrp0",
					"groupName": "User Group 0"
				},
				"expectedNewSub": "1890",
				"usersTargeted": "2000",
				"convUplift": {
					"value": "4.67284",
					"trend": "+ive"
				}
		};
		success(result);
		//requestWS();
*/	};

	this.getDecisionOptionsTableData = function(reqData, success, fail) {
		var cacheKey = "ReviewDoTable" + JSON.stringify(reqData);
		var finalData = {};
		var requestWS = postRequestWS(
				RequestConstantsFactory['DECISION_URL'].REVIEW_DO, 
				reqData,
				success, 
				fail,
				function(result) {
					console.log("ppp result:", result)
					var cData = result;
					cData = DataConversionService.toReviewDODeepDrive(result);
	                cData = DataConversionService.toGetCommaSeparated(cData.doList);
	                finalData['doList'] = cData;
						StorageService.put(cacheKey, finalData, StorageService.getCache("decision-workbench-reviewdoCache"));
					return finalData;
				}
		);
	/*	var result = {"status":"OK","message":"Request Processed Successfully","periodName":"weekly","doList":[{"doId":"1,3","isEdited":false,"originalDO":"","isExpired":false,"targetConvActivityList":[{"convActivityId":"Act 1,2","convActivityName":"Act 1,2"},{"convActivityId":"Act 2,5","convActivityName":"Act 2,5"}],"channelList":[{"channelId":"Email","channelName":"Email"},{"channelId":"Ads","channelName":"Ads"}],"userGroupList":[{"groupId":"UG 1","groupName":"UG 1"},{"groupId":"UG 2","groupName":"UG 2"}],"expectedNewSub":"215","usersTargeted":[{"id":"1","value":"2800"},{"id":"3","value":"3800"}],"convUplift":{"value":"33%","trend":"+ve"},"campaignDuration":[{"id":"1","value":"4"},{"id":"3","value":"3"}],"cost":[{"id":"1","value":"4000"},{"id":"3","value":"3000"}],"activate":true,"responsibility":"Jai","tenure":"1","activeStartDate":"05/11/2014","activeEndDate":"05/11/2014","approvalStatus":[{"stepNo":"1","approverName":"Tom","currentStatus":"completed"},{"stepNo":"2","approverName":" Elik Link","currentStatus":"completed"},{"stepNo":"3","approverName":" Jeniffer","currentStatus":"completed"},{"stepNo":"4","approverName":" Jai","currentStatus":"completed"}]},{"doId":"1,3,5","isEdited":false,"originalDO":"","isExpired":false,"targetConvActivityList":[{"convActivityId":"Act 1,3","convActivityName":"Act 1,3"},{"convActivityId":"Act 3,5","convActivityName":"Act 3,5"},{"convActivityId":"Act 6,7","convActivityName":"Act 6,7"}],"channelList":[{"channelId":"Email","channelName":"Email"},{"channelId":"Ads","channelName":"Ads"},{"channelId":"House Ads","channelName":"House Ads"}],"userGroupList":[{"groupId":"UG 1","groupName":"UG 1"},{"groupId":"UG 3","groupName":"UG 3"},{"groupId":"UG 6","groupName":"UG 6"}],"expectedNewSub":"230","usersTargeted":[{"id":"1","value":"2800"},{"Id":"3","value":"3800"},{"Id":"5","value":"1243"}],"convUplift":{"value":"26%","trend":"+ve"},"campaignDuration":[{"id":"1","value":"4"},{"id":"3","value":"3"},{"id":"5","value":"5"}],"cost":[{"id":"1","value":"2345"},{"id":"3","value":"2330"},{"id":"5","value":"1220"}],"activate":true,"responsibility":"Jai","tenure":"1","activeStartDate":"05/11/2014","activeEndDate":"05/11/2014","approvalStatus":[{"stepNo":"1","approverName":"Tom","currentStatus":"completed"},{"stepNo":"2","approverName":" Elik Link","currentStatus":"completed"},{"stepNo":"3","approverName":" Jeniffer","currentStatus":"completed"},{"stepNo":"4","approverName":" Jai","currentStatus":"completed"}]},{"doId":"1","isEdited":false,"originalDO":"","isExpired":false,"targetConvActivityList":[{"convActivityId":"Act 1,3,5,6","convActivityName":"Act 1,3,5,6"}],"channelList":[{"channelId":"Email","channelName":"Email"}],"userGroupList":[{"groupId":"UG 5","groupName":"UG 5"}],"expectedNewSub":"215","usersTargeted":[{"id":"1","value":"422"}],"convUplift":{"value":"33%","trend":"+ve"},"campaignDuration":[{"id":"1","value":"3"}],"cost":[{"id":"1","value":"4800"}],"activate":true,"responsibility":"Jai","tenure":"1","activeStartDate":"05/11/2014","activeEndDate":"05/11/2014","approvalStatus":[{"stepNo":"1","approverName":"Tom","currentStatus":"completed"},{"stepNo":"2","approverName":" Elik Link","currentStatus":"completed"},{"stepNo":"3","approverName":" Jeniffer","currentStatus":"completed"},{"stepNo":"4","approverName":" Jai","currentStatus":"completed"}]}]};
		cData = DataConversionService.toReviewDODeepDrive(result);
        cData = DataConversionService.toGetCommaSeparated(cData.doList);
        finalData['doList'] = cData;
        success(finalData);*/
		sendRequest(cacheKey, "decision-workbench-reviewdoCache", success, requestWS);
	};
	
	this.updateDO = function(reqData, success, fail) {
		
		var cacheKey = "updateDO" + JSON.stringify(reqData);
		var requestWS = postRequestWS(
			RequestConstantsFactory['DECISION_URL'].UPDATE_DO, 
			reqData,
			success, 
			fail,
			function(result) {
				var cData = result;
					StorageService.put(cacheKey, cData, StorageService.getCache("decision-workbench-indexCache"));
					cData = DataConversionService.toReviewDODeepDrive(result);
				return cData;
			}
		);
		try {
			var dataInfo = StorageService.info(cacheKey, StorageService.getCache("decision-workbench-indexCache"));
			var data = StorageService.get(cacheKey, StorageService.getCache("decision-workbench-indexCache"));
			if(true) {
				requestWS();
			}
			else{
				cData = DataConversionService.toReviewDODeepDrive(data[$rootScope.selectedPeriod].data);
				if(success instanceof Function)
					success(cData);
			}
		} catch(e) {
			console.log(e);
			UtilitiesService.throwError(fail, {message: "Not found in Cache!", type: "internal"});
		}
	};
	this.editDOSaveAction = function(reqData, success, fail) {
		var cacheKey = "DWDecisionTable" + JSON.stringify(reqData);
		var requestWS = postRequestWS(
				RequestConstantsFactory['DECISION_URL'].EDIT_DO_SAVE, 
				reqData,
				success, 
				fail,
				function(result) {
					var cData = DataConversionService.toGetBuildDoDecision(result);
					//StorageService.put(cacheKey, cData, StorageService.getCache("decision-workbench-builddoCache"));
					return cData;
				}
		);
		requestWS();
	};

	this.saveSelectedDO = function(reqData, fail, successFunction) {
		NetworkService.post(RequestConstantsFactory['DECISION_URL'].REVIEW_DO,reqData, fail).then(function(result) {
			UtilitiesService.validateResponse(result);
			successFunction();
		}).catch(function(e){
			UtilitiesService.throwError(fail, e);
		});
	}
	
	this.getBuilddoDecision = function(reqData, success, fail) {
		var cacheKey = "DWDecisionTable" + JSON.stringify(reqData);
		var requestWS = postRequestWS(
				RequestConstantsFactory['DECISION_URL'].GET_DECISION_FILTERS, 
				reqData,
				success, 
				fail,
				function(result) {
					var cData = DataConversionService.toGetBuildDoDecision(result);
					cData = DataConversionService.toGetCommaSeparatedForDO(cData);
					StorageService.put(cacheKey, cData, StorageService.getCache("decision-workbench-builddoCache"));
					return cData;
				}
		);
		sendRequest(cacheKey, "decision-workbench-builddoCache", success, requestWS);

	};

}])