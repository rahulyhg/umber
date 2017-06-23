myApp
    .controller('HomeCtrl', function ($scope, TemplateService, CartService, WishlistService, NavigationService, ProductService, $timeout, $location) {
        $scope.template = TemplateService.getHTML("content/home.html");
        TemplateService.title = "Home"; //This is the Title of the Website
        $scope.navigation = NavigationService.getNavigation();
        $scope.toggled = function (open) {
            alert('xd');
        };

        ProductService.getthelook(function (data) {
            $scope.getthelook = data.data.data;
            //console.log("new look", data.data.data);
        })
        $scope.userId = $.jStorage.get('userId');
        NavigationService.EnabledHomeScreen(function (data) {
            console.log("Frontend->controller.js->data: ", data);
            $scope.clothCat = data.data.data;
            console.log("clothCat: ", $scope.clothCat);
        });

        NavigationService.getEnabledCategories(function (data) {
            console.log("Getting categories: ", data);
            $scope.categories = data.data.data;
            console.log("Retrieved categories: ", $scope.categories);
        });

        ProductService.getNewArrivals(function (data) {
            console.log("Getting new arrivals: ", data);
            $scope.newArrivals = data.data.data;
            console.log("New arrivals: ", $scope.newArrivals);
        });

        /******************todo:for showing cart logo  infinite loop issue******************** */
        var userId = {
            userId: $.jStorage.get("userId"),
            accessToken: $.jStorage.get("accessToken")
        }
        console.log("before check")
        /****************for cart tooltip after login***************** */
        if (userId.userId) {


            CartService.getCart(userId, function (data) {


                if (data.data.data) {

                    $scope.mycart = data.data.data.products;
                    $scope.tempcart = [];
                    for (var i = 0; i < $scope.mycart.length; i++) {
                        $scope.tempcart.push({
                            productId: $scope.mycart[i].product.productId
                        })
                    }
                }
            })

            WishlistService.getWishlist(userId, function (result) {

                console.log("***************************wishlistran*****************************")
                $scope.wishlist = result.data.data;
                console.log("Wishlist data::::::::", $scope.wishlist);

            });

            ProductService.getFeatured(function (data) {
                console.log("***************************************productran***********************")
                $scope.featured = data.data.data;
                console.log("Featured: ", $scope.featured);
            })

        } else {
            $scope.mycart = []
            $scope.mycart = $.jStorage.get("cart");
            $scope.wishlist = $.jStorage.get("wishlist")
            console.log("offline wishlist check:::::::", $scope.wishlist)
            if ($scope.mycart) {
                $scope.mycart = $scope.mycart.products;
                console.log("mycartfor offlinetooltip::::", $scope.mycart)
                $scope.tempcart = [];
                if ($scope.mycart) {
                    for (var i = 0; i < $scope.mycart.length; i++) {
                        $scope.tempcart.push({
                            productId: $scope.mycart[i].product.productId
                        })
                    }
                }
            }

            ProductService.getFeatured(function (data) {
                $scope.featured = data.data.data;

            });
        }
        $scope.checkInCart = function (productId) {

            if (userId.userId) {

                var result = _.find($scope.tempcart, {
                    "productId": productId
                });

                if (result) {
                    return true
                } else {
                    return false
                }
            } else {
                var result = _.find($scope.tempcart, {
                    "productId": productId
                });

                if (result) {
                    return true
                } else {
                    return false
                }
            }
        }

        $scope.checkWishlist = function (productId) {

            if (userId.userId) {

                var result = _.find($scope.wishlist, {
                    "productId": productId
                });
                console.log("result:::::", result)
                if (result) {
                    return "fa fa-heart";
                } else {
                    return "fa fa-heart-o";
                }
            } else {
                var result = _.find($scope.wishlist, {
                    "productId": productId
                });

                if (result) {
                    return "fa fa-heart";
                } else {
                    return "fa fa-heart-o";
                }
            }
        }

        NavigationService.getEnabledBlogs(function (data) {
            $scope.blogs = data.data.data;
            console.log("Enabled blogs retrieved: ", $scope.blogs);
        });

        $scope.sale = [{
            img: '../img/home/11.jpg',
            price: '2,899',
            type: 'Linen Full Sleeve ShirtWith Rollup'

        }, {
            img: '../img/home/12.jpg',
            price: '2,899',
            type: 'Linen Full Sleeve ShirtWith Rollup'

        }, {
            img: '../img/home/13.jpg',
            price: '2,899',
            type: 'Linen Full Sleeve ShirtWith Rollup'

        }, {
            img: '../img/home/14.jpg',
            price: '2,899',
            type: 'Linen Full Sleeve ShirtWith Rollup'

        }, {
            img: '../img/home/11.jpg',
            price: '2,899',
            type: 'Linen Full Sleeve ShirtWith Rollup'

        }, {
            img: '../img/home/12.jpg',
            price: '2,899',
            type: 'Linen Full Sleeve ShirtWith Rollup'

        }, {
            img: '../img/home/13.jpg',
            price: '2,899',
            type: 'Lorem Ipsum is simply dummy text'

        }, {
            img: '../img/home/14.jpg',
            price: '2,899',
            type: 'Lorem Ipsum is simply dummy text'

        }];
    })
    .controller('BuythelookCtrl', function ($scope, $rootScope, $stateParams, ProductService, TemplateService, NavigationService, $timeout, $uibModal) {
        $scope.template = TemplateService.getHTML("content/buythelook.html");
        TemplateService.title = "Buythelook"; //This is the Title of the Website
        //$scope.navigation = NavigationService.getEnabledCtNavigation();
        $scope.currentId = $stateParams.id;
        console.log($scope.currentId);
        var input = {
            _id: $scope.currentId
        }
        ProductService.getBuyTheLookDetails(input, function (data) {
            $scope.buyshirt = data.data.data;
            $scope.myShirt = [];
            $scope.myShirt11 = [];
            $scope.myShirt = _.chunk($scope.buyshirt, 3);
            console.log($scope.myShirt)
            // console.log("myshirt", $scope.myShirt);
            // _.each($scope.myShirt, function (n) {
            //     $scope.myShirt1 = _.chunk(n, 3);
            //     $scope.myShirt11.push($scope.myShirt1);
            //     console.log($scope.myShirt11);
            // });
        })

        $rootScope.clickfun = function (product) {
            console.log(product)
            $scope.compareproduct = $.jStorage.get('compareproduct') ? $.jStorage.get('compareproduct') : [];
            var result = _.find($scope.compareproduct, {
                productId: product.productId
            });
            if (result) {
                _.remove($scope.compareproduct, {
                    productId: product.productId
                });
                $.jStorage.set('compareproduct', $scope.compareproduct);
            } else {
                $scope.compareproduct.push(product);
                $.jStorage.set('compareproduct', $scope.compareproduct);
                console.log($.jStorage.get('compareproduct'))
            }
            console.log($.jStorage.get('compareproduct'))
            if (_.isEmpty($.jStorage.get('compareproduct'))) {
                $scope.showCheck = false

            } else {
                $scope.showCheck = true
            }
        }
        $rootScope.checkStateOnReload = function (prodid) {
            var cp = $.jStorage.get("compareproduct")
            var result = _.find(cp, {
                productId: prodid
            });
            if (result) {
                return true;
            } else {
                return false;
            }
        }

        // $scope.buyshirt = [{
        //     img: 'img/buy/2.jpg',
        //     rupee: '3,000',
        //     title: 'linen FULL SLEEVE SHIRT WITH ROLL UP',
        //     id: 0
        // }, {
        //     img: 'img/buy/3.jpg',
        //     rupee: '3,000',
        //     title: 'linen FULL SLEEVE SHIRT WITH ROLL UP',
        //     id: 1
        // }, {
        //     img: 'img/buy/4.jpg',
        //     rupee: '3,000',
        //     title: 'linen FULL SLEEVE SHIRT WITH ROLL UP',
        //     id: 2
        // }, {
        //     img: 'img/buy/5.jpg',
        //     rupee: '3,000',
        //     title: 'OFF WHITE SLIM FIT FORMA TROUSER',
        //     id: 3
        // }, {
        //     img: 'img/buy/6.jpg',
        //     rupee: '3,000',
        //     title: 'OFF WHITE SLIM FIT FORMA TROUSER',
        //     id: 4
        // }, {
        //     img: 'img/buy/7.jpg',
        //     rupee: '3,000',
        //     title: 'OFF WHITE SLIM FIT FORMA TROUSER',
        //     id: 5
        // }, {
        //     img: 'img/buy/2.jpg',
        //     rupee: '3,000',
        //     title: 'Linen LIGHT BLUE CASUAL BLAZER',
        //     id: 6
        // }, {
        //     img: 'img/buy/3.jpg',
        //     rupee: '3,000',
        //     title: 'linen LIGHT BLUE CASUAL BLAZER',
        //     id: 7
        // }, {
        //     img: 'img/buy/4.jpg',
        //     rupee: '3,000',
        //     title: 'linen LIGHT BLUE CASUAL BLAZER',
        //     id: 8
        // }, {
        //     img: 'img/buy/5.jpg',
        //     rupee: '3,000',
        //     title: 'MEN WHITE GENUINE LEATHER DERBYS',
        //     id: 9
        // }, {
        //     img: 'img/buy/6.jpg',
        //     rupee: '3,000',
        //     title: 'MEN WHITE GENUINE LEATHER DERBYS',
        //     id: 10
        // }, {
        //     img: 'img/buy/7.jpg',
        //     rupee: '3,000',
        //     title: 'MEN WHITE GENUINE LEATHER DERBYS',
        //     id: 11
        // }, {
        //     img: 'img/buy/3.jpg',
        //     rupee: '3,000',
        //     title: 'LETHER MEN BLACK GENUINE LEATHER BELT',
        //     id: 12
        // }, {
        //     img: 'img/buy/4.jpg',
        //     rupee: '3,000',
        //     title: 'LETHER MEN BLACK GENUINE LEATHER BELT',
        //     id: 13
        // }, {
        //     img: 'img/buy/5.jpg',
        //     rupee: '3,000',
        //     title: 'LETHER MEN BLACK GENUINE LEATHER BELT',
        //     id: 14
        // }, {
        //     img: 'img/buy/6.jpg',
        //     rupee: '3,000',
        //     title: 'GRAVIATE BLACK FULL FRAME ROUNDGLASSES',
        //     id: 15
        // }, {
        //     img: 'img/buy/7.jpg',
        //     rupee: '3,000',
        //     title: 'GRAVIATE BLACK FULL FRAME ROUNDGLASSES',
        //     id: 16
        // }, {
        //     img: 'img/buy/5.jpg',
        //     rupee: '3,000',
        //     title: 'GRAVIATE BLACK FULL FRAME ROUNDGLASSES',
        //     id: 17
        // }];





        $scope.forgot = function () {
            $uibModal.open({
                animation: true,
                templateUrl: 'views/modal/changepass.html',
                scope: $scope
            });
        };

        $scope.otp1 = function () {
            $uibModal.open({
                animation: true,
                templateUrl: 'views/modal/otp1.html',
                scope: $scope
            });
        };

        $scope.otp2 = function () {
            $uibModal.open({
                animation: true,
                templateUrl: 'views/modal/otp2.html',
                scope: $scope
            });
        };

        $scope.addwishlist = function () {
            $uibModal.open({
                animation: true,
                templateUrl: 'views/modal/wishlistadd.html',
                scope: $scope
            });
        };

        $scope.addcart = function () {

            $uibModal.open({
                animation: true,
                templateUrl: 'views/modal/cartadd.html',
                scope: $scope
            });
        };

        $scope.remove = function () {
            $uibModal.open({
                animation: true,
                templateUrl: 'views/modal/removeitem.html',
                scope: $scope
            });
        };

        $scope.form = true;
        $scope.forms = false;
        $scope.continue = function () {
            $scope.forms = true;
            $scope.form = false;
        };
    })
    .controller('CheckoutCtrl', function ($scope, OrderService, ProductService, toastr, $state, myService, BannerService, TemplateService, NavigationService, UserService, CartService, WishlistService, $timeout) {
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
    .controller('IndividualPageCtrl', function ($scope, $rootScope, $http, $stateParams, $state, $uibModal, UserService, WishlistService,
        TemplateService, NavigationService, ProductService, CartService, $timeout, myService) {
        $scope.template = TemplateService.getHTML("content/individual-page.html");
        TemplateService.title = "individual-page"; //This is the Title of the Website
        $scope.navigation = NavigationService.getNavigation();
        $scope.formSubmitted = false;
        $scope.oneAtATime = true;
        $scope.reqQuantity = 1;
        $scope.submitForm = function (data) {
            console.log(data);
            $scope.formSubmitted = true;
        };
        $scope.updateQuantity = function (oper) {

            $scope.reqQuantity += parseInt(oper);

        }
        $scope.loggedUser = $.jStorage.get("userId");
        var data = {
            productId: $stateParams.id
        };

        ProductService.getProductDetails(data, function (data) {

            if (data.data.value) {
                $scope.product = data.data.data;
                $scope.productImages = _.sortBy($scope.product.images, ['order']);
                $scope.selectedImage = _.sortBy($scope.product.images, ['order'])[0];
                $scope.sizes = $scope.product.sizes;

                $scope.selectedSize = $scope.sizes[0];
                $scope.activeButton = $scope.selectedSize.name;
            } else {
                console.log(data.data.error);
                $scope.product = {};
            }
        });
        $scope.selectSize = function (sizeObj) {
            console.log(sizeObj)
            $scope.activeButton = sizeObj.name;
            $scope.selectedSize = sizeObj;
            var data = {
                productId: $scope.product.productId,
                size: sizeObj._id,
                color: $scope.product.color._id
            }
            console.log("SKUdetails:", data)
            ProductService.getSKUWithParameter(data, function (data) {
                console.log("SKU:", data)
                if (data.data.value) {
                    $scope.product = data.data.data;
                } else {
                    $scope.product = {};
                    // TODO: show out of stock
                }
            })
        }
        $scope.addToCart = function () {
            myService.addToCart($scope.product, $scope.reqQuantity, $scope.selectedSize, function (data) {
                $state.reload();
            })
        }

        $scope.setQuantity = function (quantity) {

            if ($scope.product.quantity >= quantity) {
                angular.element(document.getElementsByClassName('btn-add'))[0].disabled = false;
                $scope.reqQuantity = quantity;
            } else {
                angular.element(document.getElementsByClassName('btn-add'))[0].disabled = true;
                $scope.reqQuantity = quantity;
            }
        }
        $rootScope.checkStateOnReload = function (prodid) {
            var cp = $.jStorage.get("compareproduct")
            var result = _.find(cp, {
                productId: prodid
            });
            if (result) {
                return true;
            } else {
                return false;
            }
        }


        $scope.changeImage = function (index) {
            $scope.selectedImage = $scope.product.images[index];
        };
    })
    .controller('MycartCtrl', function ($scope, myService, $state, TemplateService, NavigationService, BannerService, CartService, $timeout, $uibModal, WishlistService) {
        $scope.template = TemplateService.getHTML("content/mycart.html");
        TemplateService.title = "Mycart"; //This is the Title of the Website
        $scope.navigation = NavigationService.getNavigation();
        myService.ctrlBanners("mycart", function (data) {
            $scope.banner = data;
        });
        $scope.newA = _.chunk($scope.mycartmodal, 4);
        // console.log("$scope.newA ", $scope.newA);
        var userId = {
            userId: $.jStorage.get("userId")
        };
        if (userId.userId != null) {
            CartService.getCart(userId, function (data) {
                console.log("getcart->data: ", data);
                //TODO: Instead of array this will be single doc when query changes to findOneAndUpdate
                $scope.mycartTable = data.data.data;
                console.log("mycarttableof if: ", $scope.mycartTable);
                //TODO: Calculate actual grand total
                if ($scope.mycartTable)
                    $scope.grandTotal = $scope.total = CartService.getTotal($scope.mycartTable.products);
            });
        } else {
            $scope.mycartTable = $.jStorage.get("cart");

            if ($scope.mycartTable) {
                $scope.grandTotal = $scope.total = CartService.getTotal($scope.mycartTable.products);
            }
            console.log("else ran:::", $scope.grandTotal);
        }
        // $scope.mycartTable = {};
        $scope.updateQuantity = function (index, count) {
            // if (ProductService.isProductAvailable(count, $scope.mycartTable.products[index])) {
            $scope.mycartTable.products[index].quantity += count;
            if ($scope.mycartTable.products[index].quantity <= 0)
                $scope.mycartTable.products[index].quantity = 0;
            //TODO: Handle update cart error
            CartService.updateCartQuantity($scope.mycartTable);
            //TODO: Calculate actual grand total
            $scope.grandTotal = $scope.total = CartService.getTotal($scope.mycartTable.products);
            // }
        }
        console.log("oflinecartinmycartcontroller::::::", $.jStorage.get("cart"))

        $scope.removeProductFromCart = function (cartId, productId) {
            console.log("Removing product: ", productId);
            if (userId.userId) {
                var data = {
                    cartId: cartId,
                    productId: productId
                }
                CartService.removeProduct(data, function (data) {
                    $scope.mycartTable = data.data.data;
                    $state.reload("mycart");
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
        $scope.addToWishlist = function (prod) {
            myService.addToWishlist(prod, function (data) {
                $scope.addwishlist = function () {
                    $scope.addwishlistmodal = $uibModal.open({
                        animation: true,
                        templateUrl: 'views/modal/wishlistadd.html',
                        size: 'md',
                        scope: $scope
                    });
                };
                $scope.addwishlist()
            })
        }

        $scope.checkStockStatus = function (prod) {
            if (prod.quantity > prod.product.quantity) {

                angular.element(document.getElementsByClassName('checkout--btn'))[0].disabled = true;
                return "disabled-outofstock";

            } else {
                return "";
            }

        }


    })
    .controller('compareProductsCtrl', function ($scope, TemplateService, NavigationService, $timeout) {
        $scope.template = TemplateService.getHTML("content/compare-products.html");
        TemplateService.title = "Compare Products"; //This is the Title of the Website
        $scope.navigation = NavigationService.getNavigation();

        $scope.products = $.jStorage.get('compareproduct');
        console.log($scope.products);

        $scope.removeCompareProduct = function (product) {
            _.remove($scope.products, {
                productId: product.productId
            });
            $.jStorage.set('compareproduct', $scope.products);
        }
    })
    .controller('BrandsCtrl', function ($scope, myService, TemplateService, ProductService, BannerService, NavigationService, $timeout) {
        $scope.template = TemplateService.getHTML("content/brands.html");
        TemplateService.title = "Brands"; //This is the Title of the Website
        $scope.navigation = NavigationService.getNavigation();
        // var banner = {
        //     pageName: "Brands"
        // }
        // BannerService.getBanner(banner, function (data) {
        //     $scope.banner = data.data.data;

        // });
        myService.ctrlBanners("Brands", function (data) {
            $scope.banner = data;
        });

        ProductService.getBrands(function (data) {
            if (data.data.data) {
                $scope.brands = data.data.data;
            } else {
                $scope.message = "No Data Found";
            }
        })

    })

    .controller('ListingPageCtrl', function ($scope, toastr, CartService, $rootScope, $stateParams, $state, WishlistService, TemplateService, NavigationService,
        SizeService, BannerService, CategoryService, myService, ProductService, $timeout, $uibModal) {
        $scope.template = TemplateService.getHTML("content/listing-page.html");
        TemplateService.title = "Form"; //This is the Title of the Website
        $scope.navigation = NavigationService.getNavigation();
        $scope.formSubmitted = false;
        myService.ctrlBanners("listing-page", function (data) {
            $scope.banner = data;
        });
        if (_.isEmpty($.jStorage.get('compareproduct'))) {
            $scope.showCheck = false

        } else {
            $scope.showCheck = true
            $scope.compareproduct = $.jStorage.get('compareproduct')
        }
        NavigationService.getListingCategories(function (data) {
            console.log('getProductsWithFilters', data);
            $scope.categories = data.data.data;

        });
        /******getting products based on category******* */
        $scope.filteredProducts = function (selectedCategory) {
            $.jStorage.set("selectedCategory", selectedCategory);
            $.jStorage.deleteKey("appliedFilters");
            var input = {

                "category": selectedCategory,
                "page": 1
            }

            ProductService.getProductsWithFilters(input, function (data) {

                if (data.data.data.length == 0) {
                    $scope.displayMessage = "No Data Found";

                } else if (!_.isEmpty(data.data.data)) {
                    $scope.displayMessage = "";
                    $scope.products = _.chunk(data.data.data, 3);
                    console.log(data)
                    var input = {
                        "category": selectedCategory,
                    }
                    ProductService.getFiltersWithCategory(input, function (data) {
                        console.log("product category on basis of category", data.data.data)
                        $scope.filters = data.data.data;
                        $scope.min = $scope.filters.priceRange[0].min;
                        $scope.max = $scope.filters.priceRange[0].max;
                        console.log("filters", $scope.filters.priceRange[0].max)
                        $scope.slider_translate = {
                            minValue: 80,
                            maxValue: 100,
                            options: {
                                ceil: $scope.filters.priceRange[0].max,
                                floor: $scope.filters.priceRange[0].min,
                                id: 'translate-slider'
                                // translate: function (value, id, which) {
                                //     return '$' + value;
                                // }
                            }
                        };
                    })

                } else {
                    toastr.error('There was some error', 'Error');
                }
            })
        }
        $rootScope.clickfun = function (product) {
            console.log(product)
            $scope.compareproduct = $.jStorage.get('compareproduct') ? $.jStorage.get('compareproduct') : [];
            var result = _.find($scope.compareproduct, {
                productId: product.productId
            });
            if (result) {
                _.remove($scope.compareproduct, {
                    productId: product.productId
                });
                $.jStorage.set('compareproduct', $scope.compareproduct);
            } else {
                $scope.compareproduct.push(product);
                $.jStorage.set('compareproduct', $scope.compareproduct);
                console.log($.jStorage.get('compareproduct'))
            }

            if (_.isEmpty($.jStorage.get('compareproduct'))) {
                $scope.showCheck = false

            } else {
                $scope.showCheck = true
            }
        }
        /******function to remove product from compare list******* */
        $scope.removeFromCompare = function (prodId) {

            var removeCompare = $.jStorage.get("compareproduct");
            var result = _.remove(removeCompare, {
                productId: prodId
            });

            $.jStorage.set("compareproduct", removeCompare);
            $state.reload();
        }

        /**********logic for checkbox on reload************ */
        $rootScope.checkStateOnReload = function (prodid) {
            var cp = $.jStorage.get("compareproduct")
            var result = _.find(cp, {
                productId: prodid
            });
            if (result) {
                return true;
            } else {
                return false;
            }
        }
        $scope.gotoComparePage = function () {
            $state.go("compare-products");
        }

        var appliedFilters = {};

        $scope.applyFilters = function (key, filter) {
            var appliedFilters = {};
            appliedFilters.appliedFilters = $.jStorage.get('appliedFilters') ? $.jStorage.get('appliedFilters') : {
                category: [],
                type: [],
                style: [],
                color: [],
                collection: [],
                size: [],
                fabric: [],
            };
            console.log(filter, key)
            appliedFilters.appliedFilters.category = [$.jStorage.get("selectedCategory")];

            var result = _.indexOf(appliedFilters.appliedFilters[key], filter._id);
            console.log("check result", result)
            if (result != -1) {
                _.pullAt(appliedFilters.appliedFilters[key], result);
            } else {
                if (!_.isArrayLike(appliedFilters.appliedFilters[key])) {
                    appliedFilters.appliedFilters[key] = [];
                }
                appliedFilters.appliedFilters[key].push(filter._id);
            }
            appliedFilters.page = 1;
            $.jStorage.set('appliedFilters', appliedFilters)

            console.log("Jstoragefor filters::", $.jStorage.get("appliedFilters"))
            _.forIn(appliedFilters.appliedFilters, function (val, key, obj) {
                if (_.isEmpty(val)) {
                    console.log("key: ", key);
                    delete appliedFilters.appliedFilters[key];
                }
            });
            console.log("apply filters: ", appliedFilters);
            ProductService.getProductsWithAppliedFilters(appliedFilters, function (data) {
                console.log("filtersretrived:::", data.data.data);
                $scope.products = _.chunk(data.data.data.products, 3);
                $scope.filters = data.data.data.filters;

            })

            //api call
        }
        /******checking filters after reload***** */
        $scope.checkFilterStatus = function (key, filter) {
            var appliedFilters = $.jStorage.get("appliedFilters");

            if (appliedFilters) {
                var result = _.indexOf(appliedFilters.appliedFilters[key], filter);

                if (result != -1) {
                    return true;
                } else {
                    return false;
                }
            }
        }
        /********check selected category******** */
        $scope.checkRadioCategory = function (catid) {

            var selectedId = $.jStorage.get("selectedCategory")
            if (selectedId) {


                if (selectedId == catid) {
                    return true;
                } else {
                    return false;
                }
            }
        }

        $scope.submitForm = function (data) {
            console.log(data);
            $scope.formSubmitted = true;
        };

        $scope.displayCntent = function () {
            //$('.viewSize, .view--btn').css('opacity', '1');
            $('.viewSize, .view--btn').css('display', 'block');
            $(' .view--btn').css({
                'position': 'relative',
                'top': '3px'
            });

        }
        $scope.hideContent = function () {
            $('.viewSize, .view--btn').css('display', 'none');
        };

        // var filter = {
        //     category: "",
        //     page: 1
        // };
        // //TODO: For demo purpose. Use category with id in production
        // ProductService.getProductsWithCategory(filter, function (data) {
        //     console.log(data)
        //     $scope.products = _.chunk(data.data.data, 3);

        // });
        var userId = {
            userId: $.jStorage.get("userId"),
            accessToken: $.jStorage.get("accessToken")
        }
        if (userId.userId) {
            CartService.getCart(userId, function (data) {

                if (data.data.data) {

                    $scope.mycart = data.data.data.products;
                    $scope.tempcart = [];
                    for (var i = 0; i < $scope.mycart.length; i++) {
                        $scope.tempcart.push({
                            productId: $scope.mycart[i].product.productId
                        })
                    }
                }
            })
            WishlistService.getWishlist(userId, function (data) {
                $scope.wishlist = data.data.data;
                console.log("Wishlist data::::::::", $scope.wishlist);
            });
        } else {
            $scope.mycart = []
            $scope.mycart = $.jStorage.get("cart");
            $scope.wishlist = $.jStorage.get("wishlist")

            if ($scope.mycart) {
                $scope.mycart = $scope.mycart.products;
                console.log("mycartfor offlinetooltip::::", $scope.mycart)
                $scope.tempcart = [];
                if ($scope.mycart) {
                    for (var i = 0; i < $scope.mycart.length; i++) {
                        $scope.tempcart.push({
                            productId: $scope.mycart[i].product.productId
                        })
                    }
                }
            }
        }
        $scope.checkWishlist = function (productId) {
            if (userId.userId) {

                var result = _.find($scope.wishlist, {
                    "productId": productId
                });

                if (result) {
                    return "fa fa-heart";
                } else {
                    return "fa fa-heart-o";
                }
            } else {
                var result = _.find($scope.wishlist, {
                    "productId": productId
                });

                if (result) {
                    return "fa fa-heart";
                } else {
                    return "fa fa-heart-o";
                }
            }
        }

        $scope.checkInCart = function (productId) {

            if (userId.userId) {

                var result = _.find($scope.tempcart, {
                    "productId": productId
                });

                if (result) {
                    return true
                } else {
                    return false
                }
            } else {
                var result = _.find($scope.tempcart, {
                    "productId": productId
                });

                if (result) {
                    return true
                } else {
                    return false
                }
            }
        }
        // This function is used to display the modal on quck view button
        $scope.quickviewProduct = function (prod) {
            $scope.product = prod;
            $scope.selectedImage = _.sortBy($scope.product.images, ['order'])[0];
            $scope.selectSize = function (sizeObj) {
                $scope.activeButton = sizeObj.name;
                $scope.selectedSize = sizeObj;
            }
            $scope.changeImage = function (index) {
                $scope.selectedImage = $scope.product.images[index];
            };
            $scope.reqQuantity = 1;
            $scope.updateQuantity = function (oper) {
                $scope.reqQuantity += parseInt(oper);
                console.log($scope.reqQuantity)
            }
            var quickviewProduct = $uibModal.open({
                animation: true,
                templateUrl: 'views/modal/quickview-product.html',
                scope: $scope,
                size: 'lg'

            });

        };
        //End of  modal on quck view button


    })
    .controller('FormCtrl', function ($scope, TemplateService, NavigationService, $timeout) {
        $scope.template = TemplateService.getHTML("content/form.html");
        TemplateService.title = "Form"; //This is the Title of the Website
        $scope.navigation = NavigationService.getNavigation();
        $scope.formSubmitted = false;
        $scope.submitForm = function (data) {
            console.log(data);
            $scope.formSubmitted = true;
        };
    })
    .controller('LoginCtrl', function ($scope, TemplateService, NavigationService, $timeout) {
        $scope.template = TemplateService.getHTML("modal/login.html");
        TemplateService.title = "Login"; //This is the Title of the Website
        $scope.navigation = NavigationService.getNavigation();
    })
    .controller('CancelCtrl', function ($scope, TemplateService, NavigationService, $timeout) {
        $scope.template = TemplateService.getHTML("content/cancel.html");
        TemplateService.title = "Return-Cancellation"; //This is the Title of the Website
        $scope.navigation = NavigationService.getNavigation();
    })

    .controller('GiftCtrl', function ($scope, TemplateService, NavigationService, $timeout) {
        $scope.template = TemplateService.getHTML("content/gift.html");
        TemplateService.title = "Gift Card"; //This is the Title of the Website
        $scope.navigation = NavigationService.getNavigation();
    })

    .controller('AboutCtrl', function ($scope, TemplateService, NavigationService, $timeout) {
        $scope.template = TemplateService.getHTML("content/about.html");
        TemplateService.title = "About us"; //This is the Title of the Website
        $scope.navigation = NavigationService.getNavigation();
    })
    .controller('OrdersCtrl', function ($scope, TemplateService, NavigationService, $timeout) {
        $scope.template = TemplateService.getHTML("content/orders.html");
        TemplateService.title = "Order"; //This is the Title of the Website
        $scope.navigation = NavigationService.getNavigation();
    })
    .controller('ComingSoonCtrl', function ($scope, TemplateService, NavigationService, $timeout) {
        $scope.template = TemplateService.getHTML("content/coming-soon.html");
        TemplateService.title = "Coming Soon"; //This is the Title of the Website
        $scope.navigation = NavigationService.getNavigation();
    })
    //Example API Controller
    .controller('DemoAPICtrl', function ($scope, TemplateService, apiService, NavigationService, $timeout) {
        apiService.getDemo($scope.formData, function (data) {
            console.log(data);
        });
    });