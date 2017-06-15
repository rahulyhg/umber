myApp.factory('CategoryService', function ($http) {
    return {

        getCategoryWithId: function (input, callback) {
            $http({
                url: adminurl + 'HomeCategory/getCategoryWithId/' + input,
                method: 'POST',
                withCredentials: false
            }).then(callback);
        }
    };
});