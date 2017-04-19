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

        HomeScreen: function (callback) {
            console.log("Frontend->navigation.js->data");
            $http({
                url: adminurl + 'HomeScreen/getHomeContent',
                method: 'POST',
                withCredentials: false
            }).then(callback);
        }
    };
});