"use strict";

var moviesApp = angular.module('moviesApp', [
    'ngRoute',
    'ui.bootstrap',
    'moviesControllers',
    'moviesFilters',
    'moviesServices'
]);

moviesApp.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
            when('/movies', {
                templateUrl: 'partials/movies.html',
                controller : 'MoviesListCtrl'
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