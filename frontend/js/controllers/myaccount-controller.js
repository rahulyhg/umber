myApp.controller('MyAccountCtrl', function ($scope, TemplateService, $translate, $rootScope) {
    $scope.template = TemplateService.getHTML("content/myaccount.html");
    TemplateService.title = "My Account"; //This is the Title of the Website
    //  $scope.navigation = NavigationService.getNavigation();

    $scope.save = false; // used for Edit tab on profile button to save user's details
    $scope.edit = function () { // Function is used to show & hide edit & save tab
        $scope.save = !$scope.save;
        if ($scope.save) {
            $scope.userDetails.firstName = ''; // to make it all fields empty in tnput text after save
            $scope.userDetails.lastName = '';
            $scope.userDetails.email = '';
            $scope.userDetails.mobNo = '';
        }
    };

    $scope.userDetails = { // an object to store user details on edit tab
        firstName: '',
        lastName: '',
        emailId: '',
        mobNo: ''
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

});