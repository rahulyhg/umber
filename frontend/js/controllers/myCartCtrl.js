 myApp.controller('MycartCtrl', function ($scope, myService, ModalService, $state, toastr, TemplateService, NavigationService, BannerService, CartService, $timeout, $uibModal, WishlistService) {
     $scope.template = TemplateService.getHTML("content/mycart.html");
     TemplateService.title = "Mycart"; //This is the Title of the Website
     $scope.navigation = NavigationService.getNavigation();
     myService.ctrlBanners("mycart", function (data) {
         console.log("called api");
         $scope.banner = data;
         console.log("$scope.banner", $scope.banner)

     });

     $scope.grandTotalAfterDiscount = 0;

     //  $scope.discountValue={
     //      id:"demo"
     //  };

     $scope.newA = _.chunk($scope.mycartmodal, 4);
     // console.log("$scope.newA ", $scope.newA);
     var userId = {
         userId: $.jStorage.get("userId")
     };

     //avinash functions start
     $scope.applicableDiscounts = function (data,grandTotal) {
         // console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
         myService.applicableDiscounts($scope.productArrayForDiscount,grandTotal, function (data) {
             //    console.log("called api applicableDiscounts");
             $scope.applicableDiscounts = data;
             console.log("$scope.applicableDiscounts", $scope.applicableDiscounts)

         });
     }
     $scope.discountSelected = {};
     $scope.radioSubmit = function (data) {
         console.log("inside radioSubmit ************", data);
         $scope.discountSelected = data;
     }

     var isEmptyObject = function (obj) {
         for (var prop in obj) {
             if (obj.hasOwnProperty(prop))
                 return false;
         }

         return JSON.stringify(obj) === JSON.stringify({});
     }
     $scope.applyCouponSubmit = function () {
         if (!isEmptyObject($scope.discountSelected)) {
             console.log("$scope.discountSelected in applyCouponSubmit", $scope.discountSelected.discountType);
             var discountObject = $scope.discountSelected;
             if ($scope.discountSelected.discountType == "59d329e334d0832185b7f577a") {
                 // console.log("ifffff",$scope.discountSelected);
                 // console.log("Full discountObject",discountObject);
             } else if ($scope.discountSelected.discountType == "59d329e334d0832185b7f577") {
                 //  console.log("elseeeeee iffffffff", $scope.discountSelected);
                 //  console.log("$scope.mycartTable", $scope.mycartTable.products);
                 // var formData={
                 //     productIds:$scope.productArrayForDiscount,
                 //     discount
                 // }
                 myService.getAllProductsByDiscount($scope.discountSelected._id, function (data) {
                     console.log("called api getAllProductsByDiscount", data.products);
                     var totalCountProductsInB1GXOff = 0;
                     _.each(data.products, function (product) {
                         _.each($scope.mycartTable.products, function (cartProduct) {
                             if (product._id == cartProduct.product._id) {
                                 totalCountProductsInB1GXOff = totalCountProductsInB1GXOff + cartProduct.quantity;
                             }
                         });
                         //  console.log("totalCountProductsInB1GXOff", totalCountProductsInB1GXOff);

                         //    _.find($scope.mycartTable.products, function(cartProduct) 
                         //    {

                         //     //    return o.age < 40; 
                         //    });
                     });
                     if (totalCountProductsInB1GXOff > 1) {
                         console.log("$scope.grandTotal Before 1", $scope.grandTotal);

                         if ($scope.mycartTable) {
                             $scope.grandTotal = $scope.total = CartService.getTotal($scope.mycartTable.products);
                             //  $.jStorage.set("grandTotal", $scope.grandTotal);
                         }

                         $scope.grandTotal = $scope.grandTotal - $scope.discountSelected.maxDiscountAmount;
                         $scope.grandTotalAfterDiscount = $scope.discountSelected.maxDiscountAmount;
                         //  $scope.$watch('grandTotal', function (newValue, oldValue) {
                         //      $scope.$digest();
                         //  });
                         //  $scope.discount="400";
                         console.log("$scope.grandTotal after 1", $scope.grandTotal);
                         $scope.Couponmodal.close();

                     } else if (totalCountProductsInB1GXOff == 1) {
                         console.log("$scope.grandTotal before 2", $scope.grandTotal);
                         if ($scope.mycartTable) {
                             $scope.grandTotal = $scope.total = CartService.getTotal($scope.mycartTable.products);
                             //  $.jStorage.set("grandTotal", $scope.grandTotal);
                         }
                         $scope.grandTotal = $scope.grandTotal - $scope.discountSelected.xValue;
                         $scope.grandTotalAfterDiscount = $scope.discountSelected.xValue;
                         console.log("$scope.grandTotal after 2", $scope.grandTotal);

                         $scope.Couponmodal.close();
                     } else {
                         $scope.grandTotal = 0;
                         $scope.grandTotalAfterDiscount = 0;
                         $scope.Couponmodal.close();

                     }
                     // $scope.$apply();

                     //    $scope.applicableDiscounts = data;
                     //    console.log("$scope.applicableDiscounts", $scope.applicableDiscounts)

                 });
             } else if ($scope.discountSelected.discountType == "59ede2fcd30c7e2ab3324ece") {
                 if ($scope.mycartTable) {
                     $scope.grandTotal = $scope.total = CartService.getTotal($scope.mycartTable.products);
                     //  $.jStorage.set("grandTotal", $scope.grandTotal);
                 }
                 if($scope.grandTotal>=$scope.discountSelected.yValue){
                    $scope.grandTotal = $scope.grandTotal - $scope.discountSelected.xValue;
                    $scope.grandTotalAfterDiscount = $scope.discountSelected.xValue;
                    $scope.Couponmodal.close();
                 }else{
                       alert("Your Cart Total Low to Avail This Discount!!! Shop More to Get This Discount...");
                }
             }

         } else {
             console.log("in else");
         }
     }
     //avinash functions end

     $scope.productArrayForDiscount = [];
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
                 console.log("else-", value.product);
                 $scope.productArrayForDiscount.push(value.product._id);

             });
            //  $scope.applicableDiscounts($scope.productArrayForDiscount);
             console.log("mycarttableof if: ", $scope.mycartTable);
             //TODO: Calculate actual grand total
             if ($scope.mycartTable) {
                 $scope.grandTotal = $scope.total = CartService.getTotal($scope.mycartTable.products);
                 //  $.jStorage.set("grandTotal", $scope.grandTotal);
                $scope.applicableDiscounts($scope.productArrayForDiscount,$scope.grandTotal);
             }

         });
     } else {
         $scope.mycartTable = $.jStorage.get("cart");
         //_.each for single product
         _.forEach($scope.mycartTable.products, function (value) {
             console.log("else-", value.product);
             $scope.productArrayForDiscount.push(value.product._id);

         });
         console.log("$scope.productArrayForDiscount=-=-=-=-=-=-", $scope.productArrayForDiscount);
         if ($scope.mycartTable) {
             $scope.grandTotal = $scope.total = CartService.getTotal($scope.mycartTable.products);
             //  $.jStorage.set("grandTotal", $scope.grandTotal);
            $scope.applicableDiscounts($scope.productArrayForDiscount,$scope.grandTotal);
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
         $scope.applyCouponSubmit();
        //  $scope.grandTotal=$scope.grandTotal-$scope.grandTotalAfterDiscount;
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
         $scope.Couponmodal = $uibModal.open({
             animation: true,
             templateUrl: 'views/modal/Coupon.html',
             size: 'md',
             scope: $scope
         });
     }




 })