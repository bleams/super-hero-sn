(function(){

    'use strict';

    angular
        .module('superApp')
        .controller('mainController', mainController);

    mainController.$inject = ['$rootScope', '$location', 'Auth'];


    function mainController ($rootScope, $location, Auth) {

        var vm = this;

        // get info if the person is logged in
        vm.loggedIn = Auth.isLoggedIn();

        // checks to see if a user is logged in on every request
        $rootScope.$on('$routeChangeStart', function(){

            vm.loggedIn = Auth.isLoggedIn();

            // get user information on route change
            Auth.getUser()
                .then(function(data){
                    vm.user = data;
                });
        });

        // function to handle login form
        vm.doLogin = function(){
            Auth.login(vm.loginData.username, vm.loginData.password)
                .then(function (data) {

                    // if a user successfully logs in, redirect to the user page
                    // TODO redirect to the user's page
                    $location.path('/users');
                });
        };


        // function to handle login form
        vm.doLogout = function(){
            Auth.logout();
            // reset all user info
            vm.user = {};
            $location.path('/login');

        };

    }



})();