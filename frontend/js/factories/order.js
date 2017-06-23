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
        getUserOrders: function (input, callback) {
            $http({
                url: adminurl + 'Order/getUserOrders',
                data: input,
                method: 'POST',
                withCredentials: false
            }).then(callback);
        }
    }
});