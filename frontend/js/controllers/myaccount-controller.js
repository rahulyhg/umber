myApp.controller('MyAccountCtrl', function ($scope, toastr, $state, OrderService, WishlistService, TemplateService, $translate, $rootScope, UserService, $stateParams, $filter) {
    $scope.template = TemplateService.getHTML("content/myaccount.html");
    TemplateService.title = "My Account"; //This is the Title of the Website
    //  $scope.navigation = NavigationService.getNavigation();
    if (_.isEmpty($.jStorage.get("accessToken"))) {
        toastr.error("Please login to access your details", "Error:")
        $state.go("home");
    }
    if ($stateParams.view) {
        $scope.view = $stateParams.view;
    } else {
        $scope.view = "profTab";
    }

    $scope.retriveCancelledProducts = function (view) {


        var data = {
            user: $.jStorage.get("userId"),
            accessToken: $.jStorage.get("accessToken"),
            status: view
        }

        $scope.paramview = view;
        console.log("data", data)
        OrderService.cancelledProduct(data, function (output) {
            console.log(output.data.data);

            $scope.returned = output.data.data;
            console.log("dasdsadasdsad", $scope.returned)


        })
    }

    var input = {
        "userId": $.jStorage.get("userId")
    }
    console.log("input:", input)
    OrderService.getUserOrders(input, function (data) {
        console.log("order::", data.data.data);
        $scope.orders = data.data.data;
    })

    /*****whishlist data***** */
    WishlistService.getWishlist(input, function (data) {
        console.log("wishlist:", data);
        $scope.wishlists = data.data.data;
        $scope.wl = _.chunk($scope.wishlists, 3)
    })

    /******userdetails***** */
    if (input.userId) {
        UserService.getUserDetails(input, function (data) {
            $scope.userDetails = data.data;
            console.log("userdetails::", data)
        });
    }
    $scope.save = false; // used for Edit tab on profile button to save user's details
    $scope.edit = function () { // Function is used to show & hide edit & save tab
        $scope.save = !$scope.save;
        if ($scope.save) {
            $scope.userDetails.firstName = ''; // to make it all fields empty in tnput text after save
            $scope.userDetails.lastName = '';
            $scope.userDetails.email = '';
            $scope.userDetails.mobNo = '';
            $scope.userDetails.address1 = '';
            $scope.userDetails.address2 = '';
            $scope.userDetails.address3 = '';
            $scope.userDetails.address4 = '';
            $scope.userDetails.city = '';
            $scope.userDetails.pinCode = '';
            $scope.userDetails.country = '';
        }
        var data = {};
        data.accessToken = $.jStorage.get("accessToken");
        data.type = "shippingAddress";
        data.shippingAddress = $scope.userDetails;
        console.log("data for  delete", data)
        UserService.updateUser(data, function (data) {
            console.log(data)
        })
    };


    $scope.edit1 = function (id) { // Function is used to show & hide edit & save tab


        // $scope.save = !$scope.save;
        // if ($scope.save) {
        //     $scope.userDetails.firstName = ''; // to make it all fields empty in tnput text after save
        //     $scope.userDetails.lastName = '';
        //     $scope.userDetails.email = '';
        //     $scope.userDetails.mobNo = '';
        //     $scope.userDetails.address1 = '';
        //     $scope.userDetails.address2 = '';
        //     $scope.userDetails.address3 = '';
        //     $scope.userDetails.address4 = '';
        //     $scope.userDetails.city = '';
        //     $scope.userDetails.pinCode = '';
        //     $scope.userDetails.country = '';
        // }
        $scope.data = {};
        console.log("data for  delete", $scope.userDetails.data._id);

        console.log("data for  delete**************************", id);
        $scope.data = {
            user_id: $scope.userDetails.data._id,
            shippingAddress_id: id
        };

        UserService.deleteShippingAddress($scope.data, function (data) {
            console.log(data);
        })

    };
    $scope.userDetails = { // an object to store user details on edit tab
        firstName: '',
        lastName: '',
        emailId: '',
        mobNo: '',
        address1: '',
        address2: '',
        address3: '',
        address4: '',
        city: '',
        pinCode: '',
        country: '',
    };

    $scope.buyshirt = [{
        img: 'img/buy/2.jpg',
        rupee: '3,000',
        title: 'linen FULL SLEEVE SHIRT WITH ROLL UP',
        id: 0
    }, {
        img: 'img/buy/3.jpg',
        rupee: '3,000',
        title: 'linen FULL SLEEVE SHIRT WITH ROLL UP',
        id: 1
    }, {
        img: 'img/buy/4.jpg',
        rupee: '3,000',
        title: 'linen FULL SLEEVE SHIRT WITH ROLL UP',
        id: 2
    }, {
        img: 'img/buy/5.jpg',
        rupee: '3,000',
        title: 'OFF WHITE SLIM FIT FORMA TROUSER',
        id: 3
    }, {
        img: 'img/buy/6.jpg',
        rupee: '3,000',
        title: 'OFF WHITE SLIM FIT FORMA TROUSER',
        id: 4
    }, {
        img: 'img/buy/7.jpg',
        rupee: '3,000',
        title: 'OFF WHITE SLIM FIT FORMA TROUSER',
        id: 5
    }, {
        img: 'img/buy/2.jpg',
        rupee: '3,000',
        title: 'Linen LIGHT BLUE CASUAL BLAZER',
        id: 6
    }, {
        img: 'img/buy/3.jpg',
        rupee: '3,000',
        title: 'linen LIGHT BLUE CASUAL BLAZER',
        id: 7
    }, {
        img: 'img/buy/4.jpg',
        rupee: '3,000',
        title: 'linen LIGHT BLUE CASUAL BLAZER',
        id: 8
    }, {
        img: 'img/buy/5.jpg',
        rupee: '3,000',
        title: 'MEN WHITE GENUINE LEATHER DERBYS',
        id: 9
    }, {
        img: 'img/buy/6.jpg',
        rupee: '3,000',
        title: 'MEN WHITE GENUINE LEATHER DERBYS',
        id: 10
    }, {
        img: 'img/buy/7.jpg',
        rupee: '3,000',
        title: 'MEN WHITE GENUINE LEATHER DERBYS',
        id: 11
    }, {
        img: 'img/buy/3.jpg',
        rupee: '3,000',
        title: 'LETHER MEN BLACK GENUINE LEATHER BELT',
        id: 12
    }, {
        img: 'img/buy/4.jpg',
        rupee: '3,000',
        title: 'LETHER MEN BLACK GENUINE LEATHER BELT',
        id: 13
    }, {
        img: 'img/buy/5.jpg',
        rupee: '3,000',
        title: 'LETHER MEN BLACK GENUINE LEATHER BELT',
        id: 14
    }, {
        img: 'img/buy/6.jpg',
        rupee: '3,000',
        title: 'GRAVIATE BLACK FULL FRAME ROUNDGLASSES',
        id: 15
    }, {
        img: 'img/buy/7.jpg',
        rupee: '3,000',
        title: 'GRAVIATE BLACK FULL FRAME ROUNDGLASSES',
        id: 16
    }, {
        img: 'img/buy/5.jpg',
        rupee: '3,000',
        title: 'GRAVIATE BLACK FULL FRAME ROUNDGLASSES',
        id: 17
    }];
    $scope.myShirt = [];
    $scope.myShirt11 = [];
    $scope.myShirt = _.chunk($scope.buyshirt, 16);
    console.log($scope.myShirt);
    _.each($scope.myShirt, function (n) {
        $scope.myShirt1 = _.chunk(n, 4);
        $scope.myShirt11.push($scope.myShirt1);
    });
    // $scope.gotoOrder = function (orderDetails) {
    //     $.jStorage.set("orderDetails", orderDetails);
    //     $state.go("orderdetail");
    // }

    //For Manage address's dropdown to select country'
    $scope.countryButton = 'india';
    $scope.selectedState = ['Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Dadra and Nagar Haveli', 'Daman and Diu', 'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jammu and Kashmir', 'Jharkhand', 'Karnataka',
        'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Orissa', 'Puducherry', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
        'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
    ];
    $scope.visible = true;
    $scope.hidden = false;
    $scope.selectCounteries = ['india', 'usa', 'uk', 'test'];
    $scope.changeCountry = function (name) {
        $scope.countryButton = name;
        if (_.isEqual(name, 'india') && $scope.countryButton == 'india') {
            $scope.visible = true;
            $scope.hidden = false;
            // $scope.selectedState = 'state';
            console.log("*******inside if***")
            $scope.selectedState = ['Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Dadra and Nagar Haveli', 'Daman and Diu', 'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jammu and Kashmir', 'Jharkhand', 'Karnataka',
                'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Orissa', 'Puducherry', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
                'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
            ];
        } else {
            $scope.visible = false;
            $scope.hidden = true;
        }

        // $scope.countryButton = name;
        // var countryButton = angular.element(document.getElementsByClassName('state-dropdown--btn'));
        // console.log(countryButton);
        // countryButton[0].disabled = false;
    };

    //For Manage address's dropdown to select state
    $scope.stateButton = 'State';
    $scope.selectState = {
        state: ['mumbai', 'maharashtra', 'banglore', 'test1']
    };
    $scope.changeState = function (name) {
        $scope.stateButton = name;
    };
    //For cancellation of product
    $scope.cancellation = function (orderDetails) {
        $.jStorage.set("orderDetails", orderDetails);
        $state.go("cancel");
    }
    $scope.removeWishlist = function (prodId) {
        var data = {};
        data.accessToken = $.jStorage.get("accessToken");
        data.productId = prodId;
        WishlistService.removeProduct(data, function (data) {
            console.log(data);
            $state.reload();
        })
    }

});
myApp.controller('ProductReturnCtrl', function ($scope, toastr, $state, OrderService, WishlistService, TemplateService, $translate, $rootScope, UserService) {
    $scope.template = TemplateService.getHTML("content/product-return.html");

});
myApp.controller('ReturnSuccessCtrl', function ($scope, TemplateService, $translate, $rootScope) {
    $scope.template = TemplateService.getHTML("content/return-success.html");
    TemplateService.title = "Return Successful"; //This is the Title of the Website
    //  $scope.navigation = NavigationService.getNavigation();
});
myApp.controller('CancelMsgCtrl', function ($scope, TemplateService, $translate, $rootScope) {
    $scope.template = TemplateService.getHTML("content/cancel-msg.html");
    TemplateService.title = "Canceld Oreder"; //This is the Title of the Website
    //  $scope.navigation = NavigationService.getNavigation();
});
myApp.controller('GiftCardCtrl', function ($scope, TemplateService, $translate, $rootScope) {
    $scope.template = TemplateService.getHTML("content/giftcard.html");
    TemplateService.title = "Your Gift Card"; //This is the Title of the Website
    //  $scope.navigation = NavigationService.getNavigation();
});
myApp.controller('StoreLocatorCtrl', function ($scope, TemplateService, $translate, $rootScope, $filter) {
    $scope.template = TemplateService.getHTML("content/storelocator.html");
    TemplateService.title = "Stores"; //This is the Title of the Website
    //  $scope.navigation = NavigationService.getNavigation();
    $scope.storeLocation = [{
            address: 'Shop No 2, Morya Mahal,Linking Road,  Bandra West, Mumbai - 400050',
            contactNo: '+(91)-22-26559556 +(91)-9769422251, 9821593786',
            email: 'info@burntum'
        },
        {
            address: 'Delphi Building, Orchard Ave, Hiranandani Gardens, Powai,Mumbai, Maharashtra 400076',
            contactNo: '+(91)-22-26559556 +(91)-9769422251, 9821593786',
            email: 'info@burntum'
        },
        {
            address: 'Shop No 2, Morya Mahal, Linking Road,  Bandra West, Mumbai - 400050',
            contactNo: '+(91)-22-26559556 +(91)-9769422251, 9821593786',
            email: 'info@burntumber.in'
        },
        {
            address: 'Delphi Building, Orchard Ave, Hiranandani Gardens, Powai, Mumbai, Maharashtra 400076',
            contactNo: '+(91)-22-26559556 +(91)-9769422251, 9821593786',
            email: 'info@burntum'
        },
        {
            address: 'Delphi Building, Orchard Ave, Hiranandani Gardens, Powai,Mumbai, Maharashtra 400076',
            contactNo: '+(91)-22-26559556 +(91)-9769422251, 9821593786',
            email: 'info@burntum'
        }
    ];
    $scope.storeLocation = _.chunk($scope.storeLocation, 4);
    $scope.locationButton = 'Location';
    $scope.location = ['Mumbai', 'Pune', 'Hyderabad', 'Chennai'];
    $scope.changePlaces = function (name) {
        $scope.locationButton = name;
    };
});