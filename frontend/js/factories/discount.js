myApp.factory('DiscountService', function ($http, $timeout) {
    return {

        getAllDiscounts: function (callback) {
            $http({
                url: adminurl + 'Discount/getAllDiscounts',
                method: 'POST',
                withCredentials: false
            }).then(callback);
        },
        getProductDetails: function (input, callback) {
            $http({
                url: adminurl + 'Discount/getProductDetails',
                data: input,
                method: 'POST',
                withCredentials: false
            }).then(callback);
        },
        isAvailableProduct: function (reqQuantity, product) {
            return reqQuantity < product.quantity;
        }
    };
});