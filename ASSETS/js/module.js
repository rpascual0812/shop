var app = angular.module('onload', [
                                    'ngRoute',
                                    'ngCookies',
                                    'angular-md5'
                                ]);

app.config(function($routeProvider){
    $routeProvider
    .when('/',
    {
        controller: 'Home',
        templateUrl: 'PARTIALS/home.html'
    })
    .when('/category/:id',
    {
        controller: 'Home',
        templateUrl: 'PARTIALS/store/items.html'
    })
    .otherwise(
    {
        redirectTo: '/'
    })
})