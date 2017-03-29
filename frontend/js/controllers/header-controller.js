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
            size: 'lg',
            // windowClass: 'modal-content-radi0'
        });
    };
    $scope.view = false;
    $scope.viewLogin = function () {
        $scope.view = !$scope.view;
    }
});