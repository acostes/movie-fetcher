'use strict';

var moviesControllers = angular.module('moviesControllers', []);

moviesControllers.run(function($rootScope, $location, $timeout, $window, Movie) {
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

    $rootScope.$watch(
        'search',
        function() {
            if ($rootScope.search !== undefined && $rootScope.search !== '') {
                $location.path('/movies');
            }
        }
    );
});

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

    $scope.resetPage = function() {
        $scope.currentPage = 1;
    }

    $scope.$watch(
        '[sort, quality, genre, currentPage, search]',
        function(newValue, oldValue) {
            var timeout = 0;
            if ($routeParams.sort !== undefined && oldValue[0] === newValue[0]) {
                $scope.sort = $routeParams.sort;
            }

            if ($routeParams.quality !== undefined && oldValue[1] === newValue[1]) {
                $scope.quality = $routeParams.quality;
            }

            if ($routeParams.genre !== undefined && oldValue[2] === newValue[2]) {
                $scope.genre = $routeParams.genre;
            }

            if (oldValue[4] !== newValue[4]) {
                timeout = 500;
            }

            $timeout(function() {
                var result = Movie.list($scope.sort, $scope.quality, $scope.genre, $scope.currentPage, $scope.search);
                if (result) {
                    result.success(function(data) {
                        $scope.totalItems = data.MovieCount;
                        $scope.movies = data;
                    });
                }
            }, timeout);

            if ($scope.currentPage !== undefined) {
                var query       = new Object();
                query.page      = $scope.currentPage;
                query.sort      = $scope.sort;
                query.quality   = $scope.quality;
                query.genre     = $scope.genre;
                if ($scope.search !== undefined) {
                    query.search = $scope.search;
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