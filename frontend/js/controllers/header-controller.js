myApp.controller('headerCtrl', function ($scope, $state, WishlistService, TemplateService, CartService, UserService, $uibModal) {
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

        $scope.openWishlistModal10 = function () {

            $scope.wishlistModal = $uibModal.open({
                animation: true,
                templateUrl: 'views/modal/mycartmodal.html',
                scope: $scope,
                size: 'md',
                controller: 'wishlistModalCtrl'
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
            $.jStorage.deleteKey('wishlist');
            //$.jStorage.flush();
            UserService.logout(data, function (data) {
                $scope.loggedUser = "";
                $scope.accessToken = "";
                $state.go("home");
                $state.reload();
            });
        }

        // and not the lot no in the backend
        $scope.removeProductFromCart = function (cartId, productId) {
            console.log("Cart: ", cartId);
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
                $scope.cart = $.jStorage.get('cart').products;
                var idx = _.findIndex($scope.cart, function (product) {
                    return product.product._id == productId;
                });
                console.log("Removing product at index: ", idx);
                // remove this product
                $scope.cart.splice(idx, 1);
                var cart = {};
                cart.products = $scope.cart;
                $.jStorage.set('cart', cart);
                $state.reload();
            }
        }

        var userId = {
            userId: $.jStorage.get("userId"),
            accessToken: $.jStorage.get("accessToken")
        }

        if (userId.userId != null) {
            CartService.getCart(userId, function (data) {
                $scope.cart = data.data.data;
                console.log("mycarttable: ", $scope.cart);
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
    .controller('wishlistModalCtrl', function ($scope, $state, $uibModalInstance, UserService, CartService, WishlistService) {
        var userId = {
            userId: $.jStorage.get("userId"),
            accessToken: $.jStorage.get("accessToken")
        }
        if (userId.accessToken) {
            WishlistService.getWishlist(userId, function (data) {
                $scope.wishlists = data.data.data;
                console.log("wishlist returneddata::::::", $scope.wishlists)
                $scope.newA = _.chunk($scope.wishlists, 4);

            });
        } else {
            $scope.wishlists = $.jStorage.get("wishlist");
            console.log("offlinewishlist returneddata::::::", $scope.wishlists)
            $scope.newA = _.chunk($scope.wishlists, 4);
        }
        $scope.removeFromWishlist = function (prodId) {
            if (userId && userId.userId) {
                var userId = {
                    userId: $.jStorage.get("userId"),
                    accessToken: $.jStorage.get("accessToken"),
                    productId: prodId
                }
                WishlistService.removeProduct(userId, function (data) {

                })
                //remove online wishlist api
            } else {
                var wishlist = $.jStorage.get("wishlist")
                _.remove(wishlist, {
                    productId: prodId
                });
                $.jStorage.set("wishlist", wishlist);
                $scope.wishlists = $.jStorage.get("wishlist")
                $scope.newA = _.chunk($scope.wishlists, 4);
                console.log($scope.wishlists);
            }
        }
    })
    .controller('loginModalCtrl', function ($scope, $state, $uibModalInstance, UserService, CartService, WishlistService) {

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
                        var userCart = $.jStorage.get("cart");
                        if (userCart) {
                            cart.products = userCart.products;
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
                        var offlineWishlist = []
                        offlineWishlist = $.jStorage.get("wishlist");
                        var products = [];
                        if (offlineWishlist) {
                            console.log(offlineWishlist.length)
                            for (var i = 0; i < offlineWishlist.length; i++) {
                                products.push(offlineWishlist[i].productId);
                            }
                            var product = {
                                accessToken: $.jStorage.get("accessToken"),
                                userId: $.jStorage.get("userId"),
                                products: products
                            }
                            WishlistService.saveProduct(product, function (data) {
                                console.log("sendingwishlisttodb:::::::", data);
                            })
                        }
                    }
                    $scope.loggedUser = $scope.userData._id;
                    $scope.accessToken = $scope.userData.accessToken[$scope.userData.accessToken.length - 1];

                    $uibModalInstance.close();
                    $state.reload();
                } else {
                    // TODO:: show popup to register
                    $scope.message = "Invalid Credentials"
                }
            });
        }

        $scope.registerUser = function () {
            console.log("Register data: ", $scope.formData);
            UserService.userRegistration($scope.formData, function (data) {
                console.log(data.data.error);
                if (data.data.error) {
                    $scope.errormsg = "User already exists with the given emailId.<br /> Please login to proced"
                }
                $scope.userData = data.data.data;

                $.jStorage.set("accessToken", $scope.userData.accessToken[$scope.userData.accessToken.length - 1]);
                $.jStorage.set("userId", $scope.userData._id);
                var tokken = $.jStorage.get("accessToken");
                if (tokken) {
                    var offlineCart = $.jStorage.get("cart");
                    if (offlineCart) {
                        var cart = {};
                        cart.userId = $.jStorage.get("userId");
                        cart.accessToken = $.jStorage.get("accessToken");
                        cart.products = $.jStorage.get("cart").products;
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
                    var offlineWishlist = $.jStorage.get("wishlist");
                    console.log("sendingofflinewishlist::::::", offlineWishlist)
                    if (offlineWishlist) {
                        var product = {
                            accessToken: $.jStorage.get("accessToken"),
                            userId: $.jStorage.get("userId"),
                            products: $.jStorage.get("wishlist"),
                        }
                        WishlistService.saveProduct(product, function (data) {
                            console.log("sendingwishlisttodb:::::::", data);
                        })
                    }
                }

                $scope.loggedUser = $scope.userData._id;
                $scope.accessToken = $scope.userData.accessToken[$scope.userData.accessToken.length - 1];

                $uibModalInstance.close();
                $state.reload();
            });
        }
    });