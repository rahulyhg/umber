myApp.controller('headerCtrl', function ($scope, $state, TemplateService, CartService, UserService, $uibModal) {
    $scope.template = TemplateService;
    $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
        $(window).scrollTop(0);
    });
    $.fancybox.close(true);

    $scope.userId = "";
    $scope.accessToken = "";

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

    $scope.formData = {};
    $scope.loginData = {};

    $scope.login = function () {
        console.log("Header login");
        UserService.login($scope.loginData, function (data) {
            if (!_.isEmpty(data.data.data)) {
                $scope.userData = data.data.data;

                $.jStorage.set("accessToken", $scope.userData.accessToken[$scope.userData.accessToken.length - 1]);
                $.jStorage.set("userId", $scope.userData._id);

                $scope.userId = $scope.userData._id;
                $scope.accessToken = $scope.userData.accessToken[$scope.userData.accessToken.length - 1];

                $scope.loginModal.close();
                $state.go("home");
            } else {
                // TODO:: show popup to register
            }
        });
    }

    $scope.registerUser = function () {
        UserService.userRegistration($scope.formData, function (data) {
            $scope.loginModal.close();
            $state.reload("home");
        });
    }

    $scope.logout = function () {
        var data = {
            userId: $scope.userId,
            accessToken: $scope.accessToken
        }
        $.jStorage.deleteKey('userId');
        $.jStorage.deleteKey('accessToken');
        UserService.logout(data, function (err, data) {
            if (err) {
                // TODO: Show error popup
            } else if (data) {
                // TODO: Change view
                $scope.userId = "";
                $scope.accessToken = "";
            } else {
                // TODO: Show error popup
            }
        })
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
        userId: $scope.userId
    }

    if (userId.userId != "") {
        CartService.getCart(userId, function (data) {
            if ($scope.accessToken) {
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
});