var app = angular.module('DS', ['ngRoute', 'DS.templates']);

//api url constant
app.constant('ApiEndPoint', {
   url:'http://localhost/api' 
})

app.config(function($routeProvider, $locationProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "partials/home.html",
        controller  : "HomeCtrl"
    })
    .otherwise({redirectTo: "/"});
    //$locationProvider.html5Mode(true);
});
