myApp.controller('HomeCtrl', function ($scope, TemplateService, CartService, NavigationService, ProductService, $timeout, $location) {





        $scope.template = TemplateService.getHTML("content/home.html");
        TemplateService.title = "Home"; //This is the Title of the Website
        $scope.navigation = NavigationService.getNavigation();
        // $scope.status.isopen = !$scope.status.isopen;

        // $scope.getCartCount = CartService.getCart;
        // console.log(" $scope.getCartCount ");;
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
                //console.log("checkproductidinside cart service:::", data.data.data)

                $scope.mycart = data.data.data.products;
                $scope.tempcart = [];
                for (var i = 0; i < $scope.mycart.length; i++) {
                    $scope.tempcart.push({
                        productId: $scope.mycart[i].product.productId
                    })
                }
                ProductService.getFeatured(function (data) {
                    $scope.featured = data.data.data;
                    console.log("Featured: ", $scope.featured);
                });

            })
        } else {
            $scope.mycart = []
            $scope.mycart = $.jStorage.get("cart");
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
            console.log("temparraqyfor offline cart", $scope.tempcart)
            ProductService.getFeatured(function (data) {
                $scope.featured = data.data.data;
                console.log("Featured: ", $scope.featured);
            });
        }
        $scope.checkInCart = function (productId) {
            console.log("inside checkcart");
            if (userId.userId) {
                console.log("checkproductid:::", productId);
                var result = _.find($scope.tempcart, {
                    "productId": productId
                });
                console.log("result:::::", result)
                if (result) {
                    return true
                } else {
                    return false
                }
            } else {
                var result = _.find($scope.tempcart, {
                    "productId": productId
                });
                console.log("result:::::", result)
                if (result) {
                    return true
                } else {
                    return false
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
    .controller('BuythelookCtrl', function ($scope, TemplateService, NavigationService, $timeout, $uibModal) {
        $scope.template = TemplateService.getHTML("content/buythelook.html");
        TemplateService.title = "Buythelook"; //This is the Title of the Website
        //     $scope.navigation = NavigationService.getEnabledCtNavigation();

        $scope.buyshirt = [{
            img: 'img/buy/2.jpg',
            rupee: '3,000',
            title: 'linen FULL SLEEVE SHIRT WITH ROLL UP',
            id: 0
        }, {
            img: 'img/buy/3.jpg',
            rupee: '3,000',
            title: 'linen FULL SLEEVE SHIRT WITH ROLL UP',
            id: 1
        }, {
            img: 'img/buy/4.jpg',
            rupee: '3,000',
            title: 'linen FULL SLEEVE SHIRT WITH ROLL UP',
            id: 2
        }, {
            img: 'img/buy/5.jpg',
            rupee: '3,000',
            title: 'OFF WHITE SLIM FIT FORMA TROUSER',
            id: 3
        }, {
            img: 'img/buy/6.jpg',
            rupee: '3,000',
            title: 'OFF WHITE SLIM FIT FORMA TROUSER',
            id: 4
        }, {
            img: 'img/buy/7.jpg',
            rupee: '3,000',
            title: 'OFF WHITE SLIM FIT FORMA TROUSER',
            id: 5
        }, {
            img: 'img/buy/2.jpg',
            rupee: '3,000',
            title: 'Linen LIGHT BLUE CASUAL BLAZER',
            id: 6
        }, {
            img: 'img/buy/3.jpg',
            rupee: '3,000',
            title: 'linen LIGHT BLUE CASUAL BLAZER',
            id: 7
        }, {
            img: 'img/buy/4.jpg',
            rupee: '3,000',
            title: 'linen LIGHT BLUE CASUAL BLAZER',
            id: 8
        }, {
            img: 'img/buy/5.jpg',
            rupee: '3,000',
            title: 'MEN WHITE GENUINE LEATHER DERBYS',
            id: 9
        }, {
            img: 'img/buy/6.jpg',
            rupee: '3,000',
            title: 'MEN WHITE GENUINE LEATHER DERBYS',
            id: 10
        }, {
            img: 'img/buy/7.jpg',
            rupee: '3,000',
            title: 'MEN WHITE GENUINE LEATHER DERBYS',
            id: 11
        }, {
            img: 'img/buy/3.jpg',
            rupee: '3,000',
            title: 'LETHER MEN BLACK GENUINE LEATHER BELT',
            id: 12
        }, {
            img: 'img/buy/4.jpg',
            rupee: '3,000',
            title: 'LETHER MEN BLACK GENUINE LEATHER BELT',
            id: 13
        }, {
            img: 'img/buy/5.jpg',
            rupee: '3,000',
            title: 'LETHER MEN BLACK GENUINE LEATHER BELT',
            id: 14
        }, {
            img: 'img/buy/6.jpg',
            rupee: '3,000',
            title: 'GRAVIATE BLACK FULL FRAME ROUNDGLASSES',
            id: 15
        }, {
            img: 'img/buy/7.jpg',
            rupee: '3,000',
            title: 'GRAVIATE BLACK FULL FRAME ROUNDGLASSES',
            id: 16
        }, {
            img: 'img/buy/5.jpg',
            rupee: '3,000',
            title: 'GRAVIATE BLACK FULL FRAME ROUNDGLASSES',
            id: 17
        }];
        $scope.myShirt = [];
        $scope.myShirt11 = [];
        $scope.myShirt = _.chunk($scope.buyshirt, 9);
        console.log($scope.myShirt);
        _.each($scope.myShirt, function (n) {
            $scope.myShirt1 = _.chunk(n, 3);
            $scope.myShirt11.push($scope.myShirt1);
        });
        console.log($scope.myShirt11);



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
    .controller('CheckoutCtrl', function ($scope, $state, BannerService, TemplateService, NavigationService, UserService, CartService, WishlistService, $timeout) {
        $scope.template = TemplateService.getHTML("content/checkout.html");
        TemplateService.title = "Checkout"; //This is the Title of the Website
        $scope.navigation = NavigationService.getNavigation();
        var banner = {
            pageName: "checkout"
        }
        BannerService.getBanner(banner, function (data) {
            $scope.banner = data.data.data;

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
                    $scope.userData = data.data.data;
                    $.jStorage.set("accessToken", $scope.userData.accessToken[$scope.userData.accessToken.length - 1]);
                    $.jStorage.set("userId", $scope.userData._id);
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
    })
    .controller('IndividualPageCtrl', function ($scope, $http, $stateParams, $state, $uibModal, UserService, WishlistService,
        TemplateService, NavigationService, ProductService, CartService, $timeout) {
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

        $scope.loggedUser = $.jStorage.get("userId");
        var data = {
            productId: $stateParams.id
        };

        ProductService.getProductDetails(data, function (data) {
            console.log("getproductionDetails:::", data);
            if (data.data.value) {
                $scope.product = data.data.data;
                $scope.productImages = _.sortBy($scope.product.images, ['order']);
                $scope.selectedImage = _.sortBy($scope.product.images, ['order'])[0];
                $scope.sizes = $scope.product.sizes;
                console.log($scope.sizes);
                $scope.selectedSize = $scope.sizes[0];
            } else {
                console.log(data.data.error);
                $scope.product = {};
            }
        });

        $scope.addToCart = function () {
            console.log($scope.product);
            $scope.product.selectedSize = $scope.selectedSize._id;
            $scope.product.reqQuantity = $scope.reqQuantity;
            var accessToken = $.jStorage.get("accessToken");
            if (!_.isEmpty(accessToken)) {
                $scope.product.accessToken = accessToken;
                $scope.product.userId = $.jStorage.get("userId");
                //if (ProductService.isProductAvailable($scope.product.reqQuantity, $scope.product)) {
                CartService.saveProduct($scope.product, function (data) {
                    if (data.data.error) {
                        console.log("Error: ", data.data.error);
                    } else {
                        console.log("Success");
                        $state.reload();
                    }
                });
                // } else {
                //     // TODO: Add product not available error
                // }
            } else {
                console.log("User not logged in");
                // TODO: add product without login
                $scope.cart = {};
                $scope.cart = $.jStorage.get('cart') ? $.jStorage.get('cart') : {};
                if (_.isEmpty($scope.cart))
                    $scope.cart.products = [];
                console.log($scope.cart);
                $scope.product.size = {};
                $scope.product.size.name = $scope.selectedSize.name;
                console.log($scope.product)
                console.log($scope.cart)
                $scope.cart.products.push({
                    product: $scope.product
                });
                var len = $scope.cart.products.length;
                $scope.cart.products[len - 1].quantity = $scope.reqQuantity;
                $.jStorage.set('cart', $scope.cart);
                console.log("Scope cart: ", $scope.cart);
                $state.reload();

            }
        }

        $scope.addToWishlist = function () {
            $scope.product.selectedSize = $scope.selectedSize._id;
            $scope.product.reqQuantity = $scope.reqQuantity;
            var accessToken = $.jStorage.get("accessToken");
            if (!_.isEmpty(accessToken)) {
                $scope.product.accessToken = accessToken;
                $scope.product.userId = $.jStorage.get("userId");
                $scope.wishlist = {
                    accessToken: accessToken,
                    userId: $.jStorage.get("userId"),
                    products: [$scope.product.productId]
                }
                console.log("whislist product:::::::::", $scope.wishlist)
                //if (ProductService.isProductAvailable($scope.product.reqQuantity, $scope.product)) {
                WishlistService.saveProduct($scope.wishlist, function (data) {
                    console.log(data);
                    if (data.data.error) {
                        console.log("Error: ", data.data.error);
                    } else {
                        console.log("Success");
                        $state.reload();
                    }
                });
                // } else {
                //     // TODO: Add product not available error

                // }
            } else {
                console.log("User not logged in");
                // TODO: goto login. can't route to modal or checkkout
                //todo: offline wishlist add
                $scope.productId = $.jStorage.get('wishlist') ? $.jStorage.get('wishlist') : [];
                $scope.productId.push($scope.product);
                $.jStorage.set('wishlist', $scope.productId);
                console.log("offflinewishlist:::::::", $.jStorage.set('wishlist', $scope.productId))

            }
        }

        $scope.openLoginModal = function () {
            var userId = $.jStorage.get("userId");
            if (!userId) {
                $scope.loginModal = $uibModal.open({
                    animation: true,
                    templateUrl: 'views/modal/login.html',
                    scope: $scope,
                    size: 'md',
                    controller: 'loginModalCtrl'
                    // windowClass: 'modal-content-radi0'
                });
            }
        }

        $scope.selectedSize = {};
        $scope.selectedSize.name = "Select Size";
        $scope.setSelectedSize = function (size) {
            $scope.selectedSize = size;
            var data = {
                productId: $scope.product.productId,
                size: size._id,
                color: $scope.product.color._id
            }
            ProductService.getSKUWithParameter(data, function (data) {
                if (data.data.value) {
                    $scope.product = data.data.data;
                } else {
                    $scope.product = {};
                    // TODO: show out of stock
                }
            })
        }
        $scope.setQuantity = function (quantity) {
            $scope.reqQuantity = quantity;
        }

        /* $scope.featured = [{
            img: '../img/home/11.jpg',
            price: '2,899',
            type: 'LINEN FULL SLEEVE SHIRT WITH ROLLUP'

        }, {
            img: '../img/home/12.jpg',
            price: '2,899 ',
            type: 'LINEN FULL SLEEVE SHIRT WITH ROLLUP'

        }, {
            img: '../img/home/13.jpg',
            price: '2,899',
            type: 'MARATHON PLAIN FRONT TROUSER'

        }, {
            img: '../img/home/14.jpg',
            price: '2,899',
            type: 'MARATHON PLAIN FRONT TROUSER'

        }, {
            img: '../img/home/11.jpg',
            price: '2,899 ',
            type: 'LINEN FULL SLEEVE SHIRT WITH ROLLUP'

        }, {
            img: '../img/home/12.jpg',
            price: '2,899',
            type: 'LINEN FULL SLEEVE SHIRT WITH ROLLUP'

        }, {
            img: '../img/home/13.jpg',
            price: '2,899 ',
            type: 'MARATHON PLAIN FRONT TROUSER'

        }, {
            img: '../img/home/14.jpg',
            price: '2,899',
            type: 'MARATHON PLAIN FRONT TROUSER'

        }];

        $scope.individual = [{
            bigImg: '../img/individual/66.png',
            img: '../img/individual/2.jpg'

        }, {
            bigImg: '../img/individual/7.jpg',
            img: '../img/individual/3.jpg'

        }, {
            bigImg: '../img/individual/66.png',
            img: '../img/individual/4.jpg'

        }, {
            bigImg: '../img/individual/7.jpg',
            img: '../img/individual/5.jpg'

        }, {
            bigImg: '../img/individual/66.png',
            img: '../img/individual/2.jpg'

        }, {
            bigImg: '../img/individual/7.jpg',
            img: '../img/individual/3.jpg'

        }];*/
        $scope.changeImage = function (index) {
            $scope.selectedImage = $scope.product.images[index];
        };
    })
    .controller('MycartCtrl', function ($scope, $state, TemplateService, NavigationService, BannerService, CartService, $timeout, $uibModal, WishlistService) {
        $scope.template = TemplateService.getHTML("content/mycart.html");
        TemplateService.title = "Mycart"; //This is the Title of the Website
        $scope.navigation = NavigationService.getNavigation();
        var banner = {
            pageName: "mycart"
        }
        BannerService.getBanner(banner, function (data) {
            $scope.banner = data.data.data;

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
            if ($scope.mycartTable)
                $scope.grandTotal = $scope.total = CartService.getTotal($scope.mycartTable.products);
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

        $scope.openUpload = function () {
            console.log("clla");
            $uibModal.open({
                animation: true,
                templateUrl: 'views/modal/mycartmodal.html',
                scope: $scope,
                size: 'sm',
                // windowClass: 'modal-content-radi0'
            });
        };


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

    .controller('BrandsCtrl', function ($scope, TemplateService, NavigationService, $timeout) {
        $scope.template = TemplateService.getHTML("content/brands.html");
        TemplateService.title = "Brands"; //This is the Title of the Website
        $scope.navigation = NavigationService.getNavigation();

    })
    .controller('ListingPageCtrl', function ($scope, $stateParams, $state, TemplateService, NavigationService,
        SizeService, BannerService, CategoryService, ProductService, $timeout) {
        $scope.template = TemplateService.getHTML("content/listing-page.html");
        TemplateService.title = "Form"; //This is the Title of the Website
        $scope.navigation = NavigationService.getNavigation();
        $scope.formSubmitted = false;
        var banner = {
            pageName: "listing-page"
        }
        console.log("bannerservice:::::")
        BannerService.getBanner(banner, function (data) {
            console.log("bannerservice:::::::", data)
            if (data.data.value)
                $scope.banner = data.data.data;

        });

        if (_.isEmpty($.jStorage.get('compareproduct'))) {
            $scope.showCheck = false

        } else {
            $scope.showCheck = true
            $scope.compareproduct = $.jStorage.get('compareproduct')
        }

        $scope.clickfun = function (product) {
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

        /**********logic for checkbox on reload************ */
        $scope.checkStateOnReload = function (prodid) {

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

        var banner = {
            pageName: "listing-page"
        }
        BannerService.getBanner(banner, function (data) {
            $scope.banner = data.data.data;

        });
        // Ideally products should be retrieved with respect to category
        var data = {
            category: "592e6d69b958d66a25c0fe48"
        }

        $scope.filterProducts = function (filterParameter) {
            ProductService.filterProducts(filterParameter, function (data) {
                $scope.products = _.chunk(data.data.data, 3);

                console.log("Listing page products: ", $scope.products);
            });
        }

        ProductService.getFiltersWithCategory(data, function (data) {
            console.log(data);
            if (data.data.value) {
                $scope.filters = data.data.data;
                $scope.slider_translate = {
                    minValue: $scope.filters.priceRange[0].min,
                    maxValue: $scope.filters.priceRange[0].min,
                    options: {
                        ceil: 7000,
                        floor: 100,
                        id: 'translate-slider',
                        translate: function (value, id, which) {
                            console.info(value, id, which);
                            return '$' + value;
                        }
                    }
                };
            }
        });

        // ProductService.getProductsWithCategoryId(categoryId, function (data) {
        //     $scope.products = data.data.data;
        // })

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

        var filter = {
            category: "",
            page: 1
        };
        //TODO: For demo purpose. Use category with id in production
        ProductService.getProductsWithCategory(filter, function (data) {
            $scope.products = _.chunk(data.data.data, 3);
            console.log("Listing page products: ", $scope.products);
        });
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
    //Example API Controller
    .controller('DemoAPICtrl', function ($scope, TemplateService, apiService, NavigationService, $timeout) {
        apiService.getDemo($scope.formData, function (data) {
            console.log(data);
        });
    });