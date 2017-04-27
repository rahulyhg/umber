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
            console.log("Frontend->navigation.js->data");
            $http({
                url: adminurl + 'HomeScreen/getEnabledHomeContent',
                method: 'POST',
                withCredentials: false
            }).then(callback);
        },

        getEnabledCategories: function (callback) {
            console.log("Navigation->Categories");
            $http({
                url: adminurl + 'Category/getEnabledCategories',
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
            console.log("Getting enabled blogs");
            $http({
                url: adminurl + 'Blog/getEnabledBlogs',
                method: 'POST',
                withCredentials: false
            }).then(callback);
        },

        getEnabledCollections: function (callback) {
            console.log("Getting enabled collections");
            $http({
                url: adminurl + 'Collection/getEnabledCollections',
                method: 'POST',
                withCredentials: false
            }).then(callback);
        }
    };
});