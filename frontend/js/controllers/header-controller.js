myApp.controller('headerCtrl', function ($rootScope, $scope, NavigationService, $state, $timeout, WishlistService,
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

            $rootScope.loginModal = $uibModal.open({
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
                data.skip = 0;
                data.limit = 10;
                $state.go('search', {
                    'id': $scope.keyword
                });
                // $rootScope.$emit('globalsSearch', null);

                // ProductService.globalSearch(data, function (data) {
                //     console.log("in globalSearch*****", data.data.data);
                //     $.jStorage.set("searchedProduct", data.data.data);
                //     $.jStorage.set("searchedKeyword", $scope.keyword);
                //     console.log($state.current);
                //     if (!_.isEmpty($.jStorage.get("searchedProduct"))) {
                //         console.log("insidre if")
                //         if ($state.current.name == 'listing-page') {
                //             $state.go('listing-page', {
                //                 'id': $scope.keyword
                //             });



                //         } else {
                //             $state.go('listing-page', {
                //                 'id': $scope.keyword
                //             });

                //         }
                //         // $scope.searchNotFound = "Data Not Found"
                //     } else {
                //         console.log("in globalSearch***SearchedProduct**", $scope.newA);
                //         $.jStorage.set("searchedProduct", []);
                //         if ($state.current.name == 'listing-page') {
                //             $state.go('listing-page', {
                //                 'id': $scope.keyword
                //             });
                //         } else {
                //             $state.go('listing-page', {
                //                 'id': $scope.keyword
                //             });
                //             // $state.reload();
                //         }

                //     }
                // });
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
                _.each($scope.cart.products, function (product) {
                    if (product.product.quantity == 0) {
                        $scope.cartDisable = true;
                    }
                });
            });

        } else {
            //TODO: Implement without login
            if ($.jStorage.get("cart")) {
                $scope.cart = $.jStorage.get("cart");
                _.each($scope.cart.products, function (product) {
                    if (product.product.quantity == 0) {
                        $scope.cartDisable = true;
                    }
                })
            }
        }

        $scope.view = false;
        $scope.navActiveTab = 0; // Default set to index 0 i.e login button
        $scope.viewLogin = function () {
            $scope.view = !$scope.view;
        }
        // Used to switch from signup to login & login to sign up tab
        $scope.changeToLoginTab = function () {
            $scope.view = false;
        };
        $scope.changeToSignUpTab = function () {
            $scope.view = true;
        };
        //To change the icon for UIB accordian
        $scope.accordHeader = false;
        //To show side navigation backdrop design 
        $scope.isBackdropActive = false;
        //To open side nav
        $scope.sideNav = false; // For toggle sidenavigation
        $scope.openSideNav = function () {
            if (!$scope.sideNav) {
                $('.side-nav').toggleClass('side-nav-menu-in');
                $('.mobview-side-nav').toggleClass('side-nav-menu-in');
                $('.navbar__sideNav').toggleClass(' hamburger-cross');
                $scope.sideNav = true;
                $scope.isBackdropActive = !$scope.isBackdropActive;
            } else {
                $('.side-nav').toggleClass('side-nav-menu-in');
                $('.mobview-side-nav').toggleClass('side-nav-menu-in');
                $('.navbar__sideNav').toggleClass(' hamburger-cross');
                $scope.sideNav = false;
                $scope.isBackdropActive = false;
            }

        };

        //To close side nav when it focuses out
        $scope.closeSideNav = function () {
            if ($scope.sideNav) {
                $('.side-nav').toggleClass('side-nav-menu-in');
                $('.mobview-side-nav').toggleClass('side-nav-menu-in');
                $('.navbar__sideNav').toggleClass(' hamburger-cross');
                $scope.sideNav = false;
                $scope.isBackdropActive = false;
            }
        };
        //End of focus out
        //End of side nav
        //To Close side nav when hovering online
        $scope.slideUpSideNav = function () {
            $('.side-nav').removeClass('side-nav-menu-in');
            $('.side-nav').addClass('side-nav-menu-out');
            $('.navbar__sideNav').removeClass('hamburger-cross');
            $scope.isBackdropActive = false;
            $scope.sideNav = false;
        };
        //End of close side nav
        $scope.closeCategires = function () {
            $('.mobview-links').removeClass('mobview-links-menu-in');
            $('.mobview-links').addClass('mobview-links-menu-out');
            $('.mobview-categories').removeClass('mobview-categories-menu-out');
            $('.mobview-categories').addClass('mobview-categories-menu-in');

        };
        $scope.closePromotions = function () {
            $('.mobview-links').removeClass('mobview-links-menu-in');
            $('.mobview-links').addClass('mobview-links-menu-out');
            $('.mobview-promotions').removeClass('mobview-promotions-menu-out');
            $('.mobview-promotions').addClass('mobview-promotions-menu-in');
        };
        $scope.slidebackToMobview = function () {
            $('.mobview-links').removeClass('mobview-links-menu-out');
            $('.mobview-links').addClass('mobview-links-menu-in');
            $('.mobview-categories ').removeClass('mobview-categories-menu-in');
            $('.mobview-categories ').addClass('mobview-categories-menu-out');
            $('.mobview-promotions ').removeClass('mobview-promotions-menu-in');
            $('.mobview-promotions').addClass('mobview-promotions-menu-out');
        };

        $scope.getSubCategories = function (category) {
            $scope.hCategory = {};
            $scope.slug = category.slug;
            $scope.hCategory.slug = category.slug;
            console.log("getSubCategories", $scope.hCategory);
            CategoryService.getCategoryWithParent($scope.hCategory, function (data) {
                console.log("subcatretrived", data);
                if (data.data.value) {
                    $scope.hCategory.subCategories = data.data.data;
                    console.log("subcatretrived", $scope.hCategory.subCategories[0].slug);
                } else {
                    console.log("subcatretrived", data.data.error);
                }
            })
        }

        /*******menu code****** */
        NavigationService.getEnabledCategories(function (data) {

            $scope.categories = data.data.data;
            console.log('cat', $scope.categories)


        });
        //
        $scope.redirectCheckOut = function (cart) {
            console.log("cart", cart);
            _.each(cart, function (pro) {
                if (pro.product.quantity == 0) {
                    $scope.cartDisable = true;
                    $scope.cartErr = "Product is Out of Stock";
                    return false
                }
            });
        }

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
    .controller('loginModalCtrl', function ($rootScope, $scope, $timeout, $state, $uibModalInstance, UserService, CartService, WishlistService, $uibModal) {

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
                console.log("*****in register user", data.data.data)
                if (data.data.error) {
                    $scope.errormsg = "User already exists with the given emailId.Please login to proced"
                } else if (!_.isEmpty(data.data.data)) {
                    $rootScope.userData = data.data.data;
                    $rootScope.otpRegister = $uibModal.open({
                        animation: true,
                        templateUrl: 'views/modal/otp2.html',

                        // windowClass: 'loginModalSize',
                        controller: 'loginModalCtrl'
                        // windowClass: 'modal-content-radi0'
                    });
                    $.jStorage.set("username", $scope.userData.firstName);
                    if ($.jStorage.get("username")) {
                        $scope.firstname = $.jStorage.get("username");
                    }

                    $.jStorage.set("accessToken", $scope.userData.accessToken[$scope.userData.accessToken.length - 1]);
                    // $.jStorage.set("userId", $scope.userData._id);
                }

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

                // $scope.loggedUser = $scope.userData._id;
                // $scope.accessToken = $scope.userData.accessToken[$scope.userData.accessToken.length - 1];

                // $uibModalInstance.close();
                // $state.reload();
            });
        }

        $scope.checkOtp = function (otp) {
            // $scope.userData = {};
            if (otp) {
                $rootScope.userData.otp = otp;
                console.log("Registered user: ", $rootScope.userData);
                UserService.verifyRegisterUserWithOtp($scope.userData, function (data) {
                    console.log("VerifyOtp: ", data);
                    if (data.data.value === true) {
                        $.jStorage.set('user', data.data.data);
                        $.jStorage.set("userId", $scope.userData._id);
                        $.jStorage.set('accessToken', data.data.data.accessToken[0]);
                        $scope.loggedUser = $scope.userData._id;
                        $uibModalInstance.dismiss('cancel');
                        $state.reload();

                        var emailUser = {};
                        emailUser._id = $.jStorage.get('userId');
                        UserService.welcomeEmail(emailUser, function (data) {
                            console.log("in User/welcomeEmail", data);
                            if (data.value === true) {

                            }
                        });

                    } else {
                        if (data.error == 'otpNoMatch') {
                            $scope.errorMessage = "Invalid OTP. Please provide valid OTP.";
                        } else if (data.error == 'otpExpired') {
                            $scope.errorMessage = "OTP Expired. Please click on 'Resend OTP'!";
                            $scope.resendOtpBut = true;
                        } else if (data.error == 'noOtpFound') {
                            $scope.errorMessage = "No OTP found. Please click on 'Resend OTP'!";
                            $scope.resendOtpBut = true;
                        } else {
                            $scope.errorMessage = "Error Occurred. Please click on 'Resend OTP'";
                            $scope.resendOtpBut = true;
                        }
                    }
                });
            } else {
                $scope.errorMessage = "Please enter OTP";
            }
        }

        $scope.resendOtp = function () {
            console.log(" in resend $scope.formData: ", $scope.userData);
            if ($scope.gtUser) {
                UserService.resendOtpForPwd($scope.gtUser, function (data) {
                    if (data.value) {
                        $scope.resendOtpBut = false;
                    } else {
                        console.log("Error: ", data);
                    }
                });
            }
            if ($scope.userData) {
                UserService.resendOtp($scope.userData, function (data) {
                    if (data.value) {
                        $scope.resendOtpBut = false;
                    } else {
                        console.log("Error: ", data);
                    }
                });
            }
        }

        $scope.forgotPassword = function () {
            $scope.forgotPwd = true;
            $scope.otpPwd = false
            $scope.resetPwd = false;
            // code to close the modal 
            // $rootScope.loginModal.close();
            // $timeout(function () {
            //     $scope.forgetModal = $uibModal.open({
            //         animation: true,
            //         templateUrl: 'views/modal/otp1.html',

            //         // windowClass: 'loginModalSize',
            //         controller: 'loginModalCtrl'
            //         // windowClass: 'modal-content-radi0'
            //     });
            // }, 500);
            $scope.forgetModal = $uibModal.open({
                animation: true,
                templateUrl: 'views/modal/otp1.html',
                // windowClass: 'loginModalSize',
                controller: 'loginModalCtrl'
                // windowClass: 'modal-content-radi0'
            });

            // $scope.loginModal.close({
            //     $value: $scope.loginModal
            // });
            // $rootScope.loginModal.close();
        }
        $scope.forgotPasswordOtp = function (emailId) {
            $scope.userEmail = {};
            $scope.userEmail.email = emailId;
            UserService.forgotPasswordOtp($scope.userEmail, function (data) {
                console.log("in forgotPassword: ", data)
                if (data.data.value) {
                    $scope.forgotPwd = false;
                    $scope.resetPwd = false;
                    $scope.otpPwd = true;
                    $scope.gtUser = {};
                    $scope.gtUser._id = data.data.data._id;
                    // console.log("in forgotPassword: ", data.data.data)
                } else {
                    $scope.message = "Please sing up";
                    console.log("Error: ", data);
                }
            });
        }
        $scope.confirmForgotPasswordOtp = function (otp) {
            $scope.gtUser.verifyOtp = otp;
            console.log("confirmForgotPasswordOtp: ", $scope.gtUser);
            UserService.confirmForgotPasswordOtp($scope.gtUser, function (data) {
                console.log("confirm", data);
                if (data.data.value = true) {
                    if (data.data.data == "No Data Found") {
                        $scope.errorMessage = "Invalid OTP. Please provide a valid OTP";
                        $scope.resendOtpBut = true;
                    } else {
                        $scope.otpPwd = false;
                        $scope.resetPwd = true;
                    }
                } else {
                    $scope.errorMessage = "Invalid OTP. Please provide a valid OTP";
                    $scope.resendOtpBut = true;
                }
            })
        }
        $scope.savePassword = function (password) {
            if (password.newPassword == password.confirmPassword) {
                $scope.gtUser.password = password.newPassword;
                $scope.gtUser.email = $scope.userEmail.email
                console.log("confirmForgotPasswordOtp: savePassword", $scope.gtUser);
                UserService.forgotPasswordSave($scope.gtUser, function (data) {
                    console.log("data in save password", data.data)
                    $.jStorage.set("username", data.data.data.firstName);
                    $.jStorage.set("userId", data.data.data._id);
                    $.jStorage.set('accessToken', data.data.data.accessToken[0]);
                    $scope.loggedUser = data.data.data._id;
                    $uibModalInstance.dismiss('cancel');
                    $state.reload();
                })
            }
        }
    });