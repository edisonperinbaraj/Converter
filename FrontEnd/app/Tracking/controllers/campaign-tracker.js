angular.module('Tracking')

.controller("campaignTrackerInitController",function($scope, CustomService ,DataService, ChartOptionsService, UtilitiesService)
{
	angular.element(document).ready(function () {
			var chartOBJ = {};
            var classNames = [];
          /*  $('.groupTime').click(function(){
            classNames = $(this).attr('class').split((/\s+/));
            chartId = $(this).parent().attr('class').split((/\s+/));
            chartOBJ = $('#'+chartId[1]).renderChart(classNames[3], Data.businessImpact[classNames[1]][classNames[2]],Data.businessImpact[classNames[1]].chartOptions);
            $('.groupTime.'+classNames[1]+'.active').removeClass('active');
            $(this).addClass('active');
		
				
            });
            console.log("data:",DataService.getCampaignConvActivity().today)
             console.log("Data:",Data.campaignTracker.convActivity['today'])*/
            setTimeout(function(){CustomService.appInit();},1);
	});
	UtilitiesService.getTotalMemory();
})


.controller("campaignSummaryController",function($scope, CustomService ,DataService, ChartOptionsService)
{
	$scope.campaignSummary = DataService.getTrackCampaignTrackerSummary();
	var convActivityData = DataService.getCampaignConvActivity().today;
	var convActivityChartData =  ChartOptionsService.getCampaignConvActivity().chartOptions;
	var topCampaignData = DataService.getTopCampaign().today;
	var topCampaignChartData = ChartOptionsService.getTopCampaign().chartOptions;
	
	chartOBJ = $('#pieChart').renderChart("pie", convActivityData, convActivityChartData);
	chartOBJ = $('#barChart').renderChart("bar", topCampaignData, topCampaignChartData);
})

.controller("campaignsController",function($scope,DataService)
{
	$scope.campaignTracker = DataService.getTrackSummaryDataCT();
})

.controller("selectedCampaignSummaryController",function($scope,DataService)
{
	$scope.selectedCampaignSummary = DataService.getTrackSelectedCampaignSummary();
})

.controller("selectedCampaignTrendController",function($scope, CustomService ,DataService, ChartOptionsService)
{
	var campaignTrendData = DataService.getCampaignTrend().week;
	var campaignTrendChartData = ChartOptionsService.getCampaignTrend().chartOptions;
	var campaignStackedData = DataService.getCampaignStackedColumn().week;
	var campaignStackedChartData = ChartOptionsService.getCampaignStackedColumn().chartOptions;

	chartOBJ = $('#trendlineChart').renderChart("line", campaignTrendData, campaignTrendChartData);
	chartOBJ = $('#trendcolumnChart').renderChart("stackedColumn", campaignStackedData, campaignStackedChartData);
})

.controller("selectedCampaignDeepDiveController",function($scope,DataService)
{
	$scope.deepDive = DataService.getTrackCampaignTrackerDeepDive();
	$scope.bestCampaign = DataService.getTrackCampaignTrackerBestCampaign();
	$scope.worstCampaign = DataService.getTrackCampaignTrackerWorstCampaign();


})