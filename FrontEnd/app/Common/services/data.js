angular.module('AnalyticsApp')

.service('CommonDataService',['UtilitiesService', 'RequestConstantsFactory','NetworkService',function(UtilitiesService, RequestConstantsFactory, NetworkService){
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
			    "explicitNameList": [{"key":"track_tab","value":""},{"key":"summary_tab","value":""},{"key":"business_impact_tab","value":""},{"key":"engagement_activity_tab","value":""},{"key":"user_group_tab","value":""},{"key":"home_tab","value":""},{"key":"decision_workbench_tab","value":""},{"key":"index_tab","value":""},{"key":"reviewdo_tab","value":""},{"key":"settings_tab","value":""},{"key":"track_summary_funnel_title","value":""},{"key":"track_summary_trend_title","value":""},{"key":"track_summary_funnel_visitors","value":""},{"key":"track_summary_funnel_registrations","value":""},{"key":"track_summary_metrics_title","value":""},{"key":"track_summary_funnel_subscriptions","value":""},{"key":"track_summary_funnel_cancellations","value":""},{"key":"track_summary_metrics_businessImpact","value":""},{"key":"track_summary_metrics_engagementMetrics","value":""},{"key":"track_summary_metrics_userGroup","value":""},{"key":"track_summary_funnel_acquisistionRate","value":""},{"key":"track_summary_funnel_conversionRate","value":""},{"key":"track_summary_funnel_churnRate","value":""},{"key":"track_summary_trend_chart_title","value":""},{"key":"track_summary_trend_chart_title","value":""},{"key":"track_summary_trend_chart_left_title","value":""},{"key":"track_summary_trend_chart_right_title","value":"New Paid Users"},{"key":"track_BI_key_business_metrics_title","value":""},{"key":"track_BI_summary_title","value":""},{"key":"track_BI_trend_title","value":""},{"key":"track_BI_deep_dive_title","value":""},{"key":"track_BI_deep_dive_user_group_column","value":""},{"key":"track_BI_deep_dive_wtd_actual_column","value":""},{"key":"track_BI_trend_chart_title","value":""},{"key":"track_EA_engagement_score_title","value":""},{"key":"track_EA_engagement_score_trend_title","value":""},{"key":"track_EA_key_engagement_activity_matrices_title","value":""},{"key":"track_EA_summary_title","value":""},{"key":"track_EA_trend_title","value":""},{"key":"track_EA_deep_dive_title","value":""},{"key":"track_EA_deep_dive_moduleEngagement","value":""},{"key":"track_EA_deep_dive_conversionWeightage","value":""},{"key":"track_EA_deep_dive_moduleEngagement_user_group_column","value":""},{"key":"track_EA_deep_dive_moduleEngagement_actual_vs_column","value":""},{"key":"track_EA_deep_dive_moduleEngagement_no_of_users","value":""},{"key":"track_UG_trend_chart_title","value":""},{"key":"track_UG_usergroup_metrics_title","value":""},{"key":"track_UG_summary_title","value":""},{"key":"track_UG_trend_title","value":""},{"key":"track_UG_deep_dive_title","value":""},{"key":"track_UG_deep_dive_engagement_view_user_group_column","value":""},{"key":"track_UG_deep_dive_engagement_view_active_users_column","value":""},{"key":"track_UG_deep_dive_engagement_view_average_login_column","value":""},{"key":"track_UG_deep_dive_engagement_view_recurring_booking_column","value":""},{"key":"track_UG_deep_dive_engagement_view_arpu_column","value":""},{"key":"track_UG_deep_dive_engagement_view_engagement_level_column","value":""},{"key":"track_UG_deep_dive_engagement_view_engagement_score_column","value":""},{"key":"track_UG_deep_dive_campaign_view_user_group_column","value":""},{"key":"track_UG_deep_dive_campaign_view_no_of_users_column","value":""},{"key":"track_UG_deep_dive_campaign_view_base_expected_conversion_column","value":""},{"key":"track_UG_deep_dive_campaign_view_campaign_impact_column","value":""},{"key":"track_UG_deep_dive_campaign_view_new_users_achieved","value":""},{"key":"track_UG_deep_dive_campaign_view_compared_to_column","value":""},{"key":"track_UG_deep_dive_campaign_view_target_column","value":""},{"key":"track_UG_deep_dive_campaign_view_conversion_uplift_column","value":""},{"key":"track_UG_deep_dive_campaign_view_time_remaining_column","value":""},{"key":"dw_index_title","value":""},{"key":"dw_index_waterfall_chart_title","value":""},{"key":"dw_index_showing_data_title","value":""},{"key":"dw_index_bubblechart_1_title","value":""},{"key":"dw_index_bubblechart_2_title","value":""},{"key":"dw_index_show_best_do_button_text","value":""},{"key":"dw_index_set_filters_button_text","value":""},{"key":"dw_builddo_title","value":""},{"key":"dw_builddo_waterfall_chart_title","value":""},{"key":"dw_builddo_review_panel_title","value":""},{"key":"dw_builddo_decision_options_title","value":""},{"key":"dw_builddo_remove_selection_btn_text","value":""},{"key":"dw_builddo_review_panel_save_btn_text","value":""},{"key":"dw_reviewdo_title","value":""},{"key":"dw_reviewdo_waterfall_chart_title","value":""},{"key":"dw_reviewdo_bubble_chart_title","value":""},{"key":"dw_reviewdo_decision_options_title","value":""},{"key":"dw_filters_title","value":""},{"key":"dw_filters_user_group_title","value":""},{"key":"dw_filters_conversion_activity_title","value":""},{"key":"dw_filters_conversion_uplift_title","value":""},{"key":"dw_filters_active_till_date_title","value":""},{"key":"dw_filters_show_do_button_text","value":""},{"key":"dw_filters_clear_filter_button_text","value":""},{"key":"dw_filters_close_filter_button_text","value":""},{"key":"dw_filters_builddo_text","value":""}] 
		};
		success(result);
	};	
	
	this.logoutCall = function(){
		NetworkService.get(RequestConstantsFactory['LOGOUT_URL']);
	}
	
}])


