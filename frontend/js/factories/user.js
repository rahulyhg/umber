myApp.factory('UserService', function ($http) {
    return {
        userRegistration: function (userData, callback) {
            $http({
                url: adminurl + 'User/registration',
                method: 'POST',
                data: userData,
                withCredentials: false
            }).then(callback);
        },

        login: function (userData, callback) {
            $http({
                url: adminurl + 'User/login',
                method: 'POST',
                data: userData,
                withCredentials: false
            }).then(callback);
        },

        logout: function (data, callback) {
            $http({
                url: adminurl + 'User/logout',
                method: 'POST',
                data: data,
                withCredentials: false
            }).then(callback);
        },

        getUserDetails: function (data, callback) {
            $http({
                url: adminurl + 'User/getDetails',
                method: 'POST',
                data: data,
                withCredentials: false
            }).then(callback);
        },

        saveAddressMyaccount: function (data, callback) {
            $http({
                url: adminurl + 'User/saveAddress',
                method: 'POST',
                data: data,
                withCredentials: false
            }).then(callback);
        },
        saveAddressCheckout: function (data, callback) {
            $http({
                url: adminurl + 'User/saveAddresses',
                method: 'POST',
                data: data,
                withCredentials: false
            }).then(callback);
        },
        deleteShippingAddress: function (data, callback) {
            $http({
                url: adminurl + 'User/deleteShippingAddress',
                method: 'POST',
                data: data,
                withCredentials: false
            }).then(callback);
        },
        updateUser: function (data, callback) {
            $http({
                url: adminurl + 'User/updateUser',
                method: 'POST',
                data: data,
                withCredentials: false
            }).then(callback);
        }
    }
});