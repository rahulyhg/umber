myApp.controller('headerCtrl', function ($scope, TemplateService, $uibModal) {
    $scope.template = TemplateService;
    $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
        $(window).scrollTop(0);
    });
    $.fancybox.close(true);

    $scope.openLoginModal10 = function () {
        // alert('click');
        // console.log("clla");
        $uibModal.open({
            animation: true,
            templateUrl: 'views/modal/login.html',
            scope: $scope,
            size: 'md',
            // windowClass: 'modal-content-radi0'
        });
    };
    $scope.view = false;
    $scope.viewLogin = function () {
        $scope.view = !$scope.view;
    }

    $scope.cart = [{
        img: '../img/home/11.jpg',
        shirtType: 'linen full sleeve shirt with rollup',
        price: '2899',
        size: '36'
    }, {
        img: '../img/home/12.jpg',
        shirtType: 'linen full sleeve shirt with rollup',
        price: '3000',
        size: '37'
    }, {
        img: '../img/home/12.jpg',
        shirtType: 'linen full sleeve shirt with rollup',
        price: '3000',
        size: '37'
    }, {
        img: '../img/home/12.jpg',
        shirtType: 'linen full sleeve shirt with rollup',
        price: '3000',
        size: '37'
    }];
});