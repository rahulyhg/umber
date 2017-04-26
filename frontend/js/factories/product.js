myApp.factory('ProductService', function ($http) {
    return {


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
        }
    };
});