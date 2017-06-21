myApp.factory('OrderService', function ($http) {
    return {
        createOrderFromCart: function (input, callback) {
            $http({
                url: adminurl + 'Order/createOrderFromCart',
                data: input,
                method: 'POST',
                withCredentials: false
            }).then(callback);
        },
    }
});