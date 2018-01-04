myApp.factory('CartService', function ($http, cfpLoadingBar) {
    return {
        saveProduct: function (product, callback) {
            console.log("CartService->saveProduct: ", product);
            $http({
                url: adminurl + 'Cart/saveProduct',
                method: 'POST',
                data: product,
                withCredentials: false
            }).then(callback);
        },

        getCart: function (userId, callback) {
            $http({
                url: adminurl + 'Cart/getCart',
                method: 'POST',
                data: userId,
                withCredentials: false
            }).then(callback);
        },

        getTotal: function (products) {
            var total = 0;
            for (var productIdx = 0; productIdx < products.length; productIdx++) {
                total += _.round(products[productIdx].product.price) * products[productIdx].quantity;
            }

            cfpLoadingBar.complete()
            return total;
        },
        saveCartWithDiscount: function (cart) {
            $http({
                url: adminurl + 'Cart/saveCartWithDiscount',
                method: 'POST',
                data: cart,
                ignoreLoadingBar: true,
                withCredentials: false
            });
        },
        updateCartQuantity: function (cart) {
            console.log("update cart: ", cart);
            $http({
                url: adminurl + 'Cart/updateCartQuantity',
                method: 'POST',
                data: cart,
                ignoreLoadingBar: true,
                withCredentials: false
            });
        },
        offlineCart: function (cart, callback) {
            console.log("update cart: ", cart);
            $http({
                url: adminurl + 'Cart/setProductInCart',
                method: 'POST',
                data: cart,
                withCredentials: false
            }).then(callback);
        },
        removeProduct: function (data, callback) {
            $http({
                url: adminurl + 'Cart/removeProduct',
                method: 'POST',
                data: data,
                ignoreLoadingBar: true,
                withCredentials: false
            }).then(callback);
        },
        giftSave: function (gift, callback) {
            $http({
                url: adminurl + 'GiftCard/save',
                method: 'POST',
                data: gift,
                ignoreLoadingBar: false,
                withCredentials: false
            }).then(callback);
        },
        giftSaveInCart: function (gift, callback) {
            $http({
                url: adminurl + 'cart/giftSaveInCart',
                method: 'POST',
                data: gift,
                ignoreLoadingBar: false,
                withCredentials: false
            }).then(callback);
        }
    };
});