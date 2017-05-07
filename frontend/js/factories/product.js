myApp.factory('ProductService', function ($http) {
    return {

        getEnabledProducts: function (callback) {
            $http({
                url: adminurl + 'Product/getEnabledProducts',
                method: 'POST',
                withCredentials: false
            }).then(callback);
        },

        getNewArrivals: function (callback) {
            $http({
                url: adminurl + 'Product/getNewArrivals',
                method: 'POST',
                withCredentials: false
            }).then(callback);
        },

        getFeatured: function (callback) {
            $http({
                url: adminurl + 'Product/getFeatured',
                method: 'POST',
                withCredentials: false
            }).then(callback);
        },

        getProductWithId: function (input, callback) {
            $http({
                url: adminurl + 'Product/getProductWithId/' + input,
                method: 'POST',
                withCredentials: false
            }).then(callback);
        },

        getProductsWithCategoryId: function (input, callback) {
            $http({
                url: adminurl + 'Product/getProductsWithCategoryId/' + input,
                method: 'POST',
                withCredentials: false
            }).then(callback);
        },

        isAvailableProduct: function (reqQuantity, product) {
            return reqQuantity < product.quantity;
        }
    };
});