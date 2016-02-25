(function(){
   'use strict';

    // this module will be injected in our main app module.
    // it holds 3 factories
    angular
        .module('superApp')
        .factory('Auth', Auth)
        .factory('AuthToken', AuthToken)
        .factory('AuthInterceptor', AuthInterceptor);

    // ===============================
    // auth factory to check the user status (login, logout) and get the user information
        // inject $http for communicating with the API
        // inject $q to return promise objects
        // inject AuthToken to manage tokens


    Auth.$inject = ['$http', '$q', 'AuthToken'];

    function Auth ($http, $q, AuthToken) {

        // create auth factory object
        var authFactory = {};

        // to log a suer in
        authFactory.login = function(username, password) {
            // return the promise object and its data
            return $http.post('/api/authenticate', {
                    username: username,
                    password: password
                })
                .then(function(data){
                    AuthToken.setToken(data.token);
                    return data
                });
        };

        // to log a user out we clear the token
        authFactory.logout = function() {
            // clear the token
            AuthToken.setToken();
        };

        // check if a user is logged in
        // check if ther is a local token

        authFactory.isLoggedIn = function(){
            if ( AuthToken.getToken() ) {
                return AuthToken.getToken();
            }
        };

        // getting the logged in user
        authFactory.getUser = function(){
            if ( AuthToken.getToken() ) {
                return $http.get('/api/me', {cache : true});
            } else {
                return $q.reject({message : 'User has no token.'});
            }
        };

        return authFactory;

    }



    // ===============================
    // factory for handling tokens
    // inject $window to store the token on the client-side

    AuthToken.$inject = ['$window'];

    function AuthToken ($window){
        var authTokenFactory = {};

        // get the token from local storage
        authTokenFactory.getToken = function(){
            $window.localStorage.getItem('token');
        };

        // set token or clea token
        // if a token is passed, set the token
        // if no token, clear it from local storage
        authTokenFactory.setToken = function (token) {
            if(token){
                $window.localStorage.setItem('token', token);
            }   else {
                $window.localStorage.removeItem('token')
            }
        };

        return authTokenFactory;
    }

    // ===============================
    // this application configuration will attach the token
    // to all HTTP requests from the frontend app
    // inject $window to store the token on the client-side

    AuthInterceptor.$inject = ['$q', 'AuthToken'];

    function AuthInterceptor ($q, AuthToken){
        var interceptorFactory = {};

        // will happen on all HTTP requests
        interceptorFactory.reques = function (config) {
            // let's grab the token
            var token = AuthToken.getToken();

            // if the token exists, add it to the header as x-access-token
            if (token) {
                config.headers['x-access-token'] = token;
                return config;
            }

        };

        // happens on response errors
        interceptorFactory.responseError = function(response){

            // if our server returns a 403 forbidden response
            if(response.status == 403) {
                AuthToken.setToken();
                $location.path('/login');
            }

            // return the errors from the server as a promise
            return $q.reject(response);
        };

        return interceptorFactory;

    }

})();