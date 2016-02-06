/**
 * Created by jimi on 02/02/2016.
 */

var superApp = angular.module('superApp', ['ngResource', 'ngRoute']);

superApp.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $routeProvider
        .when('/', {
            templateUrl: '/partials/main',
            controllerAs: 'main',
            controller: 'MainCtrl'
        })
}]);

superApp.controller('MainCtrl', function () {
    var vm = this; // vm for view-model
    vm.myVar = 'Hello Anng'
});