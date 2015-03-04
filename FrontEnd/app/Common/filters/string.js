angular.module('AnalyticsApp')

.filter('trimString', ['$filter', function ($filter) {
    return function (input) {
        return input.trim();
    };
} ]);