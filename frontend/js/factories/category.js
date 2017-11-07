myApp.factory('CategoryService', function ($http) {
    return {

        getCategoryWithId: function (input, callback) {
            $http({
                url: adminurl + 'HomeCategory/getCategoryWithId/' + input,
                method: 'POST',
                withCredentials: false
            }).then(callback);
        },
        getCategoryWithParent: function (input, callback) {
            $http({
                url: adminurl + 'category/getCategoriesWithParent',
                method: 'POST',
                data: input,
                withCredentials: false
            }).then(callback);
        },
        getCategorySlug: function (data, callback) {

            $http({
                url: adminurl + 'Category/getCategorySlug',
                data: data,
                method: 'POST',
                withCredentials: false
            }).then(callback);
        },
        getCategoryBySlug: function (data, callback) {
            console.log("factory getCategoryBySlug",data,adminurl);
            $http({
                url: adminurl + 'HomeCategory/getCategoryBySlug',
                data: data,
                method: 'POST',
                withCredentials: false
            }).then(callback);
        },
    };
});