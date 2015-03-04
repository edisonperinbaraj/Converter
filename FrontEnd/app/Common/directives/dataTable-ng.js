angular.module('AnalyticsApp')

.directive('myTable',[ '$compile','$timeout',function ($compile, $timeout) {
    console.log("in directive")
    return {
        restrict: 'E, A, C',
        replace: true,
        link: function (scope, element, attrs, controller) {
            var dataTable = element.dataTable(scope.options);
            scope.options = scope.options;
            scope.$watch('options.aaData', handleModelUpdates, true);

            $(element).on('page.dt', function () {
                $timeout(function () { $compile(element.contents())(scope); }, 10);
            });

            function handleModelUpdates(newData) {
                scope.userData = scope.otherData;
                var data = newData || null;
                if (data) {
                    dataTable.fnClearTable();
                    dataTable.fnAddData(data);
                }
                $compile(element.contents())(scope);
            }
            $timeout(function () { $compile(element.contents())(scope); },10);
        },
        scope: {
            options: "=",
            tableData: '=',
            otherData: '='
        }
    };
}]);