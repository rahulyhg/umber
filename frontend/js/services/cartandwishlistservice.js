myApp.service('myService', function ($http, WishlistService, BannerService, CartService, $uibModal, $timeout) {
    this.ctrlBanners = function (pagename, callback) {
            var banner = {
                pageName: pagename
            }
            BannerService.getBanner(banner, function (data) {
                console.log(data);
                callback(data.data.data)

            });
        },
        //avinash functions starts here
        this.applicableDiscounts = function (productIdsArr, grandTotal, callback) {
            var formData = {
                productIds: productIdsArr,
                grandTotal: grandTotal
            };
            BannerService.applicableDiscounts(formData, function (data) {
                console.log(data);
                callback(data.data.data)

            });
        },

        this.getAllProductsByDiscount = function (discountId, callback) {
            console.log("cartandwishlistservice inside getAllProductsByDiscount");
            var formData = {
                _id: discountId
            }
            // console.log("formdata$$$",formData);
            BannerService.getAllProductsByDiscount(formData, function (data) {
                console.log(data);
                callback(data.data.data)

            });
        },
        //avinash functions ends here
        /*************Adding Products To Cart**************** */
        this.addToCart = function (prod, reqQuantity, size, com, productStyle, productColor, callback) {
            console.log("product:", prod, "size:", size, "quanti:", reqQuantity, "productColor", productColor)
            prod.selectedSize = size._id;
            prod.reqQuantity = reqQuantity;
            prod.comment = com;
            prod.productStyle = productStyle;
            prod.productColor = productColor;
            var accessToken = $.jStorage.get("accessToken");
            if (!_.isEmpty(accessToken)) {
                console.log("inside if in addtcart service")
                prod.accessToken = $.jStorage.get("accessToken");
                prod.userId = $.jStorage.get("userId");
                console.log("productbeforesending:", prod)

                CartService.saveProduct(prod, function (data) {
                    if (data.data.error) {
                        console.log("Error: ", data.data.error);

                    } else {
                        var addcartmodal = $uibModal.open({
                            animation: true,
                            templateUrl: 'views/modal/cartadd.html',
                            size: 'md',

                        });
                        $timeout(function () {
                            addcartmodal.close();
                            // $state.reload();
                        }, 2000)
                        console.log("Success");

                    }
                });
            } else {
                console.log("went for local storage")
                var cart = {};
                cart = $.jStorage.get('cart') ? $.jStorage.get('cart') : {};
                if (_.isEmpty(cart)) {
                    cart.products = [];
                }
                prod.size = {};
                prod.size.name = size.name;
                cart.products.push({
                    product: prod
                });
                var len = cart.products.length;
                cart.products[len - 1].quantity = reqQuantity;
                $.jStorage.set('cart', cart);
                console.log("added to offlinecart", $.jStorage.set('cart', cart))
                callback("sucess");
            }

        },

        /*******Add Product To Wishlist******** */
        this.addToWishlist = function (prod, callback) {
            var accessToken = $.jStorage.get("accessToken");
            if (!_.isEmpty(accessToken)) {
                var wishlist = {
                    accessToken: accessToken,
                    userId: $.jStorage.get("userId"),
                    products: [prod.product.productId]
                }
                WishlistService.saveProduct(wishlist, function (data) {
                    console.log(data);
                    if (data.data.error) {
                        console.log("Error: ", data.data.error);
                    } else {
                        console.log("Success");
                        // $state.reload();

                    };

                });
            } else {
                console.log("User not logged in");
                var productId = $.jStorage.get('wishlist') ? $.jStorage.get('wishlist') : [];
                productId.push(prod.product);
                $.jStorage.set('wishlist', productId);
                console.log("offflinewishlist:::::::")

            }
            callback("success");
        },
        this.removeWishlist = function (prod, callback) {
            var accessToken = $.jStorage.get("accessToken");
            if (!_.isEmpty(accessToken)) {
                var wishlist = {
                    accessToken: accessToken,
                    userId: $.jStorage.get("userId"),
                    products: [prod.product.productId]
                }
                WishlistService.saveProduct(wishlist, function (data) {
                    console.log(data);
                    if (data.data.error) {
                        console.log("Error: ", data.data.error);
                    } else {
                        console.log("Success");
                        // $state.reload();

                    };

                });
            } else {
                console.log("User not logged in");
                var productId = $.jStorage.get('wishlist') ? $.jStorage.get('wishlist') : [];
                var result = _.indexOf(productId, prod.product);
                var index = productId.indexOf(prod.product);
                console.log("offflinewishlist:::::::result", result);
                if (result == -1) {
                    productId.splice(index, 1);
                    console.log("offflinewishlist:::::::result", productId);
                    $.jStorage.set('wishlist', productId);
                }

            }
            callback("success");
        }
})