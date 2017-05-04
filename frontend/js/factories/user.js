myApp.factory('UserService', function ($http) {
    return {
        userRegistration: function (userData) {
            $http({
                url: adminurl + 'User/registration',
                method: 'POST',
                data: userData,
                withCredentials: false
            }).then(console.log("executed"));
        }
    }
});