angular.module('AnalyticsApp')

.factory('RequestConstantsFactory', function(){
	var CONSTANTS = {};
	var RESPONSE = [];
	var REQUEST = [];
	var LOGIN = [];
	var CHANGE_PASSWORD = [];
	//TRACKING
	var WIDGETS = [];
	//Decision WorkBench module
	var BUILDDO = [];
	//Settings module
	var DATASYNC = [];
	var CHANNELS = [];
	var MODELS = [];
	var GOALS = [];
	var USERS = [];
	var AUDIT_TRAIL = [];
	var LABEL_CONFIG = [];
	var NOTIFICATION = [];
	var CONFIRMATION = [];
	var ERROR_MSGS = [];
	var DATE = [];
	var DECISION_URL = [];
	var TRAC_URL = [];
	var SETTINGS_URL = [];
	var PERMISSIONS = [];
	var CHART_CONSTANTS = [];
	/*---------------------Permission constants---------------------------*/
	PERMISSIONS.TRACK_READ = "TRACK_READ";
	//Summary
	PERMISSIONS.TRACK_SUMMARY_FUNNEL_READ = "TRACK_SUMMARY_FUNNEL_READ";
	PERMISSIONS.TRACK_SUMMARY_FUNNEL_WRITE = "TRACK_SUMMARY_FUNNEL_WRITE";
	PERMISSIONS.TRACK_SUMMARY_TREND_READ = "TRACK_SUMMARY_TREND_READ";
	PERMISSIONS.TRACK_SUMMARY_TREND_WRITE = "TRACK_SUMMARY_TREND_WRITE";
	PERMISSIONS.TRACK_SUMMARY_METRICES_READ = "TRACK_SUMMARY_METRICES_READ";
	PERMISSIONS.TRACK_SUMMARY_METRICES_WRITE = "TRACK_SUMMARY_METRICES_WRITE";
	
	//Business Impact
	PERMISSIONS.TRACK_BI_TREND_READ = "TRACK_BI_TREND_READ";
	PERMISSIONS.TRACK_BI_TREND_WRITE = "TRACK_BI_TREND_WRITE";
	PERMISSIONS.TRACK_BI_DEEPDIVE_READ = "TRACK_BI_DEEPDIVE_READ";
	PERMISSIONS.TRACK_BI_DEEPDIVE_WRITE = "TRACK_BI_DEEPDIVE_WRITE";
	//Engagement Activity
	PERMISSIONS.TRACK_EA_SCORE_READ = "TRACK_EA_SCORE_READ";
	PERMISSIONS.TRACK_EA_SCORE_WRITE = "TRACK_EA_SCORE_WRITE";
	PERMISSIONS.TRACK_EA_MODULEENGAGEMENT_READ = "TRACK_EA_MODULEENGAGEMENT_READ";
	PERMISSIONS.TRACK_EA_MODULEENGAGEMENT_WRITE = "TRACK_EA_MODULEENGAGEMENT_WRITE";
	PERMISSIONS.TRACK_EA_DEEPDIVE_READ = "TRACK_EA_DEEPDIVE_READ";
	PERMISSIONS.TRACK_EA_DEEPDIVE_WRITE = "TRACK_EA_DEEPDIVE_WRITE";
	//User Group
	PERMISSIONS.TRACK_UG_SUMMARY_READ = "TRACK_UG_SUMMARY_READ";
	PERMISSIONS.TRACK_UG_SUMMARY_WRITE = "TRACK_UG_SUMMARY_WRITE";
	PERMISSIONS.TRACK_UG_TREND_READ = "TRACK_UG_TREND_READ";
	PERMISSIONS.TRACK_UG_TREND_WRITE = "TRACK_UG_TREND_WRITE";
	PERMISSIONS.TRACK_UG_DEEPDIVE_READ = "TRACK_UG_DEEPDIVE_READ";
	PERMISSIONS.TRACK_UG_DEEPDIVE_WRITE = "TRACK_UG_DEEPDIVE_WRITE";
	
	//Decision Workbench
	PERMISSIONS.DO_READ = "DO_READ";
	PERMISSIONS.DO_WRITE = "DO_WRITE";
	
	//Settings
	PERMISSIONS.SETTINGS_READ = "SETTINGS_READ";
	PERMISSIONS.SETTINGS_WRITE = "SETTINGS_WRITE";
	
	PERMISSIONS.TRACK_BI = "business_impact";
	PERMISSIONS.TRACK_EA = "engagement_activity";
	PERMISSIONS.TRACK_UG = "user_groups";
	
	PERMISSIONS.BI_REVENUE = "revenue";
	PERMISSIONS.BI_NEW_PAID_USERS = "newPaidUsers";
	PERMISSIONS.BI_CONVERSION_RATE = "covRate";
	PERMISSIONS.BI_PAGE_VIEWS = "pageViews";
	PERMISSIONS.BI_ARPU = "arpu";
	PERMISSIONS.BI_DAILY_COST = "dailyCost";
	PERMISSIONS.BI_COST_ESTIMATES = "costEst";
	PERMISSIONS.BI_NEW_SIGN_UPS = "convRate";
	
	PERMISSIONS.EA_ENGAGEMENT_SCORE = "enScore";
	PERMISSIONS.EA_VIDEO_UPLOADS = "vidUpload";
	PERMISSIONS.EA_PROFILE_BUILDER = "profBldr";
	PERMISSIONS.EA_MESSAGES = "msg";
	PERMISSIONS.EA_BLOGS = "commBlog";
	PERMISSIONS.EA_JOBS = "jobs";
	PERMISSIONS.EA_FRIENDS_LIST = "friends";
	PERMISSIONS.COST_ESTIMATE = "costEstimate";
	PERMISSIONS.EA_SENT_EMAIL = "sentEmail";
	PERMISSIONS.EA_VIEW_RESUME = "viewResume";
	PERMISSIONS.EA_APPLY_JOB = "applyJob";
	PERMISSIONS.EA_ADD_PEOPLE = "addPeople";
	PERMISSIONS.EA_ADD_BLOGS = "addBlogs";
	PERMISSIONS.EA_CREATE_RESUME= "createResume";
	PERMISSIONS.EA_SAVE_RESUME= "saveResume";
	
	PERMISSIONS.UG_ONE = "usergroup1";
	PERMISSIONS.UG_TWO = "usergroup2";
	PERMISSIONS.UG_THREE = "usergroup3"
	PERMISSIONS.UG_FOUR = "usergroup4";
	PERMISSIONS.UG_FIVE = "usergroup5";
	PERMISSIONS.SUMMARY_TREND_PAID_USERS = "newSubs_cancellations";
	PERMISSIONS.SUMMARY_TREND_REVENUE = "revenue_mrr";
	
	CONSTANTS['PERMISSIONS'] = PERMISSIONS;
	/*---------------------Chart constants---------------------------*/
	CHART_CONSTANTS.TREND_TYPE = ['column','column','line','line'];
	CHART_CONSTANTS.TREND_YAXIS = [0,0,1,1];
	CHART_CONSTANTS.TREND_COLORS = ['#32cabb','#26a48e','#149ae3','#1b6395'];
	CHART_CONSTANTS.TREND_ID = ['newRevenue','mrr','Actual','Target'];
	CHART_CONSTANTS.TREND_NAME = ['New Revenue ($)','MRR ($)','Cancellations','New Subs'];
	CHART_CONSTANTS.TREND_TOOLTIP_SUFFIX = ['Mn','Mn','K','K'];
	CONSTANTS['CHART_CONSTANTS'] = CHART_CONSTANTS;
	/*---------------------Date function constants---------------------------*/
	DATE.WEEK_LABLES = ['a','b','c','d','e'];
	CONSTANTS['DATE'] = DATE;
	/*---------------------Notify message---------------------------*/
	NOTIFICATION.SUCCESS = "success";
	NOTIFICATION.FAILURE = "failure"; 
	CONSTANTS['NOTIFICATION'] = NOTIFICATION;
	/*--------------------Confirmation Message----------------------*/
	CONFIRMATION.UPDATE_API = "Your cached data is " + window.appConstants.CACHE_MAX_AGE /60 + " Hours old. Update?";
	CONSTANTS['CONFIRMATION'] = CONFIRMATION;
	/*----------------------Error Messages------------------------------*/ 
	ERROR_MSGS.DATA_ERR = "No Data Available !!";
	ERROR_MSGS.NETWORK_ERR = "Network Error !!";
	CONSTANTS['ERROR_MSGS'] = ERROR_MSGS;
	/*---------------------Decision Workbench---------------------------*/
	BUILDDO.WATERFALL_CURRENT = "current";
	BUILDDO.WATERFALL_DEFICIT = "deficit";
	BUILDDO.WATERFALL_CONVERSION_UPLIFT = "conversionUplift";
	BUILDDO.WATERFALL_BASE_EXPECTED = "baseExpected";
	BUILDDO.WATERFALL_TARGET = "target";
	BUILDDO.WATERFALL_ACHIEVABLE = "achievable";
	BUILDDO.PERIOD_DATA_MAX_UPLIFT = "maximumUplift";
	
	CONSTANTS['BUILDDO'] = BUILDDO;
	
	/*-------------------------Response--------------------------*/
	RESPONSE.STATUS_OKAY = "OK";
	RESPONSE.STATUS = "status";
	RESPONSE.LOGIN_SUCCESS = "loginSuccess";
	
	CONSTANTS['RESPONSE'] = RESPONSE;
	
	/*------------------------Home-----------------------------*/
	
	//For Login Page
	LOGIN.USER_NAME = "userName";
	LOGIN.PASSWORD = "password";
	
	//For Change Password page Page
	CHANGE_PASSWORD.OLD_PASSWORD = "oldpass";
	CHANGE_PASSWORD.NEW_PASSWORD = "password";
	CHANGE_PASSWORD.CONFIRM_PASSWORD = "newpass2";
	
	
	CONSTANTS['LOGIN'] = LOGIN;
	CONSTANTS['CHANGE_PASSWORD'] = CHANGE_PASSWORD;
	
	/*---------------------Track---------------------------*/
	
	WIDGETS.FUNNEL_SUBSCRIPTION = "subscriptions";
	WIDGETS.FUNNEL_CANCELLATIONS = "cancellations";
	WIDGETS.FUNNEL_VISITORS = "visitors";
	WIDGETS.FUNNEL_REGISTRATIONS = "registrations";
	
	WIDGETS.BI_REVENUE = "revenue";
	WIDGETS.BI_NEW_PAID_USERS = "newPaidUsers";
	WIDGETS.BI_CONVERSION_RATE = "covRate";
	WIDGETS.BI_PAGE_VIEWS = "pageViews";
	WIDGETS.BI_ARPU = "arpu";
	WIDGETS.BI_DAILY_COST = "dailyCost";
	WIDGETS.BI_COST_ESTIMATES = "costEst";
	WIDGETS.BI_NEW_SIGN_UPS = "convRate";
	
	WIDGETS.EA_ENGAGEMENT_SCORE = "enScore";
	WIDGETS.EA_VIDEO_UPLOADS = "vidUpload";
	WIDGETS.EA_PROFILE_BUILDER = "profBldr";
	WIDGETS.EA_MESSAGES = "msg";
	WIDGETS.EA_BLOGS = "commBlog";
	WIDGETS.EA_JOBS = "jobs";
	WIDGETS.EA_FRIENDS_LIST = "friends";
	WIDGETS.COST_ESTIMATE = "costEstimate";
	WIDGETS.EA_SENT_EMAIL = "sentEmail";
	WIDGETS.EA_VIEW_RESUME = "viewResume";
	WIDGETS.EA_APPLY_JOB = "applyJob";
	WIDGETS.EA_ADD_PEOPLE = "addPeople";
	WIDGETS.EA_ADD_BLOGS = "addBlogs";
	WIDGETS.EA_CREATE_RESUME= "createResume";
	WIDGETS.EA_SAVE_RESUME= "saveResume";
	
	
	WIDGETS.UG_ONE = "usrGrp1";
	WIDGETS.UG_TWO = "usrGrp2";
	WIDGETS.UG_THREE = "usrGrp3"
	WIDGETS.UG_FOUR = "usrGrp4";
	WIDGETS.UG_FIVE = "usrGrp5";
	CONSTANTS['WIDGETS'] = WIDGETS;
	
	//Engagement Activity - request constants
	REQUEST.EA_SCORE_MAX_ROWS = "5";
	CONSTANTS['REQUEST'] = REQUEST;
	
	/*---------------------Settings---------------------------*/
	
	//for dataSync Page
	DATASYNC.DATA_SOURCE_ID = "dataSourceId";
	DATASYNC.FROM_DATE = "periodFrom";
	DATASYNC.TO_DATE = "periodTo";
	DATASYNC.REPORTING_INTERVAL = "reportingInterval";
	DATASYNC.PERIOD_NAME = "periodName";
	DATASYNC.TIME_RANGE = "timeRange";
	
	//for Channels Page
	CHANNELS.CHANNEL_ID = "channelId";
	CHANNELS.CHANNEL_TYPE = "channelType";
	CHANNELS.ESTIMATE_COST = "estimateCost";
	CHANNELS.ESTIMATE_TIME = "estimateTime";
	CHANNELS.LAST_MODIFIED_DATE = "lastModifiedDate";
	CHANNELS.LAST_MODIFIED_BY = "lastModifiedBy";
	CHANNELS.DEFAULT_CHANNEL = "defaultChannel";
	
	//for Models Page
	MODELS.MODEL_ID = "modelId";
	MODELS.MODEL_DETAILS = "modelDetails";
	MODELS.MODEL_FILE = "modelFile";
	MODELS.MODEL_VERSION = "modelVersion";
	
	//for Goals Page
	GOALS.FROM_DATE = "periodFrom";
	GOALS.TO_DATE = "periodTo";
	GOALS.TIME_RANGE = "timeRange";
	GOALS.GOAL_ID = "goalId";
	GOALS.GOAL_PERIOD = "goalPeriod";
	GOALS.REVENUE = "revenue";
	GOALS.NPU = "npu";
	GOALS.CONV_RATE = "convRate";
	GOALS.NEW_SIGNUPS = "newSignUps";
	GOALS.PAGE_VIEWS = "pageViews";
	GOALS.CHILDREN = "children";
	GOALS.YEAR = "year";
	//for Users Page
	USERS.USER_ID = "userId";
	USERS.USER_NAME = "userName";
	USERS.FIRST_NAME = "fName";
	USERS.LAST_NAME = "lName";
	USERS.PASSWORD = "password";
	USERS.EMAIL_ID = "emailId";
	USERS.DEPARTMENT = "dept";
	USERS.ROLE = "role";
	USERS.ROLE_ID = "roleId";
	USERS.ROLE_NAME = "roleName";
	USERS.ROLE_ENTITY_ID = "entityId";
	USERS.ROLE_ENTITY_NAME = "entityName";
	USERS.ROLE_DESCRIPTION = "roleDescription";
	USERS.ROLE_READ_PERMISSION = "readPermission";
	USERS.ROLE_WRITE_PERMISSION = "writePermission";
	USERS.ROLE_PERMISSIONS = "permissions";
	USERS.ROLE_PERMISSION_LIST = "permissionsList";
	
	//for Audit Trail Page
	AUDIT_TRAIL.LIST_OF_MODULES = "moduleList";
	AUDIT_TRAIL.FROM_DATE = "fromDate";
	AUDIT_TRAIL.LIST_OF_ACTIVITIES = "activityList";
	AUDIT_TRAIL.TO_DATE = "toDate";
	AUDIT_TRAIL.CHANGED_BY = "changedBy";
	AUDIT_TRAIL.TIME_RANGE = "timeRange";
	
	//for Label Config
	LABEL_CONFIG.LABEL_ID = "labelId";
	LABEL_CONFIG.EXPLICIT_NAME = "explicitName";
	
	
	CONSTANTS['DATASYNC'] = DATASYNC;
	CONSTANTS['CHANNELS'] = CHANNELS;
	CONSTANTS['MODELS'] = MODELS;
	CONSTANTS['USERS'] = USERS;
	CONSTANTS['GOALS'] = GOALS;
	CONSTANTS['AUDIT_TRAIL'] = AUDIT_TRAIL;
	CONSTANTS['LABEL_CONFIG'] = LABEL_CONFIG;
	
	
	/*----------------------base url------------------------------*/
	//var BASE_URL = "http://199.223.234.202:8080/absolutdata";
	
	/*---------------------url version------------------------------*/
	var BASE_URL_VERSION = appConstants.API_BASE_URL + "/v0.3"
	
	/*-----------------------login-----------------------------*/
	var LOGIN_URL = BASE_URL_VERSION + "/login";
	var LOGOUT_URL = BASE_URL_VERSION + "/logout";
	var CHANGE_PASS_URL = BASE_URL_VERSION + "/settings/changePassword";
	
	/*-----------------Decision Workbench module------------------*/
	var DECISION_BASE_URL = BASE_URL_VERSION + "/decisionWorkbench/";
	
	DECISION_URL.DO_SETTINGS = DECISION_BASE_URL + "setDOSettings";
	DECISION_URL.VALIDATE_DO = DECISION_BASE_URL + "validateDO";
	DECISION_URL.EDIT_DO = DECISION_BASE_URL + "editDOAction";
	DECISION_URL.GET_DO_SETTINGS = DECISION_BASE_URL + "getDOSettings";
	DECISION_URL.NEW_DECISION_OPTION = DECISION_BASE_URL + "getNewDecisionOptions";
	DECISION_URL.REVIEW_DO = DECISION_BASE_URL + "reviewDO";
	DECISION_URL.UPDATE_DO = DECISION_BASE_URL + "updateDO";
	DECISION_URL.GET_COMBINED_DO_DETAILS = DECISION_BASE_URL + "getCombinedDODtls";
	DECISION_URL.EDIT_DO_SAVE = DECISION_BASE_URL + "editDOSaveAction";
	DECISION_URL.GET_DECISION_FILTERS = DECISION_BASE_URL + "getDecisionOptionsWithFilters";
	
	/*------------------Tracking module---------------------*/
	var TRAC_BASE_URL = BASE_URL_VERSION + "/track/";
	
	TRAC_URL.GET_SUMMARY = TRAC_BASE_URL + "getTrackSummary";
	TRAC_URL.GET_BI_DATA_USER = TRAC_BASE_URL + "getBiDataDeepDive";
	TRAC_URL.GET_GRP_SUMMARY = TRAC_BASE_URL + "getGrpSummary";
	TRAC_URL.GET_ACQ_TREND_DATA = TRAC_BASE_URL + "getAcqTrendData";
	TRAC_URL.GET_ACQ_FUNNEL_DATA = TRAC_BASE_URL + "getAcqFunnelData";
	TRAC_URL.GET_BI_DATE_BY_TIME = TRAC_BASE_URL + "getBIDataByTime";
	TRAC_URL.GET_EA_DATA_MODULE = TRAC_BASE_URL + "getEADataByModule";
	TRAC_URL.GET_EA_HEAT_MAP = TRAC_BASE_URL + "getEAHeatMap";
	TRAC_URL.GET_USER_SETTINGS = TRAC_BASE_URL + "getUserSettings";
	TRAC_URL.POST_USER_SETTINGS = TRAC_BASE_URL + "postUserSettings";
	TRAC_URL.GET_EA_SCORE = TRAC_BASE_URL + "getEAScore";
	TRAC_URL.GET_GRP_ACQUISITION_TREND = TRAC_BASE_URL + "getGrpAcquisitionTrend";
	TRAC_URL.GET_GRP_DETAILS = TRAC_BASE_URL + "getGrpDetails";
	
	/*-----------------Settings module------------------*/
	var SETTINGS_BASE_URL = BASE_URL_VERSION + "/settings/";
	
	SETTINGS_URL.DATA_SYNC_STATUS = SETTINGS_BASE_URL + "getDataSyncStatus";
	SETTINGS_URL.DATA_SYNC_HISTORY = SETTINGS_BASE_URL + "getDataSyncHistory";
	
	SETTINGS_URL.CHANNELS_LIST = SETTINGS_BASE_URL + "getChannelList";
	SETTINGS_URL.CHANNELS_ADD = SETTINGS_BASE_URL + "addChannel";
	SETTINGS_URL.CHANNELS_EDIT = SETTINGS_BASE_URL + "editChannel";
	SETTINGS_URL.CHANNELS_DELETE = SETTINGS_BASE_URL + "deleteChannel";
	
	SETTINGS_URL.MODELS_LIST = SETTINGS_BASE_URL + "getModelList";
	SETTINGS_URL.MODELS_HISTORY_LIST = SETTINGS_BASE_URL + "getModelVersionHistory";
	SETTINGS_URL.ADD_MODELS = SETTINGS_BASE_URL + "addModel";
	SETTINGS_URL.MODEL_DETAILS = SETTINGS_BASE_URL + "getModelMeta";
	
	SETTINGS_URL.GOALS_LIST = SETTINGS_BASE_URL + "getRolledUpTarget";
	SETTINGS_URL.GOALS_EDIT = SETTINGS_BASE_URL + "editGoal";
	SETTINGS_URL.GOALS_UPLOAD = SETTINGS_BASE_URL + "uploadGoal";
	SETTINGS_URL.GET_TARGET_GRID_DATE_RANGE =SETTINGS_BASE_URL + "getDateRange";
	SETTINGS_URL.SAVE_TARGET_GRID =SETTINGS_BASE_URL + "postTarget";
	SETTINGS_URL.GET_TARGET_GRID = SETTINGS_BASE_URL + "listTarget";
	
	SETTINGS_URL.USERS_LIST = SETTINGS_BASE_URL + "listUsers";
	SETTINGS_URL.USERS_EDIT = SETTINGS_BASE_URL + "editUser";
	SETTINGS_URL.ROLES_LIST = SETTINGS_BASE_URL + "listRoles";
	SETTINGS_URL.ROLE_ADD = SETTINGS_BASE_URL + "addRole";
	SETTINGS_URL.ROLE_EDIT = SETTINGS_BASE_URL + "editRole";
	SETTINGS_URL.USERS_DELETE = SETTINGS_BASE_URL + "deleteUser";
	SETTINGS_URL.ROLE_DELETE = SETTINGS_BASE_URL + "deleteRole";
	SETTINGS_URL.USERS_ADD = SETTINGS_BASE_URL + "createUser";
	SETTINGS_URL.USERS_PERMISSION_ROLES = SETTINGS_BASE_URL + "listPermissionForRole";
	SETTINGS_URL.USERS_UPATE_PERMISSION_ROLES = SETTINGS_BASE_URL + "updatePermissionForRole";
	
	SETTINGS_URL.AUDIT_TRAIL_SETUP = SETTINGS_BASE_URL + "getAuditTrailMeta";
	SETTINGS_URL.AUDIT_TRAIL_LIST = SETTINGS_BASE_URL + "getAuditTrail";
	
	SETTINGS_URL.LABEL_CONFIG_SET_DATE = SETTINGS_BASE_URL + "setDate";
	
	CONSTANTS['DECISION_URL'] = DECISION_URL;
	CONSTANTS['TRAC_URL'] = TRAC_URL;
	CONSTANTS['SETTINGS_URL'] = SETTINGS_URL;
	CONSTANTS['LOGIN_URL'] = LOGIN_URL;
	CONSTANTS['LOGOUT_URL'] = LOGOUT_URL;
	CONSTANTS['CHANGE_PASS_URL'] = CHANGE_PASS_URL;

	return CONSTANTS;
})

.factory('EnabledCacheInfoFactory', function(){
	var CONSTANTS  = {};
	
	//Settings module
	var DATASYNC = [];
	var CHANNELS = [];
	var MODELS = [];
	var GOALS = [];
	var USERS = [];
	var AUDIT_TRAIL = [];
	var LABEL_CONFIG = [];
	
	/*---------------------Settings---------------------------*/
	//Data Sync Page
	DATASYNC.DATA_SYNC_STATUS = false;
	DATASYNC.DATA_SYNC_HISTORY = false;
	
	//for Channels Page
	CHANNELS.CHANNEL_INFO_TABLE = false;
	CHANNELS.ADD_CHANNEL = false;
	CHANNELS.EDIT_CHANNEL = false;
	CHANNELS.DELETE_CHANNEL = false;
	
	//for models page
	MODELS.UPDATE_MODEL_TABLE = false;
	MODELS.VIEW_MODEL_TABLE = false;
	MODELS.ADD_MODEL = false;
	MODELS.MODEL_DETAILS = false;//for the add model dialog drop down
	
	//for goals page
	GOALS.GOALS_TABLE = false;
	GOALS.EDIT_GOALS = false;
	GOALS.TARGET_INITIAL_DATA = false;
	
	//for users page - user module
	USERS.USER_LIST_TABLE = false;
	USERS.USER_ADD = false;
	USERS.USER_EDIT = false;
	USERS.USER_DELETE = false;
	//for users page - role module
	USERS.ROLE_LIST_TABLE = false;
	USERS.ROLE_ADD = false;
	USERS.ROLE_EDIT = false;
	USERS.ROLE_DELETE = false;
	USERS.ROLE_PERMISSION = false;
	USERS.ROLE_PERMISSION_UPDATE = false;
	
	//for audit trail page
	AUDIT_TRAIL.AUDIT_TRAIL_SETUP = false;
	AUDIT_TRAIL.AUDIT_TRAIL_USERLIST_SETUP = false;//getting the list of users from users page for setup
	AUDIT_TRAIL.AUDIT_TRAIL_LIST_TABLE = false;
	
	//fro label config page
	
	LABEL_CONFIG.LIST_TABLE = false;
	
	CONSTANTS['DATASYNC'] = DATASYNC;
	CONSTANTS['CHANNELS'] = CHANNELS;
	CONSTANTS['MODELS'] = MODELS;
	CONSTANTS['GOALS'] = GOALS;
	CONSTANTS['USERS'] = USERS;
	CONSTANTS['AUDIT_TRAIL'] = AUDIT_TRAIL;
	CONSTANTS['LABEL_CONFIG'] = LABEL_CONFIG;
	return CONSTANTS;
})

.service('labelConfigService',['$rootScope' ,function($rootScope){
	this.getLabel = function(labelName) {
		var defaultList = [];
		var explicitList = [];
		$.each(window.labelConstants, function(key, eachData){
			defaultList[eachData.key] = eachData.value	
		})
		$.each($rootScope.explicitNameList, function(key, eachData){
			explicitList[eachData.key] = eachData.value
		})
		if(explicitList[labelName]){
			return explicitList[labelName];
		}
		else{
			return defaultList[labelName];
		}
	};
}])
