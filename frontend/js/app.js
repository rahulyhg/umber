// Link all the JS Docs here
var myApp = angular.module('myApp', [
    'ui.router',
    'pascalprecht.translate',
    'angulartics',
    'angulartics.google.analytics',
    'ui.bootstrap',
    'ngAnimate',
    'ngSanitize',
    'angular-flexslider',
    'rzModule',
    'ui.swiper'
]);

// Define all the routes below
myApp.config(function ($stateProvider, $urlRouterProvider, $httpProvider, $locationProvider) {
    var tempateURL = "views/template/template.html"; //Default Template URL

    // for http request with session
    $httpProvider.defaults.withCredentials = true;
    $stateProvider
        .state('home', {
            url: "/",
            templateUrl: tempateURL,
            controller: 'HomeCtrl'
        })
        .state('login', {
            url: "/login",
            templateUrl: tempateURL,
            controller: 'LoginCtrl'
        })
        .state('checkout', {
            url: "/checkout",
            templateUrl: tempateURL,
            controller: 'CheckoutCtrl'
        })
        .state('mycart', {
            url: "/mycart",
            templateUrl: tempateURL,
            controller: 'MycartCtrl'
        })
        .state('buythelook', {
            url: "/buythelook",
            templateUrl: tempateURL,
            controller: 'BuythelookCtrl'
        })
        .state('listing-page', {
            url: "/listing-page",
            templateUrl: tempateURL,
            controller: 'ListingPageCtrl'
        })
        .state('individual-page', {
            url: "/individual-page/:id",
            templateUrl: tempateURL,
            controller: 'IndividualPageCtrl'
        })
        .state('compare-products', {
            url: "/compare-products",
            templateUrl: tempateURL,
            controller: 'compareProductsCtrl'
        })
        .state('form', {
            url: "/form",
            templateUrl: tempateURL,
            controller: 'FormCtrl'
        })
        .state('cancel', {
            url: "/cancel",
            templateUrl: tempateURL,
            controller: 'CancelCtrl'
        });

    $urlRouterProvider.otherwise("/");
    $locationProvider.html5Mode(isproduction);
});

myApp.filter('serverimage', function () {
    return function (image) {
        if (image && image !== null) {
            return adminurl + "upload/readFile?file=" + image;
        } else {
            return undefined;
        }
    }
});

// For Language JS
myApp.config(function ($translateProvider) {
    $translateProvider.translations('en', LanguageEnglish);
    $translateProvider.translations('hi', LanguageHindi);
    $translateProvider.preferredLanguage('en');
});