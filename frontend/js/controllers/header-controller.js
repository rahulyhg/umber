myApp.controller('headerCtrl', function ($scope, $state, TemplateService, CartService, UserService, $uibModal) {
    $scope.template = TemplateService;
    $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
        $(window).scrollTop(0);
    });
    $.fancybox.close(true);

    $scope.openLoginModal10 = function () {
        // alert('click');
        // console.log("clla");
        $scope.loginModal = $uibModal.open({
            animation: true,
            templateUrl: 'views/modal/login.html',
            scope: $scope,
            size: 'md',
            // windowClass: 'modal-content-radi0'
        });
    };
    $scope.loginData = {};
    $scope.login = function () {
        console.log("Header login");
        UserService.login($scope.loginData, function (data) {
            console.log("Login data: ", data);
            if (!_.isEmpty(data.data.data)) {
                $scope.userData = data.data.data;
                $.jStorage.set("accessToken", $scope.userData.accessToken[$scope.userData.accessToken.length - 1]);
                $.jStorage.set("userId", $scope.userData._id);
                $scope.loginModal.close();
                $state.go("home");
            } else {
                // TODO:: show popup to register
            }
        });
    }

    $scope.removeProductFromCart = function (cartId, productId) {
        console.log("Removing product: ", productId);
        var data = {
            cartId: cartId,
            productId: productId
        }
        CartService.removeProduct(data, function (data) {
            $scope.mycartTable = data.data.data;
        });
    }

    var userId = {
        userId: $.jStorage.get("userId")
    }
    if (userId.userId != null || typeof userId.userId == 'undefined') {
        CartService.getCart(userId, function (data) {
            console.log("getcart->data: ", data);
            //TODO: Instead of array this will be single doc when query changes to findOneAndUpdate
            var accessToken = $.jStorage.get("accessToken");
            if (accessToken) {
                $scope.cart = data.data.data;
                console.log("mycarttable: ", $scope.cart);
            } else {
                $scope.cart = {};
            }
        });
    } else {
        $scope.cart = {};
    }

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