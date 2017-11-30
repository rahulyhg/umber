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
        postReq: function (input, callback) {
            $http({
                url: adminurl + 'Order/postReq',
                data: input,
                method: 'POST',
                withCredentials: false
            }).then(callback);
        },
        updateOrderAddress: function (input, callback) {
            $http({
                url: adminurl + 'Order/updateOrderAddress',
                data: input,
                method: 'POST',
                withCredentials: false
            }).then(callback);
        },
        cancelOrder: function (input, callback) {
            $http({
                url: adminurl + 'Order/cancelProducts',
                data: input,
                method: 'POST',
                withCredentials: false
            }).then(callback);
        },
        cancelledProduct: function (input, callback) {
            $http({
                url: adminurl + 'Order/getCancelledOrdersForUser',
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
        },

        getDetailsOfOrder: function (input, callback) {
            $http({
                url: adminurl + 'Order/getAnOrderDetail',
                data: input,
                method: 'POST',
                withCredentials: false
            }).then(callback);
        },
        ConfirmOrderPlacedMail: function (userData, callback) {
            $http({
                url: adminurl + 'Order/ConfirmOrderPlacedMail',
                method: 'POST',
                data: userData,
                withCredentials: false
            }).then(callback);
        },
        returnedProductEmail: function (userData, callback) {
            $http({
                url: adminurl + 'Order/returnedProductEmail',
                method: 'POST',
                data: userData,
                withCredentials: false
            }).then(callback);
        },
        cancelProductEmail: function (userData, callback) {
            $http({
                url: adminurl + 'Order/cancelProductEmail',
                method: 'POST',
                data: userData,
                withCredentials: false
            }).then(callback);
        },
        deliveredProductEmail: function (userData, callback) {
            $http({
                url: adminurl + 'Order/deliveredProductEmail',
                method: 'POST',
                data: userData,
                withCredentials: false
            }).then(callback);
        },
        shippedProductEmail: function (userData, callback) {
            $http({
                url: adminurl + 'Order/shippedProductEmail',
                method: 'POST',
                data: userData,
                withCredentials: false
            }).then(callback);
        },
    }
});