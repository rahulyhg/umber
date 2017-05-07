myApp.factory('BannerService', function ($http) {
    return {
        getBanner: function (pageName, callback) {
            $http({
                url: adminurl + 'Banner/getBanner',
                method: 'POST',
                data: pageName,
                withCredentials: false
            }).then(callback);
        }
    }
})