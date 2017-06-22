myApp.service('myService', function ($http, BannerService, CartService) {
    this.ctrlBanners = function (pagename, callback) {
            var banner = {
                pageName: pagename
            }
            BannerService.getBanner(banner, function (data) {
                console.log(data);
                callback(data.data.data)

            });
        },
        this.addToCart = function (prod, reqQuantity, size, callback) {
            console.log("product:", prod, "size:", size, "quanti:", reqQuantity)
            prod.selectedSize = size._id;
            prod.reqQuantity = reqQuantity;
            var accessToken = $.jStorage.get("accessToken");
            if (!_.isEmpty(accessToken)) {
                console.log("inside if in addtcart service")
                prod.accessToken = $.jStorage.get("accessToken");
                prod.userId = $.jStorage.get("userId");
                console.log("productbeforesending:", prod)
                CartService.saveProduct(prod, function (data) {
                    console.log("Error: ", data);
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
        }
})