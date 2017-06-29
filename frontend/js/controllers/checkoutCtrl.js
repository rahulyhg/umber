myApp.controller('CheckoutCtrl', function ($scope, OrderService, ProductService, toastr, $state, myService, BannerService, TemplateService, NavigationService, UserService, CartService, WishlistService, $timeout) {
    $scope.template = TemplateService.getHTML("content/checkout.html");
    TemplateService.title = "Checkout"; //This is the Title of the Website
    $scope.navigation = NavigationService.getNavigation();
    myService.ctrlBanners("checkout", function (data) {
        $scope.banner = data;
    });
    $scope.registerData = {};
    $scope.loginData = {};
    $scope.loggedUser = $.jStorage.get("userId");
    $scope.accessToken = $.jStorage.get("accessToken");

    if ($scope.loggedUser) {
        $scope.view = "orderTab";
    } else {
        $scope.view = "loginTab";
    }

    $scope.registerUser = function () {
        UserService.userRegistration($scope.registerData, function (data) {
            console.log("login  data: ", data);
            if (!_.isEmpty(data.data.data)) {
                console.log("Login data: ", data);
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
                $state.reload();

            } else {
                // TODO:: show popup to register
            }
        });
    }

    $scope.updateAddress = function () {
        var updateAdd = {
            user: $.jStorage.get("userId"),
            billingAddress: $scope.user.billingAddress,
            shippingAddress: $scope.user.deliveryAddress
        }
        UserService.saveAddressCheckout(updateAdd, function (data) {
            console.log("saveuserdetails", data);
        })
    }

    $scope.login = function () {
        UserService.login($scope.loginData, function (data) {
            console.log("loginoncheckoutpage::::", data)
            if (!_.isEmpty(data.data.data)) {
                console.log("in if");
                var cart = {};
                $scope.userData = data.data.data;
                $.jStorage.set("accessToken", $scope.userData.accessToken[$scope.userData.accessToken.length - 1]);
                $.jStorage.set("userId", $scope.userData._id);
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
                $state.reload();
            } else {
                // TODO:: show popup to register
            }
        });
    }

    var userData = {
        userId: $.jStorage.get("userId")
    }

    CartService.getCart(userData, function (data) {
        if (data.data.data)
            $scope.orderTable = data.data.data;
        if ($scope.orderTable && $scope.orderTable.products)
            $scope.grandTotal = CartService.getTotal($scope.orderTable.products);
    });

    if (userData.userId) {
        UserService.getUserDetails(userData, function (data) {
            $scope.user = data.data.data;
            console.log("userdetails::", $scope.user)
        });
    }

    $scope.gotoDetails = function () {
        $scope.view = "detailTab";
    }

    $scope.setDeliveryAddress = function () {
        if (!$scope.user.deliveryAddress)
            $scope.user.deliveryAddress = {};
        $scope.user.deliveryAddress.line1 = $scope.user.billingAddress.line1;
        $scope.user.deliveryAddress.line2 = $scope.user.billingAddress.line2;
        $scope.user.deliveryAddress.line3 = $scope.user.billingAddress.line3;
        $scope.user.deliveryAddress.city = $scope.user.billingAddress.city;
        $scope.user.deliveryAddress.state = $scope.user.billingAddress.state;
        $scope.user.deliveryAddress.country = $scope.user.billingAddress.country;
        $scope.user.deliveryAddress.pincode = $scope.user.billingAddress.pincode;
    }

    $scope.updateUser = function () {
        UserService.updateUser($scope.user, function (data) {
            if (data.data.data) {
                $scope.view = 'paymentTab'
            }
        });
    }
    var input = {
        "userId": $.jStorage.get("userId")
    }
    if (input.userId) {
        OrderService.createOrderFromCart(input, function (data) {
            console.log("oderplaced", data);
            if (data.data.data) {
                toastr.success('Thank You your order was placed successfully', 'success');
            } else {
                toastr.error('Sorry there was some problem in placing your order', 'Error');
            }
        })
    }
})