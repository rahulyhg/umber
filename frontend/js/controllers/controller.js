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
        })
        $scope.userId = $.jStorage.get('userId');
        NavigationService.EnabledHomeScreen(function (data) {
            $scope.clothCat = data.data.data;
        });
        NavigationService.getEnabledCategories(function (data) {
            $scope.categories = data.data.data;
        });
        ProductService.getNewArrivals(function (data) {
            $scope.newArrivals = data.data.data;
        });
        /******************todo:for showing cart logo  infinite loop issue******************** */
        var userId = {
            userId: $.jStorage.get("userId"),
            accessToken: $.jStorage.get("accessToken")
        }
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
                WishlistService.getWishlist(userId, function (result) {
                    console.log("inside home contrller after getWishlist api called")
                    $scope.wishlist = result.data.data;
                    console.log("inside home contrller after getWishlist api called", $scope.wishlist)
                    ProductService.getFeatured(function (data) {
                        console.log("inside home contrller after getfeatured api called")
                        $scope.featured = data.data.data;
                        if ($scope.featured.length < 0 || $scope.featured == undefined) {
                            $scope.visible = false;
                        } else {
                            $scope.visible = true;
                        }
                        console.log("inside home contrller after getfeatured api called", $scope.featured.length)
                    })
                });

            })
            // async.waterfall([
            //     function (callback) {
            //         CartService.getCart(userId, function (data) {
            //             if (data.data.data) {
            //                 $scope.mycart = data.data.data.products;
            //                 $scope.tempcart = [];
            //                 for (var i = 0; i < $scope.mycart.length; i++) {
            //                     $scope.tempcart.push({
            //                         productId: $scope.mycart[i].product.productId
            //                     })
            //                 }
            //             }
            //             callback(null, null);
            //         })
            //     },
            //     function (callback) {
            //         WishlistService.getWishlist(userId, function (result) {
            //             console.log("inside home contrller after getWishlist api called")
            //             $scope.wishlist = result.data.data;
            //             console.log("inside home contrller after getWishlist api called", $scope.wishlist);
            //             callback(null, null);
            //         })
            //     },
            //     function (callback) {
            //         ProductService.getFeatured(function (data) {
            //             console.log("inside home contrller after getfeatured api called")
            //             $scope.featured = data.data.data;
            //             console.log("inside home contrller after getfeatured api called", $scope.featured)
            //             callback(null, null);
            //         })
            //     }

            // ], function (err, result) {
            //     console.log(result);
            // })
        } else {
            $scope.mycart = []
            $scope.mycart = $.jStorage.get("cart");
            $scope.wishlist = $.jStorage.get("wishlist")
            if ($scope.mycart) {
                $scope.mycart = $scope.mycart.products;
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
    .controller('BuythelookCtrl', function ($scope, $rootScope, $stateParams, ProductService, TemplateService, NavigationService, $timeout, $uibModal, myService, ModalService) {
        $scope.template = TemplateService.getHTML("content/buythelook.html");
        TemplateService.title = "Buythelook"; //This is the Title of the Website
        //$scope.navigation = NavigationService.getEnabledCtNavigation();
        $scope.currentId = $stateParams.id;
        console.log($scope.currentId);
        var input = {
            _id: $scope.currentId
        }
        ProductService.getBuyTheLookDetails(input, function (data) {
            $scope.buyshirt = data.data.data.products;
            $scope.insideImage = data.data.data.look.insideImage;
            $scope.myShirt = [];
            $scope.myShirt11 = [];
            $scope.myShirt = _.chunk($scope.buyshirt, 3);
            console.log(data)
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

        // $scope.addwishlist = function () {
        //     $uibModal.open({
        //         animation: true,
        //         templateUrl: 'views/modal/wishlistadd.html',
        //         scope: $scope
        //     });
        // };
        $scope.addWishlist = function (prod) {
            console.log("wishlist", prod)
            var data = {
                "product": prod,
            }
            myService.addToWishlist(data, function (data) {

                ModalService.addwishlist();
            })
        }

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
                $scope.message = "No Product Found";
            }
        })

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
    .controller('ContactUsCtrl', function ($scope, TemplateService, NavigationService, $timeout) {
        $scope.template = TemplateService.getHTML("content/contactus.html");
        TemplateService.title = "Coming Soon"; //This is the Title of the Website
        $scope.navigation = NavigationService.getNavigation();
    })
    //Example API Controller
    .controller('DemoAPICtrl', function ($scope, TemplateService, apiService, NavigationService, $timeout) {
        apiService.getDemo($scope.formData, function (data) {
            console.log(data);
        });
    });