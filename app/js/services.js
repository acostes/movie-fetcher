"use strict";

var moviesServices = angular.module('moviesServices', []);
var tvShowsServices = angular.module('tvShowsServices', []);

tvShowsServices.factory('TvShowsPager', ['TvShows', '$http', '$timeout', function(TvShows, $http, $timeout) {
    var TvShowsPager = function(status, genre) {
        this.items = [];
        this.busy = false;
        this.after = 1;
        this.genre = genre;
        this.status = status;
    };

    TvShowsPager.prototype.nextPage = function() {
        if (this.busy) return;
        this.busy = true;
        var timeout = 1000;
        if (this.after == 1) {
            timeout = 0;
        }

        $timeout(function() {
            TvShows.list(this.status, this.genre, this.after).success(function(data) {
                for (var i = 0; i < data.length; i++) {
                    data[i].network_slug = data[i].network.toLowerCase().replace(' ', '_');
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
    var genres = [
        'All',
        'Comedy',
        'News',
        'Talk Show',
        'Drama',
        'Western',
        'Family',
        'Romance',
        'Action',
        'Science Fiction',
        'Thriller',
        'Adventure',
        'Fantasy',
        'Horror',
        'Crime',
    ];

    var statuses = [
        'All',
        'Continuing',
        'Ended',
    ];

    return {
        list : function(status, genre, page) {
            var query = '';
            if (page !== undefined && page !== 1) {
                query += '/' + page;
            }

            if (status !== 'All' && status !== undefined) {
                query += '?status=' + status;
            }

            if (genre !== 'All' && genre !== undefined) {
                var param = '?';
                if (query.indexOf('?') > -1) {
                    param = '&';
                }
                query += param + 'genres=' + genre;
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
        },

        getGenres : function() {
            return genres;
        },

        getStatuses : function() {
            return statuses;
        }
    };
}]);

moviesServices.factory('Movie', ['$http', function ($http) {
    var API_LIST        = 'https://yts.re/api/v2/list_movies.json';
    var API_DETAIL      = 'https://yts.re/api/v2/movie_details.json';
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
        'Date_added',
        'Seeds',
        'Peers',
        'Like_count',
        'Downloaded_count',
        'Title',
        'Rating',
        'Year',
    ];

    return {
        list : function(sort, quality, genre, page, keyword) {
            var query = '?sort_by=' + sort + '&quality=' + quality;

            if (keyword !== undefined && keyword !== '' && keyword.length <= 2) {
                return null;
            }

            if (page !== undefined && page !== 1) {
                query += '&page=' + page;
            }

            if (keyword !== undefined && keyword.length > 2) {
                query += '&query_term=' + keyword;
            }

            if (genre !== undefined && genre !== 'All') {
                query += '&genre=' + genre;
            }
            return $http.get(API_LIST + query, {cache: true});
        },

        get : function(id) {
            return $http.get(API_DETAIL + '?movie_id=' + id + '&with_images=true&with_cast=true', {cache: true});
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

        getMagnetLink : function(torrent, title) {
            return 'magnet:?xt=urn:btih:' + torrent.hash + '&dn=' + title
                + '&amp;tr=http%3A%2F%2Ftracker.yify-torrents.com%2Fannounce&amp;tr=udp%3A%2F%2Ftracker.openbittorrent.com%3A80&amp;tr=udp%3A%2F%2Ftracker.publicbt.org%3A80&amp;tr=udp%3A%2F%2Ftrackr.sytes.net%3A80&amp;tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&amp;tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&amp;tr=udp%3A%2F%2Fopen.demonii.com%3A1337';
        },

        upload : function(url) {
            return $http.post('/upload', url);
        }
    };
}]);