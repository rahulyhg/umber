myApp.controller('CheckoutCtrl', function ($scope, OrderService, ProductService, toastr, $state, $uibModal, myService, BannerService, TemplateService, $sce, NavigationService, UserService, CartService, WishlistService, $timeout) {
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
    $scope.user = {};
    $scope.user.billingAddress = {};
    $scope.user.deliveryAddress = {};
    $scope.user.billingAddress.country = "India";
    $scope.user.deliveryAddress.country = "India";
    $scope.paymentWay = [{
        name: 'Credit Card',
        checked: false,
        id: 1
    }, {
        name: 'Debit card',
        checked: false,
        id: 2
    }, {
        name: 'net banking',
        checked: false,
        id: 3
    }, {
        name: 'Cash on delivery',
        checked: false,
        id: 4
    }]

    //to select one checkbox at a time
    $scope.updateSelection = function (position, paymentWay) {

        // var result = _.indexOf(paymentWay, id);

        // if (result != -1) {
        //     return true;
        // } else {
        //     return false;
        // }
        angular.forEach(paymentWay, function (payment, index) {
            if (position != index)
                payment.checked = false;
        });
        $scope.getPaymentMethod = $scope.paymentWay[position].name;
    }

    if ($scope.loggedUser) {
        $scope.view = "orderTab";
    } else {
        $scope.view = "loginTab";
    }
    // $scope.createOrder = function () {
    //     var data = {};
    //     data.userId = $scope.loggedUser;
    //     OrderService.createOrderFromCart(data, function (data) {
    //         console.log("created order: ", data);
    //         if (data.data.value) {
    //             $scope.orders = data.data.data;
    //             $scope.grandTotal = CartService.getTotal($scope.orders.products);
    //             console.log("Orders: ", $scope.orders);
    //         } else {
    //             console.log("Error in creating order: ", data.data.error);
    //         }
    //     });
    // }

    // $scope.createOrder();

    $scope.registerUser = function () {
        UserService.userRegistration($scope.registerData, function (data) {
            console.log("login  data: ", data);
            if (!_.isEmpty(data.data.data)) {
                console.log("Login data: ", data);
                $scope.userData = data.data.data;
                $scope.otpRegister = $uibModal.open({
                    animation: true,
                    templateUrl: 'views/modal/otp2.html',
                    scope: $scope,
                    // windowClass: 'loginModalSize',
                    controller: 'CheckoutCtrl'
                    // windowClass: 'modal-content-radi0'
                });

                $.jStorage.set("username", $scope.userData.firstName)
                if ($.jStorage.get("username")) {
                    $scope.firstname = $.jStorage.get("username");
                }
                // $.jStorage.set("accessToken", $scope.userData.accessToken[$scope.userData.accessToken.length - 1]);
                // $.jStorage.set("userId", $scope.userData._id);

            } else if (data.data.error) {
                toastr.error("User already exists with the given emailId. Please login to proceed", "Error");
            } {
                // TODO:: show popup to register
            }
        });
    }
    $scope.checkOtp = function (otp) {
        if (otp) {
            $scope.userData.otp = otp;
            console.log("Registered user: ", $scope.userData);
            UserService.verifyRegisterUserWithOtp($scope.userData, function (data) {
                console.log("VerifyOtp: ", data);
                if (data.data.value === true) {
                    // $scope.test = $uibModal.open({
                    //     templateUrl: "views/modal/otpsuccess.html",
                    //     animation: true,
                    //     scope: $scope,
                    //     size: 'small'
                    // });
                    $.jStorage.set('user', data.data.data);
                    $.jStorage.set("userId", $scope.userData._id);
                    $.jStorage.set('accessToken', data.data.data.accessToken[0]);
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
                    $uibModalInstance.dismiss('cancel');
                    $state.reload();

                    var emailUser = {};
                    emailUser.email = $.jStorage.get('user').email;
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
        console.log(" in resend $scope.gtUser ", $scope.gtUser);
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
        console.log("in forgot password1111");
        $scope.forgotPwd = true;
        $scope.otpPwd = false
        $scope.resetPwd = false;
        $scope.forgotPasswordModal = $uibModal.open({
            animation: true,
            templateUrl: 'views/modal/otp1.html',
            scope: $scope,
            // windowClass: 'loginModalSize',
            controller: 'CheckoutCtrl'
            // windowClass: 'modal-content-radi0'
        });
        // $scope.loginModal.close({
        //     $value: $scope.loginModal
        // });
        // $rootScope.loginModal.close();
    };
    $scope.forgotPasswordOtp = function (emailId) {
        $scope.userEmail = {};
        $scope.userEmail.email = emailId;
        UserService.forgotPasswordOtp($scope.userEmail, function (data) {
            console.log("in forgotPassword: 222", data)
            if (data.data.value) {
                $scope.forgotPwd = false;
                $scope.resetPwd = false;
                $scope.otpPwd = true;
                $scope.gtUser = {};
                $scope.gtUser._id = data.data.data._id;
                // console.log("in forgotPassword: ", data)
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
                    $scope.errorOtpMessage = "Invalid OTP.";
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

    //to sve offline cart and wishlist
    $scope.addOfflineWishlistAndCart = function () {
        console.log("in addOfflineWishlistAndCart");
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
                    // $scope.createOrder();
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
                // $uibModalInstance.dismiss('cancel');
                console.log("GDSGFHFGJGHKGHKJHLJHFXGHS");
                $scope.addOfflineWishlistAndCart();
                console.log("GDSGFHFGJGHKGHKJHLJHFXGHS");
                $state.reload();
            })
        } else {
            $scope.invalidConfPwd = "Invalid password";
        }
    }

    // $scope.updateAddress = function () {
    //     angular.element(document.getElementById('ordergenerate')).disabled = true;
    //     var updateAdd = {
    //         _id: $scope.orders._id,
    //         user: $.jStorage.get("userId"),
    //         billingAddress: $scope.user.billingAddress,
    //         shippingAddress: $scope.user.deliveryAddress
    //     }
    //     OrderService.updateOrderAddress(updateAdd, function (data) {
    //         console.log("oderplaced", data);
    //         if (data.data.data) {
    //             toastr.success('Thank You your order was placed successfully', 'success');
    //         } else {
    //             toastr.error('Sorry there was some problem in placing your order', 'Error');
    //         }
    //         angular.element(document.getElementById('ordergenerate')).disabled = false;
    //     });
    // }

    $scope.login = function () {
        UserService.login($scope.loginData, function (data) {
            console.log("loginoncheckoutpage::::", data)
            if (!_.isEmpty(data.data.data)) {
                console.log("in if");
                var cart = {};
                $scope.userData = data.data.data;
                $.jStorage.set("username", $scope.userData.firstName)
                if ($.jStorage.get("username")) {
                    $scope.firstname = $.jStorage.get("username");
                }
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
                            // $scope.createOrder();
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
                $scope.message = "Invalid user name or password"
            }
        });
    }

    //to checkPaymentMethod
    $scope.checkPaymentMethod = function (payment) {

        console.log($scope.user.firstName);
        if ($.jStorage.get("gifts")) {

        }
        // $scope.generateOrder($scope.getPaymentMethod);
        if ($scope.getPaymentMethod == "Cash on delivery") {
            $scope.generateOrder($scope.getPaymentMethod);
        } else {
            $scope.generateOrder($scope.getPaymentMethod);
        }
    };

    $scope.testFunction = function () {
        OrderService.hdfcPaymentGateway({
            "hii": 1
        }, function (data) {
            console.log("########## data ########", data.data);
            $scope.paymentData = $sce.trustAsHtml('<form id="nonseamless" method="post"name="redirect" action="https://test.ccavenue.com/transaction/transaction.do?command=initiateTransaction" /><input type="hidden" id="encRequest" name="encRequest" value="f51027781089b57f78dfccf60bd3551d731e88ce4a4f0c3f67b49a6c889bb032869ba385f1c4ee2f3965dbc1535b6e62fc6ecbc9166d87ee31eaa64e85feac210c1c9524ced5da9f9aecab05a70cc117ee0d6bc6562c222ad3b62d7358e901b919cbd28276a4c4a92437a599d72ac41d1d4fdc4a13f87be21904a2c28de5f1b0a52678d4c89ab588bb7307906b49f5f74240f908726eceb121239ec07009934327ef645e106aebd97bbe1172712272d6c1b49d853116e81eb2e3dd4684a3807e474eea337957fc0f1a46342e5fda8c1e75cb25da3e81a21f56e11bab09096cb7dae26602c078b41ff7142478f5e181ee0d4c8512a58adf31c3a7a4a9df3c4e670bf8d57b572d7c826041a7039e7a380e159efc330d96ae12f46439d49edc1438fef36d4dbbd404cf865bac54df188bf65c23f7f2ef9d4b687ec24a8a0d7ea8fe96e54709ad395a391ebd755438ff64c490750ab7b0783e28e13de3ee6bbf0cd2c94378b5264244b5946558cb1e3414dcf576f794faa0869787781cf4707109af66f0f09c5ffc88672baa85b622d84fcdd2e6f11cc76937d1a305a362fbc30c46ff1afeec55ea9a0861f8f9c322e928548b320e17ffcd5d8f1aed77b92e8ece2403182e80e4ce8ab2fb9bab22a4ed82cf7120e59a3a8a332a84ac2775af0238170ffc146589eabc28c348fab382a55be5ad66460e29cc0458ac38c9aec4d21ac473d60792c21019aa023aabf4baa96f0d071f4a20251d87caabc252076db14f0767c90b5062543efc3b06961442feb569a4016b034cf3c8f8ba85e2da8f0f39756673f67b60be23600217cd77efce137ab2607f33f4fcf412186956c700c85be540269bfc5f5cfc95559e079b5163541ee4adfdbbd8ce8be918b858bb4fda34318a849355ae3c6ce6f136fedfdfe0dc2c3f410c8e8cfde4dea374828297dd1c71796f7df09a67b660b63c6ef2ea0e55624d712eb6f57011c5bbc0b5bd76662b943911c69d33b61645599038dde96d17d3"><input type="hidden" name="access_code" id="access_code" value="AVRL01EK28AF79LRFA"><script language="javascript">document.redirect.submit();</script></form>');
            $scope.paymentGateway = $uibModal.open({
                animation: true,
                templateUrl: 'views/modal/paymentGateway.html',
                scope: $scope
                // windowClass: 'loginModalSize',
                // controller: 'CheckoutCtrl'
                // windowClass: 'modal-content-radi0'
            });


        })
    }

    //for send ordermail
    $scope.orderConfirmMail = function (emailUser) {
        OrderService.ConfirmOrderPlacedMail(emailUser, function (data) {
            console.log("in User/ConfirmOrderPlacedMail", data);
            if (data.value === true) {

            }
        });
    }
    // redirect to myAccount OrderTab
    $scope.redirectToOrderTab = function () {
        $state.go("myaccount", {
            'view': 'orderTab'
        });
    }

    /************order generation and ADDRESSSS UPDATION IN USERTABLE AS WELL AS ORDER TABLE************* */
    $scope.generateOrder = function (value) {
        var data = {};
        data.firstName = $scope.user.firstName;
        data.lastName = $scope.user.lastName;
        data.mobileNo = $scope.user.mobile;
        data.email = $scope.user.email;
        data.userId = $scope.loggedUser;
        data.paymentMethod = value;
        if ($.jStorage.get("discountValues")) {
            data.selectedDiscount = $.jStorage.get("discountValues");
            if (data.selectedDiscount.selectedDiscount) {
                if ($.jStorage.get("coupon") && data.selectedDiscount.selectedDiscount.discountType == "59f06bc7647252477439a1e4") {
                    data.couponData = $.jStorage.get("coupon");
                }
            } else {

            }
        }
        var couponD = $.jStorage.get("coupon");
        // console.log("couponD", couponD, "alldata", data);
        if ($.jStorage.get("gifts")) {
            data.gifts = $.jStorage.get("gifts");
        }
        OrderService.createOrderFromCart(data, function (data) {
            console.log("created order: ", data);
            if (data.data.value) {
                $scope.orders = data.data.data;
                $.jStorage.set("userOrders", $scope.orders);
                $scope.grandTotal = CartService.getTotal($scope.orders.products);
                console.log("Orders: ", $scope.orders);
                $.jStorage.deleteKey("gifts");
                $.jStorage.deleteKey("discountValues");
                var updateAdd = {
                    _id: $scope.orders._id,
                    user: $.jStorage.get("userId"),
                    billingAddress: $scope.user.billingAddress,
                    shippingAddress: $scope.user.deliveryAddress
                }
                OrderService.updateOrderAddress(updateAdd, function (data) {
                    console.log("oderplaced", data);
                    if (data.data.data) {
                        var emailUser = {};
                        emailUser._id = $.jStorage.get("userId");
                        emailUser.order = $scope.orders;
                        if (value == "Cash on delivery") {
                            toastr.success('Thank You your order was placed successfully', 'success');
                            $scope.orderConfirmMail(emailUser);
                            $scope.redirectToOrderTab();
                        } else {
                            // payment gateway code goes here
                            // you will get all order details in $scope.orders 

                            window.location.href = "http://umber.wohlig.co.in/api/Order/formRedirect?orderId=" + $scope.orders._id;
                        }
                    } else {
                        toastr.error('Sorry there was some problem in placing your order', 'Error');
                    }
                    angular.element(document.getElementById('ordergenerate')).disabled = false;
                });

            } else {
                console.log("Error in creating order: ", data.data.error);
            }
        });
    }

    var userData = {
        userId: $.jStorage.get("userId")
    }
    /// for gifts
    if ($.jStorage.get("gifts")) {
        $scope.gift = $.jStorage.get("gifts");
    }

    CartService.getCart(userData, function (data) {
        if (data.data.data)
            $scope.orderTable = data.data.data;
        // if ($scope.orderTable) {
        //     for (var i = 0; i <= $scope.orderTable.products.length - 1; i++) {
        //         if ($scope.orderTable.products[i].quantity > $scope.orderTable.products[i].product.quantity) {

        //             $state.go("mycart");
        //         }
        //     }
        // } else {
        //     $state.go("mycart");
        // }
        if ($scope.orderTable && $scope.orderTable.products) {
            $scope.grandTotal = CartService.getTotal($scope.orderTable.products);
            if ($.jStorage.get("discountValues")) {
                // discountAmount: 3394, grandTotalAfterDiscount: 3394, selectedDiscount: Object, totalAmountOfOrder: 6788
                var discountTypeObjectData = $.jStorage.get("discountValues");
                $scope.discountAmount = discountTypeObjectData.discountAmount;
                $scope.grandTotalAfterDiscount = discountTypeObjectData.grandTotalAfterDiscount;
                $scope.totalAmountOfOrder = discountTypeObjectData.totalAmountOfOrder;
            }
        }

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
    $scope.states = ["Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli", "Daman and Diu", "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka", "Kerala", "Lakshadweep", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Orissa", "Pondicherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Tripura", "Uttar Pradesh", "Uttaranchal", "West Bengal"];
    $scope.countries = [{
            "name": "Afghanistan",
            "code": "AF",
            "continent": "Asia",
            "filename": "afghanistan"
        },
        {
            "name": "Åland Islands",
            "continent": "Europe",
            "code": "AX"
        },
        {
            "name": "Albania",
            "code": "AL",
            "continent": "Europe",
            "filename": "albania"
        },
        {
            "name": "Algeria",
            "code": "DZ",
            "continent": "Africa",
            "filename": "algeria"
        },
        {
            "name": "American Samoa",
            "code": "AS",
            "continent": "Oceania"
        },
        {
            "name": "Andorra",
            "code": "AD",
            "continent": "Europe",
            "filename": "andorra"
        },
        {
            "name": "Angola",
            "code": "AO",
            "continent": "Africa",
            "filename": "angola"
        },
        {
            "name": "Anguilla",
            "code": "AI",
            "continent": "North America"
        },
        {
            "name": "Antarctica",
            "continent": "Antarctica",
            "code": "AQ"
        },
        {
            "name": "Antigua and Barbuda",
            "code": "AG",
            "continent": "North America",
            "filename": "antigua-and-barbuda"
        },
        {
            "name": "Argentina",
            "code": "AR",
            "continent": "South America",
            "filename": "argentina"
        },
        {
            "name": "Armenia",
            "code": "AM",
            "continent": "Europe",
            "filename": "armenia"
        },
        {
            "name": "Aruba",
            "code": "AW",
            "continent": "Europe"
        },
        {
            "name": "Australia",
            "code": "AU",
            "continent": "Oceania",
            "filename": "australia"
        },
        {
            "name": "Austria",
            "code": "AT",
            "continent": "Europe",
            "filename": "austria"
        },
        {
            "name": "Azerbaijan",
            "code": "AZ",
            "continent": "Europe",
            "filename": "azerbaijan"
        },
        {
            "name": "Bahamas",
            "code": "BS",
            "continent": "North America",
            "filename": "bahamas"
        },
        {
            "name": "Bahrain",
            "code": "BH",
            "continent": "Asia",
            "filename": "bahrain"
        },
        {
            "name": "Bangladesh",
            "code": "BD",
            "continent": "Asia",
            "filename": "bangladesh"
        },
        {
            "name": "Barbados",
            "code": "BB",
            "continent": "North America",
            "filename": "barbados"
        },
        {
            "name": "Belarus",
            "code": "BY",
            "continent": "Europe",
            "filename": "belarus"
        },
        {
            "name": "Belgium",
            "code": "BE",
            "continent": "Europe",
            "filename": "belgium"
        },
        {
            "name": "Belize",
            "code": "BZ",
            "continent": "North America",
            "filename": "belize"
        },
        {
            "name": "Benin",
            "code": "BJ",
            "continent": "Africa",
            "filename": "benin"
        },
        {
            "name": "Bermuda",
            "code": "BM",
            "continent": "North America"
        },
        {
            "name": "Bhutan",
            "code": "BT",
            "continent": "Asia",
            "filename": "bhutan"
        },
        {
            "name": "Bolivia",
            "code": "BO",
            "continent": "South America",
            "filename": "bolivia"
        },
        {
            "name": "Bosnia and Herzegovina",
            "code": "BA",
            "continent": "Europe",
            "filename": "bosnia-and-herzegovina"
        },
        {
            "name": "Botswana",
            "code": "BW",
            "continent": "Africa",
            "filename": "botswana"
        },
        {
            "name": "Bouvet Island",
            "continent": "Antarctica",
            "code": "BV"
        },
        {
            "name": "Brazil",
            "code": "BR",
            "continent": "South America",
            "filename": "brazil"
        },
        {
            "name": "British Indian Ocean Territory",
            "continent": "Africa",
            "code": "IO"
        },
        {
            "name": "Brunei Darussalam",
            "code": "BN",
            "continent": "Asia",
            "filename": "brunei-darussalam"
        },
        {
            "name": "Bulgaria",
            "code": "BG",
            "continent": "Europe",
            "filename": "bulgaria"
        },
        {
            "name": "Burkina Faso",
            "code": "BF",
            "continent": "Africa",
            "filename": "burkina-faso"
        },
        {
            "name": "Burundi",
            "code": "BI",
            "continent": "Africa",
            "filename": "burundi"
        },
        {
            "name": "Cambodia",
            "code": "KH",
            "continent": "Asia",
            "filename": "cambodia"
        },
        {
            "name": "Cameroon",
            "code": "CM",
            "continent": "Africa",
            "filename": "cameroon"
        },
        {
            "name": "Canada",
            "code": "CA",
            "continent": "North America",
            "filename": "canada"
        },
        {
            "name": "Cape Verde",
            "code": "CV",
            "continent": "Africa",
            "filename": "cape-verde"
        },
        {
            "name": "Cayman Islands",
            "code": "KY",
            "continent": "North America"
        },
        {
            "name": "Central African Republic",
            "code": "CF",
            "continent": "Africa",
            "filename": "central-african-republic"
        },
        {
            "name": "Chad",
            "code": "TD",
            "continent": "Africa",
            "filename": "chad"
        },
        {
            "name": "Chile",
            "code": "CL",
            "continent": "South America",
            "filename": "chile"
        },
        {
            "name": "China",
            "code": "CN",
            "continent": "Asia",
            "filename": "china"
        },
        {
            "name": "Christmas Island",
            "code": "CX",
            "continent": "Oceania"
        },
        {
            "name": "Cocos (Keeling) Islands",
            "code": "CC",
            "continent": "Oceania"
        },
        {
            "name": "Colombia",
            "code": "CO",
            "continent": "South America",
            "filename": "colombia"
        },
        {
            "name": "Comoros",
            "code": "KM",
            "continent": "Africa",
            "filename": "comoros"
        },
        {
            "name": "Congo",
            "code": "CG",
            "continent": "Africa",
            "filename": "congo"
        },
        {
            "name": "Congo, The Democratic Republic of the",
            "code": "CD",
            "continent": "Africa",
            "filename": "congo-the-democratic-republic-of-the"
        },
        {
            "name": "Cook Islands",
            "continent": "Oceania",
            "code": "CK"
        },
        {
            "name": "Costa Rica",
            "code": "CR",
            "continent": "North America",
            "filename": "costa-rica"
        },
        {
            "name": "Côte d'Ivoire, Republic of",
            "code": "CI",
            "continent": "Africa",
            "filename": "cote-d-ivoire-republic-of"
        },
        {
            "name": "Croatia",
            "code": "HR",
            "continent": "Europe",
            "filename": "croatia"
        },
        {
            "name": "Cuba",
            "code": "CU",
            "continent": "North America",
            "filename": "cuba"
        },
        {
            "name": "Curaçao",
            "code": "CW",
            "continent": "Europe"
        },
        {
            "name": "Cyprus",
            "code": "CY",
            "continent": "Europe",
            "filename": "cyprus"
        },
        {
            "name": "Czech Republic",
            "code": "CZ",
            "continent": "Europe",
            "filename": "czech-republic"
        },
        {
            "name": "Denmark",
            "code": "DK",
            "continent": "Europe",
            "filename": "denmark"
        },
        {
            "name": "Djibouti",
            "code": "DJ",
            "continent": "Africa",
            "filename": "djibouti"
        },
        {
            "name": "Dominica",
            "code": "DM",
            "continent": "North America",
            "filename": "dominica"
        },
        {
            "name": "Dominican Republic",
            "code": "DO",
            "continent": "North America",
            "filename": "dominican-republic"
        },
        {
            "name": "Ecuador",
            "code": "EC",
            "continent": "South America",
            "filename": "ecuador"
        },
        {
            "name": "Egypt",
            "code": "EG",
            "continent": "Africa",
            "filename": "egypt"
        },
        {
            "name": "El Salvador",
            "code": "SV",
            "continent": "North America",
            "filename": "el-salvador"
        },
        {
            "name": "Equatorial Guinea",
            "code": "GQ",
            "continent": "Africa",
            "filename": "equatorial-guinea"
        },
        {
            "name": "Eritrea",
            "code": "ER",
            "continent": "Africa",
            "filename": "eritrea"
        },
        {
            "name": "Estonia",
            "code": "EE",
            "continent": "Europe",
            "filename": "estonia"
        },
        {
            "name": "Ethiopia",
            "code": "ET",
            "continent": "Africa",
            "filename": "ethiopia"
        },
        {
            "name": "Falkland Islands (Malvinas)",
            "code": "FK",
            "continent": "South America"
        },
        {
            "name": "Faroe Islands",
            "continent": "Europe",
            "code": "FO"
        },
        {
            "name": "Fiji",
            "code": "FJ",
            "continent": "Oceania",
            "filename": "fiji"
        },
        {
            "name": "Finland",
            "code": "FI",
            "continent": "Europe",
            "filename": "finland"
        },
        {
            "name": "France",
            "code": "FR",
            "continent": "Europe",
            "filename": "france"
        },
        {
            "name": "French Guiana",
            "code": "GF",
            "continent": "South America"
        },
        {
            "name": "French Polynesia",
            "code": "PF",
            "continent": "Oceania"
        },
        {
            "name": "French Southern Territories",
            "continent": "Antarctica",
            "code": "TF"
        },
        {
            "name": "Gabon",
            "code": "GA",
            "continent": "Africa",
            "filename": "gabon"
        },
        {
            "name": "Gambia",
            "code": "GM",
            "continent": "Africa",
            "filename": "gambia"
        },
        {
            "name": "Georgia",
            "code": "GE",
            "continent": "Europe",
            "filename": "georgia"
        },
        {
            "name": "Germany",
            "code": "DE",
            "continent": "Europe",
            "filename": "germany"
        },
        {
            "name": "Ghana",
            "code": "GH",
            "continent": "Africa",
            "filename": "ghana"
        },
        {
            "name": "Gibraltar",
            "continent": "Europe",
            "code": "GI"
        },
        {
            "name": "Greece",
            "code": "GR",
            "continent": "Europe",
            "filename": "greece"
        },
        {
            "name": "Greenland",
            "code": "GL",
            "continent": "North America",
            "filename": "greenland"
        },
        {
            "name": "Grenada",
            "code": "GD",
            "continent": "North America",
            "filename": "grenada"
        },
        {
            "name": "Guadeloupe",
            "code": "GP",
            "continent": "North America"
        },
        {
            "name": "Guam",
            "code": "GU",
            "continent": "Oceania"
        },
        {
            "name": "Guatemala",
            "code": "GT",
            "continent": "North America",
            "filename": "guatemala"
        },
        {
            "name": "Guernsey",
            "continent": "Europe",
            "code": "GG"
        },
        {
            "name": "Guinea",
            "code": "GN",
            "continent": "Africa",
            "filename": "guinea"
        },
        {
            "name": "Guinea-Bissau",
            "code": "GW",
            "continent": "Africa",
            "filename": "guinea-bissau"
        },
        {
            "name": "Guyana",
            "code": "GY",
            "continent": "South America",
            "filename": "guyana"
        },
        {
            "name": "Haiti",
            "code": "HT",
            "continent": "North America",
            "filename": "haiti"
        },
        {
            "name": "Heard Island and Mcdonald Islands",
            "continent": "Oceania",
            "code": "HM"
        },
        {
            "name": "Holy See (Vatican City State)",
            "code": "VA",
            "continent": "Europe"
        },
        {
            "name": "Honduras",
            "code": "HN",
            "continent": "North America",
            "filename": "honduras"
        },
        {
            "name": "Hong Kong",
            "code": "HK",
            "continent": "Asia",
            "filename": "hong-kong"
        },
        {
            "name": "Hungary",
            "code": "HU",
            "continent": "Europe",
            "filename": "hungary"
        },
        {
            "name": "Iceland",
            "code": "IS",
            "continent": "Europe",
            "filename": "iceland"
        },
        {
            "name": "India",
            "code": "IN",
            "continent": "Asia",
            "filename": "india"
        },
        {
            "name": "Indonesia",
            "code": "ID",
            "continent": "Asia",
            "filename": "indonesia"
        },
        {
            "name": "Iran, Islamic Republic Of",
            "code": "IR",
            "continent": "Asia",
            "filename": "iran-islamic-republic-of"
        },
        {
            "name": "Iraq",
            "code": "IQ",
            "continent": "Asia",
            "filename": "iraq"
        },
        {
            "name": "Ireland",
            "code": "IE",
            "continent": "Europe",
            "filename": "ireland"
        },
        {
            "name": "Isle of Man",
            "continent": "Europe",
            "code": "IM"
        },
        {
            "name": "Israel",
            "code": "IL",
            "continent": "Asia",
            "filename": "israel"
        },
        {
            "name": "Italy",
            "code": "IT",
            "continent": "Europe",
            "filename": "italy"
        },
        {
            "name": "Jamaica",
            "code": "JM",
            "continent": "North America",
            "filename": "jamaica"
        },
        {
            "name": "Japan",
            "code": "JP",
            "continent": "Asia",
            "filename": "japan"
        },
        {
            "name": "Jersey",
            "continent": "Europe",
            "code": "JE"
        },
        {
            "name": "Jordan",
            "code": "JO",
            "continent": "Asia",
            "filename": "jordan"
        },
        {
            "name": "Kazakhstan",
            "code": "KZ",
            "continent": "Europe",
            "filename": "kazakhstan"
        },
        {
            "name": "Kenya",
            "code": "KE",
            "continent": "Africa",
            "filename": "kenya"
        },
        {
            "name": "Kiribati",
            "code": "KI",
            "continent": "Oceania",
            "filename": "kiribati"
        },
        {
            "name": "Korea, Democratic People's Republic of",
            "code": "KP",
            "continent": "Asia",
            "filename": "korea-democratic-people-s-republic-of"
        },
        {
            "name": "Korea, Republic of",
            "code": "KR",
            "continent": "Asia",
            "filename": "korea-republic-of"
        },
        {
            "name": "Kuwait",
            "code": "KW",
            "continent": "Asia",
            "filename": "kuwait"
        },
        {
            "name": "Kyrgyzstan",
            "code": "KG",
            "continent": "Asia",
            "filename": "kyrgyzstan"
        },
        {
            "name": "Lao People's Democratic Republic",
            "code": "LA",
            "continent": "Asia",
            "filename": "lao-people-s-democratic-republic"
        },
        {
            "name": "Latvia",
            "code": "LV",
            "continent": "Europe",
            "filename": "latvia"
        },
        {
            "name": "Lebanon",
            "code": "LB",
            "continent": "Asia",
            "filename": "lebanon"
        },
        {
            "name": "Lesotho",
            "code": "LS",
            "continent": "Africa",
            "filename": "lesotho"
        },
        {
            "name": "Liberia",
            "code": "LR",
            "continent": "Africa",
            "filename": "liberia"
        },
        {
            "name": "Libyan Arab Jamahiriya",
            "code": "LY",
            "continent": "Africa",
            "filename": "libyan-arab-jamahiriya"
        },
        {
            "name": "Liechtenstein",
            "code": "LI",
            "continent": "Europe",
            "filename": "liechtenstein"
        },
        {
            "name": "Lithuania",
            "code": "LT",
            "continent": "Europe",
            "filename": "lithuania"
        },
        {
            "name": "Luxembourg",
            "code": "LU",
            "continent": "Europe",
            "filename": "luxembourg"
        },
        {
            "name": "Macao",
            "code": "MO",
            "continent": "Asia"
        },
        {
            "name": "Macedonia, The Former Yugoslav Republic of",
            "code": "MK",
            "continent": "Europe",
            "filename": "macedonia-the-former-yugoslav-republic-of"
        },
        {
            "name": "Madagascar",
            "code": "MG",
            "continent": "Africa",
            "filename": "madagascar"
        },
        {
            "name": "Malawi",
            "code": "MW",
            "continent": "Africa",
            "filename": "malawi"
        },
        {
            "name": "Malaysia",
            "code": "MY",
            "continent": "Asia",
            "filename": "malaysia"
        },
        {
            "name": "Maldives",
            "code": "MV",
            "continent": "Asia",
            "filename": "maldives"
        },
        {
            "name": "Mali",
            "code": "ML",
            "continent": "Africa",
            "filename": "mali"
        },
        {
            "name": "Malta",
            "code": "MT",
            "continent": "Europe",
            "filename": "malta"
        },
        {
            "name": "Marshall Islands",
            "code": "MH",
            "continent": "Oceania",
            "filename": "marshall-islands"
        },
        {
            "name": "Martinique",
            "code": "MQ",
            "continent": "North America"
        },
        {
            "name": "Mauritania",
            "code": "MR",
            "continent": "Africa",
            "filename": "mauritania"
        },
        {
            "name": "Mauritius",
            "code": "MU",
            "continent": "Africa",
            "filename": "mauritius"
        },
        {
            "name": "Mayotte",
            "code": "YT",
            "continent": "Africa"
        },
        {
            "name": "Mexico",
            "code": "MX",
            "continent": "North America",
            "filename": "mexico"
        },
        {
            "name": "Micronesia, Federated States of",
            "code": "FM",
            "continent": "Oceania",
            "filename": "micronesia-federated-states-of"
        },
        {
            "name": "Moldova, Republic of",
            "code": "MD",
            "continent": "Europe",
            "filename": "moldova-republic-of"
        },
        {
            "name": "Monaco",
            "code": "MC",
            "continent": "Europe",
            "filename": "monaco"
        },
        {
            "name": "Mongolia",
            "code": "MN",
            "continent": "Asia",
            "filename": "mongolia"
        },
        {
            "name": "Montenegro",
            "code": "ME",
            "continent": "Europe",
            "filename": "montenegro"
        },
        {
            "name": "Montserrat",
            "code": "MS",
            "continent": "North America"
        },
        {
            "name": "Morocco",
            "code": "MA",
            "continent": "Africa",
            "filename": "morocco"
        },
        {
            "name": "Mozambique",
            "code": "MZ",
            "continent": "Africa",
            "filename": "mozambique"
        },
        {
            "name": "Myanmar",
            "code": "MM",
            "continent": "Asia",
            "filename": "myanmar"
        },
        {
            "name": "Namibia",
            "code": "NA",
            "continent": "Africa",
            "filename": "namibia"
        },
        {
            "name": "Nauru",
            "code": "NR",
            "continent": "Oceania",
            "filename": "nauru"
        },
        {
            "name": "Nepal",
            "code": "NP",
            "continent": "Asia",
            "filename": "nepal"
        },
        {
            "name": "Netherlands",
            "code": "NL",
            "continent": "Europe",
            "filename": "netherlands"
        },
        {
            "name": "Netherlands Antilles",
            "code": "AN",
            "continent": "Europe"
        },
        {
            "name": "New Caledonia",
            "code": "NC",
            "continent": "Oceania"
        },
        {
            "name": "New Zealand",
            "code": "NZ",
            "continent": "Oceania",
            "filename": "new-zealand"
        },
        {
            "name": "Nicaragua",
            "code": "NI",
            "continent": "North America",
            "filename": "nicaragua"
        },
        {
            "name": "Niger",
            "code": "NE",
            "continent": "Africa",
            "filename": "niger"
        },
        {
            "name": "Nigeria",
            "code": "NG",
            "continent": "Africa",
            "filename": "nigeria"
        },
        {
            "name": "Niue",
            "continent": "Oceania",
            "code": "NU"
        },
        {
            "name": "Norfolk Island",
            "code": "NF",
            "continent": "Oceania"
        },
        {
            "name": "Northern Mariana Islands",
            "continent": "Oceania",
            "code": "MP"
        },
        {
            "name": "Norway",
            "code": "NO",
            "continent": "Europe",
            "filename": "norway"
        },
        {
            "name": "Oman",
            "code": "OM",
            "continent": "Asia",
            "filename": "oman"
        },
        {
            "name": "Pakistan",
            "code": "PK",
            "continent": "Asia",
            "filename": "pakistan"
        },
        {
            "name": "Palau",
            "code": "PW",
            "continent": "Oceania",
            "filename": "palau"
        },
        {
            "name": "Palestinian Territory, Occupied",
            "code": "PS",
            "continent": "Asia",
            "filename": "palestinian-territory-occupied"
        },
        {
            "name": "Panama",
            "code": "PA",
            "continent": "North America",
            "filename": "panama"
        },
        {
            "name": "Papua New Guinea",
            "code": "PG",
            "continent": "Oceania",
            "filename": "papua-new-guinea"
        },
        {
            "name": "Paraguay",
            "code": "PY",
            "continent": "South America",
            "filename": "paraguay"
        },
        {
            "name": "Peru",
            "code": "PE",
            "continent": "South America",
            "filename": "peru"
        },
        {
            "name": "Philippines",
            "code": "PH",
            "continent": "Asia",
            "filename": "philippines"
        },
        {
            "name": "Pitcairn",
            "continent": "Oceania",
            "code": "PN"
        },
        {
            "name": "Poland",
            "code": "PL",
            "continent": "Europe",
            "filename": "poland"
        },
        {
            "name": "Portugal",
            "code": "PT",
            "continent": "Europe",
            "filename": "portugal"
        },
        {
            "name": "Puerto Rico",
            "code": "PR",
            "continent": "North America"
        },
        {
            "name": "Qatar",
            "code": "QA",
            "continent": "Asia",
            "filename": "qatar"
        },
        {
            "name": "Réunion",
            "code": "RE",
            "continent": "Africa"
        },
        {
            "name": "Romania",
            "code": "RO",
            "continent": "Europe",
            "filename": "romania"
        },
        {
            "name": "Russian Federation",
            "code": "RU",
            "continent": "Europe",
            "filename": "russian-federation"
        },
        {
            "name": "Rwanda",
            "code": "RW",
            "continent": "Africa",
            "filename": "rwanda"
        },
        {
            "name": "Saint Helena, Ascension and Tristan da Cunha",
            "code": "SH",
            "continent": "Africa",
            "filename": "saint-helena-ascension-and-tristan-da-cunha"
        },
        {
            "name": "Saint Kitts and Nevis",
            "code": "KN",
            "continent": "North America",
            "filename": "saint-kitts-and-nevis"
        },
        {
            "name": "Saint Lucia",
            "code": "LC",
            "continent": "North America",
            "filename": "saint-lucia"
        },
        {
            "name": "Saint Pierre and Miquelon",
            "code": "PM",
            "continent": "North America"
        },
        {
            "name": "Saint Vincent and the Grenadines",
            "code": "VC",
            "continent": "North America",
            "filename": "saint-vincent-and-the-grenadines"
        },
        {
            "name": "Samoa",
            "code": "WS",
            "continent": "Oceania",
            "filename": "samoa"
        },
        {
            "name": "San Marino",
            "code": "SM",
            "continent": "Europe",
            "filename": "san-marino"
        },
        {
            "name": "São Tomé and Príncipe",
            "code": "ST",
            "continent": "Africa",
            "filename": "sao-tome-and-principe"
        },
        {
            "name": "Saudi Arabia",
            "code": "SA",
            "continent": "Asia",
            "filename": "saudi-arabia"
        },
        {
            "name": "Senegal",
            "code": "SN",
            "continent": "Africa",
            "filename": "senegal"
        },
        {
            "name": "Serbia",
            "code": "RS",
            "continent": "Europe",
            "filename": "serbia"
        },
        {
            "name": "Seychelles",
            "code": "SC",
            "continent": "Africa",
            "filename": "seychelles"
        },
        {
            "name": "Sierra Leone",
            "code": "SL",
            "continent": "Africa",
            "filename": "sierra-leone"
        },
        {
            "name": "Singapore",
            "code": "SG",
            "continent": "Asia",
            "filename": "singapore"
        },
        {
            "name": "Sint Maarten",
            "code": "SX",
            "continent": "Europe"
        },
        {
            "name": "Slovakia",
            "code": "SK",
            "continent": "Europe",
            "filename": "slovakia"
        },
        {
            "name": "Slovenia",
            "code": "SI",
            "continent": "Europe",
            "filename": "slovenia"
        },
        {
            "name": "Solomon Islands",
            "code": "SB",
            "continent": "Oceania",
            "filename": "solomon-islands"
        },
        {
            "name": "Somalia",
            "code": "SO",
            "continent": "Africa",
            "filename": "somalia"
        },
        {
            "name": "South Africa",
            "code": "ZA",
            "continent": "Africa",
            "filename": "south-africa"
        },
        {
            "name": "South Georgia and the South Sandwich Islands",
            "code": "GS",
            "continent": "South America"
        },
        {
            "name": "South Sudan",
            "code": "SS",
            "continent": "Africa",
            "filename": "south-sudan"
        },
        {
            "name": "Spain",
            "code": "ES",
            "continent": "Europe",
            "filename": "spain"
        },
        {
            "name": "Sri Lanka",
            "code": "LK",
            "continent": "Asia",
            "filename": "sri-lanka"
        },
        {
            "name": "Sudan",
            "code": "SD",
            "continent": "Africa",
            "filename": "sudan"
        },
        {
            "name": "Suriname",
            "code": "SR",
            "continent": "South America",
            "filename": "suriname"
        },
        {
            "name": "Svalbard and Jan Mayen",
            "continent": "Europe",
            "code": "SJ"
        },
        {
            "name": "Swaziland",
            "code": "SZ",
            "continent": "Africa",
            "filename": "swaziland"
        },
        {
            "name": "Sweden",
            "code": "SE",
            "continent": "Europe",
            "filename": "sweden"
        },
        {
            "name": "Switzerland",
            "code": "CH",
            "continent": "Europe",
            "filename": "switzerland"
        },
        {
            "name": "Syrian Arab Republic",
            "code": "SY",
            "continent": "Asia",
            "filename": "syrian-arab-republic"
        },
        {
            "name": "Taiwan, Province of China",
            "code": "TW",
            "continent": "Asia",
            "filename": "taiwan-province-of-china"
        },
        {
            "name": "Tajikistan",
            "code": "TJ",
            "continent": "Asia",
            "filename": "tajikistan"
        },
        {
            "name": "Tanzania, United Republic of",
            "code": "TZ",
            "continent": "Africa",
            "filename": "tanzania-united-republic-of"
        },
        {
            "name": "Thailand",
            "code": "TH",
            "continent": "Asia",
            "filename": "thailand"
        },
        {
            "name": "Timor-Leste",
            "code": "TL",
            "continent": "Oceania",
            "filename": "timor-leste"
        },
        {
            "name": "Togo",
            "code": "TG",
            "continent": "Africa",
            "filename": "togo"
        },
        {
            "name": "Tokelau",
            "continent": "Oceania",
            "code": "TK"
        },
        {
            "name": "Tonga",
            "code": "TO",
            "continent": "Oceania",
            "filename": "tonga"
        },
        {
            "name": "Trinidad and Tobago",
            "code": "TT",
            "continent": "North America",
            "filename": "trinidad-and-tobago"
        },
        {
            "name": "Tunisia",
            "code": "TN",
            "continent": "Africa",
            "filename": "tunisia"
        },
        {
            "name": "Turkey",
            "code": "TR",
            "continent": "Europe",
            "filename": "turkey"
        },
        {
            "name": "Turkmenistan",
            "code": "TM",
            "continent": "Asia",
            "filename": "turkmenistan"
        },
        {
            "name": "Turks and Caicos Islands",
            "code": "TC",
            "continent": "North America"
        },
        {
            "name": "Tuvalu",
            "code": "TV",
            "continent": "Oceania",
            "filename": "tuvalu"
        },
        {
            "name": "Uganda",
            "code": "UG",
            "continent": "Africa",
            "filename": "uganda"
        },
        {
            "name": "Ukraine",
            "code": "UA",
            "continent": "Europe",
            "filename": "ukraine"
        },
        {
            "name": "United Arab Emirates",
            "code": "AE",
            "continent": "Asia",
            "filename": "united-arab-emirates"
        },
        {
            "name": "United Kingdom",
            "code": "GB",
            "continent": "Europe",
            "filename": "united-kingdom"
        },
        {
            "name": "United States",
            "code": "US",
            "continent": "North America",
            "filename": "united-states"
        },
        {
            "name": "United States Minor Outlying Islands",
            "code": "UM",
            "continent": "North America",
            "filename": "united-states-minor-outlying-islands"
        },
        {
            "name": "Uruguay",
            "code": "UY",
            "continent": "South America",
            "filename": "uruguay"
        },
        {
            "name": "Uzbekistan",
            "code": "UZ",
            "continent": "Asia",
            "filename": "uzbekistan"
        },
        {
            "name": "Vanuatu",
            "code": "VU",
            "continent": "Oceania",
            "filename": "vanuatu"
        },
        {
            "name": "Venezuela",
            "code": "VE",
            "continent": "South America",
            "filename": "venezuela"
        },
        {
            "name": "Viet Nam",
            "code": "VN",
            "continent": "Asia",
            "filename": "viet-nam"
        },
        {
            "name": "Virgin Islands, British",
            "code": "VG",
            "continent": "North America"
        },
        {
            "name": "Virgin Islands, U.S.",
            "code": "VI",
            "continent": "North America"
        },
        {
            "name": "Wallis and Futuna",
            "continent": "Oceania",
            "code": "WF"
        },
        {
            "name": "Western Sahara",
            "continent": "Africa",
            "code": "EH"
        },
        {
            "name": "Yemen",
            "code": "YE",
            "continent": "Asia",
            "filename": "yemen"
        },
        {
            "name": "Zambia",
            "code": "ZM",
            "continent": "Africa",
            "filename": "zambia"
        },
        {
            "name": "Zimbabwe",
            "code": "ZW",
            "continent": "Africa",
            "filename": "zimbabwe"
        }
    ];

    //Function for next button which displays the detail tab if a user is logged in or clicks on the next button for checkout 
    var clickCounter = 0;
    $scope.proceedToDetailTab = function () {
        $scope.view = 'detailTab';
    };

})