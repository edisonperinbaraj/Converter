angular.module('Tracking')

.controller("channelTrackerInitController",function($scope, CustomService, ChartOptionsService, DataService, UtilitiesService)
{
	angular.element(document).ready(function () {
               var chartOBJ = {};
                var classNames = [];
               /* $('.groupTime').click(function () {
                    classNames = $(this).attr('class').split((/\s+/));
                    chartId = $(this).parent().attr('class').split((/\s+/));

                    if (chartId[1] == "pieChart") {
                    	console.log("class:",classNames[2])
                        chartOBJ = $('#' + chartId[1]).renderChart("pie", Data.channelTracker.pieChart[classNames[2]]['today'], Data.channelTracker.pieChart.chartOptions);

                    } else {
                        chartOBJ = $('#' + chartId[1]).renderChart("line", Data.channelTracker.trend[classNames[2]], Data.channelTracker.trend.chartOptions);
                        $('.groupTime.trendTime.active').removeClass('active');
                    }
                    $(this).addClass('active');
                });
               chartOBJ = $('#pieChart').renderChart("pie", DataService.getChannelSummary().campaign.today, ChartOptionsService.getChannelSummary().chartOptions);
               $('.groupTime.time.active').removeClass('active');
                $('.groupTime.time.today').addClass('active');
                $('.groupTime.campaign').addClass('active');

                chartOBJ = $('#trendChart').renderChart("line", DataService.getChannelTrend().previousDays, ChartOptionsService.getChannelTrend().chartOptions);
                $('.groupTime.trendTime.active').removeClass('active');
                $('.groupTime.trendTime.previousDays').addClass('active');*/
				setTimeout(function(){CustomService.appInit();},1);
	});	
	UtilitiesService.getTotalMemory();
				
})

.controller("channelSummaryController",function($scope, CustomService, ChartOptionsService, DataService)
{
	var channelSummaryData = DataService.getChannelSummary().campaign.today;
	var channelSummaryChartData = ChartOptionsService.getChannelSummary().chartOptions;
	
	chartOBJ = $('#pieChart').renderChart("pie", channelSummaryData, channelSummaryChartData);
	$scope.channelSummary = DataService.getTrackSummaryDataCP();

})

.controller("selectedWidgetSummaryController",function($scope,DataService)
{
	$scope.ChannelTrackerWidgetSummary = DataService.getTrackChannelTrackerSummary();
})

.controller("selectedWidgetTrendController",function($scope, CustomService, ChartOptionsService, DataService)
{
	var channelTrendData = DataService.getChannelTrend().previousDays;
	var channelTrendChartData = ChartOptionsService.getChannelTrend().chartOptions;
	
	chartOBJ = $('#trendChart').renderChart("line", channelTrendData, channelTrendChartData);
})
.controller("selectedWidgetDeepDiveController",function($scope,DataService)
{
	$scope.deepDive = DataService.getTrackChannelTrackerDeepDive();
})