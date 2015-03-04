
//This module contains all common Services lik Data service,
//Utilities, filters. This module will be injected in to 
//other modules.

angular.module('AnalyticsApp',['ngRoute','jmdobry.angular-cache'])
.controller('mainAppContent',['$scope','$rootScope','$angularCacheFactory','UtilitiesService','Permission','labelConfigService','CommonDataService','$window',
                              function($scope, $rootScope, $angularCacheFactory, UtilitiesService, Permission,labelConfigService,CommonDataService, $window){

	//Synchronously loading the Constants file from server
	//Request file based on tenant ID (params) set on the current domain.

	var params = "";
	var url = "js/config.js" + params;
	$.ajax({
		async:false,
		type:'GET',
		url:"js/config.js",
		dataType:'script',
		error: function() {
			console.log('Error Loading Constants!!', arguments);
		}
	});
	
	$scope.logout = function(){
		//CommonDataService.logoutCall();
		$window.location="login.htm";
	}

	//Tenant Management configured key/value

	$scope.Constants = window.appConstants;

	//Tooltip Constant for Funnel

	$scope.Tooltip = window.appTooltipConstants;

	//Tenant Theme selection
	//Webservice call to get the theme name for tenant
	//Here hardcoded theme name as "red".

	$('<link/>', {
		rel: 'stylesheet',
		type: 'text/css',
		//href: 'css/themes/red.css'
	}).appendTo('head');

	UtilitiesService.initStorage();

	var requestData = {};
	var cacheKey = "labelConfig" + JSON.stringify(requestData);
	$scope.addData = function(result){
		$rootScope.explicitNameList = result.explicitNameList;
	}
	//For getting the table data
	function loadLabelData() {
		var func = $scope.addData; 
		if (arguments[1]) { 
			if (arguments[1].key == cacheKey) { 
				func = null; 
			} else { 
				return false; 
			} 
		}
		CommonDataService.getLabelConfig(requestData, func, $scope.fail);
	}
	loadLabelData();
	$scope.labelConstants = {
			//tabs
			//tracking
			"track_tab" : labelConfigService.getLabel('track_tab'),
			"summary_tab" : labelConfigService.getLabel('summary_tab'),
			"business_impact_tab" : labelConfigService.getLabel('business_impact_tab'),
			"engagement_activity_tab" : labelConfigService.getLabel('engagement_activity_tab'),
			"user_group_tab" : labelConfigService.getLabel('user_group_tab'),
			"home_tab" : labelConfigService.getLabel('home_tab'),
			//Decision Workbench
			"decision_workbench_tab" : labelConfigService.getLabel('decision_workbench_tab'),
			"index_tab":labelConfigService.getLabel('index_tab'),
			"reviewdo_tab":labelConfigService.getLabel('reviewdo_tab'),
			//Settings
			"settings_tab" :labelConfigService.getLabel('settings_tab'),
			
			//summary
			"track_summary_funnel": labelConfigService.getLabel('track_summary_funnel_title'),
			"track_summary_trend" : labelConfigService.getLabel('track_summary_trend_title'),
			"track_summary_funnel_visitors" : labelConfigService.getLabel('track_summary_funnel_visitors'),
			"track_summary_funnel_registrations" : labelConfigService.getLabel('track_summary_funnel_registrations'),
			"track_summary_metrics" : labelConfigService.getLabel('track_summary_metrics_title'),
			"track_summary_funnel_subscriptions" : labelConfigService.getLabel('track_summary_funnel_subscriptions'),
			"track_summary_funnel_cancellations" : labelConfigService.getLabel('track_summary_funnel_cancellations'),
			"track_summary_metrics_businessImpact" : labelConfigService.getLabel('track_summary_metrics_businessImpact'),
			"track_summary_metrics_engagementMetrics" : labelConfigService.getLabel('track_summary_metrics_engagementMetrics'),
			"track_summary_metrics_userGroup" : labelConfigService.getLabel('track_summary_metrics_userGroup'),
			"track_summary_funnel_acquisistionRate" : labelConfigService.getLabel('track_summary_funnel_acquisistionRate'),
			"track_summary_funnel_conversionRate" : labelConfigService.getLabel('track_summary_funnel_conversionRate'),
			"track_summary_funnel_churnRate" : labelConfigService.getLabel('track_summary_funnel_churnRate'),
			"track_summary_trend_title" : labelConfigService.getLabel('track_summary_trend_chart_title'),
			"track_summary_trend_left_title":labelConfigService.getLabel('track_summary_trend_chart_left_title'),
			"track_summary_trend_right_title":labelConfigService.getLabel('track_summary_trend_chart_right_title'),
			
			//businessImpact
			"track_BI_key_business_metrics" : labelConfigService.getLabel('track_BI_key_business_metrics_title'),
			"track_BI_key_summary" : labelConfigService.getLabel('track_BI_summary_title'),
			"track_BI_key_trend" : labelConfigService.getLabel('track_BI_trend_title'),
			"track_BI_deep_dive" : labelConfigService.getLabel('track_BI_deep_dive_title'),
			"track_BI_trend_title" : labelConfigService.getLabel('track_BI_trend_chart_title'),
		    "track_BI_deep_dive_user_group_column" : labelConfigService.getLabel('track_BI_deep_dive_user_group_column'),
		    "track_BI_deep_dive_wtd_actual_column" : labelConfigService.getLabel('track_BI_deep_dive_wtd_actual_column'),
		    
			//engagementActivity
			"track_EA_engagement_score" : labelConfigService.getLabel('track_EA_engagement_score_title'),
			"track_EA_engagement_score_trend" : labelConfigService.getLabel('track_EA_engagement_score_trend_title'),
			"track_EA_key_engagement_activity_matrices" : labelConfigService.getLabel('track_EA_key_engagement_activity_matrices_title'),
			"track_EA_summary" : labelConfigService.getLabel('track_EA_summary_title'),
			"track_EA_trend" : labelConfigService.getLabel('track_EA_trend_title'),
			"track_EA_deep_dive" : labelConfigService.getLabel('track_EA_deep_dive_title'),
			"track_EA_deep_dive_moduleEngagement" : labelConfigService.getLabel('track_EA_deep_dive_moduleEngagement'),
			"track_EA_deep_dive_conversionWeightage" :labelConfigService.getLabel('track_EA_deep_dive_conversionWeightage'),
		    "track_EA_deep_dive_moduleEngagement_actual" : labelConfigService.getLabel('track_EA_deep_dive_moduleEngagement_actual'),
		    "track_EA_deep_dive_moduleEngagement_user_group_column": labelConfigService.getLabel('track_EA_deep_dive_moduleEngagement_user_group_column'),
		    "track_EA_deep_dive_moduleEngagement_no_of_users" : labelConfigService.getLabel('track_EA_deep_dive_moduleEngagement_no_of_users'),
			
			//userGroup
			"track_UG_usergroup_metrics" : labelConfigService.getLabel('track_UG_usergroup_metrics_title'),
			"track_UG_summary": labelConfigService.getLabel('track_UG_summary_title'),
			"track_UG_trend" : labelConfigService.getLabel('track_UG_trend_title'),
			"track_UG_deep_dive" :labelConfigService.getLabel('track_UG_deep_dive_title'),
			"track_UG_trend_title" : labelConfigService.getLabel('track_UG_trend_chart_title'),
			"track_UG_deep_dive_engagement_view_user_group_column": labelConfigService.getLabel('track_UG_deep_dive_engagement_view_user_group_column'),
		    "track_UG_deep_dive_engagement_view_active_users_column": labelConfigService.getLabel('track_UG_deep_dive_engagement_view_active_users_column'),
		    "track_UG_deep_dive_engagement_view_average_login_column": labelConfigService.getLabel('track_UG_deep_dive_engagement_view_average_login_column'),
		    "track_UG_deep_dive_engagement_view_recurring_booking_column": labelConfigService.getLabel('track_UG_deep_dive_engagement_view_recurring_booking_column'),
		    "track_UG_deep_dive_engagement_view_arpu_column": labelConfigService.getLabel('track_UG_deep_dive_engagement_view_arpu_column'),
		    "track_UG_deep_dive_engagement_view_engagement_level_column": labelConfigService.getLabel('track_UG_deep_dive_engagement_view_engagement_level_column'),
		    "track_UG_deep_dive_engagement_view_engagement_score_column": labelConfigService.getLabel('track_UG_deep_dive_engagement_view_engagement_score_column'),
		    "track_UG_deep_dive_campaign_view_user_group_column": labelConfigService.getLabel('track_UG_deep_dive_campaign_view_user_group_column'),
	        "track_UG_deep_dive_campaign_view_no_of_users_column": labelConfigService.getLabel('track_UG_deep_dive_campaign_view_no_of_users_column'),
	        "track_UG_deep_dive_campaign_view_base_expected_conversion_column": labelConfigService.getLabel('track_UG_deep_dive_campaign_view_base_expected_conversion_column'),
	        "track_UG_deep_dive_campaign_view_campaign_impact_column": labelConfigService.getLabel('track_UG_deep_dive_campaign_view_campaign_impact_column'),
	        "track_UG_deep_dive_campaign_view_new_users_achieved": labelConfigService.getLabel('track_UG_deep_dive_campaign_view_new_users_achieved'),
	        "track_UG_deep_dive_campaign_view_compared_to_column": labelConfigService.getLabel('track_UG_deep_dive_campaign_view_compared_to_column'),
	        "track_UG_deep_dive_campaign_view_target_column": labelConfigService.getLabel('track_UG_deep_dive_campaign_view_target_column'),
	        "track_UG_deep_dive_campaign_view_conversion_uplift_column": labelConfigService.getLabel('track_UG_deep_dive_campaign_view_conversion_uplift_column'),
	        "track_UG_deep_dive_campaign_view_time_remaining_column":labelConfigService.getLabel('track_UG_deep_dive_campaign_view_time_remaining_column'),
			
			//index
			"dw_index_title": labelConfigService.getLabel('dw_index_title'),
			"dw_index_waterfall_chart_title": labelConfigService.getLabel('dw_index_waterfall_chart_title'),
			"dw_index_showing_data_title": labelConfigService.getLabel('dw_index_showing_data_title'),
			"dw_index_bubblechart_1_title": labelConfigService.getLabel('dw_index_bubblechart_1_title'),
			"dw_index_bubblechart_2_title": labelConfigService.getLabel('dw_index_bubblechart_2_title'),
			"dw_index_show_best_do_button_text": labelConfigService.getLabel('dw_index_show_best_do_button_text'),
			"dw_index_set_filters_button_text": labelConfigService.getLabel('dw_index_set_filters_button_text'),
			
			//Builddo
			"dw_builddo_title": labelConfigService.getLabel('dw_builddo_title'),
			"dw_builddo_waterfall_chart_title": labelConfigService.getLabel('dw_builddo_waterfall_chart_title'),
			"dw_builddo_review_panel_title": labelConfigService.getLabel('dw_builddo_review_panel_title'),
			"dw_builddo_decision_options_title": labelConfigService.getLabel('dw_builddo_decision_options_title'),
			"dw_builddo_remove_selection_btn_text" : labelConfigService.getLabel('dw_builddo_remove_selection_btn_text'),
			"dw_builddo_review_panel_save_btn_text" : labelConfigService.getLabel('dw_builddo_review_panel_save_btn_text'),
			
			//Reviewdo
			"dw_reviewdo_title": labelConfigService.getLabel('dw_reviewdo_title'),
			"dw_reviewdo_waterfall_chart_title": labelConfigService.getLabel('dw_reviewdo_waterfall_chart_title'),
			"dw_reviewdo_bubble_chart_title": labelConfigService.getLabel('dw_reviewdo_bubble_chart_title'),
			"dw_reviewdo_decision_options_title": labelConfigService.getLabel('dw_reviewdo_decision_options_title'),
			
			//filters
			"dw_filters_title": labelConfigService.getLabel('dw_filters_title'),
			"dw_filters_user_group_title": labelConfigService.getLabel('dw_filters_user_group_title'),
			"dw_filters_conversion_activity_title": labelConfigService.getLabel('dw_filters_conversion_activity_title'),
			"dw_filters_conversion_uplift_title": labelConfigService.getLabel('dw_filters_conversion_uplift_title'),
			"dw_filters_active_till_date_title": labelConfigService.getLabel('dw_filters_active_till_date_title'),
			"dw_filters_show_do_button_text": labelConfigService.getLabel('dw_filters_show_do_button_text'),
			"dw_filters_clear_filter_button_text": labelConfigService.getLabel('dw_filters_clear_filter_button_text'),
			"dw_filters_close_filter_button_text": labelConfigService.getLabel('dw_filters_close_filter_button_text'),
			"dw_filters_builddo_text": labelConfigService.getLabel('dw_filters_builddo_text')
	};
	
	/*-------------------Permissions Starts Here-------------------*/
	//-----Tracking Module
	//Summary
	$scope.isFunnelViewable = Permission.canViewSummaryFunnel();
	$scope.isTrendViewable = Permission.canViewSummaryTrend();
	$scope.isMetricsViewable = Permission.canViewSummaryMetrics();
	//Business Impact
	$scope.isBusinessImpactViewable = Permission.canViewTrackBusinessImpact();
	$scope.isBITrendVisible = Permission.canViewTrackBITrend();
	$scope.isBIDeepDiveViewable = Permission.canViewTrackBIDeepDive();
	//Engagement Metrics
	$scope.isEngagementMetricsViewable = Permission.canViewTrackEngagementMetrics();
	$scope.isEAScoreViewable = Permission.canViewEAScore();
	$scope.isEADeepDiveViewable = Permission.canViewEADeepDive();
	$scope.isEAEngagementTableViewable = Permission.canViewEAEngagementTable();
	//User Group Engagement
	$scope.isUserGroupViewable =  Permission.canViewUserGroup();
	$scope.isUGSummaryViewable =  Permission.canViewUGSummary();
	$scope.isUGTrendViewable =  Permission.canViewUGTrend();
	$scope.isUGDeepDiveViewable =  Permission.canViewUGDeepDive();

	//-----Decision Workbench Module
	//Set Goals
	$scope.isSetGoalsEditable = Permission.canEditSetGoals();
	//Review DO
	$scope.isReviewDOViewable = Permission.canViewReviewDO();
	$scope.isDOCostEditable = Permission.canEditDOCost();
	$scope.isDOResponsibilityEditable = Permission.canEditDOResponsibility();

	//-----Settings Module
	//Data Sync Page
	$scope.isDataSyncViewable = Permission.canDataSyncViewable();
	//Channels Page
	$scope.isChannelsViewable = Permission.canChannelsViewable();
	$scope.isChannelsEditable = Permission.canChannelsEditable();
	//Models page
	$scope.isModelsViewable = Permission.canModelsViewable();
	$scope.isModelsEditable = Permission.canModelsEditable();
	//Goals page
	$scope.isGoalsViewable = Permission.canGoalsViewable();
	$scope.isGoalsEditable = Permission.canGoalsEditable();
	//Users page
	$scope.isUsersViewable = Permission.canUsersViewable();
	$scope.isUsersEditable = Permission.canUsersEditable();
	//Audit Trail page
	$scope.isAuditTrailViewable = Permission.canAuditTrailViewable();
	$scope.isAuditTrailEditable = Permission.canAuditTrailEditable();
	//Label Config page
	$scope.isLabelConfigViewable = Permission.canLabelConfigViewable();
	$scope.isLabelConfigEditable = Permission.canLabelConfigEditable();

	/*-------------------Permissions Ends Here---------------------*/

	/*--------------------Tab visibility starts here-----------------*/
	//For Tracking Module
	$scope.isSummaryTabVisible = Permission.canViewTrackSummary();
	$scope.isBusinessImpactTabVisible = Permission.canViewTrackBusinessImpact();
	$scope.isEngagementTabVisible = Permission.canViewTrackEngagementMetrics();
	$scope.isUserGroupTabVisible = Permission.canViewUserGroup();

	// Track tab visbility
	$scope.isTrackTabVisible = !(!$scope.isSummaryTabVisible && !$scope.isBusinessImpactTabVisible && !$scope.isEngagementTabVisible && !$scope.isUserGroupTabVisible);
	//For Decision Workbench Module
	$scope.isDecisionWorkbenchTabVisible = !(!$scope.isSetGoalsEditable && !$scope.isReviewDOViewable);

	//-----Settings Module
	$scope.isSettingsTabVisible = !(!$scope.isDataSyncViewable && !$scope.isChannelsViewable && !$scope.isModelsViewable && !$scope.isGoalsViewable && !$scope.isUsersViewable && !$scope.isAuditTrailViewable && !$scope.islabelConfigViewable);

	/*--------------------Tab visibility ends here-----------------*/

}])
.controller("navLinkController",['$rootScope','$scope','DataService','$location','Permission',
                                 function($rootScope, $scope, DataService, $location, Permission){
	$rootScope.$on('$routeChangeSuccess', function(evt, cur, prev) {
		$scope.thisPage = $location.path();
	});
}]);

angular.module('Home',['ngRoute', 'AnalyticsApp'])
.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/:page', {
		templateUrl: function(params){ return 'app/Home/' + params.page + '.htm';}
	}).otherwise({
		redirectTo: '/login'
	});
}]);

angular.module('DecisionWorkbench',['ngRoute', 'AnalyticsApp', 'ngDragDrop','ngHandsontable'])
.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/:page', {
		templateUrl: function(params){ return 'app/DecisionWorkbench/' + params.page + '.htm';}
	}).otherwise({
		redirectTo: '/index'
	});
}]);

angular.module('Tracking',['ngRoute', 'AnalyticsApp'])
.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/:page', {
		templateUrl: function(params){ return 'app/Tracking/' + params.page + '.htm';}
	}).otherwise({
		redirectTo: '/summary'
	});
}]);

angular.module('Settings',['ngRoute','AnalyticsApp','ngTreetable','blueimp.fileupload','taiPlaceholder','ngHandsontable','millerColumnBrowser','restangular'])
.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/:page', {
		templateUrl: function(params){ return 'app/Settings/' + params.page + '.htm';}
	}).otherwise({
		redirectTo: '/dataSync'
	})
}]);


//Factory - returns data
//Service - returns functions/objects
//directives - functions to modify or interact with DOM