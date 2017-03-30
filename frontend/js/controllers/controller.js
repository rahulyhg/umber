myApp.controller('HomeCtrl', function ($scope, TemplateService, NavigationService, $timeout) {
        $scope.template = TemplateService.getHTML("content/home.html");
        TemplateService.title = "Home"; //This is the Title of the Website
        $scope.navigation = NavigationService.getNavigation();

        // $scope.mySlides = [
        //     'http://flexslider.woothemes.com/images/kitchen_adventurer_cheesecake_brownie.jpg',
        //     'http://flexslider.woothemes.com/images/kitchen_adventurer_lemon.jpg',
        //     'http://flexslider.woothemes.com/images/kitchen_adventurer_donut.jpg',
        //     'http://flexslider.woothemes.com/images/kitchen_adventurer_caramel.jpg'
        // ];
        $scope.clothCat = [{
                img: '../img/home/1.jpg',
                shirtType: 'casual shirt',
                disc: 'Lorem Ipsum is simply dummy text',
                buttonText: 'shop now'
            },
            {
                img: '../img/home/1.jpg',
                shirtType: 'shirt casual ',
                disc: 'Lorem Ipsum is simply dummy text',
                buttonText: 'shop now'
            },
            {
                img: '../img/home/1.jpg',
                shirtType: 'casual shirt',
                disc: 'Lorem Ipsum is simply dummy text',
                buttonText: 'shop now'
            },
            {
                img: '../img/home/1.jpg',
                shirtType: 'casual shirt',
                disc: 'Lorem Ipsum is simply dummy text',
                buttonText: 'shop now'
            }
        ];
        $scope.newArrival = [{
                img: '../img/home/8.jpg',
                price: '3000',
                type: 'Lorem Ipsum is simply dummy text'

            },
            {
                img: '../img/home/9.jpg',
                price: '4000 ',
                type: 'Lorem Ipsum is simply dummy text'

            },
            {
                img: '../img/home/10.jpg',
                price: '5000',
                type: 'Lorem Ipsum is simply dummy text'

            }, {
                img: '../img/home/8.jpg',
                price: '3000',
                type: 'Lorem Ipsum is simply dummy text'

            },
            {
                img: '../img/home/9.jpg',
                price: '4000 ',
                type: 'Lorem Ipsum is simply dummy text'

            },
            {
                img: '../img/home/10.jpg',
                price: '5000',
                type: 'Lorem Ipsum is simply dummy text'

            }
        ];
        $scope.featured = [{
                img: '../img/home/11.jpg',
                price: '3000',
                type: 'Lorem Ipsum is simply dummy text'

            },
            {
                img: '../img/home/12.jpg',
                price: '4000 ',
                type: 'Lorem Ipsum is simply dummy text'

            },
            {
                img: '../img/home/13.jpg',
                price: '5000',
                type: 'Lorem Ipsum is simply dummy text'

            }, {
                img: '../img/home/14.jpg',
                price: '3000',
                type: 'Lorem Ipsum is simply dummy text'

            },
            {
                img: '../img/home/11.jpg',
                price: '4000 ',
                type: 'Lorem Ipsum is simply dummy text'

            },
            {
                img: '../img/home/12.jpg',
                price: '5000',
                type: 'Lorem Ipsum is simply dummy text'

            },
            {
                img: '../img/home/13.jpg',
                price: '4000 ',
                type: 'Lorem Ipsum is simply dummy text'

            },
            {
                img: '../img/home/14.jpg',
                price: '5000',
                type: 'Lorem Ipsum is simply dummy text'

            }
        ];
        $scope.blogs = [{
                img: '../img/home/16.jpg',
                heading: 'Lorem Ipsum is simply dummy text',
                para: 'Lorem Ipsum is simply dummy text Lorem Ipsum is simply dummy text, Lorem Ipsum is simply dummy text Lorem Ipsum is simply dummy text'
            },
            {
                img: '../img/home/17.jpg',
                heading: 'Lorem Ipsum is simply dummy text',
                para: 'Lorem Ipsum is simply dummy text, Lorem Ipsum is simply dummy text Lorem Ipsum is simply dummy text'
            },
            {
                img: '../img/home/18.jpg',
                heading: 'Lorem Ipsum is simply dummy text',
                para: 'Lorem Ipsum is simply dummy text, Lorem Ipsum is simply dummy text Lorem Ipsum is simply dummy text'
            }, {
                img: '../img/home/16.jpg',
                heading: 'Lorem Ipsum is simply dummy text',
                para: 'Lorem Ipsum is simply dummy text Lorem Ipsum is simply dummy text, Lorem Ipsum is simply dummy text Lorem Ipsum is simply dummy text'
            },
            {
                img: '../img/home/17.jpg',
                heading: 'Lorem Ipsum is simply dummy text',
                para: 'Lorem Ipsum is simply dummy text, Lorem Ipsum is simply dummy text Lorem Ipsum is simply dummy text'
            },
            {
                img: '../img/home/18.jpg',
                heading: 'Lorem Ipsum is simply dummy text',
                para: 'Lorem Ipsum is simply dummy text, Lorem Ipsum is simply dummy text Lorem Ipsum is simply dummy text'
            }
        ];
        $scope.sale = [{
                img: '../img/home/11.jpg',
                price: '3000',
                type: 'Lorem Ipsum is simply dummy text'

            },
            {
                img: '../img/home/12.jpg',
                price: '4000 ',
                type: 'Lorem Ipsum is simply dummy text'

            },
            {
                img: '../img/home/13.jpg',
                price: '5000',
                type: 'Lorem Ipsum is simply dummy text'

            }, {
                img: '../img/home/14.jpg',
                price: '3000',
                type: 'Lorem Ipsum is simply dummy text'

            },
            {
                img: '../img/home/11.jpg',
                price: '4000 ',
                type: 'Lorem Ipsum is simply dummy text'

            },
            {
                img: '../img/home/12.jpg',
                price: '5000',
                type: 'Lorem Ipsum is simply dummy text'

            },
            {
                img: '../img/home/13.jpg',
                price: '4000 ',
                type: 'Lorem Ipsum is simply dummy text'

            },
            {
                img: '../img/home/14.jpg',
                price: '5000',
                type: 'Lorem Ipsum is simply dummy text'

            }
        ];
        //$scope.byTheLook = [{text: '', para: ''},]
    })
    .controller('BuythelookCtrl', function ($scope, TemplateService, NavigationService, $timeout) {
        $scope.template = TemplateService.getHTML("content/buythelook.html");
        TemplateService.title = "Buythelook"; //This is the Title of the Website
        $scope.navigation = NavigationService.getNavigation();

        $scope.buyshirt = [{
                img: 'img/buy/2.jpg',
                rupee: '3,000',
                title: 'LINES FULL SLEEVE SHIRT WITH ROLL UP'
            },
            {
                img: 'img/buy/3.jpg',
                rupee: '3,000',
                title: 'LINES FULL SLEEVE SHIRT WITH ROLL UP'
            },
            {
                img: 'img/buy/4.jpg',
                rupee: '3,000',
                title: 'LINES FULL SLEEVE SHIRT WITH ROLL UP'
            },
            {
                img: 'img/buy/5.jpg',
                rupee: '3,000',
                title: 'LINES FULL SLEEVE SHIRT WITH ROLL UP'
            },
            {
                img: 'img/buy/6.jpg',
                rupee: '3,000',
                title: 'LINES FULL SLEEVE SHIRT WITH ROLL UP'
            },
            {
                img: 'img/buy/7.jpg',
                rupee: '3,000',
                title: 'LINES FULL SLEEVE SHIRT WITH ROLL UP'
            },
            {
                img: 'img/buy/2.jpg',
                rupee: '3,000',
                title: 'LINES FULL SLEEVE SHIRT WITH ROLL UP'
            },
            {
                img: 'img/buy/3.jpg',
                rupee: '3,000',
                title: 'LINES FULL SLEEVE SHIRT WITH ROLL UP'
            },
            {
                img: 'img/buy/4.jpg',
                rupee: '3,000',
                title: 'LINES FULL SLEEVE SHIRT WITH ROLL UP'
            },
            {
                img: 'img/buy/5.jpg',
                rupee: '3,000',
                title: 'LINES FULL SLEEVE SHIRT WITH ROLL UP'
            },
            {
                img: 'img/buy/6.jpg',
                rupee: '3,000',
                title: 'LINES FULL SLEEVE SHIRT WITH ROLL UP'
            },
            {
                img: 'img/buy/7.jpg',
                rupee: '3,000',
                title: 'LINES FULL SLEEVE SHIRT WITH ROLL UP'
            },
            {
                img: 'img/buy/3.jpg',
                rupee: '3,000',
                title: 'LINES FULL SLEEVE SHIRT WITH ROLL UP'
            },
            {
                img: 'img/buy/4.jpg',
                rupee: '3,000',
                title: 'LINES FULL SLEEVE SHIRT WITH ROLL UP'
            },
            {
                img: 'img/buy/5.jpg',
                rupee: '3,000',
                title: 'LINES FULL SLEEVE SHIRT WITH ROLL UP'
            },
            {
                img: 'img/buy/6.jpg',
                rupee: '3,000',
                title: 'LINES FULL SLEEVE SHIRT WITH ROLL UP'
            },
            {
                img: 'img/buy/7.jpg',
                rupee: '3,000',
                title: 'LINES FULL SLEEVE SHIRT WITH ROLL UP'
            },
            {
                img: 'img/buy/5.jpg',
                rupee: '3,000',
                title: 'LINES FULL SLEEVE SHIRT WITH ROLL UP'
            }
        ]
        $scope.myShirt = [];
        $scope.myShirt11 = [];
        $scope.myShirt = _.chunk($scope.buyshirt, 9);
        console.log($scope.myShirt);
        _.each($scope.myShirt, function (n) {
            $scope.myShirt1 = _.chunk(n, 3);
            $scope.myShirt11.push($scope.myShirt1);
        });
        console.log($scope.myShirt11);

        // $scope.trouser = [{
        //         img: '../img/buy/3.jpg',
        //     },
        //     {
        //         img: '../img/buy/4.jpg',
        //     },
        //     {
        //         img: '../img/buy/5.jpg',
        //     },
        // ]
        // $scope.blazer = [{
        //         img: '../img/buy/4.jpg',
        //     },
        //     {
        //         img: '../img/buy/5.jpg',
        //     },
        //     {
        //         img: '../img/buy/6.jpg',
        //     },
        // ]
        // $scope.derbys = [{
        //         img: '../img/buy/5.jpg',
        //     },
        //     {
        //         img: '../img/buy/6.jpg',
        //     },
        //     {
        //         img: '../img/buy/7.jpg',
        //     },
        // ]
        // $scope.belt = [{
        //         img: '../img/buy/6.jpg',
        //     },
        //     {
        //         img: '../img/buy/7.jpg',
        //     },
        //     {
        //         img: '../img/buy/5.jpg',
        //     },
        // ]
        // $scope.glasses = [{
        //         img: '../img/buy/7.jpg',
        //     },
        //     {
        //         img: '../img/buy/6.jpg',
        //     },
        //     {
        //         img: '../img/buy/5.jpg',
        //     },
        // ]
    })


    .controller('CheckoutCtrl', function ($scope, TemplateService, NavigationService, $timeout) {
        $scope.template = TemplateService.getHTML("content/checkout.html");
        TemplateService.title = "Checkout"; //This is the Title of the Website
        $scope.navigation = NavigationService.getNavigation();

        $scope.orderTable = [{
            img: 'img/checkout/item.jpg',
            title1: 'florence prints',
            title2: 'half sleeve shirts',
            color: 'blue',
            size: 'xl',
            quantity: '02',
            subtotal: 'Rs. 2,899'
        }, {
            img: 'img/checkout/item.jpg',
            title1: 'florence prints',
            title2: 'half sleeve shirts',
            color: 'blue',
            size: 'xl',
            quantity: '02',
            subtotal: 'Rs. 2,899'
        }]
    })
    .controller('IndividualPageCtrl', function ($scope, TemplateService, NavigationService, $timeout) {
        $scope.template = TemplateService.getHTML("content/individual-page.html");
        TemplateService.title = "individual-page"; //This is the Title of the Website
        $scope.navigation = NavigationService.getNavigation();
        $scope.formSubmitted = false;
        $scope.oneAtATime = true;
        $scope.submitForm = function (data) {
            console.log(data);
            $scope.formSubmitted = true;
        };
        $scope.featured = [{
                img: '../img/home/11.jpg',
                price: '3000',
                type: 'Lorem Ipsum is simply dummy text'

            },
            {
                img: '../img/home/12.jpg',
                price: '4000 ',
                type: 'Lorem Ipsum is simply dummy text'

            },
            {
                img: '../img/home/13.jpg',
                price: '5000',
                type: 'Lorem Ipsum is simply dummy text'

            }, {
                img: '../img/home/14.jpg',
                price: '3000',
                type: 'Lorem Ipsum is simply dummy text'

            },
            {
                img: '../img/home/11.jpg',
                price: '4000 ',
                type: 'Lorem Ipsum is simply dummy text'

            },
            {
                img: '../img/home/12.jpg',
                price: '5000',
                type: 'Lorem Ipsum is simply dummy text'

            },
            {
                img: '../img/home/13.jpg',
                price: '4000 ',
                type: 'Lorem Ipsum is simply dummy text'

            },
            {
                img: '../img/home/14.jpg',
                price: '5000',
                type: 'Lorem Ipsum is simply dummy text'

            }
        ];
    })
    .controller('MycartCtrl', function ($scope, TemplateService, NavigationService, $timeout, $uibModal) {
        $scope.template = TemplateService.getHTML("content/mycart.html");
        TemplateService.title = "Mycart"; //This is the Title of the Website
        $scope.navigation = NavigationService.getNavigation();

        $scope.mycartTable = [{
            img: 'img/checkout/item.jpg',
            title1: 'FLORENCE PRINTS',
            title2: 'HALF SLEEVE SHIRTS',
            color: 'BLUE',
            size: 'XL',
            quantity: '02',
            subtotal: 'Rs. 2,899'
        }, {
            img: 'img/checkout/item.jpg',
            title1: 'FLORENCE PRINTS',
            title2: 'HALF SLEEVE SHIRTS',
            color: 'BLUE',
            size: 'XL',
            quantity: '02',
            subtotal: 'Rs. 2,899'
        }]
        $scope.mycartmodal = [{
                img: 'img/cart/1.jpg',
                title1: 'WALLET MODERN CORNER ZIP',
                title2: '',
            },
            {
                img: 'img/cart/2.jpg',
                title1: 'WALLET MODERN CORNER ZIP',
                title2: '',
            }, {
                img: 'img/cart/3.jpg',
                title1: 'WALLET MODERN CORNER ZIP',
                title2: '',
            },
            {
                img: 'img/cart/4.jpg',
                title1: 'WALLET MODERN CORNER ZIP',
                title2: '',
            },
            {
                img: 'img/cart/5.jpg',
                title1: 'WALLET MODERN CORNER ZIP',
                title2: '',
            },
            {
                img: 'img/cart/6.jpg',
                title1: 'WALLET MODERN CORNER ZIP',
                title2: '',
            },
            {
                img: 'img/cart/7.jpg',
                title1: 'WALLET MODERN CORNER ZIP',
                title2: '',
            },
            {
                img: 'img/cart/8.jpg',
                title1: 'WALLET MODERN CORNER ZIP',
                title2: '',
            }
        ]
        $scope.newA = _.chunk($scope.mycartmodal, 4);
        console.log("$scope.newA ", $scope.newA);

        $scope.openUpload = function () {
            console.log("clla");
            $uibModal.open({
                animation: true,
                templateUrl: 'views/modal/mycartmodal.html',
                scope: $scope,
                size: 'md',
                // windowClass: 'modal-content-radi0'
            });
        };


    })
    .controller('ListingPageCtrl', function ($scope, TemplateService, NavigationService, $timeout) {
        $scope.template = TemplateService.getHTML("content/listing-page.html");
        TemplateService.title = "Form"; //This is the Title of the Website
        $scope.navigation = NavigationService.getNavigation();
        $scope.formSubmitted = false;
        $scope.submitForm = function (data) {
            console.log(data);
            $scope.formSubmitted = true;
        };
        $scope.slider_translate = {
            minValue: 200,
            maxValue: 1500,
            options: {
                ceil: 7000,
                floor: 100,
                id: 'translate-slider',
                translate: function (value, id, which) {
                    console.info(value, id, which);
                    return '$' + value;
                }
            }
        };
        $scope.buyshirt = [{
                img: 'img/buy/2.jpg',
                rupee: '3,000',
                title: 'LINES FULL SLEEVE SHIRT WITH ROLL UP'
            },
            {
                img: 'img/buy/3.jpg',
                rupee: '3,000',
                title: 'LINES FULL SLEEVE SHIRT WITH ROLL UP'
            },
            {
                img: 'img/buy/4.jpg',
                rupee: '3,000',
                title: 'LINES FULL SLEEVE SHIRT WITH ROLL UP'
            },
            {
                img: 'img/buy/5.jpg',
                rupee: '3,000',
                title: 'LINES FULL SLEEVE SHIRT WITH ROLL UP'
            },
            {
                img: 'img/buy/6.jpg',
                rupee: '3,000',
                title: 'LINES FULL SLEEVE SHIRT WITH ROLL UP'
            },
            {
                img: 'img/buy/7.jpg',
                rupee: '3,000',
                title: 'LINES FULL SLEEVE SHIRT WITH ROLL UP'
            },
            {
                img: 'img/buy/2.jpg',
                rupee: '3,000',
                title: 'LINES FULL SLEEVE SHIRT WITH ROLL UP'
            },
            {
                img: 'img/buy/3.jpg',
                rupee: '3,000',
                title: 'LINES FULL SLEEVE SHIRT WITH ROLL UP'
            },
            {
                img: 'img/buy/4.jpg',
                rupee: '3,000',
                title: 'LINES FULL SLEEVE SHIRT WITH ROLL UP'
            },
            {
                img: 'img/buy/5.jpg',
                rupee: '3,000',
                title: 'LINES FULL SLEEVE SHIRT WITH ROLL UP'
            },
            {
                img: 'img/buy/6.jpg',
                rupee: '3,000',
                title: 'LINES FULL SLEEVE SHIRT WITH ROLL UP'
            },
            {
                img: 'img/buy/7.jpg',
                rupee: '3,000',
                title: 'LINES FULL SLEEVE SHIRT WITH ROLL UP'
            },
            {
                img: 'img/buy/3.jpg',
                rupee: '3,000',
                title: 'LINES FULL SLEEVE SHIRT WITH ROLL UP'
            },
            {
                img: 'img/buy/4.jpg',
                rupee: '3,000',
                title: 'LINES FULL SLEEVE SHIRT WITH ROLL UP'
            },
            {
                img: 'img/buy/5.jpg',
                rupee: '3,000',
                title: 'LINES FULL SLEEVE SHIRT WITH ROLL UP'
            },
            {
                img: 'img/buy/6.jpg',
                rupee: '3,000',
                title: 'LINES FULL SLEEVE SHIRT WITH ROLL UP'
            },
            {
                img: 'img/buy/7.jpg',
                rupee: '3,000',
                title: 'LINES FULL SLEEVE SHIRT WITH ROLL UP'
            },
            {
                img: 'img/buy/5.jpg',
                rupee: '3,000',
                title: 'LINES FULL SLEEVE SHIRT WITH ROLL UP'
            },
            {
                img: 'img/buy/5.jpg',
                rupee: '3,000',
                title: 'LINES FULL SLEEVE SHIRT WITH ROLL UP'
            },
            {
                img: 'img/buy/5.jpg',
                rupee: '3,000',
                title: 'LINES FULL SLEEVE SHIRT WITH ROLL UP'
            },
            {
                img: 'img/buy/5.jpg',
                rupee: '3,000',
                title: 'LINES FULL SLEEVE SHIRT WITH ROLL UP'
            },
            {
                img: 'img/buy/5.jpg',
                rupee: '3,000',
                title: 'LINES FULL SLEEVE SHIRT WITH ROLL UP'
            },
            {
                img: 'img/buy/5.jpg',
                rupee: '3,000',
                title: 'LINES FULL SLEEVE SHIRT WITH ROLL UP'
            },
            {
                img: 'img/buy/5.jpg',
                rupee: '3,000',
                title: 'LINES FULL SLEEVE SHIRT WITH ROLL UP'
            },
            {
                img: 'img/buy/5.jpg',
                rupee: '3,000',
                title: 'LINES FULL SLEEVE SHIRT WITH ROLL UP'
            },
            {
                img: 'img/buy/5.jpg',
                rupee: '3,000',
                title: 'LINES FULL SLEEVE SHIRT WITH ROLL UP'
            },
            {
                img: 'img/buy/5.jpg',
                rupee: '3,000',
                title: 'LINES FULL SLEEVE SHIRT WITH ROLL UP'
            },
            {
                img: 'img/buy/5.jpg',
                rupee: '3,000',
                title: 'LINES FULL SLEEVE SHIRT WITH ROLL UP'
            },
            {
                img: 'img/buy/5.jpg',
                rupee: '3,000',
                title: 'LINES FULL SLEEVE SHIRT WITH ROLL UP'
            },
            {
                img: 'img/buy/5.jpg',
                rupee: '3,000',
                title: 'LINES FULL SLEEVE SHIRT WITH ROLL UP'
            },
            {
                img: 'img/buy/5.jpg',
                rupee: '3,000',
                title: 'LINES FULL SLEEVE SHIRT WITH ROLL UP'
            },
            {
                img: 'img/buy/5.jpg',
                rupee: '3,000',
                title: 'LINES FULL SLEEVE SHIRT WITH ROLL UP'
            },
            {
                img: 'img/buy/5.jpg',
                rupee: '3,000',
                title: 'LINES FULL SLEEVE SHIRT WITH ROLL UP'
            },
            {
                img: 'img/buy/5.jpg',
                rupee: '3,000',
                title: 'LINES FULL SLEEVE SHIRT WITH ROLL UP'
            },
            {
                img: 'img/buy/5.jpg',
                rupee: '3,000',
                title: 'LINES FULL SLEEVE SHIRT WITH ROLL UP'
            }
        ]
        $scope.myShirt = [];
        $scope.myShirt11 = [];
        $scope.myShirt = _.chunk($scope.buyshirt, 9);
        console.log($scope.myShirt);
        _.each($scope.myShirt, function (n) {
            $scope.myShirt1 = _.chunk(n, 3);
            $scope.myShirt11.push($scope.myShirt1);
        });
        console.log($scope.myShirt11);
    })
    .controller('FormCtrl', function ($scope, TemplateService, NavigationService, $timeout) {
        $scope.template = TemplateService.getHTML("content/form.html");
        TemplateService.title = "Form"; //This is the Title of the Website
        $scope.navigation = NavigationService.getNavigation();
        $scope.formSubmitted = false;
        $scope.submitForm = function (data) {
            console.log(data);
            $scope.formSubmitted = true;
        };
    })

    //Example API Controller
    .controller('DemoAPICtrl', function ($scope, TemplateService, apiService, NavigationService, $timeout) {
        apiService.getDemo($scope.formData, function (data) {
            console.log(data);
        });
    });