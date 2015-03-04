angular.module('Tracking')

.service("DataService",['RequestConstantsFactory','DataConversionService','NetworkService','StorageService','$rootScope','$q','$timeout','UtilitiesService',
                        function(RequestConstantsFactory, DataConversionService, NetworkService, StorageService, $rootScope, $q, $timeout, UtilitiesService) {

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

	/*---------------------Summary page-------------------------*/
	this.getTrackSummaryFunnelData = function(reqData, success, fail) {
		var cacheKey = "summaryFunnel" + JSON.stringify(reqData);
		var requestWS = postRequestWS(
				RequestConstantsFactory['TRAC_URL'].GET_ACQ_FUNNEL_DATA, 
				reqData,
				success, 
				fail,
				function(result) {
					var data = DataConversionService.toTrackSummaryAcqFunnelData(result);
					var cData = DataConversionService.toTrackSummaryAcqFunnel(data);
					StorageService.put(cacheKey, cData, StorageService.getCache("summaryCache"));
					return cData;
				}
		);
		sendRequest(cacheKey, "summaryCache", success, requestWS);

	};
	this.getTrackSummaryFunnelSparkLineData = function(reqData, success, fail) {
		var cacheKey = "summaryFunnel" + JSON.stringify(reqData);
		var requestWS = postRequestWS(
				RequestConstantsFactory['TRAC_URL'].GET_ACQ_FUNNEL_DATA, 
				reqData,
				success, 
				fail,
				function(result) {
					var data = DataConversionService.toTrackSummaryAcqFunnelData(result);
					var cData = DataConversionService.toTrackSummaryAcqFunnel(data);
					StorageService.put(cacheKey, cData, StorageService.getCache("summaryCache"));
					return cData;
				}
		);
		sendRequest(cacheKey, "summaryCache", success, requestWS);

	};
	
	this.get

	this.getTrackSummaryAcqTrend = function(reqData, success, fail) {
		var cacheKey = "summaryTrend" + JSON.stringify(reqData);
		var requestWS = postRequestWS(
				RequestConstantsFactory['TRAC_URL'].GET_ACQ_TREND_DATA, 
				reqData,
				success, 
				fail,
				function(result) {
					var cData = DataConversionService.toTrackSummaryAcqTrend(result);
					StorageService.put(cacheKey, cData, StorageService.getCache("summaryCache"));
					return cData;
				}
		);
		sendRequest(cacheKey, "summaryCache", success, requestWS);
	};

	/*---------------------Business Impact page-------------------------*/
	this.getTrackSummaryDataBI = function(reqData, success, fail) {
		var cacheKey = "BIM" + JSON.stringify(reqData);
		var requestWS = postRequestWS(
				RequestConstantsFactory['TRAC_URL'].GET_SUMMARY, 
				reqData,
				success, 
				fail,
				function(result) {
					var cData = DataConversionService.toGetTrackSummaryDataBI(result);
					StorageService.put(cacheKey, cData, StorageService.getCache("business-impactCache"));
					return cData;
				}
		);
		sendRequest(cacheKey, "business-impactCache", success, requestWS);
	};

	this.getBusinessImpactTrendData = function(reqData, success, fail) {
		
		var cacheKey = "BITrend" + JSON.stringify(reqData);

		var requestWS = postRequestWS(
				RequestConstantsFactory['TRAC_URL'].GET_BI_DATE_BY_TIME, 
				reqData,
				success, 
				fail,
				function(result) {
					var cData = DataConversionService.toBusinessImpactTrend(result);
					StorageService.put(cacheKey, cData, StorageService.getCache("business-impactCache"));
					return cData;
				}
		);
		sendRequest(cacheKey, "business-impactCache", success, requestWS);
	};

	this.getBusinessImpactDeepDiveTableData = function(reqData, success, fail) {
		var cacheKey = "BID" + JSON.stringify(reqData);
		var requestWS = postRequestWS(
		RequestConstantsFactory['TRAC_URL'].GET_BI_DATA_USER, 
		reqData,
		success, 
		fail,
		function(result) {
		cData = DataConversionService.toGetBusinessImpactDeepDiveTableData(result);
		StorageService.put(cacheKey, cData, StorageService.getCache("business-impactCache"));
		return cData;
		}
		);
		sendRequest(cacheKey, "business-impactCache", success, requestWS);
//		var result = {"status":"OK","message":"Request Processed Successfully","groupBy":"userGroup","timeRanges":[{"periodFrom":"11012014","periodTo":"11302014","periodName":"byWeek","reportingInterval":"daily","data":[{"userGroupId":"UserGroup1","userGroupName":"User Group 1","wtdActual":698,"curWeekForecast":1290,"curWeekTarget":1395,"diffFromTarget":84,"versusLastWeek":7,"versusLastWeekTrend":"up","versusLastYear":98,"versusLastYearTrend":"up"},{"userGroupId":"UserGroup2","userGroupName":"User Group 2","wtdActual":420,"curWeekForecast":776,"curWeekTarget":839,"diffFromTarget":50,"versusLastWeek":4,"versusLastWeekTrend":"up","versusLastYear":59,"versusLastYearTrend":"up"},{"userGroupId":"UserGroup3","userGroupName":"User Group 3","wtdActual":480,"curWeekForecast":888,"curWeekTarget":960,"diffFromTarget":58,"versusLastWeek":5,"versusLastWeekTrend":"up","versusLastYear":67,"versusLastYearTrend":"up"},{"userGroupId":"UserGroup4","userGroupName":"User Group 4","wtdActual":856,"curWeekForecast":1584,"curWeekTarget":1713,"diffFromTarget":103,"versusLastWeek":9,"versusLastWeekTrend":"up","versusLastYear":120,"versusLastYearTrend":"up"},{"userGroupId":"UserGroup5","userGroupName":"User Group 5","wtdActual":655,"curWeekForecast":1211,"curWeekTarget":1309,"diffFromTarget":79,"versusLastWeek":7,"versusLastWeekTrend":"up","versusLastYear":92,"versusLastYearTrend":"up"}]},{"periodFrom":"11012014","periodTo":"11302014","periodName":"byMonth","reportingInterval":"weekly","data":[{"userGroupId":"UserGroup1","userGroupName":"User Group 1","wtdActual":2790,"curWeekForecast":5161,"curWeekTarget":5580,"diffFromTarget":335,"versusLastWeek":28,"versusLastWeekTrend":"up","versusLastYear":391,"versusLastYearTrend":"up"},{"userGroupId":"UserGroup2","userGroupName":"User Group 2","wtdActual":1678,"curWeekForecast":3105,"curWeekTarget":3357,"diffFromTarget":201,"versusLastWeek":17,"versusLastWeekTrend":"up","versusLastYear":235,"versusLastYearTrend":"up"},{"userGroupId":"UserGroup3","userGroupName":"User Group 3","wtdActual":1921,"curWeekForecast":3553,"curWeekTarget":3842,"diffFromTarget":231,"versusLastWeek":19,"versusLastWeekTrend":"up","versusLastYear":269,"versusLastYearTrend":"up"},{"userGroupId":"UserGroup4","userGroupName":"User Group 4","wtdActual":3426,"curWeekForecast":6337,"curWeekTarget":6851,"diffFromTarget":411,"versusLastWeek":34,"versusLastWeekTrend":"up","versusLastYear":480,"versusLastYearTrend":"up"},{"userGroupId":"UserGroup5","userGroupName":"User Group 5","wtdActual":2618,"curWeekForecast":4843,"curWeekTarget":5236,"diffFromTarget":314,"versusLastWeek":26,"versusLastWeekTrend":"up","versusLastYear":367,"versusLastYearTrend":"up"}]},{"periodFrom":"11012014","periodTo":"11302014","periodName":"quarterly","reportingInterval":"monthly","data":[{"userGroupId":"UserGroup1","userGroupName":"User Group 1","wtdActual":8370,"curWeekForecast":15485,"curWeekTarget":16741,"diffFromTarget":1004,"versusLastWeek":84,"versusLastWeekTrend":"up","versusLastYear":1172,"versusLastYearTrend":"up"},{"userGroupId":"UserGroup2","userGroupName":"User Group 2","wtdActual":5035,"curWeekForecast":9315,"curWeekTarget":10071,"diffFromTarget":604,"versusLastWeek":50,"versusLastWeekTrend":"up","versusLastYear":705,"versusLastYearTrend":"up"},{"userGroupId":"UserGroup3","userGroupName":"User Group 3","wtdActual":5763,"curWeekForecast":10661,"curWeekTarget":11526,"diffFromTarget":692,"versusLastWeek":58,"versusLastWeekTrend":"up","versusLastYear":807,"versusLastYearTrend":"up"},{"userGroupId":"UserGroup4","userGroupName":"User Group 4","wtdActual":10277,"curWeekForecast":19011,"curWeekTarget":20553,"diffFromTarget":1233,"versusLastWeek":103,"versusLastWeekTrend":"up","versusLastYear":1439,"versusLastYearTrend":"up"},{"userGroupId":"UserGroup5","userGroupName":"User Group 5","wtdActual":7854,"curWeekForecast":14530,"curWeekTarget":15708,"diffFromTarget":943,"versusLastWeek":79,"versusLastWeekTrend":"up","versusLastYear":1100,"versusLastYearTrend":"up"}]},{"periodFrom":"11012014","periodTo":"11302014","periodName":"yearly","reportingInterval":"monthly","data":[{"userGroupId":"UserGroup1","userGroupName":"User Group 1","wtdActual":33482,"curWeekForecast":61941,"curWeekTarget":66964,"diffFromTarget":4018,"versusLastWeek":335,"versusLastWeekTrend":"up","versusLastYear":4687,"versusLastYearTrend":"up"},{"userGroupId":"UserGroup2","userGroupName":"User Group 2","wtdActual":20142,"curWeekForecast":37261,"curWeekTarget":40283,"diffFromTarget":2417,"versusLastWeek":201,"versusLastWeekTrend":"up","versusLastYear":2820,"versusLastYearTrend":"up"},{"userGroupId":"UserGroup3","userGroupName":"User Group 3","wtdActual":23051,"curWeekForecast":42644,"curWeekTarget":46102,"diffFromTarget":2766,"versusLastWeek":231,"versusLastWeekTrend":"up","versusLastYear":3227,"versusLastYearTrend":"up"},{"userGroupId":"UserGroup4","userGroupName":"User Group 4","wtdActual":41106,"curWeekForecast":76046,"curWeekTarget":82213,"diffFromTarget":4933,"versusLastWeek":411,"versusLastWeekTrend":"up","versusLastYear":5755,"versusLastYearTrend":"up"},{"userGroupId":"UserGroup5","userGroupName":"User Group 5","wtdActual":31417,"curWeekForecast":58121,"curWeekTarget":62834,"diffFromTarget":3770,"versusLastWeek":314,"versusLastWeekTrend":"up","versusLastYear":4398,"versusLastYearTrend":"up"}]}]};
//		var cData = DataConversionService.toGetBusinessImpactDeepDiveTableData(result);
//		success(cData);
	};


	/*---------------------Engagement Activity page-------------------------*/

	this.getEngagementActivityScoreData = function(reqData, success, fail) {

		var cacheKey = "EAScore" + JSON.stringify(reqData);
		var requestWS = postRequestWS(
				RequestConstantsFactory['TRAC_URL'].GET_EA_SCORE, 
				reqData,
				success, 
				fail,
				function(result) {
					var cData = DataConversionService.toGetEngagementActivityScoreData(result);
					StorageService.put(cacheKey, cData, StorageService.getCache("engagement-activityCache"));
					return cData;
				}
		);
		sendRequest(cacheKey, "engagement-activityCache", success, requestWS);
	};

	this.getTrackSummaryEngagementActivity = function(reqData, success, fail) {
		var cacheKey = "EAM" + JSON.stringify(reqData);

		var requestWS = postRequestWS(
				RequestConstantsFactory['TRAC_URL'].GET_SUMMARY, 
				reqData,
				success, 
				fail,
				function(result) {
					var cData = DataConversionService.toGetTrackSummaryEngagementActivity(result);
					StorageService.put(cacheKey, cData, StorageService.getCache("engagement-activityCache"));
					return cData;
				}
		);
		sendRequest(cacheKey, "engagement-activityCache", success, requestWS);
	};

	this.getEngagementActivityTrendData = function(reqData, success, fail) {
		var cacheKey = "EATrend" + JSON.stringify(reqData);
		var requestWS = postRequestWS(
				RequestConstantsFactory['TRAC_URL'].GET_EA_SCORE, 
				reqData,
				success, 
				fail,
				function(result) {
					var cData = DataConversionService.toGetEngagementActivityTrendData(result);
					StorageService.put(cacheKey, cData, StorageService.getCache("engagement-activityCache"));

					return cData;
				}
		);
		sendRequest(cacheKey, "engagement-activityCache", success, requestWS);
	};

	this.getEngagementActivityDeepDiveData = function(reqData, success, fail) {

		var cacheKey = "EADD" + JSON.stringify(reqData);
		var requestWS = postRequestWS(
				RequestConstantsFactory['TRAC_URL'].GET_EA_HEAT_MAP, 
				reqData,
				success, 
				fail,
				function(result) {
					StorageService.put(cacheKey, result, StorageService.getCache("engagement-activityCache"));
					return result;
				}
		);
		sendRequest(cacheKey, "engagement-activityCache", success, requestWS);
	};

	this.getTrackModuleEngagementTableData = function(reqData, success, fail) {
		var cacheKey = "EAMC" + JSON.stringify(reqData);
		var converted = false;
		var requestWS = postRequestWS(
				RequestConstantsFactory['TRAC_URL'].GET_EA_DATA_MODULE, 
				reqData,
				success, 
				fail,
				function(result) {
					var cData = DataConversionService.toGetTrackModuleEngagementTableData(result);
					StorageService.put(cacheKey, cData, StorageService.getCache("engagement-activityCache"));
					return cData;
				}
		);
		sendRequest(cacheKey, "engagement-activityCache", success, requestWS);
	};

	/*---------------------User Engagement page-------------------------*/
	this.getTrackSummaryUserGroup = function(reqData, success, fail) {
		var cacheKey = "UGS" + JSON.stringify(reqData);

		var requestWS = postRequestWS(
				RequestConstantsFactory['TRAC_URL'].GET_GRP_SUMMARY, 
				reqData,
				success, 
				fail,
				function(result) {
					var cData = DataConversionService.toUserGroupSummary(result);
					StorageService.put(cacheKey, cData, StorageService.getCache("user-group-engagementCache"));
					return cData;
				}
		);
		sendRequest(cacheKey, "user-group-engagementCache", success, requestWS);
	};



	this.getUserSettings = function(groupBy, success, fail) {
		var reqData = {
				"mode":"free",
		};
		reqData["groupBy"] = groupBy;
		//not using request as key on purpose
		var cacheKey = groupBy + "userSettings";
		var requestWS = postRequestWS(
				RequestConstantsFactory['TRAC_URL'].GET_USER_SETTINGS, 
				reqData,
				success, 
				fail,
				function(result) {
					var cData = result;
					StorageService.put(cacheKey, cData, StorageService.getCache("user-settingsCache"));
					return cData;
				}
		);
		sendRequest(cacheKey, "user-settingsCache", success, requestWS);
	}

	this.saveUserSettings = function(groupBy, data, success,fail) {
		var cacheKey = groupBy + "userSettings";
		//clear out the cache on save. so that data get updated on reload
		StorageService.remove(cacheKey, StorageService.getCache("user-settingsCache"));
		NetworkService.post(RequestConstantsFactory['TRAC_URL'].POST_USER_SETTINGS, data).then(function(result) {
			success(result);
		}, function(response) {
			if(fail instanceof Function) {
				fail(response);
			}
		});
	}


	this.getUserGroupTrendData = function(reqData, success, fail) {
		var cacheKey = "UGTrend" + JSON.stringify(reqData);

		var requestWS = postRequestWS(
				RequestConstantsFactory['TRAC_URL'].GET_GRP_ACQUISITION_TREND, 
				reqData,
				success, 
				fail,
				function(result) {
					var cData = DataConversionService.toGetUserGroupTrendData(result);
					StorageService.put(cacheKey, cData, StorageService.getCache("user-group-engagementCache"));
					return cData;
				}
		);
		sendRequest(cacheKey, "user-group-engagementCache", success, requestWS);
	};

	this.getUserGroupDeepDiveData = function(reqData , success, fail) {
		console.log('API CALLL')
		var cacheKey = "UGDD" + JSON.stringify(reqData);
		var converted = false;
		var selectedPeriodData = {};
		var groupDetails = [];
		var requestWS = function() {
			NetworkService.post(RequestConstantsFactory['TRAC_URL'].GET_GRP_DETAILS, reqData).then(function(result){
				if(!result)
					throw {message: "No Response from Server!", type: "internal"};
					var cData = result;
					StorageService.put(cacheKey+reqData.groupBy, cData, StorageService.getCache("user-group-engagementCache"));
					$.each(result.timeRanges, function(key, obj) {
						if(obj.periodName == $rootScope.selectedPeriod){
							$.each(obj.data, function(id, value) {
								selectedPeriodData = {};
								selectedPeriodData = DataConversionService.toGetDeepDiveTableData(value.groupDetails);
								if(reqData.groupBy == 'cmpgnView'){
									$rootScope.$broadcast('CampaignData',obj);
								}
								converted = true;
								groupDetails.push(groupDetails);
							});

						}
					});
					if(!converted){
						//throw {message: "No Data for selected time period!", type: "internal"}
						fail(RequestConstantsFactory['ERROR_MSGS'].NETWORK_ERR);
					}
					if(success instanceof Function)
						success(selectedPeriodData);
			}, function(response) {
				if(fail instanceof Function) {
					fail(response);
				}
			}).catch(function(e){
				fail(RequestConstantsFactory['ERROR_MSGS'].DATA_ERR);
				//UtilitiesService.throwError(e);
			});

		}
		try{
			var dataInfo = StorageService.info(cacheKey+reqData.groupBy, StorageService.getCache("user-group-engagementCache"));
			var data = StorageService.getCache("user-group-engagementCache").get(cacheKey+reqData.groupBy);
			if(!dataInfo) {
				requestWS();
			}
			else{
				$.each(result.timeRanges, function(key, obj) {
					if(obj.periodName == $rootScope.selectedPeriod){
						$.each(obj.data, function(id, value) {
							selectedPeriodData = {};
							selectedPeriodData = DataConversionService.toGetDeepDiveTableData(value.groupDetails);
							if(reqData.groupBy == 'cmpgnView'){
								$rootScope.$broadcast('CampaignData',obj);
							}
							converted = true;
							groupDetails.push(selectedPeriodData);
						});

					}
				});
				if(!converted){
					//throw {message: "No Data for selected time period!", type: "internal"}
					fail(RequestConstantsFactory['ERROR_MSGS'].NETWORK_ERR);
				}
				if(success instanceof Function) {
					success(groupDetails);
				}
			}
		} catch(e) {
			fail(RequestConstantsFactory['ERROR_MSGS'].DATA_ERR);
			//UtilitiesService.throwError({message: "Not found in Cache!", type: "internal"});
			$timeout(requestWS, 1000);
		}
	}

}]);






