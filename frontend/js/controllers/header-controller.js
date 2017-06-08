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
            $.jStorage.deleteKey('cart');
            $.jStorage.flush();
            UserService.logout(data, function (data) {
                $scope.loggedUser = "";
                $scope.accessToken = "";
                $state.go("home");
            });
        }

        // This productId represents unique mongodb id of SKU
        // and not the lot no in the backend
        $scope.removeProductFromCart = function (cartId, productId) {
            console.log("Removing product: ", productId);
            if ($.jStorage.get('userId')) {
                var data = {
                    cartId: cartId,
                    productId: productId
                }
                CartService.removeProduct(data, function (data) {
                    $scope.mycartTable = data.data.data;
                    $state.reload();
                });
            } else {
                $scope.cart = $.jStorage.get('cart');
                var idx = _.findIndex($scope.cart, function (product) {
                    return product._id == productId;
                });
                // remove this product
                $scope.cart.splice(idx, 1);
            }
        }

        var userId = {
            userId: $.jStorage.get("userId"),
            accessToken: $.jStorage.get("accessToken")
        }

        if (userId.userId != null) {
            CartService.getCart(userId, function (data) {
                if (userId.accessToken) {
                    $scope.cart = data.data.data;
                    console.log("mycarttable: ", $scope.cart);
                } else {
                    $scope.cart = {};
                }
            });
        } else {
            //TODO: Implement without login

            $scope.cart = $.jStorage.get("cart");
            //$scope.cart = {};
        }

        $scope.view = false;
        $scope.viewLogin = function () {
            $scope.view = !$scope.view;
        }
    })
    .controller('loginModalCtrl', function ($scope, $state, $uibModalInstance, UserService, CartService) {

        $scope.formData = {};
        $scope.loginData = {};

        $scope.login = function () {
            console.log("Header login");
            UserService.login($scope.loginData, function (data) {
                if (!_.isEmpty(data.data.data)) {
                    $scope.userData = data.data.data;

                    $.jStorage.set("accessToken", $scope.userData.accessToken[$scope.userData.accessToken.length - 1]);
                    $.jStorage.set("userId", $scope.userData._id);

                    if ($scope.userData) {
                        var cart = {};
                        cart.userId = $.jStorage.get("userId");
                        cart.accessToken = $.jStorage.get("accessToken");
                        cart.products = $.jStorage.get("cart");
                        console.log("Offline cart: ", cart);
                        CartService.saveProduct(cart, function (data) {
                            if (!data.data.value) {
                                console.log("Error: in ofline storage ", data.data.error);
                            } else {
                                console.log("Success");
                                $state.reload();
                            }
                        });
                    }
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