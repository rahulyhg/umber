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
    .controller('CancelCtrl', function ($scope, TemplateService, NavigationService, $timeout, OrderService, $stateParams, $state) {
        $scope.template = TemplateService.getHTML("content/cancel.html");
        TemplateService.title = "Return-Cancellation"; //This is the Title of the Website
        $scope.navigation = NavigationService.getNavigation();
        // $scope.order = $.jStorage.get("orderDetails");
        $.jStorage.deleteKey("cancellation");
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

        //Code for return reson dropdown
        $scope.setReturnResonText = 'Select Cancel Reason';
        $scope.returnReson = [{
                'reason': 'I dont like',
                'id': 1
            },
            {
                'reason': 'I dont like because',
                'id': 2
            }, {
                'reason': 'size is not perfect',
                'id': 3
            }
        ];

        $scope.getReturnReson = function (returnReason) {
            $scope.setReturnResonText = returnReason.reason;
        };

        $scope.cancelOrder = function () {
            var data1 = {};
            data1.products = $.jStorage.get("cancellation");
            data1.user = $.jStorage.get("userId");
            data1.orderId = $scope.order._id;
            data1.accessToken = $.jStorage.get("accessToken");
            OrderService.cancelOrder(data1, function (data) {
                console.log(data);
                if (data.data.value) {
                    var emailUser = {};
                    emailUser._id = $.jStorage.get('userId');
                    emailUser.order = data1.products;
                    emailUser.orderId = data1.orderId;
                    OrderService.cancelProductEmail(emailUser, function (data) {
                        console.log("in User/cancelProductEmail", data);
                        if (data.value === true) {

                        }
                    });
                }
                OrderService.getDetailsOfOrder(input, function (output) {
                    $scope.order = output.data.data;
                    $.jStorage.deleteKey("cancellation");
                    console.log(output);
                    $state.go("cancel-msg")
                })
                // $.jStorage.deleteKey("cancellation");
            })
            console.log("data", data1);

        }
        console.log($scope.order);

    })
    .controller('ReturnCtrl', function ($scope, TemplateService, NavigationService, $timeout, OrderService, $stateParams, $state) {
        $scope.template = TemplateService.getHTML("content/return.html");
        TemplateService.title = "Return-Cancellation"; //This is the Title of the Website
        $scope.navigation = NavigationService.getNavigation();
        // $scope.order = $.jStorage.get("orderDetails");
        $.jStorage.deleteKey("cancellation");
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
            // console.log("products", products);
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

        //Code for return reson dropdown
        $scope.setReturnResonText = 'Select Cancel Reason';
        $scope.returnReson = [{
                'reason': 'I dont like',
                'id': 1
            },
            {
                'reason': 'I dont like because',
                'id': 2
            }, {
                'reason': 'size is not perfect',
                'id': 3
            }
        ];

        $scope.getReturnReson = function (returnReason) {
            $scope.setReturnResonText = returnReason.reason;
        };

        $scope.cancelOrder = function () {
            var data1 = {};
            data1.products = $.jStorage.get("cancellation");
            data1.user = $.jStorage.get("userId");
            data1.orderId = $scope.order._id;
            data1.return = true;
            data1.accessToken = $.jStorage.get("accessToken");
            OrderService.cancelOrder(data1, function (data) {
                console.log(data);
                if (data.data.value) {
                    var emailUser = {};
                    emailUser._id = $.jStorage.get('userId');
                    emailUser.order = data1.products;
                    emailUser.orderId = data1.orderId;
                    OrderService.returnedProductEmail(emailUser, function (data) {
                        console.log("in User/returnedProductEmail", data);
                        if (data.value === true) {

                        }
                    });
                }
                OrderService.getDetailsOfOrder(input, function (output) {
                    $scope.order = output.data.data;
                    $.jStorage.deleteKey("cancellation");
                    console.log(output);
                    $state.go("return-success")
                })
                // $.jStorage.deleteKey("cancellation");
            })
            console.log("data", data1);

        }
        console.log($scope.order);

    });