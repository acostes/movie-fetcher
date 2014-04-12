"use strict";

var moviesServices = angular.module('moviesServices', []);

moviesServices.factory('Movie', ['$http', function ($http) {
    var API_LIST        = 'http://yts.re/api/list.json';
    var API_DETAIL      = 'http://yts.re/api/movie.json';
    var API_UPCOMING    = 'http://yts.re/api/upcoming.json';
    var genres = [
        'All',
        'Action',
        'Sci-Fi',
        'Thriller',
        'Drama',
        'Horror',
        'Animation',
        'Comedy',
        'Documentary',
        'Family',
        'Romance',
        'Sport',
        'Adventure',
        'Biography',
        'Crime',
        'Fantasy',
        'History',
        'Music',
        'Mystery',
        'Western',
    ];
    var qualities = [
        '720p',
        '1080p',
    ];
    var sorts = [
        'Date',
        'Seeds',
        'Peers',
        'Size',
        'Alphabet',
        'Rating',
        'Downloaded',
        'Year',
    ];

    return {
        list : function(sort, quality, genre, page, keyword) {
            var query = '?sort=' + sort + '&quality=' + quality;

            if (keyword !== undefined && keyword !== '' && keyword.length <= 2) {
                return null;
            }

            if (page !== undefined) {
                query += '&set=' + page;
            }

            if (keyword !== undefined && keyword.length > 2) {
                query += '&keywords=' + keyword;
            }

            if (genre !== undefined) {
                query += '&genre=' + genre;
            }
            return $http.get(API_LIST + query, {cache: true});
        },

        get : function(id) {
            return $http.get(API_DETAIL + '?id=' + id, {cache: true});
        },

        getSorts : function() {
            return sorts;
        },

        getQualities : function() {
            return qualities;
        },

        getGenres : function() {
            return genres;
        },

        upcoming : function() {
            return $http.get(API_UPCOMING, {cache: true});
        },

        upload : function(url) {
            return $http.post('/upload', url);
        }
    };
}]);