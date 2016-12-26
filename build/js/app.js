var app = angular.module('DS', ['ngRoute', 'DS.templates']);

app.config(function($routeProvider, $locationProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "partials/home.html",
        controller  : "HomeCtrl"
    })
    .otherwise({redirectTo: "/"});
    $locationProvider.html5Mode(true);
});

app.controller("HomeCtrl", function ($scope) {
    $scope.title = "Welcome";
});

