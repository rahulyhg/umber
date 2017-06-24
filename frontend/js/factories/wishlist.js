myApp.factory('WishlistService', function ($http) {
    return {
        saveProduct: function (product, callback) {
            $http({
                url: adminurl + 'Wishlist/saveProduct',
                data: product,
                method: 'POST',
                withCredentials: false
            }).then(callback);
        },
        getWishlist: function (product, callback) {
            $http({
                url: adminurl + 'Wishlist/getWishlist',
                data: product,
                method: 'POST',
                ignoreLoadingBar: true,
                withCredentials: false
            }).then(callback);
        },
        removeProduct: function (product, callback) {
            $http({
                url: adminurl + 'Wishlist/removeProductFromWishlist',
                data: product,
                method: 'POST',
                ignoreLoadingBar: true,
                withCredentials: false
            }).then(callback);
        }
    }

});