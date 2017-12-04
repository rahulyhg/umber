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
     $scope.applicableDiscounts = function (data, grandTotal) {
         //  console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", $scope.productArrayForDiscount, "BB", grandTotal);
         myService.applicableDiscounts($scope.productArrayForDiscount, grandTotal, function (data) {
             //  console.log("called api applicableDiscounts");
             $scope.applicableDiscountsAll = data;
             console.log("$scope.applicableDiscounts", $scope.applicableDiscountsAll)

         });
     }
     $scope.discountSelected = {};
     $scope.discountValue = "";
     $scope.radioSubmit = function (data) {


         $scope.discountSelected = data;
         $scope.discountValue123 = $scope.discountSelected._id;
         $scope.visibleRadio = true;
         //  _.each($scope.applicableDiscounts, function (n) {
         //      if (n._id == data._id) {

         //          $scope.discountValue123 = false;
         //      }
         //  })
         console.log("$scope.discountValue", $scope.discountValue);
     }
     $scope.checkbox = function (ind) {
         $scope.selectedOffer = ind;
         if ($scope.applicableDiscountsAll[ind].checked) {
             $scope.visible = true;
         } else {
             $scope.visible = false;
         }
     }

     var isEmptyObject = function (obj) {
         for (var prop in obj) {
             if (obj.hasOwnProperty(prop))
                 return false;
         }

         return JSON.stringify(obj) === JSON.stringify({});
     }
     //getDiscount function
     $scope.couponCode = "";
     $scope.getDiscount = function (couponCode) {
         // var cartSubTotal =
         $scope.couponCode = couponCode;
         if (couponCode) {
             $scope.discount = {};
             $scope.discount = couponCode;
             $scope.discount.subTotal = $scope.cartSubTotal;
             $scope.butActive = true;
             NavigationService.apiCallWithData("NormalCoupon/getDiscount", $scope.discount, function (data) {
                 $scope.perDiscount = {};
                 if (data.value) {
                     if (data.data == "coupon has expired") {
                         $scope.perDiscount = 000;
                         $scope.errMessage = "Coupon Code has Expired!!!!";
                     } else {
                         $scope.subTotal = data.data.discount;
                         $scope.perDiscount = data.data.perDiscount;
                         $.jStorage.set('subTotal', $scope.subTotal);
                         $scope.errMessage = "";
                     }
                 } else {
                     $scope.errMessage = "Please Enter valid Coupon Code";
                     $scope.butActive = true;
                     $scope.perDiscount = 000;
                 }
             })
         } else {
             console.log("in else of NormalCoupon");
         }

     }


     $scope.applyCouponSubmit = function (couponName) {
         //  console.log("applyCouponSubmit", couponName)
         if (couponName) {
             NavigationService.getCoupon(couponName, function (couponData) {
                 console.log("applyCouponSubmit getCoupon", couponData)
                 if (couponData.data.data == "Coupon Invalid") {
                     console.log("in invalid");
                     $scope.errMessage = "Coupon Invalid!!!!";
                 } else if (couponData.data.data == "coupon already Used") {
                     console.log("alredy used");
                     $scope.errMessage = "coupon already Used!!!!";
                 } else if (couponData.data.data == "coupon has expired") {
                     console.log("expired");
                     $scope.errMessage = "coupon has expired!!!!";
                 } else {
                     $scope.validCoupon = couponData.data.data;
                     if ($scope.mycartTable) {
                         console.log("$scope.mycartTable", $scope.mycartTable);
                         $scope.grandTotal = $scope.total = CartService.getTotal($scope.mycartTable.products);
                         $scope.grandTotalAfterDiscount = 0;
                         if ($scope.validCoupon.cAmount) {
                             $scope.grandTotalAfterDiscount = $scope.validCoupon.cAmount;
                             $scope.grandTotal = $scope.total - $scope.grandTotalAfterDiscount;
                         } else {
                             //  console.log("Percentage@@@@@@", $scope.total);
                             var disPercentage = $scope.validCoupon.percentage / 100;
                             $scope.grandTotalAfterDiscount = $scope.total * ($scope.validCoupon.percentage) / 100;
                             if ($scope.grandTotalAfterDiscount > $scope.validCoupon.maxAmount) {
                                 $scope.grandTotalAfterDiscount = $scope.validCoupon.maxAmount;
                             }
                             $scope.grandTotal = $scope.total - $scope.grandTotalAfterDiscount;
                         }
                         $scope.discountValueObject = {
                             discountAmount: $scope.grandTotalAfterDiscount,
                             grandTotalAfterDiscount: $scope.grandTotal,
                             selectedDiscount: null,
                             totalAmountOfOrder: $scope.total,
                             coupon: $scope.validCoupon
                         }
                         $.jStorage.set("discountValues", $scope.discountValueObject);
                     }

                     $scope.Couponmodal.close();
                 }
             })
         } else {
             if (!isEmptyObject($scope.discountSelected)) {

                 console.log("$scope.discountSelected in applyCouponSubmit", $scope.discountSelected.discountType);
                 var discountObject = $scope.discountSelected;
                 discountCouponAmount = $scope.discountSelected.xValue;
                 if ($scope.discountSelected.maxAmount) {
                     $scope.discountCouponMaxAmount = $scope.discountSelected.maxAmount;
                 }
                 if ($scope.discountSelected.discountType == "59f06bc7647252477439a1e4") {
                     $.jStorage.deleteKey("coupon");
                     $.jStorage.deleteKey("gifts");
                     if ($scope.mycartTable) {
                         $scope.grandTotal = $scope.total = CartService.getTotal($scope.mycartTable.products);
                         $scope.grandTotalAfterDiscount = 0;
                         //  $.jStorage.set("grandTotal", $scope.grandTotal);
                     }

                     if ($scope.grandTotal >= $scope.discountSelected.yValue) {
                         //if jstorage.user then userid from jstorage 
                         var timestamp = Date.now();
                         var couponCode = "BU" + timestamp;
                         console.log("timestamp", couponCode);
                         if ($.jStorage.get("userId")) {
                             var userId = $.jStorage.get("userId");
                             var couponObj = {
                                 name: couponCode,
                                 couponType: "Discount",
                                 valueType: "Amount",
                                 user: userId,
                                 generatedOrderId: "",
                                 usedOrderId: "",
                                 cAmount: $scope.discountCouponMaxAmount,
                                 status: "unUsed",
                                 isActive: "True"
                             };
                         } else {

                             var couponObj = {
                                 name: couponCode,
                                 couponType: "Discount",
                                 valueType: "Amount",
                                 user: "",
                                 generatedOrderId: "",
                                 usedOrderId: "",
                                 cAmount: $scope.discountCouponMaxAmount,
                                 status: "unUsed",
                                 isActive: "True"
                             };
                         }
                         console.log(couponObj, "couponObj");
                         $.jStorage.set("coupon", couponObj);
                         var jStorageData = $.jStorage.get("coupon");
                         console.log("jStorageData", jStorageData);


                         $scope.discountValueObject = {
                             discountAmount: $scope.grandTotalAfterDiscount,
                             grandTotalAfterDiscount: $scope.grandTotal,
                             selectedDiscount: $scope.discountSelected,
                             totalAmountOfOrder: $scope.total
                         }
                         console.log("$scope.discountValueObject", $scope.discountValueObject);
                         $.jStorage.set("discountValues", $scope.discountValueObject);


                         //  myService.addCouponByUserFromCart(couponObj, function (data) {
                         //  console.log("called api addCouponByUserFromCart", data);
                         //  //send mail to user with coupon code
                         // //  var totalCountProductsInB1GXOff = 0;

                         //  $scope.Couponmodal.close();
                         // });
                         $scope.Couponmodal.close();
                         //  $scope.grandTotal = $scope.grandTotal - $scope.discountSelected.xValue;
                         //  $scope.grandTotalAfterDiscount = $scope.discountSelected.xValue;
                     } else {
                         $scope.Couponmodal.close();
                         $scope.discountSelected = {};
                         alert("Your Cart Total Low to Avail This Discount!!! Shop More to Get This Discount...");
                     }

                 } else if ($scope.discountSelected.discountType == "59d329e334d0832185b7f577") {
                     console.log("Buy 1 Get x Off Buy 2 Get 2x Off", $scope.discountSelected);
                     //for Buy 1 Get x Off Buy 2 Get 2x Off
                     $.jStorage.deleteKey("coupon");
                     $.jStorage.deleteKey("gifts");
                     myService.getAllProductsByDiscount($scope.discountSelected._id, function (data) {
                         console.log("called api getAllProductsByDiscount", data.products);
                         var totalCountProductsInB1GXOff = 0;
                         var totalAmountOfCountProductsInB1GXOff = 0;
                         var discountProducts = data.products;
                         var priceOfTwo = 0;
                         var firstTwoProductsAmountSum;
                         var iterationNumber = 0;
                         var totalPriceAdded = 0;
                         var sortedArray = discountProducts.sort(function (a, b) {
                             console.log("a", a, "b", b);
                             return a.price > b.price ? -1 : a.price < b.price ? 1 : 0
                         })
                         console.log("sortedArray", sortedArray);

                         _.each(sortedArray, function (product) {
                             _.each($scope.mycartTable.products, function (cartProduct) {
                                 if (product._id == cartProduct.product._id) {
                                     iterationNumber = iterationNumber + 1;
                                     totalCountProductsInB1GXOff = totalCountProductsInB1GXOff + cartProduct.quantity;
                                     console.log("totalCountProductsInB1GXOff", totalCountProductsInB1GXOff);
                                     var productPriceBeforeQuantityMultiplication = cartProduct.product.price;
                                     //  totalAmountOfCountProductsInB1GXOff = totalAmountOfCountProductsInB1GXOff + (cartProduct.quantity * cartProduct.product.price);
                                     var firstTwoProductsAmountSum = productPriceBeforeQuantityMultiplication;

                                     if (iterationNumber == 1) {
                                         if (cartProduct.quantity > 0 && cartProduct.quantity <= 2) {
                                             totalAmountOfCountProductsInB1GXOff = totalAmountOfCountProductsInB1GXOff + (cartProduct.quantity * cartProduct.product.price);
                                             totalPriceAdded = cartProduct.quantity;
                                             priceOfTwo = totalAmountOfCountProductsInB1GXOff;
                                         } else if (cartProduct.quantity > 2) {
                                             priceOfTwo = totalAmountOfCountProductsInB1GXOff + (2 * cartProduct.product.price);
                                             totalPriceAdded = 2;
                                             totalAmountOfCountProductsInB1GXOff = totalAmountOfCountProductsInB1GXOff + (cartProduct.quantity * cartProduct.product.price);
                                         }
                                     } else if (iterationNumber == 2 && totalPriceAdded < 2) {
                                         if (cartProduct.quantity > 0 && cartProduct.quantity <= 1) {
                                             totalAmountOfCountProductsInB1GXOff = totalAmountOfCountProductsInB1GXOff + (cartProduct.quantity * cartProduct.product.price);
                                             totalPriceAdded = cartProduct.quantity;
                                             priceOfTwo = totalAmountOfCountProductsInB1GXOff;
                                         } else if (cartProduct.quantity > 1) {
                                             priceOfTwo = totalAmountOfCountProductsInB1GXOff + (1 * cartProduct.product.price);
                                             totalAmountOfCountProductsInB1GXOff = totalAmountOfCountProductsInB1GXOff + (cartProduct.quantity * cartProduct.product.price);
                                             totalPriceAdded = 2;
                                         }
                                     } else {
                                         totalAmountOfCountProductsInB1GXOff = totalAmountOfCountProductsInB1GXOff + (cartProduct.quantity * cartProduct.product.price);
                                     }


                                     //  if(cartProduct.quantity>=2 && totalCountProductsInB1GXOff>0){
                                     //     var firstTwoProductsAmountSum=cartProduct.product.price*(2-(totalCountProductsInB1GXOff-cartProduct.quantity));
                                     //     console.log("firstTwoProductsAmountSum",firstTwoProductsAmountSum);
                                     //  }

                                     //  if(totalCountProductsInB1GXOff<=2){
                                     //      priceOfTwo=firstTwoProductsAmountSum;
                                     //         console.log("priceOfTwo if after change",priceOfTwo);
                                     //      console.log("totalAmountOfCountProductsInB1GXOff in if after calculations",totalAmountOfCountProductsInB1GXOff);
                                     //  }else{


                                     //     //     console.log("priceOfTwo else",priceOfTwo);
                                     //     //  totalAmountOfCountProductsInB1GXOff = totalAmountOfCountProductsInB1GXOff + (cartProduct.quantity * cartProduct.product.price);
                                     //     // //  totalAmountOfCountProductsInB1GXOff=priceOfTwo;
                                     //     //  console.log("totalAmountOfCountProductsInB1GXOff in else",totalAmountOfCountProductsInB1GXOff);
                                     //  }


                                 }
                             });
                         });
                         console.log("totalAmountOfCountProductsInB1GXOff", totalAmountOfCountProductsInB1GXOff);
                         console.log("priceOfTwo", priceOfTwo);
                         if (totalCountProductsInB1GXOff == 1) {
                             console.log("$scope.grandTotal Before 1 nnn", $scope.grandTotal);
                             var percentage = $scope.discountSelected.xValue;
                             console.log("percentage", percentage);
                             //  =totalAmountOfCountProductsInB1GXOff;
                             if ($scope.mycartTable) {
                                 $scope.grandTotal = $scope.total = CartService.getTotal($scope.mycartTable.products);
                                 //  $.jStorage.set("grandTotal", $scope.grandTotal);
                             }

                             //  var totalDiscount = ($scope.discountSelected.xValue/totalAmountOfCountProductsInB1GXOff)*100;
                             $scope.grandTotalAfterDiscount = (priceOfTwo * percentage) / 100;
                             console.log("$scope.grandTotalAfterDiscount nnn", $scope.grandTotalAfterDiscount);
                             $scope.grandTotal = $scope.grandTotal - $scope.grandTotalAfterDiscount;
                             console.log("$scope.grandTotal after 1 nnn", $scope.grandTotal);


                             $scope.discountValueObject = {
                                 discountAmount: $scope.grandTotalAfterDiscount,
                                 grandTotalAfterDiscount: $scope.grandTotal,
                                 selectedDiscount: $scope.discountSelected,
                                 totalAmountOfOrder: $scope.total
                             }
                             console.log("$scope.discountValueObject", $scope.discountValueObject);
                             $.jStorage.set("discountValues", $scope.discountValueObject);


                             $scope.Couponmodal.close();

                         } else if (totalCountProductsInB1GXOff >= 2) {
                             var percentage = $scope.discountSelected.yValue;
                             console.log("$scope.grandTotal before 2 nnn", $scope.grandTotal);
                             if ($scope.mycartTable) {
                                 $scope.grandTotal = $scope.total = CartService.getTotal($scope.mycartTable.products);
                                 //  $.jStorage.set("grandTotal", $scope.grandTotal);
                             }
                             $scope.grandTotalAfterDiscount = (priceOfTwo * percentage) / 100;
                             $scope.grandTotal = $scope.grandTotal - $scope.grandTotalAfterDiscount;
                             console.log("$scope.grandTotal after 2 nnn", $scope.grandTotal);

                             $scope.discountValueObject = {
                                 discountAmount: $scope.grandTotalAfterDiscount,
                                 grandTotalAfterDiscount: $scope.grandTotal,
                                 selectedDiscount: $scope.discountSelected,
                                 totalAmountOfOrder: $scope.total
                             }
                             console.log("$scope.discountValueObject", $scope.discountValueObject);
                             $.jStorage.set("discountValues", $scope.discountValueObject);


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
                     //for Discount of Rs X on Y amount shopping
                     $.jStorage.deleteKey("coupon");
                     $.jStorage.deleteKey("gifts");
                     if ($scope.mycartTable) {
                         $scope.grandTotal = $scope.total = CartService.getTotal($scope.mycartTable.products);
                         $scope.grandTotalAfterDiscount = 0;
                         //  $.jStorage.set("grandTotal", $scope.grandTotal);
                     }
                     if ($scope.grandTotal >= $scope.discountSelected.yValue) {
                         //  $scope.grandTotal = $scope.grandTotal - $scope.diif ($scope.mycartTable) {
                         $scope.grandTotal = $scope.total = CartService.getTotal($scope.mycartTable.products);
                         $scope.grandTotalAfterDiscount = 0;
                         //  $.jStorage.set("grandTotal", $scope.grandTotal);
                     }
                     if ($scope.grandTotal >= $scope.discountSelected.yValue) {
                         $scope.grandTotal = $scope.grandTotal - $scope.discountSelected.xValue;
                         $scope.grandTotalAfterDiscount = $scope.discountSelected.xValue;

                         $scope.discountValueObject = {
                             discountAmount: $scope.grandTotalAfterDiscount,
                             grandTotalAfterDiscount: $scope.grandTotal,
                             selectedDiscount: $scope.discountSelected,
                             totalAmountOfOrder: $scope.total
                         }
                         console.log("$scope.discountValueObject", $scope.discountValueObject);
                         $.jStorage.set("discountValues", $scope.discountValueObject);

                         $scope.Couponmodal.close();
                     } else {
                         alert("Your Cart Total Low to Avail This Discount!!! Shop More to Get This Discount...");
                     }
                 } else if ($scope.discountSelected.discountType == "59e44d48f255331e48fc428f") {
                     $.jStorage.deleteKey("coupon");
                     $.jStorage.deleteKey("gifts");
                     //gifts section 
                     console.log("cccccccccccccccccccccccccccccccccccccccc");
                     if ($scope.mycartTable) {
                         $scope.grandTotal = $scope.total = CartService.getTotal($scope.mycartTable.products);
                         $scope.grandTotalAfterDiscount = 0;
                         //  $.jStorage.set("grandTotal", $scope.grandTotal);
                     }
                     //  if ($scope.grandTotal >= $scope.discountSelected.xValue) {
                     //      //  $scope.grandTotal = $scope.grandTotal - $scope.diif ($scope.mycartTable) {
                     //      $scope.grandTotal = $scope.total = CartService.getTotal($scope.mycartTable.products);
                     //      $scope.grandTotalAfterDiscount = 0;
                     //      //  $.jStorage.set("grandTotal", $scope.grandTotal);
                     //  }
                     if ($scope.grandTotal >= $scope.discountSelected.xValue) {
                         $scope.gifts = $scope.discountSelected.gifts;
                         console.log("$scope.gifts", $scope.gifts);
                         $scope.discountValueObject = {
                             discountAmount: $scope.grandTotalAfterDiscount,
                             grandTotalAfterDiscount: $scope.grandTotal,
                             selectedDiscount: $scope.discountSelected,
                             totalAmountOfOrder: $scope.total
                         }
                         console.log("$scope.discountValueObject", $scope.discountValueObject);
                         $.jStorage.set("discountValues", $scope.discountValueObject);
                         //  $.jStorage.set("gifts", $scope.gifts);
                         //  $scope.grandTotal = $scope.grandTotal - $scope.discountSelected.xValue;
                         //  $scope.grandTotalAfterDiscount = $scope.discountSelected.xValue;
                         $scope.Couponmodal.close();
                         $timeout(function () {
                             $scope.mycart = $uibModal.open({
                                 animation: true,
                                 templateUrl: 'views/modal/mycartmodal.html',
                                 size: 'md',
                                 scope: $scope
                             });
                         }, 500);
                         $scope.selectGift = function (gift) {
                             $.jStorage.set("gifts", gift);
                             $scope.mycart.close();
                         }
                     } else {
                         alert("Your Cart Total Low to Avail This Discount!!! Shop More to Get This Discount...");
                     }
                 } else if ($scope.discountSelected.discountType == "59f1e3327ddd0f0dcda6fe6f") {
                     //for Buy 1 Get 1 Offer
                     $.jStorage.deleteKey("coupon");
                     $.jStorage.deleteKey("gifts");
                     myService.getAllProductsByDiscount($scope.discountSelected._id, function (data) {
                         console.log("called api getAllProductsByDiscount", data.products);
                         var totalCountProductsInB1GXOff = 0;
                         var totalAmountOfCountProductsInB1GXOff = 0;
                         var discountProducts = data.products;
                         var priceOfTwo = 0;
                         var firstTwoProductsAmountSum;
                         var iterationNumber = 0;
                         var totalPriceAdded = 0;
                         console.log("avinash");
                         var sortedArray = discountProducts.sort(function (a, b) {
                             console.log("a", a, "b", b);
                             return a.price > b.price ? -1 : a.price < b.price ? 1 : 0
                         });
                         console.log("sortedArray", sortedArray);
                         console.log("$scope.mycartTable.products", $scope.mycartTable.products);
                         var productsInBOGOOffer = [];
                         var seperateProductsInBOGOOffer = [];
                         var totalDiscountBOGO = 0;
                         _.each(sortedArray, function (product) {
                             _.each($scope.mycartTable.products, function (cartProduct) {
                                 if (product._id == cartProduct.product._id) {
                                     for (i = 0; i < cartProduct.quantity; i++) {
                                         seperateProductsInBOGOOffer.push(cartProduct);
                                     }
                                     console.log("seperateProductsInBOGOOffer", seperateProductsInBOGOOffer);


                                 }
                             });
                         });
                         var allDiscountedProcuctsTotalQty = 0;
                         _.each(seperateProductsInBOGOOffer, function (last1) {
                             allDiscountedProcuctsTotalQty += last1.product.price;
                         });
                         console.log("allDiscountedProcuctsTotalQty", allDiscountedProcuctsTotalQty);
                         var seperateProductsInBOGOOfferLength = seperateProductsInBOGOOffer.length;
                         var processingArray = seperateProductsInBOGOOffer;
                         var sumOfPricesToBeDiscard = Math.floor(seperateProductsInBOGOOfferLength / 2);
                         //  console.log("seperateProductsInBOGOOffer%%%",seperateProductsInBOGOOffer);
                         console.log("sumOfPricesToBeDiscard", sumOfPricesToBeDiscard);
                         var totalDiscount = 0;
                         var iteration = 0;

                         var finalArray = seperateProductsInBOGOOffer.slice(0, -sumOfPricesToBeDiscard);
                         //  _.takeRight(processingArray, sumOfPricesToBeDiscard);
                         console.log("finalArray processingArray", finalArray);
                         if (finalArray) {
                             console.log("in if");
                             _.each(finalArray, function (last) {
                                 console.log("last", last.product.price);
                                 totalDiscount = totalDiscount + last.product.price;
                             });
                             console.log("totalDiscount in if last", totalDiscount);
                         } else {
                             console.log("In else");
                         }
                         console.log("after if else", allDiscountedProcuctsTotalQty - totalDiscount);
                         if (sumOfPricesToBeDiscard < 1) {
                             tC = 0;
                         } else {
                             var tC = allDiscountedProcuctsTotalQty - totalDiscount;
                         }
                         console.log("tC", tC);
                         if ($scope.mycartTable) {
                             $scope.grandTotal = $scope.total = CartService.getTotal($scope.mycartTable.products);
                             //  $.jStorage.set("grandTotal", $scope.grandTotal);
                         }
                         console.log("$scope.grandTotal", $scope.grandTotal)
                         $scope.grandTotalAfterDiscount = tC;
                         console.log("$scope.grandTotalAfterDiscount", $scope.grandTotalAfterDiscount)
                         $scope.grandTotal = $scope.grandTotal - $scope.grandTotalAfterDiscount;
                         console.log("$scope.grandTotal last", $scope.grandTotal);

                         $scope.discountValueObject = {
                             discountAmount: $scope.grandTotalAfterDiscount,
                             grandTotalAfterDiscount: $scope.grandTotal,
                             selectedDiscount: $scope.discountSelected,
                             totalAmountOfOrder: $scope.total
                         }
                         console.log("$scope.discountValueObject", $scope.discountValueObject);
                         $.jStorage.set("discountValues", $scope.discountValueObject);

                         $scope.Couponmodal.close();

                     });
                 }


             } else {
                 $scope.notSelectedDiscount = true;
                 console.log("in else  ");
             }
         }
     }



     //new in switch Case 
     $scope.applyCouponSubmitSwitchCase = function () {
         if (!isEmptyObject($scope.discountSelected)) {
             console.log("$scope.discountSelected in applyCouponSubmit", $scope.discountSelected.discountType);
             var discountObject = $scope.discountSelected;
             discountCouponAmount = $scope.discountSelected.xValue;
             switch ($scope.discountSelected.discountType) {
                 case "59f06bc7647252477439a1e4":
                     alert("59f06bc7647252477439a1e4");
                     $.jStorage.deleteKey("coupon");
                     $.jStorage.deleteKey("gifts");
                     if ($scope.mycartTable) {
                         $scope.grandTotal = $scope.total = CartService.getTotal($scope.mycartTable.products);
                         $scope.grandTotalAfterDiscount = 0;
                         //  $.jStorage.set("grandTotal", $scope.grandTotal);
                     }
                     if ($scope.grandTotal >= $scope.discountSelected.yValue) {
                         var couponObj = {
                             name: "Coupon 1",
                             user: "59c5008c34054e4586c59a96",
                             generatedOrderId: "59c4c57603e1027226e4b575",
                             usedOrderId: "",
                             amount: discountCouponAmount,
                             status: "unUsed",
                             isActive: "False"
                         };
                         console.log(couponObj, "couponObj");
                         $.jStorage.set("coupon", couponObj);
                         var jStorageData = $.jStorage.get("coupon");
                         console.log("jStorageData", jStorageData);

                         //  myService.addCouponByUserFromCart(couponObj, function (data) {
                         //  console.log("called api addCouponByUserFromCart", data);
                         //  //send mail to user with coupon code
                         // //  var totalCountProductsInB1GXOff = 0;

                         //  $scope.Couponmodal.close();
                         // });
                         $scope.Couponmodal.close();
                         //  $scope.grandTotal = $scope.grandTotal - $scope.discountSelected.xValue;
                         //  $scope.grandTotalAfterDiscount = $scope.discountSelected.xValue;
                     } else {
                         alert("Your Cart Total Low to Avail This Discount!!! Shop More to Get This Discount...");
                     }
                     break;

                 case "59d329e334d0832185b7f577OLD":
                     alert("2");
                     $.jStorage.deleteKey("coupon");
                     $.jStorage.deleteKey("gifts");
                     myService.getAllProductsByDiscount($scope.discountSelected._id, function (data) {
                         console.log("called api getAllProductsByDiscount", data.products);
                         var totalCountProductsInB1GXOff = 0;
                         _.each(data.products, function (product) {
                             _.each($scope.mycartTable.products, function (cartProduct) {
                                 if (product._id == cartProduct.product._id) {
                                     totalCountProductsInB1GXOff = totalCountProductsInB1GXOff + cartProduct.quantity;
                                 }
                             });
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
                             //  $scope.dgetCategoryWithIdiscount="400";
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
                     });
                     break;
                 case "default":
                     alert("avinasg");
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
                 $scope.grandTotal = $scope.total = $scope.grandTotal.toFixed(2);
                 //  $.jStorage.set("grandTotal", $scope.grandTotal);
                 $scope.applicableDiscounts($scope.productArrayForDiscount, $scope.grandTotal);
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
             $scope.grandTotal = $scope.total = $scope.grandTotal.toFixed(2);
             //  $.jStorage.set("grandTotal", $scope.grandTotal);
             $scope.applicableDiscounts($scope.productArrayForDiscount, $scope.grandTotal);
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
         $scope.grandTotal = $scope.total = $scope.grandTotal.toFixed(2);
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
         if ($.jStorage.get("userId")) {
             $scope.loggedUser = true;
         } else {
             $scope.loggedUser = false;
         }
     }

     $scope.disabledRadio = function () {

     }

 })