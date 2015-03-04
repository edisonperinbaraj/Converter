angular.module('AnalyticsApp')

.directive('chartLabelTooltip',['$compile','$timeout', function ($compile, $timeout) {
    console.log("chartLabelTooltip")
    return {
        restrict: 'A',
        replace: true,
        link: function (scope, element, attrs, controller) {
            var html = "", activeClass = "";
        	
        	element.attr('title', '').tooltip({
                position: {
                    my: "left-75 top+11",
                    at: "center bottom",
                    using: function (position, feedback) {
                        $(this).css(position);
                        $("<div>")
                        .addClass("arrow chartLabelTooltipArrow")
                        .addClass(feedback.vertical)
                        .addClass(feedback.horizontal)
                    	.appendTo(this);
                    }
                },
                show: { effect: "fade", duration: 1 },
                //track: true,
                tooltipClass: "chartLabelTooltip",
                content: '<div class=""><p>Start Date : <span>' + scope.startDate + '</span></p>' +
                '<p>End Date : <span>' + scope.endDate + '</span></p></div>'
            });


        },
        scope: {
            startDate: "@",
            endDate:"@"
        }
    };
}]);