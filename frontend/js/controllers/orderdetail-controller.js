myApp.controller('OrderDetailCtrl', function ($scope, TemplateService, $translate, $rootScope) {
    $scope.template = TemplateService.getHTML("content/orderdetail.html");
    TemplateService.title = "Order Detail"; //This is the Title of the Website
    //  $scope.navigation = NavigationService.getNavigation();
});