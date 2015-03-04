angular.module('AnalyticsApp')
/*
 * Slider directive
 */
.directive("slider", function() {
	
	return {
		restrict : 'A',
		scope : {
			config : "=config",
			value : "=",
			max : '='
		},
		link : function(scope, elem, attrs) {
			var setModel = function(value) {
				scope.model = value;
			}
			// watching the max value
			scope.$watch('max', function(value) {
				elem.slider('option', 'max', value);
			});

			scope.$watch('value', function(value) {
				elem.slider('value', parseInt(value));
			});

			elem.slider({

				range : 'min',
				min : scope.config.min,
				max : scope.config.max,
				step : scope.config.step,
				slide : function(event, ui) {

					scope.$apply(function() {
						scope.value = ui.value;
						
					});

				}
			});
		}
	}
})