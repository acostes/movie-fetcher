"use strict";

var moviesFilters = angular.module('moviesFilters', []);

moviesFilters.filter('rate', function () {

    var stars = {
        1: '\u2605',
        2: '\u2605\u2605',
        3: '\u2605\u2605\u2605',
        4: '\u2605\u2605\u2605\u2605',
        5: '\u2605\u2605\u2605\u2605\u2605',
    };

    return function(startCount) {
        if (startCount > 10) {
            var count = Math.round((startCount/100) * 5);
        } else {
            var count = Math.round(startCount/2);
        }

        if (stars[count] === undefined) return 'N/A';
        return stars[count];
    };
});