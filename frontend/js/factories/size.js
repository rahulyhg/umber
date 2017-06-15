myApp.factory('SizeService', function ($http) {
    return {
        getEnabledSizes: function (callback) {
            $http({
                url: adminurl + 'Size/getEnabledSizes',
                method: 'POST',
                withCredentials: false
            }).then(callback);
        }
    }
})