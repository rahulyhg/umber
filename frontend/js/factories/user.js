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
        }
    }
});