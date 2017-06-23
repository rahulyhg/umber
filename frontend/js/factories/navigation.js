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
        }
    };
});