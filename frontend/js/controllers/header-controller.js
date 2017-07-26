myApp.controller('headerCtrl', function ($scope, NavigationService, $state, WishlistService,
        TemplateService, CartService, UserService, $uibModal, CategoryService, ProductService) {
        $scope.template = TemplateService;
        $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            $(window).scrollTop(0);
        });
        $.fancybox.close(true);
        if ($.jStorage.get("username")) {
            $scope.firstname = $.jStorage.get("username");
        }
        $scope.loggedUser = $.jStorage.get("userId");
        $scope.accessToken = $.jStorage.get("accessToken");

        $scope.openLoginModal10 = function () {

            $scope.loginModal = $uibModal.open({
                animation: true,
                templateUrl: 'views/modal/login.html',
                scope: $scope,
                windowClass: 'loginModalSize',
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
        $scope.search = function ($event) {
            console.log($event.charCode)

            if ($event.charCode === 13) {
                // Do that thing you finally wanted to do

                var data = {};
                data.keyword = $scope.keyword;
                ProductService.globalSearch(data, function (data) {
                    console.log(data);
                })
            }

        };

        $scope.logout = function () {

            var data = {
                userId: $.jStorage.get("userId"),
                accessToken: $.jStorage.get("accessToken")
            }
            // $.jStorage.deleteKey('userId');
            // $.jStorage.deleteKey('accessToken');
            // $.jStorage.deleteKey('cart');
            // $.jStorage.deleteKey('wishlist');
            // $.jStorage.deleteKey('compareproduct');
            // $.jStorage.deleteKey("username")
            // $.jStorage.deleteKey("selectedCategory");
            // $.jStorage.deleteKey("appliedFilters");
            // $.jStorage.deleteKey("orderDetails");
            $.jStorage.flush();

            UserService.logout(data, function (data) {
                $scope.loggedUser = "";
                $scope.accessToken = "";
                $state.go("home");
                $state.reload();
            });
        }

        // and not the lot no in the backend
        $scope.removeProductFromCart = function (cartId, productId) {

            if ($.jStorage.get('userId')) {
                var inputdata = {
                    cartId: cartId,
                    productId: productId
                }

                CartService.removeProduct(inputdata, function (data) {

                    //$scope.mycartTable = data.data.data;
                    $state.reload();
                });
            } else {
                $scope.cart = $.jStorage.get('cart').products;
                var idx = _.findIndex($scope.cart, function (product) {
                    return product.product._id == productId;
                });

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
            });

        } else {
            //TODO: Implement without login

            $scope.cart = $.jStorage.get("cart");


        }

        $scope.view = false;
        $scope.viewLogin = function () {
            $scope.view = !$scope.view;
        }
        //To open side nav
        $scope.sideNav = false; // For toggle sidenavigation
        $scope.openSideNav = function () {
            if (!$scope.sideNav) {
                $('.side-nav').toggleClass('side-nav-menu-in');
                $('.navbar__sideNav').toggleClass(' hamburger-cross');
                $scope.sideNav = true;
            } else {
                $('.side-nav').toggleClass('side-nav-menu-in');
                $('.navbar__sideNav').toggleClass(' hamburger-cross');
                $scope.sideNav = false;
            }

        };
        //End of side nav
        //To Close side nav when hovering online
        $scope.slideUpSideNav = function () {
            //  alert('enter');
            $('.side-nav').removeClass('side-nav-menu-in');
            $('.side-nav').addClass('side-nav-menu-out');
        };
        //End of close side nav
        $scope.closeCategires = function () {
            $('.mobview-links').removeClass('mobview-links-menu-in');
            $('.mobview-links').addClass('mobview-links-menu-out');
            $('.mobview-categories-display ').toggleClass('mobview-categories-menu-in');
        };
        $scope.slidebackToMobview = function () {
            $('.mobview-links').removeClass('mobview-links-menu-out');
            $('.mobview-links').addClass('mobview-links-menu-in');
            $('.mobview-categories-display ').removeClass('mobview-categories-menu-in');
            $('.mobview-categories-display ').addClass('mobview-categories-menu-out');
        };

        $scope.getSubCategories = function (category) {
            var data = {};
            $scope.id = category._id;
            data.category = category._id;
            CategoryService.getCategoryWithParent(data, function (data) {
                console.log("subcatretrived", data);
                if (data.data.value) {
                    $scope.subCategories = data.data.data;
                } else {
                    console.log("subcatretrived", data);
                }
            })
        }

        /*******menu code****** */
        NavigationService.getEnabledCategories(function (data) {

            $scope.categories = data.data.data;
            console.log($scope.categories)


        });

    })
    .controller('wishlistModalCtrl', function ($scope, $state, $uibModalInstance, UserService, CartService, WishlistService) {
        $scope.userId = {
            userId: $.jStorage.get("userId"),
            accessToken: $.jStorage.get("accessToken")
        }
        if ($scope.userId.accessToken) {
            WishlistService.getWishlist($scope.userId, function (data) {
                $scope.wishlists = data.data.data;

                $scope.newA = _.chunk($scope.wishlists, 4);

            });
        } else {
            $scope.wishlists = $.jStorage.get("wishlist");

            $scope.newA = _.chunk($scope.wishlists, 4);
        }
        $scope.removeFromWishlist = function (prodId) {
            if ($scope.userId.accessToken) {

                var userId = {
                    userId: $.jStorage.get("userId"),
                    accessToken: $.jStorage.get("accessToken"),
                    productId: prodId
                }
                WishlistService.removeProduct(userId, function (data) {

                    if (data.data.data) {
                        WishlistService.getWishlist($scope.userId, function (data) {
                            $scope.wishlists = data.data.data;

                            $scope.newA = _.chunk($scope.wishlists, 4);

                        });
                    }
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

            }
        }

    })
    .controller('loginModalCtrl', function ($scope, $state, $uibModalInstance, UserService, CartService, WishlistService) {

        $scope.formData = {};
        $scope.loginData = {};

        $scope.login = function () {

            UserService.login($scope.loginData, function (data) {

                if (!_.isEmpty(data.data.data)) {
                    $scope.userData = data.data.data;
                    $scope.firstname = data.data.data.firstName
                    $.jStorage.set("username", data.data.data.firstName)
                    if ($.jStorage.get("username")) {
                        $scope.firstname = $.jStorage.get("username");
                    }

                    $.jStorage.set("accessToken", $scope.userData.accessToken[$scope.userData.accessToken.length - 1]);
                    $.jStorage.set("userId", $scope.userData._id);

                    if ($scope.userData) {
                        var cart = {};
                        cart.userId = $.jStorage.get("userId");
                        cart.accessToken = $.jStorage.get("accessToken");
                        var userCart = $.jStorage.get("cart");
                        if (userCart) {
                            cart.products = userCart.products;

                            CartService.saveProduct(cart, function (data) {
                                if (!data.data.value) {

                                } else {

                                    $state.reload();
                                }
                            });

                        }
                        var offlineWishlist = []
                        offlineWishlist = $.jStorage.get("wishlist");
                        var products = [];
                        if (offlineWishlist) {

                            for (var i = 0; i < offlineWishlist.length; i++) {
                                products.push(offlineWishlist[i].productId);
                            }
                            var product = {
                                accessToken: $.jStorage.get("accessToken"),
                                userId: $.jStorage.get("userId"),
                                products: products
                            }
                            WishlistService.saveProduct(product, function (data) {

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

            UserService.userRegistration($scope.formData, function (data) {

                if (data.data.error) {
                    $scope.errormsg = "User already exists with the given emailId.<br /> Please login to proced"
                }
                $scope.userData = data.data.data;
                $.jStorage.set("username", $scope.userData.firstName);
                if ($.jStorage.get("username")) {
                    $scope.firstname = $.jStorage.get("username");
                }

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

                        CartService.saveProduct(cart, function (data) {
                            if (!data.data.value) {

                            } else {

                                $state.reload();
                            }
                        });
                    }
                    var offlineWishlist = $.jStorage.get("wishlist");

                    if (offlineWishlist) {
                        var product = {
                            accessToken: $.jStorage.get("accessToken"),
                            userId: $.jStorage.get("userId"),
                            products: $.jStorage.get("wishlist"),
                        }
                        WishlistService.saveProduct(product, function (data) {

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