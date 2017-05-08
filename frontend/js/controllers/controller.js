myApp.controller('HomeCtrl', function ($scope, TemplateService, NavigationService, ProductService, $timeout, $location) {
        $scope.template = TemplateService.getHTML("content/home.html");
        TemplateService.title = "Home"; //This is the Title of the Website
        $scope.navigation = NavigationService.getNavigation();
        // $scope.status.isopen = !$scope.status.isopen;
        $scope.toggled = function (open) {
            alert('xd');
        };

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

        ProductService.getFeatured(function (data) {
            $scope.featured = data.data.data;
            console.log("Featured: ", $scope.featured);
        });

        NavigationService.getBlogs(function (data) {

        });

        NavigationService.getEnabledBlogs(function (data) {
            $scope.blogs = data.data.data;
            console.log("Enabled blogs retrieved: ", $scope.blogs);
        });

        $scope.sale = [{
                img: '../img/home/11.jpg',
                price: '2,899',
                type: 'Linen Full Sleeve ShirtWith Rollup'

            },
            {
                img: '../img/home/12.jpg',
                price: '2,899',
                type: 'Linen Full Sleeve ShirtWith Rollup'

            },
            {
                img: '../img/home/13.jpg',
                price: '2,899',
                type: 'Linen Full Sleeve ShirtWith Rollup'

            }, {
                img: '../img/home/14.jpg',
                price: '2,899',
                type: 'Linen Full Sleeve ShirtWith Rollup'

            },
            {
                img: '../img/home/11.jpg',
                price: '2,899',
                type: 'Linen Full Sleeve ShirtWith Rollup'

            },
            {
                img: '../img/home/12.jpg',
                price: '2,899',
                type: 'Linen Full Sleeve ShirtWith Rollup'

            },
            {
                img: '../img/home/13.jpg',
                price: '2,899',
                type: 'Lorem Ipsum is simply dummy text'

            },
            {
                img: '../img/home/14.jpg',
                price: '2,899',
                type: 'Lorem Ipsum is simply dummy text'

            }
        ];
    })
    .controller('BuythelookCtrl', function ($scope, TemplateService, NavigationService, $timeout) {
        $scope.template = TemplateService.getHTML("content/buythelook.html");
        TemplateService.title = "Buythelook"; //This is the Title of the Website
        $scope.navigation = NavigationService.getNavigation();

        $scope.buyshirt = [{
                img: 'img/buy/2.jpg',
                rupee: '3,000',
                title: 'linen FULL SLEEVE SHIRT WITH ROLL UP',
                id: 0
            },
            {
                img: 'img/buy/3.jpg',
                rupee: '3,000',
                title: 'linen FULL SLEEVE SHIRT WITH ROLL UP',
                id: 1
            },
            {
                img: 'img/buy/4.jpg',
                rupee: '3,000',
                title: 'linen FULL SLEEVE SHIRT WITH ROLL UP',
                id: 2
            },
            {
                img: 'img/buy/5.jpg',
                rupee: '3,000',
                title: 'OFF WHITE SLIM FIT FORMA TROUSER',
                id: 3
            },
            {
                img: 'img/buy/6.jpg',
                rupee: '3,000',
                title: 'OFF WHITE SLIM FIT FORMA TROUSER',
                id: 4
            },
            {
                img: 'img/buy/7.jpg',
                rupee: '3,000',
                title: 'OFF WHITE SLIM FIT FORMA TROUSER',
                id: 5
            },
            {
                img: 'img/buy/2.jpg',
                rupee: '3,000',
                title: 'Linen LIGHT BLUE CASUAL BLAZER',
                id: 6
            },
            {
                img: 'img/buy/3.jpg',
                rupee: '3,000',
                title: 'linen LIGHT BLUE CASUAL BLAZER',
                id: 7
            },
            {
                img: 'img/buy/4.jpg',
                rupee: '3,000',
                title: 'linen LIGHT BLUE CASUAL BLAZER',
                id: 8
            },
            {
                img: 'img/buy/5.jpg',
                rupee: '3,000',
                title: 'MEN WHITE GENUINE LEATHER DERBYS',
                id: 9
            },
            {
                img: 'img/buy/6.jpg',
                rupee: '3,000',
                title: 'MEN WHITE GENUINE LEATHER DERBYS',
                id: 10
            },
            {
                img: 'img/buy/7.jpg',
                rupee: '3,000',
                title: 'MEN WHITE GENUINE LEATHER DERBYS',
                id: 11
            },
            {
                img: 'img/buy/3.jpg',
                rupee: '3,000',
                title: 'LETHER MEN BLACK GENUINE LEATHER BELT',
                id: 12
            },
            {
                img: 'img/buy/4.jpg',
                rupee: '3,000',
                title: 'LETHER MEN BLACK GENUINE LEATHER BELT',
                id: 13
            },
            {
                img: 'img/buy/5.jpg',
                rupee: '3,000',
                title: 'LETHER MEN BLACK GENUINE LEATHER BELT',
                id: 14
            },
            {
                img: 'img/buy/6.jpg',
                rupee: '3,000',
                title: 'GRAVIATE BLACK FULL FRAME ROUNDGLASSES',
                id: 15
            },
            {
                img: 'img/buy/7.jpg',
                rupee: '3,000',
                title: 'GRAVIATE BLACK FULL FRAME ROUNDGLASSES',
                id: 16
            },
            {
                img: 'img/buy/5.jpg',
                rupee: '3,000',
                title: 'GRAVIATE BLACK FULL FRAME ROUNDGLASSES',
                id: 17
            }
        ];
        $scope.myShirt = [];
        $scope.myShirt11 = [];
        $scope.myShirt = _.chunk($scope.buyshirt, 9);
        console.log($scope.myShirt);
        _.each($scope.myShirt, function (n) {
            $scope.myShirt1 = _.chunk(n, 3);
            $scope.myShirt11.push($scope.myShirt1);
        });
        console.log($scope.myShirt11);

    })
    .controller('CheckoutCtrl', function ($scope, $state, TemplateService, NavigationService, UserService, CartService, $timeout) {
        $scope.template = TemplateService.getHTML("content/checkout.html");
        TemplateService.title = "Checkout"; //This is the Title of the Website
        $scope.navigation = NavigationService.getNavigation();

        $scope.registerData = {};
        $scope.loginData = {};
        $scope.loggedUser = $.jStorage.get("userId");
        $scope.accessToken = $.jStorage.get("accessToken");

        if ($scope.loggedUser) {
            $scope.view = "orderTab";
        }

        $scope.registerUser = function () {
            console.log("Register: ", $scope.registerData);
            UserService.userRegistration($scope.registerData, function (data) {
                console.log("Login data: ", data);
                if (!_.isEmpty(data.data.data)) {
                    $scope.userData = data.data.data;
                    $.jStorage.set("accessToken", $scope.userData.accessToken[$scope.userData.accessToken.length - 1]);
                    $.jStorage.set("userId", $scope.userData._id);
                    $state.go("listing-page");
                } else {
                    // TODO:: show popup to register
                }
            });
        }


        $scope.login = function () {
            UserService.login($scope.loginData, function (data) {
                console.log("Login data: ", data);
                if (!_.isEmpty(data.data.data)) {
                    $scope.userData = data.data.data;
                    $.jStorage.set("accessToken", $scope.userData.accessToken[$scope.userData.accessToken.length - 1]);
                    $.jStorage.set("userId", $scope.userData._id);
                    $state.go("listing-page");
                } else {
                    // TODO:: show popup to register
                }
            });
        }

        var userData = {
            userId: $.jStorage.get("userId")
        }

        CartService.getCart(userData, function (err, data) {
            $scope.orderTable = data.data.data;
            $scope.grandTotal = CartService.getTotal($scope.orderTable.products);
        });


        $scope.orderTable = [{
            img: 'img/checkout/item.jpg',
            title1: 'florence prints',
            title2: 'half sleeve shirts',
            color: 'blue',
            size: 'xl',
            quantity: '02',
            subtotal: '2,899'
        }, {
            img: 'img/checkout/item.jpg',
            title1: 'florence prints',
            title2: 'half sleeve shirts',
            color: 'blue',
            size: 'xl',
            quantity: '02',
            subtotal: '2,899'
        }]
    })
    .controller('IndividualPageCtrl', function ($scope, $http, $stateParams, $state, TemplateService, NavigationService, ProductService, CartService, $timeout) {
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

        var productId = $stateParams.id;
        ProductService.getProductWithId(productId, function (data) {
            $scope.product = data.data.data;
            $scope.selectedImage = $scope.product.images[0];
            console.log("Retrieved individual page: ", $scope.product);
        });

        $scope.addToCart = function () {
            console.log($scope.product);
            var accessToken = $.jStorage.get("accessToken");
            if (!_.isEmpty(accessToken)) {
                $scope.product.accessToken = accessToken;
                $scope.product.userId = $.jStorage.get("userId");
                $scope.product.selectedSize = $scope.selectedSize._id;
                $scope.product.reqQuantity = $scope.reqQuantity;
                //if (ProductService.isProductAvailable($scope.product.reqQuantity, $scope.product)) {
                CartService.saveProduct($scope.product, function (data) {
                    if (data.data.error) {
                        console.log("Error: ", data.data.error);
                    } else {
                        console.log("Success");
                        $state.reload("individual-page");
                    }
                });
                // } else {
                //     // TODO: Add product not available error
                // }
            } else {
                console.log("User not logged in");
                // TODO: goto login. can't route to modal or checkkout
            }
        }

        $scope.selectedSize = {};
        $scope.selectedSize.name = "Select Size";
        $scope.setSelectedSize = function (size) {
            $scope.selectedSize = size;
        }
        $scope.setQuantity = function (quantity) {
            $scope.reqQuantity = quantity;
        }

        $scope.featured = [{
                img: '../img/home/11.jpg',
                price: '2,899',
                type: 'LINEN FULL SLEEVE SHIRT WITH ROLLUP'

            },
            {
                img: '../img/home/12.jpg',
                price: '2,899 ',
                type: 'LINEN FULL SLEEVE SHIRT WITH ROLLUP'

            },
            {
                img: '../img/home/13.jpg',
                price: '2,899',
                type: 'MARATHON PLAIN FRONT TROUSER'

            }, {
                img: '../img/home/14.jpg',
                price: '2,899',
                type: 'MARATHON PLAIN FRONT TROUSER'

            },
            {
                img: '../img/home/11.jpg',
                price: '2,899 ',
                type: 'LINEN FULL SLEEVE SHIRT WITH ROLLUP'

            },
            {
                img: '../img/home/12.jpg',
                price: '2,899',
                type: 'LINEN FULL SLEEVE SHIRT WITH ROLLUP'

            },
            {
                img: '../img/home/13.jpg',
                price: '2,899 ',
                type: 'MARATHON PLAIN FRONT TROUSER'

            },
            {
                img: '../img/home/14.jpg',
                price: '2,899',
                type: 'MARATHON PLAIN FRONT TROUSER'

            }
        ];

        $scope.individual = [{
                bigImg: '../img/individual/66.png',
                img: '../img/individual/2.jpg'

            },
            {
                bigImg: '../img/individual/7.jpg',
                img: '../img/individual/3.jpg'

            },
            {
                bigImg: '../img/individual/66.png',
                img: '../img/individual/4.jpg'

            },
            {
                bigImg: '../img/individual/7.jpg',
                img: '../img/individual/5.jpg'

            },
            {
                bigImg: '../img/individual/66.png',
                img: '../img/individual/2.jpg'

            },
            {
                bigImg: '../img/individual/7.jpg',
                img: '../img/individual/3.jpg'

            }
        ];
        $scope.changeImage = function (index) {
            $scope.selectedImage = $scope.product.images[index];
        };


    })
    .controller('MycartCtrl', function ($scope, $state, TemplateService, NavigationService, CartService, $timeout, $uibModal) {
        $scope.template = TemplateService.getHTML("content/mycart.html");
        TemplateService.title = "Mycart"; //This is the Title of the Website
        $scope.navigation = NavigationService.getNavigation();

        $scope.mycartmodal = [{
                img: 'img/cart/1.jpg',
                title1: 'WALLET MODERN CORNER ZIP',
                title2: '',
            },
            {
                img: 'img/cart/2.jpg',
                title1: 'WALLET MODERN CORNER ZIP',
                title2: '',
            }, {
                img: 'img/cart/3.jpg',
                title1: 'WALLET MODERN CORNER ZIP',
                title2: '',
            },
            {
                img: 'img/cart/4.jpg',
                title1: 'WALLET MODERN CORNER ZIP',
                title2: '',
            },
            {
                img: 'img/cart/5.jpg',
                title1: 'WALLET MODERN CORNER ZIP',
                title2: '',
            },
            {
                img: 'img/cart/6.jpg',
                title1: 'WALLET MODERN CORNER ZIP',
                title2: '',
            },
            {
                img: 'img/cart/7.jpg',
                title1: 'WALLET MODERN CORNER ZIP',
                title2: '',
            },
            {
                img: 'img/cart/8.jpg',
                title1: 'WALLET MODERN CORNER ZIP',
                title2: '',
            }
        ]
        $scope.newA = _.chunk($scope.mycartmodal, 4);
        console.log("$scope.newA ", $scope.newA);
        var userId = {
            userId: $.jStorage.get("userId")
        };
        if (userId != null) {
            CartService.getCart(userId, function (data) {
                console.log("getcart->data: ", data);
                //TODO: Instead of array this will be single doc when query changes to findOneAndUpdate
                $scope.mycartTable = data.data.data;
                console.log("mycarttable: ", $scope.mycartTable);
                //TODO: Calculate actual grand total
                $scope.grandTotal = $scope.total = CartService.getTotal($scope.mycartTable.products);
            });
        } else {
            $scope.mycartTable = {};
        }
        $scope.mycartTable = {};
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
            var data = {
                cartId: cartId,
                productId: productId
            }
            CartService.removeProduct(data, function (data) {
                $scope.mycartTable = data.data.data;
                $state.reload("mycart");
            });
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

    })
    .controller('ListingPageCtrl', function ($scope, $stateParams, TemplateService, NavigationService, BannerService, CategoryService, ProductService, $timeout) {
        $scope.template = TemplateService.getHTML("content/listing-page.html");
        TemplateService.title = "Form"; //This is the Title of the Website
        $scope.navigation = NavigationService.getNavigation();
        $scope.formSubmitted = false;
        $scope.clickfun = function () {
            console.log("im in showCheck")
            $scope.showCheck = !$scope.showCheck;
        }
        var banner = {
            pageName: "listing-page"
        }
        BannerService.getBanner(banner, function (data) {
            $scope.banner = data.data.data;
        });
        // Ideally products should be retrieved with respect to category
        // TODO
        var categoryId = $stateParams.id;

        CategoryService.getCategoryWithId(categoryId, function (data) {
            $scope.category = data.data.data;
        });

        ProductService.getProductsWithCategoryId(categoryId, function (data) {
            $scope.products = data.data.data;
        })

        $scope.submitForm = function (data) {
            console.log(data);
            $scope.formSubmitted = true;
        };
        $scope.slider_translate = {
            minValue: 200,
            maxValue: 1500,
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
        $scope.buyshirt = [{
                img1: 'img/listing/shirt.png',
                img: 'img/listing/2.jpg',
                toolTip: 'Buy 1 Get1 Free',
                rupee: '3,000',
                title: 'LINEN FULL SLEEVE SHIRT',
                title1: 'WITH ROLL UP ',
                id: 1
            },
            {
                img1: 'img/listing/shirt.png',
                img: 'img/listing/3.jpg',
                toolTip: 'Buy 1 Get1 Free',
                rupee: '3,000',
                title: 'LINEN FULL SLEEVE SHIRT',
                title1: 'WITH ROLL UP ',
                id: 2
            },
            {
                img1: 'img/listing/shirt.png',
                img: 'img/listing/4.jpg',
                toolTip: 'Buy 1 Get1 Free',
                rupee: '3,000',
                title: 'LINEN FULL SLEEVE SHIRT',
                title1: 'WITH ROLL UP ',
                id: 3
            },
            {
                img1: 'img/listing/gift.png',
                img: 'img/listing/5.jpg',
                toolTip: 'Buy 1 Get1 Free',
                rupee: '3,000',
                title: 'LINEN FULL SLEEVE SHIRT',
                title1: 'WITH ROLL UP ',
                id: 4
            },
            {
                img1: 'img/listing/gift.png',
                img: 'img/listing/6.jpg',
                toolTip: 'Buy 1 Get1 Free',
                rupee: '3,000',
                title: 'LINEN FULL SLEEVE SHIRT',
                title1: 'WITH ROLL UP ',
                id: 5
            },
            {
                img1: 'img/listing/gift.png',
                img: 'img/listing/7.jpg',
                toolTip: 'Buy 1 Get1 Free',
                rupee: '3,000',
                title: 'LINEN FULL SLEEVE SHIRT',
                title1: 'WITH ROLL UP ',
                id: 6
            },
            {
                img: 'img/listing/8.jpg',
                toolTip: 'Buy 1 Get1 Free',
                rupee: '3,000',
                title: 'LINEN FULL SLEEVE SHIRT',
                title1: 'WITH ROLL UP ',
                id: 7
            },
            {
                img: 'img/listing/9.jpg',
                toolTip: 'Buy 1 Get1 Free',
                rupee: '3,000',
                title: 'LINEN FULL SLEEVE SHIRT',
                title1: 'WITH ROLL UP ',
                id: 8
            },
            {
                img: 'img/listing/10.jpg',
                toolTip: 'Buy 1 Get1 Free',
                rupee: '3,000',
                title: 'LINEN FULL SLEEVE SHIRT',
                title1: 'WITH ROLL UP ',
                id: 9
            },
            {
                img1: 'img/listing/percent.png',
                toolTip: 'Buy 1 Get1 Free',
                img: 'img/listing/11.jpg',
                rupee: '3,000',
                title: 'LINEN FULL SLEEVE SHIRT',
                title1: 'WITH ROLL UP ',
                id: 10
            },
            {
                img1: 'img/listing/percent.png',
                img: 'img/listing/12.jpg',
                toolTip: 'Buy 1 Get1 Free',
                rupee: '3,000',
                title: 'LINEN FULL SLEEVE SHIRT',
                title1: 'WITH ROLL UP ',
                id: 11
            },
            {
                img1: 'img/listing/percent.png',
                img: 'img/listing/13.jpg',
                toolTip: 'Buy 1 Get1 Free',
                rupee: '3,000',
                title: 'LINEN FULL SLEEVE SHIRT',
                title1: 'WITH ROLL UP ',
                id: 12
            },
            {
                img: 'img/listing/2.jpg',
                rupee: '3,000',
                title: 'LINEN FULL SLEEVE SHIRT',
                title1: 'WITH ROLL UP ',
                id: 13
            },
            {
                img: 'img/listing/3.jpg',
                toolTip: 'Buy 1 Get1 Free',
                rupee: '3,000',
                title: 'LINEN FULL SLEEVE SHIRT',
                title1: 'WITH ROLL UP ',
                id: 14
            },
            {
                img: 'img/listing/4.jpg',
                toolTip: 'Buy 1 Get1 Free',
                rupee: '3,000',
                title: 'LINEN FULL SLEEVE SHIRT',
                title1: 'WITH ROLL UP ',
                id: 15
            },
            {
                img1: 'img/listing/lable.png',
                img: 'img/listing/6.jpg',
                toolTip: 'Buy 1 Get1 Free',
                rupee: '3,000',
                title: 'LINEN FULL SLEEVE SHIRT',
                title1: 'WITH ROLL UP ',
                id: 16
            }, {
                img1: 'img/listing/shirt.png',
                img: 'img/listing/2.jpg',
                toolTip: 'Buy 1 Get1 Free',
                rupee: '3,000',
                title: 'LINEN FULL SLEEVE SHIRT',
                title1: 'WITH ROLL UP ',
                id: 17
            },
            {
                img1: 'img/listing/shirt.png',
                img: 'img/listing/3.jpg',
                toolTip: 'Buy 1 Get1 Free',
                rupee: '3,000',
                title: 'LINEN FULL SLEEVE SHIRT',
                title1: 'WITH ROLL UP ',
                id: 18
            },
            {
                img1: 'img/listing/shirt.png',
                img: 'img/listing/4.jpg',
                toolTip: 'Buy 1 Get1 Free',
                rupee: '3,000',
                title: 'LINEN FULL SLEEVE SHIRT',
                title1: 'WITH ROLL UP ',
                id: 19
            },
            {
                img1: 'img/listing/gift.png',
                img: 'img/listing/5.jpg',
                toolTip: 'Buy 1 Get1 Free',
                rupee: '3,000',
                title: 'LINEN FULL SLEEVE SHIRT',
                title1: 'WITH ROLL UP ',
                id: 20
            },
            {
                img1: 'img/listing/gift.png',
                img: 'img/listing/6.jpg',
                toolTip: 'Buy 1 Get1 Free',
                rupee: '3,000',
                title: 'LINEN FULL SLEEVE SHIRT',
                title1: 'WITH ROLL UP ',
                id: 21
            },
            {
                img1: 'img/listing/gift.png',
                img: 'img/listing/7.jpg',
                toolTip: 'Buy 1 Get1 Free',
                rupee: '3,000',
                title: 'LINEN FULL SLEEVE SHIRT',
                title1: 'WITH ROLL UP ',
                id: 22
            },
            {
                img: 'img/listing/8.jpg',
                toolTip: 'Buy 1 Get1 Free',
                rupee: '3,000',
                title: 'LINEN FULL SLEEVE SHIRT',
                title1: 'WITH ROLL UP ',
                id: 23
            },
            {
                img: 'img/listing/9.jpg',
                toolTip: 'Buy 1 Get1 Free',
                rupee: '3,000',
                title: 'LINEN FULL SLEEVE SHIRT',
                title1: 'WITH ROLL UP ',
                id: 24
            },
            {
                img: 'img/listing/10.jpg',
                toolTip: 'Buy 1 Get1 Free',
                rupee: '3,000',
                title: 'LINEN FULL SLEEVE SHIRT',
                title1: 'WITH ROLL UP ',
                id: 25
            },
            {
                img1: 'img/listing/percent.png',
                toolTip: 'Buy 1 Get1 Free',
                img: 'img/listing/11.jpg',
                rupee: '3,000',
                title: 'LINEN FULL SLEEVE SHIRT',
                title1: 'WITH ROLL UP ',
                id: 26
            },
            {
                img1: 'img/listing/percent.png',
                img: 'img/listing/12.jpg',
                toolTip: 'Buy 1 Get1 Free',
                rupee: '3,000',
                title: 'LINEN FULL SLEEVE SHIRT',
                title1: 'WITH ROLL UP ',
                id: 27
            },
            {
                img1: 'img/listing/percent.png',
                img: 'img/listing/13.jpg',
                toolTip: 'Buy 1 Get1 Free',
                rupee: '3,000',
                title: 'LINEN FULL SLEEVE SHIRT',
                title1: 'WITH ROLL UP ',
                id: 28
            },
            {
                img: 'img/listing/2.jpg',
                rupee: '3,000',
                title: 'LINEN FULL SLEEVE SHIRT',
                title1: 'WITH ROLL UP ',
                id: 29
            },
            {
                img: 'img/listing/3.jpg',
                toolTip: 'Buy 1 Get1 Free',
                rupee: '3,000',
                title: 'LINEN FULL SLEEVE SHIRT',
                title1: 'WITH ROLL UP ',
                id: 30
            },
            {
                img: 'img/listing/4.jpg',
                toolTip: 'Buy 1 Get1 Free',
                rupee: '3,000',
                title: 'LINEN FULL SLEEVE SHIRT',
                title1: 'WITH ROLL UP ',
                id: 31
            },
            {
                img1: 'img/listing/lable.png',
                img: 'img/listing/6.jpg',
                toolTip: 'Buy 1 Get1 Free',
                rupee: '3,000',
                title: 'LINEN FULL SLEEVE SHIRT',
                title1: 'WITH ROLL UP ',
                id: 32
            },
            {
                img1: 'img/listing/lable.png',
                img: 'img/listing/6.jpg',
                toolTip: 'Buy 1 Get1 Free',
                rupee: '3,000',
                title: 'LINEN FULL SLEEVE SHIRT',
                title1: 'WITH ROLL UP ',
                id: 33
            },
            {
                img1: 'img/listing/lable.png',
                img: 'img/listing/6.jpg',
                toolTip: 'Buy 1 Get1 Free',
                rupee: '3,000',
                title: 'LINEN FULL SLEEVE SHIRT',
                title1: 'WITH ROLL UP ',
                id: 34
            },
            {
                img1: 'img/listing/lable.png',
                img: 'img/listing/6.jpg',
                toolTip: 'Buy 1 Get1 Free',
                rupee: '3,000',
                title: 'LINEN FULL SLEEVE SHIRT',
                title1: 'WITH ROLL UP ',
                id: 35
            },
            {
                img1: 'img/listing/lable.png',
                img: 'img/listing/6.jpg',
                toolTip: 'Buy 1 Get1 Free',
                rupee: '3,000',
                title: 'LINEN FULL SLEEVE SHIRT',
                title1: 'WITH ROLL UP ',
                id: 36
            }
        ];
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

        //TODO: For demo purpose. Use category with id in production
        ProductService.getEnabledProducts(function (data) {
            $scope.products = _.chunk(data.data.data, 3);
            console.log("Listing page products: ", $scope.products);
        });

        // Products should be chunked into 3 instead of 9
        // Images in each product will be iterated in column
        $scope.myShirt = [];
        $scope.myShirt11 = [];
        $scope.myShirt = _.chunk($scope.buyshirt, 9);
        console.log($scope.myShirt, "myshitt");
        _.each($scope.myShirt, function (n) {
            $scope.myShirt1 = _.chunk(n, 3);
            $scope.myShirt11.push($scope.myShirt1);
        });

        NavigationService.getEnabledCategories(function (data) {
            $scope.categories = data.data.data;
        });

        NavigationService.getEnabledCollections(function (data) {
            console.log("Collections - data: ", data);
            $scope.collections = data.data.data;
        });

        NavigationService.getListingFilterFields(function (data) {
            // In this call we retrieve fabrics, types & baseColors fields to save rtt
            // They are pushed into the array in the order given below.
            $scope.fabrics = data.data.data[0];
            $scope.types = data.data.data[1];
            $scope.baseColors = data.data.data[2];
        })
        console.log($scope.myShirt11, "*****");
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
    //Example API Controller
    .controller('DemoAPICtrl', function ($scope, TemplateService, apiService, NavigationService, $timeout) {
        apiService.getDemo($scope.formData, function (data) {
            console.log(data);
        });
    });