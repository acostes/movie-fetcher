'use strict';

var moviesControllers = angular.module('moviesControllers', []);

moviesControllers.controller('TvShowsListCtrl', ['$scope', 'TvShows', 'TvShowsPager', function($scope, TvShows, TvShowsPager) {
    $scope.sorts = TvShows.getSorts();

    $scope.$watch('[genre, sort, search]', function(oldValue, newValue) {
        if (($scope.search === undefined || $scope.search === '') && (oldValue[2] === '' || oldValue[2] === undefined) && (newValue[2] !== undefined || oldValue[0] !== newValue[0] || oldValue[1] !== newValue[1])) {
            $scope.pager = new TvShowsPager($scope.sort, $scope.genre);
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
    $scope.pager = new TvShowsPager($scope.sorts[0], $scope.genre);
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

moviesControllers.controller('MoviesListCtrl', ['$scope', 'Movie', 'MoviesPager', function($scope, Movie, MoviesPager) {
    $scope.sorts = Movie.getSorts();
    $scope.genres = Movie.getGenres();
    $scope.qualities = Movie.getQualities();

    $scope.$watch('[sort, quality, genre, search]', function(oldValue, newValue) {
        if (($scope.search === undefined || $scope.search === '')) {
            for (var i = 0; i < oldValue.length; i++) {
                if (oldValue[i] != newValue[i]) {
                   $scope.pager = new MoviesPager($scope.sort, $scope.quality, $scope.genre, $scope.search);
                   $scope.pager.nextPage();
                }
            }
        }

        if ($scope.search !== undefined && $scope.search !== '') {
            var result = Movie.list($scope.sort, $scope.quality, $scope.genre, $scope.page, $scope.search);
            if (result) {
                result.success(function(data) {
                    $scope.pager = new Object();
                    $scope.pager.items = data.data.movies;
                });
            }
        }
    }, true);
    $scope.pager = new MoviesPager($scope.sort, $scope.quality, $scope.genre, $scope.search);
}]);

moviesControllers.controller('MoviesDetailCtrl', ['$scope', '$location', 'Movie', '$routeParams', function ($scope, $location, Movie, $routeParams) {
    $scope.movieId = $routeParams.movieId;
    $scope.url = $location.url();
    Movie.get($scope.movieId).success(function(data) {
        $scope.movie = data.data.movie;
        $scope.movie.torrents.forEach(function(torrent) {
            torrent.magnet = Movie.getMagnetLink(torrent, $scope.movie.title);
        });
    });
}]);