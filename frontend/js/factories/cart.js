myApp.factory('CartService', function ($http) {
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

        getCart: function (callback) {
            $http({
                url: adminurl + 'Cart/getCart',
                method: 'POST',
                withCredentials: false
            }).then(callback);
        },

        getTotal: function (products) {
            var total = 0;
            for (var productIdx = 0; productIdx < products.length; productIdx++) {
                total += products[productIdx].product.price * products[productIdx].quantity;
            }
            return total;
        },

        updateCart: function (cart) {
            console.log("update cart: ", cart);
            $http({
                url: adminurl + 'Cart/updateCart',
                method: 'POST',
                data: cart,
                withCredentials: false
            });
        }
    };
});