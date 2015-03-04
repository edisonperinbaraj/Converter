angular.module('AnalyticsApp')

.service("UtilitiesService",['StorageService','$rootScope','sharedProperties','RequestConstantsFactory','labelConfigService', function (StorageService, $rootScope, sharedProperties,RequestConstantsFactory,labelConfigService) {

    this.initStorage = function () {
        var views = ["summary", "user-settings", "business-impact", "engagement-activity", "channel-tracker", "campaign-tracker", "user-group-engagement", "decision-workbench-index", "decision-workbench-builddo", "decision-workbench-reviewdo", "settingsData", "settingsChannels", "settingsGoals", "settingsModels", "settingsUsers", "settingsAuditTrail"];

        $.each(views, function (index, eachView) {
            StorageService.getCache(eachView + "Cache") || StorageService.createCache(eachView + "Cache", function (key, value, done) {
                //Function to execute on Expiry
                console.log("CACHE Expired " + key);
                var expiredCache = {
                    key: key,
                    value: value
                };
                $rootScope.$broadcast('onCacheExpiry', expiredCache);
            });
        });
    }


	this.sendRequest = function(cacheKey, cacheName, success, requestWS, scope, noDelay) {
		try {
			var dataInfo = StorageService.info(cacheKey, StorageService.getCache(cacheName));
			var data = StorageService.get(cacheKey, StorageService.getCache(cacheName));
			if(!dataInfo) {
				requestWS();
			} else {
				if(success instanceof Function) {
					success(data);
				}
			}
		} catch(e) {
			UtilitiesService.throwError(scope, {message: "Not found in Cache!", type: "internal"});
			if(!noDelay)
				$timeout(requestWS, 1000);
		}
	}
	
	//Checks if the source array contains all the destination array
	this.containsAll = function(source, dest){
		if(dest.length != source.length) {
			return false;
		}
		for(var i = 0 , len = dest.length; i < len; i++){
			if($.inArray(dest[i], source) == -1) {
				return false;
			}
		}
		return true;
	}
	
    this.getDataTableOptions = function () {
    	console.log("GETTING OPTIONS!!!")
        return {
            aoColumnDefs: [{
                "bSortable": true,
                "aTargets": [0, 1]

            }],
            bJQueryUI: false,
            bDestroy: true,
            bPaginate: true,
            bFilter: false,
            bInfo: false,
            bLengthChange: false,
            iDisplayLength: 5,
            aaData: [],
            dom: '<"dataTableContainer"t><"dataTablePaginateContainer"p>'
          //FOR EXPORT IN DATATABLE
            /* dom: 'T<"dataTableContainer"t><"dataTablePaginateContainer"p>',
            
           tableTools: {
            	sSwfPath : "js/lib/jquery/plugins/swf/copy_csv_xls_pdf.swf",
            	aButtons: [
            	                {
            	                    "sExtends":    "collection",
            	                    "sButtonClass": "path",
            	                    "sButtonText":'',
            	                    "aButtons":    [ "csv", "xls", "pdf" ]
            	                }
            	            ]
            }*/

        }
    }
    
    this.getLastWeek = function(today){
    	var now = moment();
        var dateDetails = moment(now).format('MM/DD/YYYY');
    }

    //returns the name of month from date
    this.dateFormatConvertor = function dateFormatConvertor(date) {
    	if(date){
    		if(date.indexOf('-')>-1) {
                var parts = date.split('-');
                var dateString = parts[0] + '/' + parts[1] + '/' + parts[2];
                return dateString;
        	}else {
        		return date;
        	}
    	}
    };
    
    this.sortObjectbyDate = function(object){
    	object.sort(function(a,b){
			  return new Date(a.forDateSorting) - new Date(b.forDateSorting);
			});
    }
    
    this.dateFormatConverterYearFirst = function(date){
    	var parts = date.split('/');
    	var dateString = parts[2] + '-' + parts[0] + '-' + parts[1];
    	return dateString;
    }
    
    this.getMonthName = function (date) {

        var monthName = moment(date).format('YYYY/MMM/DD').split("/");
        return monthName[1];

    };
    this.getMonthNumber = function (date) {
        var monthName = moment(date).format('YYYY/M/DD').split("/");
        return monthName[1];

    };
    this.getDay = function (date) {
        var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        return days[date.getDay()];
    }
    this.getYear = function (date) {
        var year = moment(date).format('MMM/DD/YYYY').split("/");
        return year[2];
    }
    this.getDateInNumber = function (date) {
        var dateInNumber = moment(date).format('MMM/DD/YYYY').split("/");
        return dateInNumber[1];
    }
    this.getTodayDetails = function () {
        var now = moment();
        var dateDetails = moment(now).format('MMM/DD/YYYY').split("/");
        return dateDetails;
    }
    //returns week number in a month from date

    this.getWeekOfMonth = function (date) {
        var firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
        var weekNumber = Math.ceil((date.getDate() + firstDay) / 7);
        return RequestConstantsFactory['DATE'].WEEK_LABLES[weekNumber-1];

    };
    this.getStartOfWeek = function (date) {
        var day = date.getDay();
        var startOfWeek = moment(date).weekday(day).format('YYYY/MMM/DD');
        var monthName = moment(startOfWeek).format('YYYY/MMM/DD').split("/");
        return monthName[1] + " " + monthName[2];
    }
    this.getEndOfWeek = function (date) {
        var startDay = date.getDay();
        var endDay = startDay + 6;
        endOfWeek = moment(date).weekday(endDay).format('YYYY/MMM/DD');
        var monthName = moment(endOfWeek).format('YYYY/MMM/DD').split("/");
        return monthName[1] + " " + monthName[2];
    }
    this.getChartLabelEndDate = function (periodName, date) {
    	var now = moment();
        if(periodName == window.appConstants.PERIOD_NAME_WEEK){
        	var endDate = moment(date).weekday(date.getDay()+6).format(window.appConstants.CHART_LABEL_DATE_FORMAT);
        	return endDate;
        }else if(periodName == window.appConstants.PERIOD_NAME_MONTH){
        	var endDate = moment(date).endOf('month').format(window.appConstants.CHART_LABEL_DATE_FORMAT);
        	return endDate;
        }else if(periodName == window.appConstants.PERIOD_NAME_QUARTER){
        	var endDate = moment(date).endOf('quarter').format(window.appConstants.CHART_LABEL_DATE_FORMAT);
        	return endDate;
        }else if(periodName == window.appConstants.PERIOD_NAME_YEAR){
        	var endDate = moment(date).endOf('year').format(window.appConstants.CHART_LABEL_DATE_FORMAT);
        	return endDate;
        }
    }
this.getChartLabels = function (periodName, date) {
    	
        var now = moment();
        if (periodName == 'tooltipDate'){
        	var endDate = moment(date).weekday(date.getDay()+7).format(window.appConstants.DATE_FORMAT);
        	return endDate;
        }
        if (periodName == window.appConstants.PERIOD_NAME_WEEK) {
        	var thisWeekStart= moment(now).startOf('week').format('MM-DD-YYYY');
        	var dateHere = moment(date).weekday(date.getDay()).format('MM-DD-YYYY');
            if ((moment(date).diff(moment(thisWeekStart), 'day'))>=0 && (moment(date).diff(moment(thisWeekStart), 'day')) <7) {
                return "This Week";
            }
            else {
            	/*var monthNumber = this.getMonthNumber(date);
                var weekNumber = this.getWeekOfMonth(date);
                return monthNumber + weekNumber;*/
            	var fromMonthName = this.getMonthName(date);
            	var fromDate = moment(date).weekday(date.getDay()).format('MM-DD-YYYY').split('-');
            	var toMonthName = this.getMonthName(moment(date).weekday(date.getDay()+7));
            	var toDate = moment(date).weekday(date.getDay()+6).format('MM-DD-YYYY').split('-');
            	return fromMonthName+" "+fromDate[1] +"- " + toMonthName +" "+toDate[1];
            }
        }
        if (periodName == window.appConstants.PERIOD_NAME_MONTH) {
        	
        	var thisMonthStart= moment(now).startOf('month').format('MM-DD-YYYY');
            if (moment(thisMonthStart).diff(moment(date), 'month') == 0) {
                return "This Month";
            }
            else {
            	
                var month = this.getMonthName(date);
                var year = this.getYear(date);
                return month + " " + year;
            }
        }
        if (periodName == window.appConstants.PERIOD_NAME_QUARTER) {
        	var month = this.getMonthNumber(date);
         	var periodFrom = moment(date).subtract(month % 3, 'month').startOf('month').format('MM-DD-YYYY');
         	periodFrom = new Date(this.dateFormatConvertor(periodFrom));
            var periodTo = moment(date).add(2 - (month % 3), 'month').endOf('month').format('MM-DD-YYYY');
            periodTo = new Date(this.dateFormatConvertor(periodTo));
            var thisQuarterStart= moment(periodFrom).startOf('month').format('MM-DD-YYYY');
	        if((moment(periodFrom)<= moment(now)) && (moment(now)<= moment(periodTo))) {
	        	return "This Quarter";
	        }
	        else{
	            var startMonth= this.getMonthName(periodFrom);
	            var endMonth = this.getMonthName(periodTo);
	            var startYear = this.getYear(periodFrom);
	            var endYear = this.getYear(periodTo);
	            return startMonth+" "+startYear +"- " + endMonth +" "+endYear;
	        }
           
        }
        if (periodName == window.appConstants.PERIOD_NAME_YEAR) {
        	var thisYearStart= moment(now).startOf('year').format('MM-DD-YYYY');
            if (moment(thisYearStart).diff(moment(date), 'year') == 0) {
                return "This Year";
            }
            else {
                var year = this.getYear(date);
                return  year;
            }
        }
    }
    this.getLocaleString = function (data) {
        var numberRegex = "^[0-9]*$";

        switch (typeof (data)) {
            case "boolean":
                {
                    return data;
                    break;
                }
            case "number":
                {
                    return data.toLocaleString();
                    break;
                }

            case "object":
                {
                    $.each(data, function (index, column) {

                        switch (typeof (column)) {
                            case "number":
                                {
                                    data[index] = column.toLocaleString();
                                    break;
                                }
                            case "string":
                                {
                                    if (column.match(numberRegex)) {
                                        data[index] = (parseInt(column)).toLocaleString();
                                    } else {
                                        data[index] = column;
                                    }
                                }
                                break;
                        }
                    });
                    return data;
                }
                break;

            case "string":
                {
                    if (data.match(numberRegex)) {
                        return (parseInt(data)).toLocaleString();
                    } else {
                        return data;
                    }
                }
                break;
        }
    };

    this.getPlotBandRange = function (data) {
        var plotBandRange = [];
        var from;
        var to;
        if (data) {
            for (i = 0; i <= data.length - 1; i++) {
                if ((data[i] == "This Week") ||
    					(data[i] == "This Month") || (data[i] == "This Year") || (data[i] == "This Quarter")) {
                    from = i + 0.5;
                    to = data.length;
                }
            }
            plotBandRange.push(from);
            plotBandRange.push(to);
        }
        return plotBandRange;
    };

    this.getPeriodData = function (obj) {
        return getPeriodDataFunc(obj);
    };

    function getPeriodDataFunc(obj) {
        var date = Date();
        date = moment(date).format('MM-DD-YYYY')
        var parts = date.split('-');
        var dateString = parts[0] + '/' + parts[1] + '/' + parts[2];
        date = new Date($rootScope.selectedDate);
        if (obj.periodName == window.appConstants.PERIOD_NAME_WEEK) {
            periodFrom = moment(date).weekday(0).format('MM-DD-YYYY');
            periodTo = moment(date).weekday(6).format('MM-DD-YYYY');
        }
        if (obj.periodName == window.appConstants.PERIOD_NAME_MONTH) {
            periodFrom = moment(date).startOf('month').format('MM-DD-YYYY');
            periodTo = moment(date).endOf('month').format('MM-DD-YYYY');
        }
        if (obj.periodName == window.appConstants.PERIOD_NAME_QUARTER) {
            var month = date.getMonth();
            periodFrom = moment(date).subtract(month % 3, 'month').startOf('month').format('MM-DD-YYYY');
            periodTo = moment(date).add(2 - (month % 3), 'month').endOf('month').format('MM-DD-YYYY');
        }
        if (obj.periodName == window.appConstants.PERIOD_NAME_YEAR) {
            periodFrom = moment(date).startOf('year').format('MM-DD-YYYY');
            periodTo = moment(date).endOf('year').format('MM-DD-YYYY');
        }

        var data = {
            periodName: obj.periodName,
            reportingInterval: obj.reportingInterval,
            periodFrom: periodFrom,
            periodTo: periodTo
        }
        return data;
    }

    this.getAvailablePeriods = function () {
        var availablePeriods = window.appConstants.AVAILABLE_PERIODS;
        var periodData = [];
        $.each(availablePeriods, function (key, obj) {
            periodData.push(getPeriodDataFunc(obj));
        });
        return periodData;
    };

    this.getCompleteRequestData = function (groupBy) {
        var request = this.getRequestData();
        if (groupBy) {
            request['groupBy'] = groupBy;
        }
        if (sharedProperties.getHeading()) {
            request['subGroupBy'] = sharedProperties.getHeading();
        }
        return request;
    };
    this.getIntFromString = function(data){
    	return parseInt(data.split(',').join(''));
    }
    this.getRequestData = function () {
        var periodData = this.getAvailablePeriods();
        var request = {
            mode: $rootScope.selectedUserMode,
            timeRanges: periodData
        }
        return request;
    };
    this.getSelectedPeriodRequestData = function(){
    	var availablePeriods = window.appConstants.AVAILABLE_PERIODS;
    	var selectedPeriod = {};
    	
    	$.each(availablePeriods, function(key, obj){
    		if(obj.periodName == $rootScope.selectedPeriod){
    			selectedPeriod = obj;
    		}
    	})
    	return getPeriodDataFunc(selectedPeriod);
    	
    };
    this.getInitialRequestData = function(){
    	var availablePeriods = window.appConstants.AVAILABLE_PERIODS;
    	var initialPeriod = {};
    	
    	$.each(availablePeriods, function(key, obj){
    		if(obj.periodName == $rootScope.selectedPeriod){
    			initialPeriod = obj;
    		}
    	})
    	var periodData = [];
    	periodData.push(getPeriodDataFunc(initialPeriod));
    	
    	var request = {
    			mode: $rootScope.selectedUserMode,
    			timeRanges: periodData
    	}
    	return request;
    }

    /* //Return the data of the selected period
    this.selectPeriodData = function selectPeriodData(data, $rootScope) {
    var index = 0;
    $.each(data.timeRanges, function (key, obj) {
    if (obj.reportingInterval == $rootScope.selectedPeriod) {
    index = key;
    }
    });
    return data.timeRanges[index];
    }*/

    this.getTotalMemory = function () {
        var t = 0;
        for (var x in localStorage) {
            t += (((localStorage[x].length * 2)));
        }
        console.warn("LocalStorage : " + t / 1024 + " KB");
    }

    this.throwError = function (e) {
        if (e)
            console.log("Error: ", e);
    }

    this.validateResponse = function(response) {
    	if(!response)
			throw {message: "Oops! internal error occured.", type: "internal"};
    }
    
    this.compareObjects = function (obj1, obj2) {
        return angular.equals(obj1, obj2);
    }
    
    this.getNotifyMessage = function(message,messageType){
    	var imageUrl;
    	$container = $("#messageContainer").notify();
    	if(messageType == 'success'){
    		imageUrl = "css/images/success-icon.png";
    	}
    	else if(messageType = 'failure'){
    		imageUrl = "css/images/failure-icon.png";
    	}
    		return $container.notify("create", {
    			title : message,
    			image : imageUrl
    			});
    	}
    
    //to get label name from labelConfigService
    
    this.getLabel = function(labelPath){
    	return labelConfigService.getLabel(labelPath);
    } 
    
    this.isObjectEmpty = function(obj){
    	console.log("ppp console:", Object.keys(obj).length)
    	return Object.keys(obj).length === 0;
    }
    
}])

/*.factory('$exceptionHandler', function () {
return function (exception, cause) {
exception.message += ' (caused by "' + cause + '")';
throw exception;
};
});*/

.service('sharedProperties', function () {

    var subGroupBy = null;
    var headingStr = "";
    var maxValue = 1000;
    var deficitValue = 500;
    var dataSourceId = 0;
    var modelId = 0;
    var defaultChannelId = 0;
    var labelId;
    var requestObjDO = {};
    var reviewDOReqObj = {};
    return {
        getSubGroupBy: function () {
            return subGroupBy;
        },
        setSubGroupBy: function (value) {
        	console.log('VALUE',value)
            subGroupBy = value;
        },
        getHeading: function () {
            return headingStr;
        },
        setHeading: function (headingString) {
            headingStr = headingString;
        },
        getMaxValue: function () {
            return maxValue;
        },
        setMaxValue: function (target) {
            maxValue = target;
        },
        getDeficitValue: function () {
            return deficitValue;
        },
        setDeficitValue: function (deficit) {
            deficitValue = deficit;
        },
        getDataSourceId: function () {
            return dataSourceId;
        },
        setDataSourceId: function (sourceId) {
        	dataSourceId = sourceId;
        },
        getModelId: function () {
            return modelId;
        },
        setModelId: function (id) {
        	modelId = id;
        },
        getDefaultChannelId: function () {
            return defaultChannelId;
        },
        setDefaultChannelId: function (channelId) {
        	defaultChannelId = channelId;
        },
        setLabelId:function(labelId) {
        	labelId = labelId;
        },
        getLabelId:function(){
        	return labelId;
        },
        setRequestDO:function(requestDO){
        	requestObjDO = requestDO;
        },
        getRequestDO:function(){
        	return requestObjDO;
        },
        setReviewDORequest:function(reviewDOReq){
        	reviewDOReqObj = reviewDOReq;
        },
        getReviewDORequest:function(){
        	return reviewDOReqObj;
        }
        
        

    };
})

