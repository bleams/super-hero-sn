/**
 * Created by jimi on 02/02/2016.
 */

angular.module('superApp', ['ngResource', 'ngRoute'])
    .config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
        $locationProvider.html5Mode(true);
        $routeProvider
            .when('/', {
                templateUrl: '/partials/main',
                controllerAs: 'main',
                controller: 'MainCtrl'
            })
}]);