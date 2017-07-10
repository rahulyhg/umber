myApp.controller('OrderDetailCtrl', function ($scope, TemplateService, $translate, $rootScope, OrderService, $stateParams) {
        $scope.template = TemplateService.getHTML("content/orderdetail.html");
        TemplateService.title = "Order Detail"; //This is the Title of the Website
        //  $scope.navigation = NavigationService.getNavigation();
        // $scope.order = $.jStorage.get("orderDetails");
        console.log($scope.order);
        var input = {
            _id: $stateParams.id
        }
        OrderService.getDetailsOfOrder(input, function (output) {
            $scope.order = output.data.data;
            console.log(output);
        })

    })
    .controller('CancelCtrl', function ($scope, TemplateService, NavigationService, $timeout, OrderService, $stateParams) {
        $scope.template = TemplateService.getHTML("content/cancel.html");
        TemplateService.title = "Return-Cancellation"; //This is the Title of the Website
        $scope.navigation = NavigationService.getNavigation();
        // $scope.order = $.jStorage.get("orderDetails");

        var input = {
            _id: $stateParams.id
        }
        OrderService.getDetailsOfOrder(input, function (output) {
            $scope.order = output.data.data;
            console.log(output);
        })

        $scope.selectedProduct = function (product) {
            var products = $.jStorage.get('cancellation') ? $.jStorage.get('cancellation') : [];
            var result = _.find(products, {
                product: product.product._id
            })
            if (result) {
                _.remove(products, {
                    product: product.product._id
                })
            } else {

                products.push({
                    product: product.product._id,
                    quantity: product.quantity
                });
            }
            console.log("products", products);
            $.jStorage.set("cancellation", products);
        }

        $scope.check = function (prodid) {
            var products = $.jStorage.get('cancellation') ? $.jStorage.get('cancellation') : [];
            var result = _.find(products, {
                product: prodid
            })
            if (result) {
                return true;
            } else {
                return false;
            }
        }

        $scope.cancelOrder = function () {
            var data = {};
            data.products = $.jStorage.get("cancellation");
            data.user = $.jStorage.get("userId");
            data.orderId = $scope.order._id;
            data.accessToken = $.jStorage.get("accessToken");
            OrderService.cancelOrder(data, function (data) {
                console.log(data);
                OrderService.getDetailsOfOrder(input, function (output) {
                    $scope.order = output.data.data;
                    $.jStorage.deleteKey("cancellation");
                    console.log(output);
                })
                // $.jStorage.deleteKey("cancellation");
            })
            console.log("data", data);

        }
        console.log($scope.order);
    });