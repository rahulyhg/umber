myApp.directive('img', function ($compile, $parse) {
        return {
            restrict: 'E',
            replace: false,
            link: function ($scope, element, attrs) {
                var $element = $(element);
                if (!attrs.noloading) {
                    $element.after("<img src='img/loading.gif' class='loading' />");
                    var $loading = $element.next(".loading");
                    $element.load(function () {
                        $loading.remove();
                        $(this).addClass("doneLoading");
                    });
                } else {
                    $($element).addClass("doneLoading");
                }
            }
        };
    })

    .directive('hideOnScroll', function ($document) {
        return {
            restrict: 'EA',
            replace: false,
            link: function (scope, element, attr) {
                var $element = $(element);
                var lastScrollTop = 0;
                $(window).scroll(function (event) {
                    var st = $(this).scrollTop();
                    if (st > lastScrollTop) {
                        $(element).addClass('nav-up');
                    } else {
                        $(element).removeClass('nav-up');
                    }
                    lastScrollTop = st;
                });
            }
        };
    })


    .directive('fancybox', function ($document) {
        return {
            restrict: 'EA',
            replace: false,
            link: function (scope, element, attr) {
                var $element = $(element);
                var target;
                if (attr.rel) {
                    target = $("[rel='" + attr.rel + "']");
                } else {
                    target = element;
                }

                target.fancybox({
                    openEffect: 'fade',
                    closeEffect: 'fade',
                    closeBtn: true,
                    padding: 0,
                    helpers: {
                        media: {}
                    }
                });
            }
        };
    })

    .directive('autoHeight', function ($compile, $parse) {
        return {
            restrict: 'EA',
            replace: false,
            link: function ($scope, element, attrs) {
                var $element = $(element);
                var windowHeight = $(window).height();
                $element.css("min-height", windowHeight);
            }
        };
    })

    .directive('ngElevateZoom', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {

                //Will watch for changes on the attribute
                attrs.$observe('zoomImage', function () {
                    linkElevateZoom();
                })


                function linkElevateZoom() {
                    //Check if its not empty
                    if (!attrs.zoomImage) return;
                    element.attr('data-zoom-image', attrs.zoomImage);
                    $(element).elevateZoom();
                }

                linkElevateZoom();

            }

        };
    })

    .directive('replace', function () {
        return {
            require: 'ngModel',
            scope: {
                regex: '@replace',
                with: '@with'
            },
            link: function (scope, element, attrs, model) {
                model.$parsers.push(function (val) {
                    if (!val) {
                        return;
                    }
                    var regex = new RegExp(scope.regex);
                    var replaced = val.replace(regex, scope.with);
                    if (replaced !== val) {
                        model.$setViewValue(replaced);
                        model.$render();
                    }
                    return replaced;
                });
            }
        };
    })



    // elevateZoom

    .directive('elevateZoom', function ($document, $filter) {
        return {
            restrict: 'EA',
            link: function ($scope, element, attr) {
                $scope.$watch(attr.image, function () {
                    $scope.changeImage = function () {
                        console.log($scope[attr.image]);
                        var $element = $(element);
                        var image = $scope[attr.image].image;
                        console.log(image);
                        // image = image.productdetail.image[0];
                        var smallimg = attr.smallImage;
                        var bigimg = attr.bigImage;
                        // $element.attr('data-zoom-image', image);
                        // $element.attr('src', image);
                        var ez = $element.data("elevateZoom");
                        if (!ez) {
                            $element.attr('data-zoom-image', $filter('serverimage')(image));
                            $element.attr('src', $filter('serverimage')(image));
                            $element.elevateZoom();
                        } else {
                            var newImage = $filter('serverimage')(image);
                            var smallImage = $filter('serverimage')(image);
                            ez.swaptheimage(smallImage, newImage);
                        }
                    }
                    $scope.$on('changeImage', function (event, data) {
                        $scope.changeImage();
                    });
                    $scope.changeImage();
                })
            }
        }
    })
    .directive('zoomContainer', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                scope.$on('$stateChangeSuccess', function () {
                    var target = element.children('div.zoomContainer').remove();
                })
            }
        }

    });