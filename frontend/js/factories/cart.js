myApp.factory('CartService', function ($http) {
    return {
        saveProduct: function (product, callback) {
            $http({
                url: adminurl + 'Cart/saveProduct',
                method: 'POST',
                data: product,
                withCredentials: false
            }).then(callback);
        }
    };
});