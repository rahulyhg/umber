myApp.controller('IndividualPageCtrl', function ($scope, $rootScope, $http, $stateParams, $state, $uibModal, UserService, WishlistService,
    TemplateService, NavigationService, ProductService, CartService, $timeout, myService, ModalService) {
    $scope.template = TemplateService.getHTML("content/individual-page.html");
    TemplateService.title = "individual-page"; //This is the Title of the Website
    $scope.navigation = NavigationService.getNavigation();
    $scope.formSubmitted = false;
    $scope.oneAtATime = true;
    $scope.reqQuantity = 1;
    $scope.productComment = {};
    $scope.productComment.name = null;
    $scope.submitForm = function (data) {
        console.log(data);
        $scope.formSubmitted = true;
    };
    $scope.updateQuantity = function (oper) {
        $scope.reqQuantity += parseInt(oper);
    }
    $scope.loggedUser = $.jStorage.get("userId");
    var data = {
        productId: $stateParams.id
    };
    ProductService.getProductDetails(data, function (data) {

        if (data.data.value) {
            $scope.product = data.data.data;
            $scope.productImages = _.sortBy($scope.product.images, ['order']);
            $scope.selectedImage = _.sortBy($scope.product.images, ['order'])[0];
            $scope.sizes = $scope.product.sizes;

            $scope.selectedSize = $scope.sizes[0];
            $scope.activeButton = $scope.selectedSize.name;
        } else {
            console.log(data.data.error);
            $scope.product = {};
        }
    });

    $scope.addToWishlist = function (prod) {
        var data = {
            "product": $scope.product,
        }
        myService.addToWishlist(data, function (data) {
            ModalService.addwishlist();
        })
    }

    $scope.selectSize = function (sizeObj) {
        console.log(sizeObj)
        $scope.activeButton = sizeObj.name;
        $scope.selectedSize = sizeObj;
        var data = {
            productId: $scope.product.productId,
            size: sizeObj._id,
            color: $scope.product.color._id
        }
        console.log("SKUdetails:", data)
        ProductService.getSKUWithParameter(data, function (data) {
            console.log("SKU:", data)
            if (data.data.value) {
                $scope.product = data.data.data;
                $scope.productImages = _.sortBy($scope.product.images, ['order']);
                $scope.selectedImage = _.sortBy($scope.product.images, ['order'])[0];
            } else {

                // TODO: show out of stock
            }
        })
    }
    $scope.addToCart = function (pc) {
        console.log("product", $scope.product)
        myService.addToCart($scope.product, $scope.reqQuantity, $scope.selectedSize, $scope.productComment.name, function (data) {
            ModalService.addcart();

        })
    }

    $scope.setQuantity = function (quantity) {

        if ($scope.product.quantity >= quantity) {
            angular.element(document.getElementsByClassName('btn-add'))[0].disabled = false;
            $scope.reqQuantity = quantity;
        } else {
            angular.element(document.getElementsByClassName('btn-add'))[0].disabled = true;
            $scope.reqQuantity = quantity;
        }
    }
    $rootScope.checkStateOnReload = function (prodid) {
        var cp = $.jStorage.get("compareproduct")
        var result = _.find(cp, {
            productId: prodid
        });
        if (result) {
            return true;
        } else {
            return false;
        }
    }


    $scope.changeImage = function (index) {
        $scope.selectedImage = $scope.product.images[index];
    };

    //To close compare-section modal
    $scope.compareProduct = false; // For toggle sidenavigation
    $scope.compareProductModal = function () {
        if (!$scope.compareProduct) {
            $('.compare-product-main').removeClass('compareProductMenuIn');
            $('.compare-product-main').addClass('compareProductMenuOut');

            // $compareProduct = true;
        }

    };

    $scope.myVarss = false;
    $scope.compareproduct = $.jStorage.get('compareproduct')
    if (!_.isEmpty($scope.compareproduct)) {
        $scope.myVarss = true;
    }
    $rootScope.checkStateOnReload = function (prodid) {
        var cp = $.jStorage.get("compareproduct")
        var result = _.find(cp, {
            productId: prodid
        });
        if (result) {
            return true;
        } else {
            return false;
        }
    }
    $rootScope.clickfun = function (product) {
        console.log(product)
        $scope.compareproduct = $.jStorage.get('compareproduct') ? $.jStorage.get('compareproduct') : [];
        var result = _.find($scope.compareproduct, {
            productId: product.productId
        });
        if (result) {
            _.remove($scope.compareproduct, {
                productId: product.productId
            });
            $.jStorage.set('compareproduct', $scope.compareproduct);
        } else if ($.jStorage.get("compareproduct").length >= 4) {
            toastr.error("You can compare only 4 products");
        } else {
            $scope.compareproduct.push(product);
            $.jStorage.set('compareproduct', $scope.compareproduct);
            console.log($.jStorage.get('compareproduct'))
        }

        if (_.isEmpty($.jStorage.get('compareproduct'))) {
            $scope.myVarss = false

        } else {
            $scope.myVarss = true
        }
    }

    $scope.removeFromCompare = function (prodId) {

        var removeCompare = $.jStorage.get("compareproduct");
        var result = _.remove(removeCompare, {
            productId: prodId
        });

        $.jStorage.set("compareproduct", removeCompare);
        $state.reload();
    }

})