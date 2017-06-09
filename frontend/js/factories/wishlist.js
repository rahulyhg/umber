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
                withCredentials: false
            }).then(callback);
        }
    }

});