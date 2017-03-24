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
                para: 'Lorem Ipsum is simply dummy text Lorem Ipsum is simply dummy text'
            },
            {
                img: '../img/home/17.jpg',
                heading: 'Lorem Ipsum is simply dummy text',
                para: 'Lorem Ipsum is simply dummy text'
            },
            {
                img: '../img/home/18.jpg',
                heading: 'Lorem Ipsum is simply dummy text',
                para: 'Lorem Ipsum is simply dummy text'
            }, {
                img: '../img/home/16.jpg',
                heading: 'Lorem Ipsum is simply dummy text',
                para: 'Lorem Ipsum is simply dummy text Lorem Ipsum is simply dummy text'
            },
            {
                img: '../img/home/17.jpg',
                heading: 'Lorem Ipsum is simply dummy text',
                para: 'Lorem Ipsum is simply dummy text'
            },
            {
                img: '../img/home/18.jpg',
                heading: 'Lorem Ipsum is simply dummy text',
                para: 'Lorem Ipsum is simply dummy text'
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
    .controller('MycartCtrl', function ($scope, TemplateService, NavigationService, $timeout) {
        $scope.template = TemplateService.getHTML("content/mycart.html");
        TemplateService.title = "Mycart"; //This is the Title of the Website
        $scope.navigation = NavigationService.getNavigation();

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