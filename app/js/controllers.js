'use strict';

var moviesControllers = angular.module('moviesControllers', []);

moviesControllers.controller('TvShowsListCtrl', ['$scope', 'TvShows', 'TvShowsPager', function($scope, TvShows, TvShowsPager) {
    $scope.genres = TvShows.getGenres();
    $scope.statuses = TvShows.getStatuses();

    $scope.$watch('[genre, status, search]', function(oldValue, newValue) {
        if (($scope.search === undefined || $scope.search === '') && (oldValue[2] === '' || oldValue[2] === undefined) && (newValue[2] !== undefined || oldValue[0] !== newValue[0] || oldValue[1] !== newValue[1])) {
            $scope.pager = new TvShowsPager($scope.status, $scope.genre);
            $scope.pager.nextPage();
        }

        if ($scope.search !== undefined && $scope.search !== '') {
            var result = TvShows.search($scope.search);
            if (result) {
                result.success(function(data) {
                    $scope.pager = new Object();
                    data.forEach(function(show) {
                        show.network_slug = show.network.toLowerCase().replace(' ', '_');
                    })
                    $scope.pager.items = data;
                });
            }
        }
    }, true);
    $scope.pager = new TvShowsPager($scope.status, $scope.genre);
}]);

moviesControllers.controller('TvShowsDetailCtrl', ['$scope', 'TvShows', '$routeParams', '$location', function ($scope, TvShows, $routeParams, $location) {
    $scope.tvshowId = $routeParams.tvshowId;
    $scope.episodes = new Object();
    $scope.url = $location.url();
    $(function () {
        $('#showsTab a:last').tab('show')
    });

    TvShows.get($scope.tvshowId).success(function(data) {
        data.network_slug = data.network.toLowerCase().replace(' ', '_');
        if (data.episodes !== undefined) {
            data.episodes.forEach(function(episode) {
                if (!(episode.season in $scope.episodes)) {
                    $scope.episodes[episode.season] = new Object();
                }
                $scope.episodes[episode.season][episode.tvdb_id] = episode;

            });
        }
        $scope.tvshow = data;
    });
}]);

moviesControllers.run(['$rootScope', '$location', '$timeout', '$window', 'Movie', function($rootScope, $location, $timeout, $window, Movie) {
    $rootScope.response = null;
    $rootScope.upload = function(url, name) {
        var torrentUrl = new Object();
        torrentUrl.url = url;
        torrentUrl.name = name;
        Movie.upload(torrentUrl).success(function(data) {
            if (data.download == 'local') {
                $window.location.href = data.url;
            }

            $rootScope.message = data.message;
            $rootScope.response = data.response;
            $timeout(function() {
                $rootScope.message = null;
            }, 2000);
        });
    }

    if ($location.$$search.search !== undefined) {
        $rootScope.search = $location.$$search.search;
    }

    $rootScope.$watch(
        'search',
        function() {
            if ($rootScope.search !== undefined && $rootScope.search !== '') {
                var path = $location.$$path.split('/');
                delete $location.$$search.search;
                $location.path(path[1]).search($location.$$search);
            }
        }
    );
}]);

moviesControllers.controller('MoviesListCtrl', ['$scope', '$timeout', '$routeParams', '$location', 'Movie', function($scope, $timeout, $routeParams, $location, Movie) {
    $scope.sorts = Movie.getSorts();
    $scope.genres = Movie.getGenres();
    $scope.qualities = Movie.getQualities();
    $scope.maxSize = 5;
    $scope.itemsPerPage = 20;

    if ($routeParams.page !== undefined) {
        $timeout(function() {
            $scope.currentPage = parseInt($routeParams.page);
        }, 1);
    }

    if ($routeParams.search !== undefined ) {
        $scope.search = $routeParams.search;
    }

    $scope.resetPage = function() {
        $scope.currentPage = 1;
    }

    $scope.$watch(
        '[sort, quality, genre, currentPage, search]',
        function(newValue, oldValue) {
            var timeout = 0;
            var genre = $scope.genre;

            if ($routeParams.sort !== undefined && oldValue[0] === newValue[0]) {
                $scope.sort = $routeParams.sort;
            }

            if ($routeParams.quality !== undefined && oldValue[1] === newValue[1]) {
                $scope.quality = $routeParams.quality;
            }

            if ($routeParams.genre !== undefined && oldValue[2] === newValue[2]) {
                $scope.genre = $routeParams.genre;
            }

            if ($scope.genre === 'All') {
                genre = undefined;
            }

            if (oldValue[4] !== newValue[4]) {
                timeout = 500;
            }

            $timeout(function() {
                var result = Movie.list($scope.sort, $scope.quality, $scope.genre, $scope.currentPage, $scope.search);
                if (result) {
                    result.success(function(data) {
                        if (data.status != 'ok') {
                            $scope.error = true;
                        }
                        $scope.totalItems = data.data.movie_count;
                        $scope.movies = data;

                        $scope.movies.data.movies.forEach(function(movie) {
                            movie.torrents.forEach(function(torrent) {
                                torrent.magnet = Movie.getMagnetLink(torrent, movie.title);
                            });
                        });
                    });
                }
            }, timeout);

            if ($scope.currentPage !== undefined || ($scope.search !== undefined && $scope.search !== '')) {
                var query       = new Object();
                query.sort      = $scope.sort;
                query.quality   = $scope.quality;

                if ($scope.search !== undefined && $scope.search.length > 2) {
                    query.search = $scope.search;
                }

                if (genre !== undefined) {
                    query.genre = $scope.genre;
                }

                if ($scope.currentPage !== undefined && $scope.currentPage !== 1) {
                    query.page = $scope.currentPage;
                }

                $location.path('/movies').search(query);
            }
        }, true
    );
}]);

moviesControllers.controller('MoviesDetailCtrl', ['$scope', '$location', 'Movie', '$routeParams', function ($scope, $location, Movie, $routeParams) {
    $scope.movieId = $routeParams.movieId;
    Movie.get($scope.movieId).success(function(data) {
        $scope.movie = data.data;
        $scope.movie.torrents.forEach(function(torrent) {
            torrent.magnet = Movie.getMagnetLink(torrent, $scope.movie.title);
        });
    });
}]);