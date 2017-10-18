 myApp.controller('MycartCtrl', function ($scope, myService, ModalService, $state, toastr, TemplateService, NavigationService, BannerService, CartService, $timeout, $uibModal, WishlistService) {
     $scope.template = TemplateService.getHTML("content/mycart.html");
     TemplateService.title = "Mycart"; //This is the Title of the Website
     $scope.navigation = NavigationService.getNavigation();
     myService.ctrlBanners("mycart", function (data) {
         console.log("called api");
         $scope.banner = data;
         console.log("$scope.banner", $scope.banner)

     });


     $scope.newA = _.chunk($scope.mycartmodal, 4);
     // console.log("$scope.newA ", $scope.newA);
     var userId = {
         userId: $.jStorage.get("userId")
     };

     //avinash functions start
$scope.applicableDiscounts = function (data) {
    // console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
       myService.applicableDiscounts($scope.productArrayForDiscount, function (data) {
        //    console.log("called api applicableDiscounts");
           $scope.applicableDiscounts = data;
           console.log("$scope.applicableDiscounts", $scope.applicableDiscounts)

       });
}

$scope.radioSubmit = function (data) {
    console.log("inside radioSubmit",data);
    // console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
    //    myService.applicableDiscounts($scope.productArrayForDiscount, function (data) {
    //     //    console.log("called api applicableDiscounts");
    //        $scope.applicableDiscounts = data;
    //        console.log("$scope.applicableDiscounts", $scope.applicableDiscounts)

    //    });
}

//avinash functions end

     $scope.productArrayForDiscount=[];
     if (userId.userId != null) {
         CartService.getCart(userId, function (data) {
             console.log("getcart->data: ", data);
             //TODO: Instead of array this will be single doc when query changes to findOneAndUpdate
             $scope.mycartTable = data.data.data;
             if ($scope.mycartTable == undefined) {
                 toastr.error("add product to cart", "Error:")
                 $state.go("home");
             }
             _.forEach($scope.mycartTable.products, function (value) {
             console.log("else-",value.product);
             $scope.productArrayForDiscount.push(value.product._id);

         });
         $scope.applicableDiscounts($scope.productArrayForDiscount);
             console.log("mycarttableof if: ", $scope.mycartTable);
             //TODO: Calculate actual grand total
             if ($scope.mycartTable)
                 $scope.grandTotal = $scope.total = CartService.getTotal($scope.mycartTable.products);
         });
     } else {
         $scope.mycartTable = $.jStorage.get("cart");
         //_.each for single product
         _.forEach($scope.mycartTable.products, function (value) {
             console.log("else-",value.product);
             $scope.productArrayForDiscount.push(value.product._id);

         });
         console.log("$scope.productArrayForDiscount=-=-=-=-=-=-",$scope.productArrayForDiscount);
         $scope.applicableDiscounts($scope.productArrayForDiscount);
         if ($scope.mycartTable) {
             $scope.grandTotal = $scope.total = CartService.getTotal($scope.mycartTable.products);
         }
         console.log("else ran:::", $scope.grandTotal);
     }



     // $scope.mycartTable = {};
     $scope.updateQuantity = function (index, count) {
         // if (ProductService.isProductAvailable(count, $scope.mycartTable.products[index])) {
         $scope.mycartTable.products[index].quantity += count;
         if ($scope.mycartTable.products[index].quantity <= 0)
             $scope.mycartTable.products[index].quantity = 0;
         //TODO: Handle update cart error
         CartService.updateCartQuantity($scope.mycartTable);
         //TODO: Calculate actual grand total
         $scope.grandTotal = $scope.total = CartService.getTotal($scope.mycartTable.products);
         // }
     }
     console.log("oflinecartinmycartcontroller::::::", $.jStorage.get("cart"))

     $scope.removeProductFromCart = function (cartId, productId) {
         console.log("Removing product: ", productId);
         if (userId.userId) {
             var data = {
                 cartId: cartId,
                 productId: productId
             }
             CartService.removeProduct(data, function (data) {
                 $scope.mycartTable = data.data.data;
                 $state.reload("mycart");
             });
         } else {
             $scope.cart = $.jStorage.get('cart').products;
             var idx = _.findIndex($scope.cart, function (product) {
                 return product.product._id == productId;
             });
             console.log("Removing product at index: ", idx);
             // remove this product
             $scope.cart.splice(idx, 1);
             var cart = {};
             cart.products = $scope.cart;
             $.jStorage.set('cart', cart);
             $state.reload();
         }
     }
     $scope.addToWishlist = function (prod) {
         myService.addToWishlist(prod, function (data) {

             ModalService.addwishlist();
         })
     }
     $scope.flag = 0;
     $scope.checkStockStatus = function (prod) {
         if (prod.quantity > prod.product.quantity) {
             $scope.flag++;
             angular.element(document.getElementsByClassName('checkout--btn'))[0].disabled = true;
             return "disabled-outofstock";

         } else {
             return "";
         }

     }

     $scope.openCoupon = function () {
         var Couponmodal = $uibModal.open({
             animation: true,
             templateUrl: 'views/modal/Coupon.html',
             size: 'md',
             scope: $scope,
             controller: 'MycartCtrl'
         });
     }




 })