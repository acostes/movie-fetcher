"use strict";

var moviesServices = angular.module('moviesServices', []);
var tvShowsServices = angular.module('tvShowsServices', []);

tvShowsServices.factory('TvShowsPager', ['TvShows', '$http', '$timeout', function(TvShows, $http, $timeout) {
    var TvShowsPager = function() {
        this.items = [];
        this.busy = false;
        this.after = 1;
    };

    TvShowsPager.prototype.nextPage = function() {
        if (this.busy) return;
        this.busy = true;
        var timeout = 1000;
        if (this.after == 1) {
            timeout = 0;
        }

        $timeout(function() {
            TvShows.list(this.after).success(function(data) {
                for (var i = 0; i < data.length; i++) {
                    this.items.push(data[i]);
                }

                this.after++;
                this.busy = false;
                if (data.length < 1) {
                    this.busy = true;
                }

            }.bind(this));
        }.bind(this), timeout);
    };
    return TvShowsPager;
}]);

tvShowsServices.factory('TvShows', ['$http',  function ($http) {
    var API_LIST            = 'http://download.hirua.net/api/shows';
    var API_DETAIL          = 'http://download.hirua.net/api/show/';
    var API_LAST_UPDATED    = 'http://download.hirua.net/api/shows/last_updated';
    var API_SEARCH          = 'http://download.hirua.net/api/shows/search/';

    return {
        list : function(page) {
            var query = '';
            if (page !== undefined && page !== 1) {
                query += '/' + page;
            }
            return $http.get(API_LIST + query, {cache: true});
        },

        get : function(id) {
            return $http.get(API_DETAIL + id, {cache: true});
        },

        lastUpdated : function(page) {
            return $http.get(API_LAST_UPDATED, {cache: true});
        },

        search : function(keyword) {
            return $http.get(API_SEARCH + keyword, {cache: true});
        }
    };
}]);

moviesServices.factory('Movie', ['$http', function ($http) {
    var API_LIST        = 'https://yts.re/api/list.json';
    var API_DETAIL      = 'https://yts.re/api/movie.json';
    var API_UPCOMING    = 'https://yts.re/api/upcoming.json';
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

            if (page !== undefined && page !== 1) {
                query += '&set=' + page;
            }

            if (keyword !== undefined && keyword.length > 2) {
                query += '&keywords=' + keyword;
            }

            if (genre !== undefined && genre !== 'All') {
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