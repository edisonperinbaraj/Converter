angular.module("Settings")

.controller("modelsInit",['$scope','CustomService', function ($scope, CustomService) {

    angular.element(document).ready(function () {
        setTimeout(function () { CustomService.appInit() }, 1);
    });

}])

.controller("uploadModelsController",['$scope' ,'UtilitiesService','DataService','RequestConstantsFactory','sharedProperties','$rootScope',
                                      function ($scope, UtilitiesService, DataService, RequestConstantsFactory,sharedProperties, $rootScope) {
    //When the cache expires
    $rootScope.$on('onCacheExpiry', loadUploadData);

    $rootScope.$on('modelsDataChange', function (event, data) {
        //$scope.addData(data);
    });
    var selectedModel;
    var errorConstants = RequestConstantsFactory['ERROR_MSGS'];
    //Setting the scope variable for showing 'spinner' until the data is loaded
    $scope.dataLoaded = false;
    //Loading the options for data - for the myTable directive
    $scope.options = UtilitiesService.getDataTableOptions();

    //Function executed after the response from the network
    $scope.addData = function (data) {
        try {
            //If data is loaded, set as true
            $scope.dataLoaded = true;
            //when data is available, set as false 
            $scope.error = false;
            $scope.options.aaData = [];

            if (!data) {
                throw "noDataError";
            }
            //For loading the uploadModel table data
            $.each(data, function (key, obj) {
                //Setting the first row of table as default selected(radio button)
                if (!key) {
                    //Setting the selected radio button modelId to the shared properties
                    sharedProperties.setModelId(obj.modelId);
                    selectedModel = "<input type='radio' name='defaultReport' ng-checked='true' ng-click=\"tableData('" + obj.modelId + "')\"/>";
                }
                else {
                    selectedModel = "<input type='radio' name='defaultReport' ng-checked='false' ng-click=\"tableData('" + obj.modelId + "')\"/>";
                }
                $scope.options.aaData.push([key + 1, obj.modelName, obj.modelDetails, obj.modelVersion, selectedModel]);
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
    //on clicking the radio button
    $scope.modelHistory = function (dataSourceId) {
        sharedProperties.setModelId(dataSourceId);
    }
    var requestData = {};

    var cacheKey = "uploadModels" + JSON.stringify(requestData);
    function loadUploadData() {
        var func = $scope.addData;
        if (arguments[1]) {
            if (arguments[1].key == cacheKey) {
                func = null;
            } else {
                return false;
            }
        }
        DataService.getUploadModelsData(requestData, func, $scope.fail);
    }

    loadUploadData();
}])

.controller("viewModelsController",['$scope','UtilitiesService','DataService','sharedProperties','RequestConstantsFactory','$rootScope' ,
                                    function ($scope, UtilitiesService, DataService, sharedProperties, RequestConstantsFactory, $rootScope) {
    //When the cache expires
    $rootScope.$on('onCacheExpiry', loadViewData);

    var requestConstants = RequestConstantsFactory['MODELS'];
    var errorConstants = RequestConstantsFactory['ERROR_MSGS'];
    var requestData = {};
    //Setting the scope variable for showing 'spinner' until the data is loaded
    $scope.dataLoaded = false;
    //Loading the options for data - for the myTable directive
    $scope.options = UtilitiesService.getDataTableOptions();
    //Function executed after the response from the network
    $scope.addData = function (data) {
        try {
            //If data is loaded, set as true
            $scope.dataLoaded = true;
            //when data is available, set as false 
            $scope.error = false;
            $scope.options.aaData = [];

            if (!data) {
                throw "noDataError";
            }
            //For loading the viewModel table data
            $.each(data, function (key, obj) {
            	if($scope.isModelsEditable){
            		 $scope.options.aaData.push([key + 1, obj.modelName, obj.modelDetails, obj.modelVersion, "<a class='upload' title='Download' href='" + obj.modelFile + "' download></a>"]);
            	}else{
            		$scope.options.aaData.push([key + 1, obj.modelName, obj.modelDetails, obj.modelVersion]);
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
    //Watching when the selected radio button changes in 'uploadModel' table
    $scope.$watch(function () {
        return sharedProperties.getModelId();
    }, function (newValue) {
        //To show the spinner until the data is loaded
        $scope.dataLoaded = false;
        //calling the function for 'viewModel' table
        loadViewData();
    });

    function loadViewData() {
        //request
        requestData[requestConstants.MODEL_ID] = sharedProperties.getModelId();
        console.log("requestData", requestData)
        var cacheKey = "viewModels" + JSON.stringify(requestData);
        var func = $scope.addData;
        if (arguments[1]) {
            if (arguments[1].key == cacheKey) {
                func = null;
            } else {
                return false;
            }
        }
        DataService.getViewModelsData(requestData, func, $scope.fail);
    }
}])

.controller("modelsModalController",['$scope', 'fileUpload','$element','sharedProperties','RequestConstantsFactory','$rootScope','DataService','UtilitiesService',
                                     function ($scope, fileUpload, $element, sharedProperties, RequestConstantsFactory, $rootScope, DataService, UtilitiesService) {


    var requestConstants = RequestConstantsFactory['MODELS'];
    var errorConstants = RequestConstantsFactory['ERROR_MSGS'];
    var modelName;
    var modelVersion;
    var formData = [];
    var addModelRequest = {};
    $scope.$on("addModel", loadAddModalDialogData);
    $scope.uploadingModels = false;

    $scope.options = {
        autoUpload: false,
        url: "http://199.223.234.202:8080/absolutdata/v0.1/settings/addModel",
        formData: addModelRequest,
        param:"file",
        submit: function () {
        	$scope.uploadingModels = true;
            addModelRequest[requestConstants.MODEL_ID] = sharedProperties.getModelId();
            //addModelRequest[requestConstants.MODEL_DETAILS] = modelName;
            addModelRequest[requestConstants.MODEL_VERSION] = modelVersion;
        },
        done: function (data) {
            console.log("Done Func", arguments);
            //Call Success function here
            $scope.addModelSubmitSuccess(data);
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
    /* Handle all events related to File Uploads here */

    var uploadSuccess = function () {
    	$scope.fileName = "";
        $scope.fileUploadDone = true;
        $scope.addModelSuccess(arguments);
        console.log("File Upload done.!!", arguments);
    },
	uploadProgressing = function () {
	    console.log("File Upload processing.!!", arguments);
	},
	uploadFileAdded = function (param, args) {
	    $scope.fileUploadDone = false;
	    $scope.fileName = args.originalFiles[0].name;
	    console.log("File Added.!!",arguments);
	    console.log("Name:.!!",args.originalFiles[0].name);
	},
	uploadFail = function (arguments) {
		$scope.fileName = "";
	    $scope.fileUploadDone = false;
	    $scope.uploadingModels = false;
	    $scope.showError = true;
	    console.log("File Upload Failed!!", arguments);
	}

    $scope.$on('fileuploaddone', uploadSuccess);
    $scope.$on('fileuploadprogress', uploadProgressing);
    $scope.$on('fileuploadadd', uploadFileAdded);
    $scope.$on('fileuploadfail', uploadFail);
    $scope.$on('fileuploadprocessfail ', uploadFail);
    $scope.$on('fileuploadchunkfail', uploadFail);

    //to get all model details for add modal dialog
    $scope.addModelDetailsForAddModelSuccess = function (data) {
        try {
            $scope.allModelDetails = [];
            $.each(data.modelList, function (key, obj) {
                $scope.allModelDetails.push(obj.modelDetails);
            });
            console.log("pppp:", $scope.allModelDetails)
        } catch (e) {
        	 $scope.fail(errorConstants.DATA_ERR);
        }
    }
    
    //to get the details for add model dialog
    $scope.addModelDialogDataSuccess = function (data) {
        try {
            if (!data) {
                throw "noDataError";
            }
            //For loading the addModel dialog data
            $.each(data, function (key, obj) {
                if (obj.modelId == sharedProperties.getModelId()) {
                    $scope.modelName = obj.modelName;
                    modelName = $scope.modelName;
                    modelVersion = obj.modelVersion;
                    $.each($scope.allModelDetails, function (key, eachDetail) {
                        if (eachDetail == obj.modelDetails) {
                            $scope.selectedModelDetail = $scope.allModelDetails[key];
                        }
                    })
                }
            });
            $element.find(":selected").trigger('change');
        } catch (e) {
            UtilitiesService.throwError(e);
        }

    }

    $scope.addModelSubmitSuccess = function (data) {
        console.log("ADD MODEL SUCCCESS", arguments);
        try {
            if (!data) {
                throw "noDataError";
            }
            if (data.status == 'OK') {
                $scope.showError = false;
                $rootScope.$broadcast('modelsDataChange', data);
                UtilitiesService.getNotifyMessage("Model Uploaded Successfully",requestConstants.SUCCESS);
                $scope.uploadingModels = false;
                $('#mask, .window').hide();
            }
            else {
                $scope.showError = true;
                $scope.uploadingModels = false;
            }
        } catch (e) {
        	 $scope.fail(errorConstants.DATA_ERR);
        }

    }

    function loadAddModalDialogData() {
        $scope.showError = false;
        var requestData = {};
        var func = $scope.addModelDialogDataSuccess;
        if (arguments[1]) {
            if (arguments[1].key == cacheKey) {
                func = null;
            } else {
                return false;
            }
        }
        DataService.getUploadModelsData(requestData, func, $scope.fail);
    }
    // function call to load all model details
    loadModelDetailsForAddModelDialog();
    //to load all the model details
    function loadModelDetailsForAddModelDialog() {
        var requestData = {};
        var func = $scope.addModelDetailsForAddModelSuccess;
        if (arguments[1]) {
            if (arguments[1].key == cacheKey) {
                func = null;
            } else {
                return false;
            }
        }
        DataService.getModelDetails(requestData, func, $scope.fail);
    }
}])