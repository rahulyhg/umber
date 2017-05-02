myApp.factory('UserService', function ($http) {
    return {
        userRegistration: function (callback) {
            $http({}).then(callback);
        }
    }
});