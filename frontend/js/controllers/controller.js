myApp
    .controller('HomeCtrl', function ($scope, TemplateService, CartService, $state, myService, ModalService, WishlistService, NavigationService, ProductService, $timeout, $location) {
        $scope.template = TemplateService.getHTML("content/home.html");
        TemplateService.title = "Home"; //This is the Title of the Website
        $scope.navigation = NavigationService.getNavigation();
        $scope.toggled = function (open) {
            alert('xd');
        };
        $scope.featuredVisible = true;
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
        NavigationService.getEnabledHomePageBlock(function (data) {
            $scope.HomePageBlocks = data.data.data;
            console.log("$scope.HomePageBlocks", $scope.HomePageBlocks);
        });
        ProductService.getNewArrivals(function (data) {
            $scope.newArrivals = data.data.data;
        });
        // ProductService.getDiscountProducts(function (data) {
        //     $scope.saleProducts = data.data.data;
        //     $scope.sale = [];
        //     _.each($scope.saleProducts, function (value) {
        //         console.log("single", value.products[0]);
        //         $scope.sale.push(value.products[0]);
        //     });
        //     console.log("$scope.sale1 after iteration", $scope.sale);
        // });
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


            })
            WishlistService.getWishlist(userId, function (result) {

                $scope.wishlist = result.data.data;

            });
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

        $scope.addToWishlist = function (prod) {
            var data = {
                "product": prod,
            }
            myService.addToWishlist(data, function (data) {
                ModalService.addwishlist();
            })
        }
        $scope.removeWishlist = function (prodId) {
            var data = {};
            if ($.jStorage.get("accessToken")) {
                data.accessToken = $.jStorage.get("accessToken");
                data.productId = prodId;
                WishlistService.removeProduct(data, function (data) {
                    console.log(data);
                    $state.reload();
                })
            } else {
                data.productId = prodId;
                myService.removeWishlist(data, function (data) {
                    console.log(data);
                    $state.reload();
                })
            }
        }
        $scope.addRemoveToWishlist = function (product) {
            if (userId.userId) {

                var result = _.find($scope.wishlist, {
                    "productId": product.productId
                });
                if (result) {
                    $scope.removeWishlist(product.productId);
                } else {
                    $scope.addToWishlist(product);
                }
            } else {
                var result = _.find($scope.wishlist, {
                    "productId": product.productId
                });
                if (result) {
                    $scope.removeWishlist(product.productId);
                } else {
                    $scope.addToWishlist(product);
                }
            }
        }
        NavigationService.getEnabledBlogs(function (data) {
            $scope.blogs = data.data.data;

        });

        $scope.saleOld = [{
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
        ProductService.getFeatured(function (data) {
            $scope.featured = data.data.data.featureds;
            $scope.sale = data.data.data.featureds;
            if (_.isEmpty($scope.featured)) {
                $scope.featuredVisible = false;
            }

        });
    })
    .controller('BuythelookCtrl', function ($scope, $rootScope, $stateParams, ProductService, TemplateService, NavigationService, $timeout, $uibModal, myService, ModalService) {
        $scope.template = TemplateService.getHTML("content/buythelook.html");
        TemplateService.title = "Buythelook"; //This is the Title of the Website
        //$scope.navigation = NavigationService.getEnabledCtNavigation();
        $scope.currentId = $stateParams.id;

        var input = {
            _id: $scope.currentId
        }
        ProductService.getBuyTheLookDetails(input, function (data) {
            $scope.buyshirt = data.data.data.products;
            $scope.insideImage = data.data.data.look.insideImage;
            $scope.myShirt = [];
            $scope.myShirt11 = [];
            // $scope.myShirt = _.chunk($scope.buyshirt, 3);
            $scope.myShirt = $scope.buyshirt;
            // console.log("myshirt", $scope.myShirt);
            // _.each($scope.myShirt, function (n) {
            //     $scope.myShirt1 = _.chunk(n, 3);
            //     $scope.myShirt11.push($scope.myShirt1);
            //     console.log($scope.myShirt11);
            // });
        })

        $rootScope.clickfun = function (product) {

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

            }

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
    .controller('compareProductsCtrl', function ($scope, TemplateService, NavigationService, $timeout, $uibModal) {
        $scope.template = TemplateService.getHTML("content/compare-products.html");
        TemplateService.title = "Compare Products"; //This is the Title of the Website
        $scope.navigation = NavigationService.getNavigation();

        $scope.products = $.jStorage.get('compareproduct');


        $scope.removeCompareProduct = function (product) {
            _.remove($scope.products, {
                productId: product.productId
            });
            $.jStorage.set('compareproduct', $scope.products);
        }

        // This function is used to display the modal on quck view button
        $scope.quickviewProduct = function (prod) {
            console.log("in quick view", prod);
            $scope.product = prod;

            if ($scope.product.sizes) {
                $scope.sizes = $scope.product.sizes
            } else if (!$scope.product.sizes) {
                $scope.sizes = $scope.product.size;
            }
            console.log($scope.sizes);
            if (angular.isArray($scope.sizes)) {
                $scope.activeButton = $scope.sizes[0].name;
                $scope.selectedSize = $scope.sizes[0];
            } else {
                $scope.activeButton = $scope.sizes.name;
                $scope.selectedSize = $scope.sizes;
            }


            $scope.arrayCheck = angular.isArray($scope.sizes);
            //  console.log("$scope.arrayCheck", $scope.arrayCheck);
            $scope.selectedImage = _.sortBy($scope.product.images, ['order'])[0];
            $scope.selectSize = function (sizeObj) {
                $scope.activeButton = sizeObj.name;
                $scope.selectedSize = sizeObj;
                var data = {
                    productId: $scope.product.productId,
                    size: sizeObj._id,
                    color: $scope.product.color._id
                }
                ProductService.getSKUWithParameter(data, function (data) {
                    console.log("SKU:", data.data);
                    if (data.data.value) {
                        console.log("after sku if ", $scope.product);
                        $scope.product = data.data.data;
                    } else {
                        console.log("after sku", $scope.product);
                        //  $scope.product = {};
                        // TODO: show out of stock
                    }
                })
            }
            $scope.addToCart = function () {
                var comment = "";
                myService.addToCart($scope.product, $scope.reqQuantity, $scope.selectedSize, comment, function (data) {
                    ModalService.addcart();
                    $scope.reload();
                })
            }
            $scope.addToWishlist = function () {
                var data = {
                    "product": $scope.product
                }
                myService.addToWishlist(data, function (data) {

                    ModalService.addwishlist();
                })
            }
            $scope.selectedImageIndex = 0;
            $scope.changeImage = function (index) {
                $scope.selectedImageIndex = index;
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
                size: 'lg',
                windowClass: 'quickview-modal-size'
            });
            $scope.closeModal = function () {
                quickviewProduct.close();
            }
        };
        //End of  modal on quck view button
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
    .controller('BlogsCtrl', function ($scope, TemplateService, NavigationService, $timeout) {
        $scope.template = TemplateService.getHTML("content/blogs.html");
        TemplateService.title = "Blogs"; //This is the Title of the Website
        $scope.navigation = NavigationService.getNavigation();
        NavigationService.getEnabledBlogs(function (data) {
            $scope.blogs = data.data.data;

        });
    })
    .controller('InnerBlogsCtrl', function ($scope, TemplateService, NavigationService, $timeout, $stateParams) {
        $scope.template = TemplateService.getHTML("content/inner-blogs.html");
        TemplateService.title = "Blogs"; //This is the Title of the Website
        $scope.navigation = NavigationService.getNavigation();
        var blogData = {}; // To push $stateParams obj
        $scope.sliderBlogsData = []; // To push individual blogs plus removed one 
        // console.log($stateParams);
        if ($stateParams) {
            blogData.id = $stateParams.id;
            // console.log(blogData.id);
        }
        //  console.log('Blog data', blogData);
        NavigationService.getEnabledInnerBlogs(blogData, function (data) {
            $scope.innarBlogs = data.data.data;
            $scope.sliderBlogsData.push($scope.innarBlogs);
            //  console.log('innerblogs', $scope.innarBlogs);
            //This service used for view also blogs section.
            NavigationService.getEnabledBlogs(function (data) {
                $scope.otherBlogs = data.data.data; // used to get all array of objects from blogs
                // In $scope.removedBlog we will get the objects except the reoved one
                $scope.removedBlog = _.remove($scope.otherBlogs, function (n) {
                    return blogData.id != n._id;
                });
                $scope.sliderBlogsData.push($scope.removedBlog);
                $scope.sliderBlogsData = _.flattenDeep($scope.sliderBlogsData);
                //console.log('after removing', $scope.removedBlog);
                // console.log('sliderBlogsData', $scope.sliderBlogsData);
            });
        });

    })
    .controller('ErrorMsgCtrl', function ($scope, TemplateService, NavigationService, $timeout, $stateParams) {
        $scope.template = TemplateService.getHTML("content/error-msg.html");
        TemplateService.title = "Error"; //This is the Title of the Website
        $scope.navigation = NavigationService.getNavigation();
        if ($stateParams.id) {
            $scope.orderId = $stateParams.id;
        }
    })
    .controller('ThankYouMsgCtrl', function ($scope, TemplateService, NavigationService, $timeout, $stateParams, OrderService) {
        $scope.template = TemplateService.getHTML("content/thankyou-msg.html");
        TemplateService.title = "Thank You"; //This is the Title of the Website
        $scope.navigation = NavigationService.getNavigation();
        if ($stateParams.id) {
            $scope.orderId = $stateParams.id;
        }
        $.jStorage.deleteKey("myCart");
        var emailUser = {};
        emailUser._id = $.jStorage.get("userId");
        emailUser.order = $.jStorage.get("userOrders");
        OrderService.ConfirmOrderPlacedMail(emailUser, function (data) {
            console.log("in User/ConfirmOrderPlacedMail", data);
            if (data.value === true) {

            }
        });
    })

    //Example API Controller
    .controller('DemoAPICtrl', function ($scope, TemplateService, apiService, NavigationService, $timeout) {
        apiService.getDemo($scope.formData, function (data) {

        });
    });