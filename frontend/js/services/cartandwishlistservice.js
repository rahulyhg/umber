myApp.service('myService', function ($http, WishlistService, BannerService, CartService) {
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
this.applicableDiscounts = function (productIdsArr, callback) {
            var formData={
                productIds:productIdsArr
            }
            BannerService.applicableDiscounts(formData, function (data) {
                console.log(data);
                callback(data.data.data)

            });
        },
//avinash functions ends here
        /*************Adding Products To Cart**************** */
        this.addToCart = function (prod, reqQuantity, size, com, callback) {
            console.log("product:", prod, "size:", size, "quanti:", reqQuantity)
            prod.selectedSize = size._id;
            prod.reqQuantity = reqQuantity;
            prod.comment = com;
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

            }
            callback("sucess");
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
        }
})