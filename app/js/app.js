"use strict";

var moviesApp = angular.module('moviesApp', [
    'ngRoute',
    'ui.bootstrap',
    'moviesControllers',
    'moviesFilters',
    'moviesServices',
    'tvShowsServices',
    'infinite-scroll',
]);

moviesApp.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
            when('/tvshows', {
                templateUrl: 'partials/tvshows.html',
                controller : 'TvShowsListCtrl',
                reloadOnSearch: false,
            }).
            when('/tvshows/:tvshowId', {
                templateUrl: 'partials/tvshows-detail.html',
                controller : 'TvShowsDetailCtrl',
                reloadOnSearch: false,
            }).
            when('/movies', {
                templateUrl: 'partials/movies.html',
                controller : 'MoviesListCtrl',
                reloadOnSearch: false,
            }).
            when('/movies/upcoming', {
                templateUrl: 'partials/upcoming.html',
                controller:  'UpcomingCtrl',
            }).
            when('/movies/:movieId', {
                templateUrl: 'partials/movies-detail.html',
                controller : 'MoviesDetailCtrl'
            }).
            otherwise({
                redirectTo: '/movies'
            });
    }
]);