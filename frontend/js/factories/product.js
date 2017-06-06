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

        getProductDetails: function (input, callback) {
            $http({
                url: adminurl + 'Product/getProductDetails',
                data: input,
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

        getFiltersWithCategory: function (input, callback) {
            $http({
                url: adminurl + 'Product/getFiltersWithCategory',
                method: 'POST',
                data: input,
                withCredentials: false
            }).then(callback);
        },

        getProductsWithCategory: function (data, callback) {
            $http({
                url: adminurl + 'Product/getProductsWithCategory',
                method: 'POST',
                data: data,
                withCredentials: false
            }).then(callback);
        },
        getthelook: function (callback) {
            $http({
                url: adminurl + 'Buythelook/getEnabledLook',
                method: 'POST',
                withCredentials: false
            }).then(callback);
        },

        isAvailableProduct: function (reqQuantity, product) {
            return reqQuantity < product.quantity;
        }
    };
});