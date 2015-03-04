angular.module('AnalyticsApp')

.directive('datepicker', function () {

    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attrs, ngModelCtrl) {
            var processChange = function (selectedDate) {
                if (element.attr('id') == 'from') {
                    $('#to').datepicker("option", "minDate", selectedDate);
                }
                scope.$apply(function () {
                    ngModelCtrl.$setViewValue(selectedDate);
                });
            };
            element.datepicker({
                changeMonth: true,
                changeYear: true,
                onSelect: processChange
            });
        }
    }
});