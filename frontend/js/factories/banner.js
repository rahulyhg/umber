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
        applicableDiscounts: function (data, callback) {
            $http({
                url: adminurl + 'Discount/applicableDiscounts',
                method: 'POST',
                data: data,
                withCredentials: false
            }).then(callback);
        },
        getAllProductsByDiscount: function (discountId, callback) {
            $http({
                url: adminurl + 'Discount/getOne',
                method: 'POST',
                data: discountId,
                withCredentials: false
            }).then(callback);
        },
        addCouponByUserFromCart: function (data, callback) {
            $http({
                url: adminurl + 'Coupon/save',
                method: 'POST',
                data: data,
                withCredentials: false
            }).then(callback);
        }
    }
})