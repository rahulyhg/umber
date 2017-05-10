myApp.controller('headerCtrl', function ($scope, $state, TemplateService, CartService, UserService, $uibModal) {
        $scope.template = TemplateService;
        $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            $(window).scrollTop(0);
        });
        $.fancybox.close(true);

        $scope.loggedUser = $.jStorage.get("userId");
        $scope.accessToken = $.jStorage.get("accessToken");

        $scope.openLoginModal10 = function () {
            // alert('click');
            // console.log("clla");
            $scope.loginModal = $uibModal.open({
                animation: true,
                templateUrl: 'views/modal/login.html',
                scope: $scope,
                size: 'md',
                controller: 'loginModalCtrl'
                // windowClass: 'modal-content-radi0'
            });
        };

        $scope.logout = function () {
            console.log("Logging out user");
            var data = {
                userId: $.jStorage.get("userId"),
                accessToken: $.jStorage.get("accessToken")
            }
            $.jStorage.deleteKey('userId');
            $.jStorage.deleteKey('accessToken');
            UserService.logout(data, function (data) {
                $scope.loggedUser = "";
                $scope.accessToken = "";
                $state.go("home");
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
            userId: $.jStorage.get("userId"),
            accessToken: $.jStorage.get("accessToken")
        }

        if (userId.userId != null || typeof userId.userId != 'undefined') {
            CartService.getCart(userId, function (data) {
                if (userId.accessToken) {
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
    })
    .controller('loginModalCtrl', function ($scope, $state, t$uibModalInstance, UserService) {

        $scope.formData = {};
        $scope.loginData = {};

        $scope.login = function () {
            console.log("Header login");
            UserService.login($scope.loginData, function (data) {
                if (!_.isEmpty(data.data.data)) {
                    $scope.userData = data.data.data;

                    $.jStorage.set("accessToken", $scope.userData.accessToken[$scope.userData.accessToken.length - 1]);
                    $.jStorage.set("userId", $scope.userData._id);

                    $scope.loggedUser = $scope.userData._id;
                    $scope.accessToken = $scope.userData.accessToken[$scope.userData.accessToken.length - 1];

                    $uibModalInstance.close();
                    $state.reload();
                } else {
                    // TODO:: show popup to register
                }
            });
        }

        $scope.registerUser = function () {
            console.log("Register data: ", $scope.formData);
            UserService.userRegistration($scope.formData, function (data) {
                $scope.userData = data.data.data;

                $.jStorage.set("accessToken", $scope.userData.accessToken[$scope.userData.accessToken.length - 1]);
                $.jStorage.set("userId", $scope.userData._id);

                $scope.loggedUser = $scope.userData._id;
                $scope.accessToken = $scope.userData.accessToken[$scope.userData.accessToken.length - 1];

                $uibModalInstance.close();
                $state.reload();
            });
        }

    });