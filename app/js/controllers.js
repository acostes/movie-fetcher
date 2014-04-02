'use strict';

var moviesControllers = angular.module('moviesControllers', []);

moviesControllers.run(function($rootScope, $location) {
    $rootScope.$watch(
        'search',
        function() {
            if ($rootScope.search !== undefined && $rootScope.search !== '') {
                $location.path('/movies');
            }
        }
    );
});

moviesControllers.controller('MoviesListCtrl', ['$scope', '$timeout', 'Movie', function($scope, $timeout, Movie) {
    $scope.sorts = [
        {name: 'Date'},
        {name: 'Seeds'},
        {name: 'Peers'},
        {name: 'Size'},
        {name: 'Alphabet'},
        {name: 'Rating'},
        {name: 'Downloaded'},
        {name: 'Year'},
    ];

    $scope.genres = [
        {name: 'All'},
        {name: 'Action'},
        {name: 'Sci-Fi'},
        {name: 'Thriller'},
        {name: 'Drama'},
        {name: 'Horror'},
        {name: 'Animation'},
        {name: 'Comedy'},
        {name: 'Documentary'},
        {name: 'Family'},
        {name: 'Romance'},
        {name: 'Sport'},
        {name: 'Adventure'},
        {name: 'Biography'},
        {name: 'Crime'},
        {name: 'Fantasy'},
        {name: 'History'},
        {name: 'Music'},
        {name: 'Mystery'},
        {name: 'Western'},
    ];

    $scope.qualities = [
        {name: '720p'},
        {name: '1080p'},
    ];

    if ($scope.sort === undefined) {
        $scope.sort = $scope.sorts[0];
    }

    if ($scope.genre === undefined) {
        $scope.genre = $scope.genres[0];
    }

    if ($scope.quality === undefined) {
        $scope.quality = $scope.qualities[0];
    }

    if ($scope.currentPage === undefined) {
        $scope.currentPage = 1;
    }

    $scope.maxSize = 5;
    $scope.itemsPerPage = 20;

    $scope.$watch(
        '[sort, quality, genre, currentPage, search]',
        function(newValue, oldValue) {
            if (oldValue[0].name !== $scope.sort.name || oldValue[1].name !== $scope.quality.name || oldValue[2].name !== $scope.genre.name) {
                $scope.currentPage = 1;
            }

            $timeout(function() {
                var result = Movie.list($scope.sort, $scope.quality, $scope.genre, $scope.currentPage, $scope.search);
                if (result) {
                    result.success(function(data) {
                        $scope.totalItems = data.MovieCount;
                        $scope.movies = data;
                    });
                }
            }, 500);
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