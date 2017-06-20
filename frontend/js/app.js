// Link all the JS Docs here
var myApp = angular.module('myApp', [
    'ui.bootstrap',
    'ui.router',
    'pascalprecht.translate',
    'angulartics',
    'angulartics.google.analytics',
    'ui.bootstrap',
    'ngAnimate',
    'ngSanitize',
    'angular-flexslider',
    'rzModule',
    'ui.swiper',
    'toastr',
    'angular-loading-bar'

]);

// Define all the routes below
myApp.config(function ($stateProvider, $urlRouterProvider, $httpProvider, $locationProvider, cfpLoadingBarProvider) {
    var tempateURL = "views/template/template.html"; //Default Template URL
    cfpLoadingBarProvider.includeSpinner = true;
    cfpLoadingBarProvider.includeBar = false;
    cfpLoadingBarProvider.parentSelector = '#loading-bar-container';
    cfpLoadingBarProvider.spinnerTemplate = '<div class="spinner-overlay"><img class="spinner" src="img/default.gif" /></div>';
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
            url: "/buythelook/:id",
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

        .state('brands', {
            url: "/brands",
            templateUrl: tempateURL,
            controller: 'BrandsCtrl'
        })

        .state('myaccount', {
            url: "/myaccount",
            templateUrl: tempateURL,
            controller: 'MyAccountCtrl'
        })

        .state('orderdetail', {
            url: "/orderdetail",
            templateUrl: tempateURL,
            controller: 'OrderDetailCtrl'
        })

        .state('cancel', {
            url: "/cancel",
            templateUrl: tempateURL,
            controller: 'CancelCtrl'
        })

        .state('gift', {
            url: "/gift-card",
            templateUrl: tempateURL,
            controller: 'GiftCtrl'
        })
        .state('orders', {
            url: "/orders",
            templateUrl: tempateURL,
            controller: 'OrdersCtrl'
        })

        .state('coming-soon', {
            url: "/coming-soon",
            templateUrl: tempateURL,
            controller: 'ComingSoonCtrl'
        })

        .state('about', {
            url: "/about",
            templateUrl: tempateURL,
            controller: 'AboutCtrl'
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