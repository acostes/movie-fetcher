'use strict';

var moviesControllers = angular.module('moviesControllers', []);

moviesControllers.run(['$rootScope', '$location', '$timeout', '$window', 'Movie', function($rootScope, $location, $timeout, $window, Movie) {
    $rootScope.response = null;
    $rootScope.upload = function(url) {
        var torrentUrl = new Object();
        torrentUrl.url = url;
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
            if ($rootScope.search !== undefined || $rootScope.search !== '') {
                delete $location.$$search.search;
                $location.path('/movies').search($location.$$search);
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
                var result = Movie.list($scope.sort, $scope.quality, genre, $scope.currentPage, $scope.search);
                if (result) {
                    result.success(function(data) {
                        $scope.totalItems = data.MovieCount;
                        $scope.movies = data;
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
                    query.genre = genre;
                }

                if ($scope.currentPage !== undefined) {
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
        $scope.movie = data;
    });
}]);

moviesControllers.controller('UpcomingCtrl', ['$scope', '$location', 'Movie', function($scope, $location, Movie) {
    Movie.upcoming().success(function(data) {
        $scope.movies = data;
    });
}]);