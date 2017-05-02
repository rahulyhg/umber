myApp.factory('CategoryService', function ($http) {
    return {

        getCategoryWithId: function (input, callback) {
            $http({
                url: adminurl + 'Category/getCategoryWithId/' + input,
                method: 'POST',
                withCredentials: false
            }).then(callback);
        }
    };
});