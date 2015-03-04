angular.module('AnalyticsApp')

.directive('myDelayedTable', function ($compile, $timeout) {
    return {
        restrict: 'E, A, C',
        replace: true,
        link: function (scope, element, attrs, controller) {
            scope.$watch('trigger', triggerDataTable, true);
            
            function triggerDataTable(triggerFlag) {
            	console.log('TRIGGER UPDATED', triggerFlag);
            	if(triggerFlag == true){
            		console.log("scope.options", scope.options)
            		element.empty();
            		element.append("<table class='GDtable' my-table options='options'>");
                    $compile(element.contents())(scope);
            	}else
            		element.empty();
            }
            $compile(element.contents())(scope);
        },
        scope: {
            trigger: "=",
            options:"=",
            tableData: '=',
            otherData: '='
        }
    };
});