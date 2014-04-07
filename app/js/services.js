"use strict";

var moviesServices = angular.module('moviesServices', []);

moviesServices.factory('Movie', ['$http', '$timeout', function ($http, $timeout) {
    var API_LIST        = 'http://yts.re/api/list.json';
    var API_DETAIL      = 'http://yts.re/api/movie.json';
    var API_UPCOMING    = 'http://yts.re/api/upcoming.json';

    return {
        list : function(sort, quality, genre, page, keyword) {
            var query = '?sort=' + sort.name + '&quality=' + quality.name + '&set=' + page;

            if (keyword !== undefined && keyword !== '' && keyword.length <= 2) {
                return null;
            }

            if (keyword !== undefined && keyword.length > 2) {
                query += '&keywords=' + keyword;
            }

            if (genre.name !== 'All') {
                query += '&genre=' + genre.name;
            }

            return $http.get(API_LIST + query, {cache: true});
        },

        get : function(id) {
            return $http.get(API_DETAIL + '?id=' + id, {cache: true});
        },

        upcoming : function() {
            return $http.get(API_UPCOMING, {cache: true});
        },

        upload : function(url) {
            return $http.post('/upload', url);
        }
    };
}]);