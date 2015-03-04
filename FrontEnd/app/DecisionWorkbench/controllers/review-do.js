angular.module('DecisionWorkbench')

.controller("reviewDoInit",['$scope','DataService','CustomService','ChartOptionsService','$rootScope',
                            function($scope, DataService, CustomService,ChartOptionsService, $rootScope) {
	// In common.js - DWPageChange
	$rootScope.$broadcast('DWPageChange', "changed");

	angular.element(document).ready(function() {
		var chartOBJ = {};
		CustomService.appInit();
		setTimeout(function() {
			CustomService.appInit();
		}, 1);
	});

}])
.controller("reviewChartController",['$scope','DataService','UtilitiesService','CustomService','chartsService','ChartOptionsService','RequestConstantsFactory','$rootScope','DataConversionService',
                                     function($scope, DataService, UtilitiesService, CustomService, chartsService, ChartOptionsService, RequestConstantsFactory, $rootScope, DataConversionService) {
	var errorConstants = RequestConstantsFactory['ERROR_MSGS'];
	var requestData = {
			"groupBy" : "cmpgnView",
	};
	var plotLine = [];
	var plotValues = {};
	var plotLinesOptions = {};
	var utilData = UtilitiesService.getRequestData();
	requestData = angular.extend({}, utilData, requestData);
	$scope.showReviewChart = false;
	var buildDoChartOptions = ChartOptionsService.getBuildDoData();
	var reviewDoBubbleChart = ChartOptionsService.getReviewDoBubbleData();
	$scope.success = function(builddoChart) {
		$scope.currentAchievableChart = builddoChart;
		try {
			$scope.error = false;
			var buildDoChartOptions = ChartOptionsService.getBuildDoData();
			chartsService.waterfall.call($("#reviewChart"),builddoChart['paidUsers'][$rootScope.selectedPeriod],
					buildDoChartOptions, $scope);
			$scope.$on('doInitialSelected',function(index,data,selectedIndex){
				console.log("doInitialSelected")
				$scope.showReviewChart = true;
				$scope.currentData = data.doList;
				window.selectedIndex = selectedIndex;
				var selectedPeriod = $rootScope.selectedPeriod;
				var bubbleData = DataConversionService.toGetReviewDoBubble($scope.currentData, selectedIndex);
				$.each(bubbleData, function(key, effort) {
					if (key != 'category') {
						plotValues = {
								color : '#6B7B93',
								dashStyle : 'longdashdot',
								value : effort.time,
								width : '1'
						}
					}
					plotLine.push(plotValues);
				});
				plotLinesOptions['xAxis'] = {
						plotLines : plotLine
				};
				$.extend(true, reviewDoBubbleChart, plotLinesOptions);
				var achievableUplift = DataConversionService.toGetAchievableUplift($scope.currentData, selectedIndex, $scope.currentAchievableChart['paidUsers']);
				buildDoChartOptions.xAxis.categories[4] = "Conv Uplift " + selectedIndex;
				var chartOBJ = chartsService.waterfall.call($("#reviewChart"), achievableUplift, buildDoChartOptions, $scope);
				var bubbleOBJ = chartsService.bubbleChart.call($("#reviewBubbleChart"), bubbleData, reviewDoBubbleChart, $scope);
				setTimeout(function(){
					$rootScope.$broadcast('chartLoaded')
				},1);
			})
			setTimeout(function(){
				$rootScope.$broadcast('reviewChartLoaded')
			},1);

		} catch (e) {
			$scope.fail(errorConstants.DATA_ERR);
		}
	}
	$scope.fail = function (msg) {
		$rootScope.$emit('reviewChartError');
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
		var func = $scope.success;
		DataService.getBuildDoChartData(requestData, func,
				$scope.fail);
	}
	loadData();
	$scope.$on('doSelected', add);
	function add(index, data, selectedIndex) {
		$scope.showReviewChart = true;
		$scope.currentData = data.doList;
		window.selectedIndex = selectedIndex;
		var selectedPeriod = $rootScope.selectedPeriod;
		var bubbleData = DataConversionService.toGetReviewDoBubble($scope.currentData, selectedIndex);
		$.each(bubbleData, function(key, effort) {
			if (key != 'category') {
				plotValues = {
						color : '#6B7B93',
						dashStyle : 'longdashdot',
						value : effort.time,
						width : '1'
				}
			}
			plotLine.push(plotValues);
		});
		plotLinesOptions['xAxis'] = {
				plotLines : plotLine
		};
		$.extend(true, reviewDoBubbleChart, plotLinesOptions);
		console.log("reviewDoBubbleChart", reviewDoBubbleChart)
		var achievableUplift = DataConversionService.toGetAchievableUplift($scope.currentData, selectedIndex, $scope.currentAchievableChart['paidUsers']);
		buildDoChartOptions.xAxis.categories[4] = "Conv Uplift " + selectedIndex;
		var chartOBJ = chartsService.waterfall.call($("#reviewChart"), achievableUplift, buildDoChartOptions, $scope);
		var bubbleOBJ = chartsService.bubbleChart.call($("#reviewBubbleChart"), bubbleData, reviewDoBubbleChart, $scope);
	}
}])

.controller( "reviewDoTableController",['$scope','$element','$rootScope','DataService','UtilitiesService','RequestConstantsFactory','DataConversionService','sharedProperties',
                                        function($scope, $element, $rootScope, DataService,	UtilitiesService, RequestConstantsFactory, DataConversionService, sharedProperties) {
	var errorConstants = RequestConstantsFactory['ERROR_MSGS'];
	var rowOld = 0;
	var count=0;
	$scope.options = UtilitiesService.getDataTableOptions();
	var tableOptions = {
			aoColumnDefs: [{
				"bSortable": false,
				"aTargets": [0,1,2,3,4,5,6,7,8,9,10,11]

			}]
	}
	$.extend(true, $scope.options, tableOptions);
	$scope.classOptions = {
			"aoColumns" : [
			               null,
			               null,
			               null,
			               null,
			               null,
			               null,
			               null,
			               null,
			               null,
			               null,
			               {
			            	   "sClass" : "",
			            	   "fnCreatedCell" : function(nTd, sData, oData, iRow, iCol) {  
			            		   $(nTd).attr('user-data', 'userData').attr('my-tooltip', '');  
			            	   }
			               }, {
			            	   "sClass" : ""
			               } ],
			               "fnRowCallback": function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
			            	   if(aData.length!=0){
			            		   if(aData[0].indexOf("Expired") > -1){
			            			   $(nRow).addClass("expiredDO");
			            		   }
			            	   }
			            	   /*window.Table = this;
						            	console.log("nRow", nRow)
						            	var isFirstRow = $(nRow).find('td:nth-child(1)').attr('rowspan');
						            	console.log('ROWSP', isFirstRow, aData.length);
						            	if($(nRow).find('td').length == 12){
						            		var DOLength = $(nRow).find('td:nth-child(1)').html().split(',').length;
							            	if(rowOld != aData[0]){
							            		$(nRow).find('td').attr('rowspan', '1');
							            		$(nRow).find('td:nth-child(12)').attr('rowspan', DOLength);
							            		$(nRow).find('td:nth-child(11)').attr('rowspan', DOLength);
							            		$(nRow).find('td:nth-child(10)').attr('rowspan', DOLength);
							            		$(nRow).find('td:nth-child(9)').attr('rowspan', DOLength);
							            		$(nRow).find('td:nth-child(2)').attr('rowspan', DOLength);
							            		$(nRow).find('td:nth-child(1)').attr('rowspan', DOLength);
							            	}else{
							            		$(nRow).find('td:nth-child(12)').remove();
								            	$(nRow).find('td:nth-child(11)').remove();
								            	$(nRow).find('td:nth-child(10)').remove();
								            	$(nRow).find('td:nth-child(9)').remove();
								            	$(nRow).find('td:nth-child(2)').remove();
								            	$(nRow).find('td:nth-child(1)').remove();
							            	}
							            	rowOld = aData[0];
						            	}
			            	    */
			               }

	};
	$rootScope.$on('updateDO', function(event, tableData) {
		$scope.addData(tableData);
	});
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
	$rootScope.$on('reviewChartError',function(){
		$scope.fail(errorConstants.DATA_ERR);
	})
	$.extend(true, $scope.options, $scope.classOptions);
	//$scope.$on('reviewChartLoaded', function () {
	var errorConstants = RequestConstantsFactory['ERROR_MSGS'];
	$scope.dataLoaded = false;
	var actualData = [];
	window.selectedIndex = [];

	$scope.addData = function(data) {
		$scope.dataLoaded = true;
		actualData = data;
		prepareTableData(data);
	};

	function prepareTableData(data) {
		try {
			$scope.error = false;
			$scope.options.aaData = [];
			var defaultIndex = [];
			$.each(
					data.doList,
					function(key, obj) {
						var doId = obj.doId;
						var targetConvActivityListText = '';
						var userGroupListText = '';
						var channelListText = '';
						var cost = "";
						var usersTargeted = '';
						var campaignDuration = '';
						if(obj.doId == data.doList[0].doId){
							$scope.actionChecked = true;
						}
						else{
							$scope.actionChecked = false;
						}
						var activateClass = obj.activate ? "'switch actBtnSwitch on '": "'switch actBtnSwitch'";

						//Permission check for editing Activate column
						if($scope.isDOResponsibilityEditable){
							var activateColumn = "<div class="
								+ activateClass
								+ "><a href='#' data-modal='responsibiltyModal' ng-click=\"tableData.activateClicked('"
								+ obj.doId
								+ "')\" data-id='"
								+ obj.doId
								+ "'  rel='activateBtn'></a><span class='num'>Yes</span>"
								+ "<span class='per'>No</span></div>";
						}else{
							//No value will make the column empty
							var activateColumn = '';
						}

						//Permission check for editing DO Cost
						if($scope.isDOResponsibilityEditable){
							var costEditClass = "editleft";
						}else{
							//No class name will make the edit icon disappear
							var costEditClass = '';
						}

						// should be removed once
						// approval image is shown
						obj.approval = "Yes";
						$scope.reviewData = obj.approvalStatus;

						if(obj.isEdited){
							doId = obj.doId + " (Edited)";
						}
						if(obj.isExpired){
							doId = obj.doId + " (Expired)";
						}

						$.each(obj.targetConvActivityListText, function(key, value){
							targetConvActivityListText += "<div class='rowSplit'>"+obj.targetConvActivityListText[key]+"</div>";
							userGroupListText += "<div class='rowSplit'>"+obj.userGroupListText[key]+"</div>";
							channelListText += "<div class='rowSplit'>"+obj.channelListText[key]+"</div>";
							cost += "<div class='rowSplit'>"+obj.cost[key]+"</div>";
							usersTargeted += "<div class='rowSplit'>"+obj.usersTargeted[key]+"</div>";
							campaignDuration +="<div class='rowSplit'>"+obj.campaignDuration[key]+"</div>";
						})
						//Pushing the data into the table
						$scope.options.aaData
						.push([
						       doId,
						       "<img src='images/arrow-up-green.png' />"
						       + obj.expectedNewSub
						       + ","
						       + obj.convUplift.value,
						       targetConvActivityListText,
						       userGroupListText,
						       channelListText,
						       usersTargeted,
						       cost,
						       campaignDuration,
						       activateColumn,
						       obj.responsibility,
						       obj.approval,
						       "<a href='#' data-modal='#modifyReviewdoDialog' data-id='"
						       + obj.doId
						       + "'  name='modal' class="+costEditClass+" title='Edit'></a> <input type='checkbox'  id='DOReview_"
						       + obj.doId
						       + "' data-id='"
						       + obj.doId 
						       + "' ng-checked='"+$scope.actionChecked+"' ng-click=\"tableData.getReviewDONumber('"
						       + obj.doId
						       + "')\"/>" ]);
					})
					defaultIndex.push(data.doList[0].doId);
			$rootScope.$broadcast('doInitialSelected', actualData, defaultIndex);
		} catch (e) {
			$scope.fail(errorConstants.DATA_ERR);
		}

	}

	$scope.activateClicked = function(id) {
		$rootScope.$broadcast('activated', id);
		var element = $('[data-id="' + id + '"]');
		if (element.closest('div').hasClass('deactivated')) {
			e.preventDefault();
			return false;
		}
		if (!element.closest('div').hasClass('on')) {
			// Get the screen height and width
			var maskHeight = $(document).height();
			var maskWidth = $(window).width();

			// Set height and width to mask to fill up the whole
			// screen
			$('#mask').css({
				'width' : maskWidth,
				'height' : maskHeight
			});

			// transition effect
			$('#mask').fadeIn(1000);
			$('#mask').fadeTo("slow", 0.8);

			// Get the window height and width
			var winH = $(window).height();
			var winW = $(window).width();

			var responsibiltyModal = $('#responsibiltyModal');
			// Set the popup window to center
			responsibiltyModal.css('top', winH / 2 - responsibiltyModal.height() / 2);
			responsibiltyModal.css('left', winW / 2 - responsibiltyModal.width() / 2);

			// transition effect
			responsibiltyModal.fadeIn(2000);
		}
	}

	$scope.getReviewDONumber = function(doId) {
		$.each(actualData.doList, function(key, data) {
			if (doId == data.doId) {
				if ($('[id="DOReview_'+doId+'"]').is(':checked')) {
					selectedIndex.push(doId);
				} else {
					var count = 0;
					selectedIndex.forEach(function(index) {
						if (index == doId)
							selectedIndex.splice(count);

						count++;
					});

				}
			}
		});
		$rootScope.$broadcast('doSelected', actualData, selectedIndex);
	}
	$scope.tableFunctions = {
			activateClicked : $scope.activateClicked,
			getReviewDONumber : $scope.getReviewDONumber
	}

	$rootScope.$on('reviewDOFilterClicked', function(){
		$scope.filterSearchResults();
	});

	$scope.filterSearchResults = function() {
		prepareTableData($rootScope
				.filterDataBySelectedOptions(actualData));
	}

	
	function loadDecisionOptionsTable() {
		if(sharedProperties.getReviewDORequest()){
			console.log("ppp here", sharedProperties.getReviewDORequest())
			var requestData = sharedProperties.getReviewDORequest();
		}else{
			var requestData = {
					"doIdList" : [],
					"filter" : "executed",
					"periodName" : $rootScope.selectedPeriod
			};
		}

		sharedProperties.setReviewDORequest('');
		console.log("ppp requestData:", requestData)
		var cacheKey = "ReviewDoTable" + JSON.stringify(requestData);
		var func = $scope.addData;
		if (arguments[1]) {
			if (arguments[1].key == cacheKey) {
				func = null;
			} else {
				return false;
			}
		}
		DataService.getDecisionOptionsTableData(requestData, func, $scope.fail);
	}

	loadDecisionOptionsTable();
	$scope.$on('periodChange', function(event, period) {
		loadDecisionOptionsTable(actualData);
	});
	//});
}])

.controller("reviewdoModalController",['$scope','$rootScope','DataService','RequestConstantsFactory','DataConversionService','UtilitiesService',
                                       function($scope, $rootScope, DataService, RequestConstantsFactory, DataConversionService, UtilitiesService) {

	var errorConstants = RequestConstantsFactory['ERROR_MSGS'];
	$scope.MAX_APPROVERS = [ 1, 2, 3, 4, 5 ];
	$scope.noOfApprovers = 3;
	$scope.savingDO = false;
	var requestConstants = RequestConstantsFactory['NOTIFICATION'];

	var decisionId = 5;
	$rootScope.$on('reviewdoModify', function(object, doId) {
		$scope.error = false;
		$scope.showError = false;
		$scope.savingDO = false;
		decisionId = doId;
		loadModalData();
	})
	$scope.$on('activated', function(object, doId) {
		$scope.activateId = doId;
		loadModalData();
	})

	$scope.success = function(reviewModalData) {
		try{
			$.each(reviewModalData.doList, function(key, eachData) {
				var costs = [];
				var campaignDurations = [];
				if (eachData.doId == decisionId) {
					$scope.editDoId = eachData.doId.split(',');
					$scope.channels = eachData.channelListText;

					$.each(eachData.cost, function(key, value){
						costs.push(UtilitiesService.getIntFromString(eachData.cost[key]));
						campaignDurations.push(UtilitiesService.getIntFromString(eachData.campaignDuration[key]));
					})
					$scope.costs = costs;
					$scope.campaignDurations = campaignDurations;
				}
			});
			$scope.$apply();
		}
		catch(e){
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
	$scope.saveReviewCost = function() {
		var reqDoEditSave = [];
		$scope.savingDO = true;
		if (!modifyReviewDoForm.checkValidity()) {
			$scope.savingDO = false;
			return false;
		}

		$.each($scope.editDoId, function(key, id){
			var tempObj = {
					"doId" : $scope.editDoId[key], 
					"cost" : $scope.costs[key],
					"channel": $scope.channels[key],
					"campaignDuration" : $scope.campaignDurations[key]
			}
			reqDoEditSave.push(tempObj);
		})
		//updateDO(reqDoSaveCost);
	};
	$scope.saveApprovers = function() {
		var requestData = {};
		var listOfApprovers = [];
		var responsibility;
		var noOfApprovers;

		$.each($('#responsibiltyModal #responsibility'), function(key, text) {
			responsibility = text.value;
		});
		$.each($('#responsibiltyModal .approver'), function(key, text) {
			var tempObj = {
					"approverId" : text.id,
					"approverName" : text.value,
					"periodName" : $rootScope.selectedPeriod
			};
			listOfApprovers.push(tempObj);

		});
		$.each($('#responsibiltyModal #approversCount'), function(key, text) {
			noOfApprovers = text.value;
		});
		requestData['doId'] = $scope.activateId;
		requestData['responsibility'] = responsibility;
		requestData['noOfApprovers'] = noOfApprovers;
		requestData['listOfApprovers'] = listOfApprovers;
		updateDO(requestData);
	};
	$scope.updateSuccess = function(reviewdoTableData) {
		if (reviewdoTableData.status == 'OK') {
			UtilitiesService.getNotifyMessage( "Activated Successfully", requestConstants.SUCCESS);
			$scope.savingDO = false;
			$rootScope .$broadcast('updateDO', reviewdoTableData);
			$scope.showError = false;
			$('#mask, .window').hide();
		} else {
			$scope.showError = true;
		}

	}
	function updateDO(requestData) {

		var requestData = {};
		var func = $scope.updateSuccess;
		if (arguments[1]) {
			if (arguments[1].key == cacheKey) {
				func = null;
			} else {
				return false;
			}
		}
		DataService.updateDO(requestData, func, $scope.fail);
	}

	function loadModalData() {
		var requestData = {};
		var func = $scope.success;
		if (arguments[1]) {
			if (arguments[1].key == cacheKey) {
				func = null;
			} else {
				return false;
			}
		}
		DataService.getDecisionOptionsTableData(requestData, func, $scope.fail);
	}
}])
