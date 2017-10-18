myApp.factory('BannerService', function ($http) {
    return {
        getBanner: function (pageName, callback) {
            $http({
                url: adminurl + 'Banner/getBanner',
                method: 'POST',
                data: pageName,
                withCredentials: false
            }).then(callback);
        },
        applicableDiscounts: function (productIds, callback) {
            $http({
                url: adminurl + 'Discount/applicableDiscounts',
                method: 'POST',
                data: productIds,
                withCredentials: false
            }).then(callback);
        }
    }
})