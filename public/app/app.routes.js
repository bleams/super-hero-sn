(function(){
    'use strict';

    angular
        .module('superApp')
        .config(routeConfig);

    function routeConfig ($routeProvider, $locationProvider) {

        $routeProvider
            .when('/', {
                // the url with "/" prefix is relative to the domain,
                // without the "/" prefix it will be relative to the main ("index.html") page
                // or base url (if you use location in the html5 mode). (stackoverflow)
                templateUrl : "/pages/home.html",
                controller: 'mainController',
                controllerAs: 'main'
            });

        // take away the hash in the URL
        $locationProvider.html5Mode(true);


    }


})();
