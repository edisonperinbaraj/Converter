angular.module('AnalyticsApp')

.directive('a', function () {
    return {
        restrict: 'E',
        link: function (scope, elem, attrs) {
            if (attrs.ngClick || attrs.href === '' || attrs.href === '#') {
                elem.on('click', function (e) {
                    e.preventDefault();
                });
            }
        }
    };
})

.directive('ngDynBindModel',['$compile', function ($compile) {
    return {
        compile: function (tEl, tAtr) {
            tEl[0].removeAttribute('ng-dyn-bind-model')
            return function (scope) {
                tEl[0].setAttribute('ng-model', tAtr.ngDynBindModel)
                $compile(tEl[0])(scope)
            }
        }
    }
}])

.directive("selectMultiple", ['$compile',function($compile) {
	
	return {
		restrict : 'A',
		scope : {
			values : "=values",
			heading: "@heading"
		},
		template : 	'<h2 class="fieldHeading">{{heading}}</h2>'+
					'<div class="ui-controlgroup-controls">'+
						'<div class="ui-checkbox" ng-repeat="value in values">'+
						'	<label for=\'{{value[entityName+"Id"]}}\'><input type="checkbox"  id=\'{{value[entityName+"Id"]}}\' class="custom" ng-model="values[$index].selected" ><span>{{value[entityName+"Name"]}}</span></label>'+
						'</div>'+
					'</div>',
		link : function(scope, elem, attrs) {
			scope.entityName = attrs.values.split('List')[0];
			elem.find('.ui-controlgroup-controls').mCustomScrollbar()
			$compile(elem.contents())(scope);
			
		}
	}
}])

.directive('contenteditable', ['$sce', function($sce) {
	  return {
		    restrict: 'A', // only activate on element attribute
		    require: '?ngModel', // get a hold of NgModelController
		    link: function(scope, element, attrs, ngModel) {
		      if (!ngModel) return; // do nothing if no ng-model
		      console.log('IN DIRECTIVE',ngModel)
		      // Specify how UI should be updated
		      ngModel.$render = function() {
		    	  console.log('ELEM',element.html())
			       element.html($sce.getTrustedHtml(ngModel.$viewValue || ''));
		      };

		      // Listen for change events to enable binding
		      element.on('blur keyup change', function() {
		    	  console.log('EDITED')
		        scope.$evalAsync(read);
		      });
		      read(); // initialize

		      // Write data to the model
		      function read() {
		        var html = element.html();
		        console.log('HTM',html)
		        // When we clear the content editable the browser leaves a <br> behind
		        // If strip-br attribute is provided then we strip this out
		        if ( attrs.stripBr && html == '<br>' ) {
		          html = '';
		        }
		        ngModel.$setViewValue(html);
		      }
		    }
		  };
		}])

.directive("customScrollBox", ['$compile',function($compile) {
	
	return {
		restrict : 'A',
		link : function(scope, elem, attrs) {
			elem.mCustomScrollbar();
		}
	}
}]);