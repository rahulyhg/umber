myApp.factory('NavigationService', function ($http) {
    var navigation = [{
        name: "Home",
        classis: "active",
        anchor: "home",
        subnav: [{
            name: "Subnav1",
            classis: "active",
            anchor: "home"
        }]
    }, {
        name: "Form",
        classis: "active",
        anchor: "form",
        subnav: []
    }];

    return {
        getNavigation: function () {
            return navigation;
        },

        EnabledHomeScreen: function (callback) {

            $http({
                url: adminurl + 'HomeScreen/getEnabledHomeContent',
                method: 'POST',
                withCredentials: false
            }).then(callback);
        },

        getEnabledCategories: function (callback) {

            $http({
                url: adminurl + 'HomeCategory/getEnabledCategories',
                method: 'POST',
                withCredentials: false
            }).then(callback);
        },

        getEnabledHomePageBlock: function (callback) {

            $http({
                url: adminurl + 'HomePageBlock/getEnabledHomePageBlock',
                method: 'POST',
                withCredentials: false
            }).then(callback);
        },

        getBlogs: function (callback) {
            $http({
                url: adminurl + 'Blog/getBlogs',
                method: 'POST',
                withCredentials: false
            }).then(callback);
        },

        getEnabledBlogs: function (callback) {

            $http({
                url: adminurl + 'Blog/getEnabledBlogs',
                method: 'POST',
                withCredentials: false
            }).then(callback);
        },
        getEnabledInnerBlogs: function (data, callback) {
            $http({
                url: adminurl + 'Blog/getEnabledInnerBlogs',
                method: 'POST',
                data: data,
                withCredentials: false
            }).then(callback);
        },

        getEnabledCollections: function (callback) {

            $http({
                url: adminurl + 'Collection/getEnabledCollections',
                method: 'POST',
                withCredentials: false
            }).then(callback);
        },

        getListingFilterFields: function (callback) {

            $http({
                url: adminurl + 'Fabric/getListingFilterFields',
                method: 'POST',
                withCredentials: false
            }).then(callback);
        },

        getListingCategories: function (callback) {
            $http({
                url: adminurl + 'Category/getEnabledCategories',
                method: 'POST',
                withCredentials: false
            }).then(callback);
        },
        getCoupon: function (data, callback) {
            $http({
                url: adminurl + 'Coupon/getCoupon',
                method: 'POST',
                data: data,
                withCredentials: false
            }).then(callback);
        },
        getAllDiscounts: function (callback) {
            $http({
                url: adminurl + 'Discount/search',
                method: 'POST',
                withCredentials: false
            }).then(callback);
        },
        getAllLocation: function (callback) {
            console.log("klhfknsdjfjhsfkdnghfdklgnhdklf")
            $http({
                url: adminurl + 'StoreLocator/search',
                method: 'POST',
                withCredentials: false
            }).then(callback);
        }
    };
});