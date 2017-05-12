"use strict";

var moviesServices = angular.module('moviesServices', []);
var tvShowsServices = angular.module('tvShowsServices', []);

tvShowsServices.factory('TvShowsPager', ['TvShows', '$http', '$timeout', function(TvShows, $http, $timeout) {
    var TvShowsPager = function(sort, genre, search) {
        this.items = [];
        this.busy = false;
        this.after = 1;
        this.genre = genre;
        this.sort = sort;
        this.search = search;
    };

    TvShowsPager.prototype.nextPage = function() {
        if (this.busy) return;
        this.busy = true;
        var timeout = 1000;
        if (this.after == 1) {
            timeout = 0;
        }

        $timeout(function() {
            TvShows.list(this.sort, this.genre, this.search, this.after).success(function(data) {
                for (var i = 0; i < data.length; i++) {
                    if (data[i].network) {
                       data[i].network_slug = data[i].network.toLowerCase().replace(' ', '_');
                    }

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
    var API_LIST            = '/api/tv/shows';
    var API_DETAIL          = '/api/tv/show';

    var sorts = [
        'Updated',
        'Trending',
        'Rating',
        'Name',
        'Year',
    ];

    return {
        list : function(sort, genre, search, page) {
            var query = '';
            if (page !== undefined) {
                query += '/' + page;
            }

            if (sort !== undefined && sort !== 'Rating') {
                query += '?sort=' + sort.toLowerCase();
            }

            if (search !== undefined && search !== '') {
                if (query.indexOf('?') === undefined || query.indexOf('?') === -1) {
                    query += '?keywords=' + search;
                } else {
                    query += '&keywords=' + search;
                }
            }

            return $http.get(API_LIST + query, {cache: true});
        },

        get : function(id) {
            return $http.get(API_DETAIL + '/' + id, {cache: true});
        },

        getSorts : function() {
            return sorts;
        }
    };
}]);

moviesServices.factory('MoviesPager', ['Movie', '$http', '$timeout', function(Movie, $http, $timeout) {
    var MoviesPager = function(sort, quality, genre, keyword) {
        this.items = [];
        this.busy = false;
        this.after = 1;
        this.genre = genre;
        this.sort = sort;
        this.keyword = keyword;
        this.quality = quality;
    };

    MoviesPager.prototype.nextPage = function() {
        if (this.busy) return;
        this.busy = true;
        var timeout = 1000;
        if (this.after == 1) {
            timeout = 0;
        }

        $timeout(function() {
            Movie.list(this.sort, this.quality, this.genre, this.after, this.keyword).success(function(data) {
                for (var i = 0; i < data.data.movies.length; i++) {
                    var movie = data.data.movies[i];
                    movie.torrents.forEach(function(torrent) {
                        torrent.magnet = Movie.getMagnetLink(torrent, movie.title);
                    });
                    this.items.push(movie);
                }

                this.after++;
                this.busy = false;
                if (data.length < 1) {
                    this.busy = true;
                }

            }.bind(this));
        }.bind(this), timeout);
    };
    return MoviesPager;
}]);

moviesServices.factory('Movie', ['$http', function ($http) {
    var API_LIST        = '/api/movie/list';
    var API_DETAIL      = '/api/movie/info';
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
            if (sort === undefined) {
                sort = sorts[0];
            }

            if (quality === undefined) {
                quality = qualities[0];
            }

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