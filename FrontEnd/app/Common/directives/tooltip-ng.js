angular.module('AnalyticsApp')

.directive('myTooltip', ['$compile','$timeout',function ($compile, $timeout) {
    return {
        restrict: 'A',
        replace: true,
        link: function (scope, element, attrs, controller) {
            var html = "", activeClass = "";
            scope.$watch('scope.userData', function () {
                if (!scope.userData)
                    return false;
                $.each(scope.userData, function (key, user) {
                    activeClass = user.currentStatus == "underReview" ? 'active' : '';
                    html += '<div class="tooltipBubble ' + activeClass + '">' +
                            '<div class="flowArrow"></div>' +
                            '<span class="number">' + user.stepNo + '</span>' +
                            '<span class="name">' + user.approverName + '</span>' +
                        '</div>';
                });
                element.attr('title', '').tooltip({
                    position: {
                        my: "left-15 top+20",
                        at: "center bottom",
                        using: function (position, feedback) {
                            $(this).css(position);
                            $("<div>")
                        	.appendTo(this);
                        }
                    },
                    track: true,
                    content: '<div class="tooltipContainer">' +
                            html +
                        '</div>'
                });
            });


        },
        scope: {
            userData: "="
        }
    };
}]);