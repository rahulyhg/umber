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


    $scope.applyCouponSubmit = function (couponName, productId) {
        //  console.log("applyCouponSubmit", couponName)
        if (!productId && couponName) {
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
                $scope.discountApplicableforCart = true;
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
                    $scope.productGst = 0;
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

                        _.each($scope.mycartTable.products, function (cartProduct) {
                            cartProduct.product.discountApplicable = false;
                            //  if (cartProduct.product.price != cartProduct.product.mrp) {
                            //      if (cartProduct.product.price > 999) {
                            //          cartProduct.product.gst = (cartProduct.product.price * cartProduct.quantity) * 0.12;
                            //      } else {
                            //          cartProduct.product.gst = (cartProduct.product.price * cartProduct.quantity) * 0.05;
                            //      }
                            //  } else {
                            //      cartProduct.product.gst = 0;
                            //  }
                            $scope.productGst = $scope.productGst + cartProduct.product.gst;
                        });
                        console.log("$scope.mycartTable.products$scope.mycartTable.products", $scope.mycartTable.products)
                        console.log(couponObj, "couponObj");
                        $.jStorage.set("coupon", couponObj);
                        var jStorageData = $.jStorage.get("coupon");
                        console.log("jStorageData", jStorageData);


                        $scope.discountValueObject = {
                            discountAmount: $scope.grandTotalAfterDiscount,
                            grandTotalAfterDiscount: $scope.grandTotal,
                            grandTotalAfterGst: $scope.productGst,
                            gst: $scope.productGst,
                            selectedDiscount: $scope.discountSelected,
                            totalAmountOfOrder: $scope.total
                        }

                        console.log("$scope.discountValueObject", $scope.discountValueObject);
                        $.jStorage.set("discountValues", $scope.discountValueObject);
                        $.jStorage.set("myCart", $scope.mycartTable.products);
                        $.jStorage.set("gst", $scope.productGst);


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
                        var totalCountProductsInB1GXOff = 0;
                        var totalAmountOfCountProductsInB1GXOff = 0;
                        var discountProducts = data.products;
                        var priceOfTwo = 0;
                        var firstTwoProductsAmountSum;
                        var iterationNumber = 0;
                        var totalPriceAdded = 0;
                        $scope.discountPriceOfProduct = 0;
                        $scope.priceWithDiscount = 0;
                        $scope.grandTotal = $scope.total = CartService.getTotal($scope.mycartTable.products);
                        $scope.grandTotalAfterDiscount = 0;
                        var sortedArray = discountProducts.sort(function (a, b) {
                            return a.price > b.price ? -1 : a.price < b.price ? 1 : 0
                        });
                        $scope.productGst = 0;
                        _.each($scope.mycartTable.products, function (cartProduct) {
                            cartProduct.product.discountApplicable = false;
                            _.each(sortedArray, function (product) {
                                if (product._id == cartProduct.product._id) {
                                    cartProduct.product.discountApplicable = true;
                                    if ($scope.discountSelected._id == "59ed87aa0a9eb11654a1eb87") {
                                        $scope.discountPriceOfProduct = cartProduct.product.price * 0.2;
                                    } else {
                                        $scope.discountPriceOfProduct = cartProduct.product.price * 0.1;
                                    }
                                    switch (cartProduct.quantity) {
                                        case 1:
                                            cartProduct.product.discountApplicable = true;
                                            cartProduct.product.discountPriceOfProduct = $scope.discountPriceOfProduct;
                                            cartProduct.product.priceWithDiscount = $scope.priceWithDiscount = cartProduct.product.price - $scope.discountPriceOfProduct;
                                            $scope.grandTotalAfterDiscount = $scope.grandTotalAfterDiscount + $scope.discountPriceOfProduct;
                                            if ($scope.priceWithDiscount > 999) {
                                                var unitPrice = ((cartProduct.product.price - $scope.discountPriceOfProduct) * 100) / (100 + 12);
                                                //  var tax = unitPrice * 0.12;
                                                var tax = $scope.priceWithDiscount * 0.12;
                                                cartProduct.product.gst = tax;
                                            } else {
                                                var unitPrice = ((cartProduct.product.price - $scope.discountPriceOfProduct) * 100) / (100 + 5);
                                                //  var tax = unitPrice * 0.05;
                                                var tax = $scope.priceWithDiscount * 0.05;
                                                cartProduct.product.gst = tax;
                                            }
                                            //  $scope.productGst = $scope.productGst + value.product.gst;
                                            $scope.Couponmodal.close();
                                            break;
                                        case 2:
                                            cartProduct.product.discountApplicable = true;
                                            cartProduct.product.discountPriceOfProduct = $scope.discountPriceOfProduct = $scope.discountPriceOfProduct * 2;
                                            cartProduct.product.priceWithDiscount = $scope.priceWithDiscount = (cartProduct.product.price * cartProduct.quantity) - $scope.discountPriceOfProduct;
                                            $scope.grandTotalAfterDiscount = $scope.grandTotalAfterDiscount + $scope.discountPriceOfProduct;
                                            if ($scope.priceWithDiscount > 999) {
                                                var unitPrice = ($scope.priceWithDiscount * 100) / (100 + 12);
                                                //  var tax = unitPrice * 0.12;
                                                var tax = $scope.priceWithDiscount * 0.12;
                                                cartProduct.product.gst = tax;
                                            } else {
                                                var unitPrice = ($scope.priceWithDiscount * 100) / (100 + 5);
                                                //  var tax = unitPrice * 0.05
                                                var tax = $scope.priceWithDiscount * 0.05;
                                                cartProduct.product.gst = tax;
                                            }
                                            $scope.Couponmodal.close();
                                            break;
                                        case 3:
                                            cartProduct.product.discountApplicable = true;
                                            cartProduct.product.discountPriceOfProduct = $scope.discountPriceOfProduct = $scope.discountPriceOfProduct * 3;
                                            cartProduct.product.priceWithDiscount = $scope.priceWithDiscount = (cartProduct.product.price * cartProduct.quantity) - $scope.discountPriceOfProduct;
                                            $scope.grandTotalAfterDiscount = $scope.grandTotalAfterDiscount + $scope.discountPriceOfProduct;
                                            if ($scope.priceWithDiscount > 999) {
                                                var unitPrice = (($scope.priceWithDiscount) * 100) / (100 + 12);
                                                //  var tax = unitPrice * 0.12;
                                                var tax = $scope.priceWithDiscount * 0.12;
                                                cartProduct.product.gst = tax;
                                            } else {
                                                var unitPrice = (($scope.priceWithDiscount) * 100) / (100 + 5);
                                                //  var tax = unitPrice * 0.05;
                                                var tax = $scope.priceWithDiscount * 0.05;
                                                cartProduct.product.gst = tax;
                                            }
                                            $scope.Couponmodal.close();
                                            break;
                                        case 4:
                                            cartProduct.product.discountApplicable = true;
                                            cartProduct.product.discountPriceOfProduct = $scope.discountPriceOfProduct = $scope.discountPriceOfProduct * 4;
                                            cartProduct.product.priceWithDiscount = $scope.priceWithDiscount = (cartProduct.product.price * cartProduct.quantity) - $scope.discountPriceOfProduct;
                                            $scope.grandTotalAfterDiscount = $scope.grandTotalAfterDiscount + $scope.discountPriceOfProduct;
                                            if ($scope.priceWithDiscount > 999) {
                                                var unitPrice = ($scope.priceWithDiscount * 100) / (100 + 12);
                                                //  var tax = unitPrice * 0.12
                                                var tax = $scope.priceWithDiscount * 0.12;
                                                cartProduct.product.gst = tax;
                                            } else {
                                                var unitPrice = ($scope.priceWithDiscount * 100) / (100 + 5);
                                                //  var tax = unitPrice * 0.05;
                                                var tax = $scope.priceWithDiscount * 0.05;
                                                cartProduct.product.gst = tax;
                                            }
                                            $scope.Couponmodal.close();
                                            break;
                                        case 5:
                                            cartProduct.product.discountApplicable = true;
                                            cartProduct.product.discountPriceOfProduct = $scope.discountPriceOfProduct = $scope.discountPriceOfProduct * 5;
                                            cartProduct.product.priceWithDiscount = $scope.priceWithDiscount = (cartProduct.product.price * cartProduct.quantity) - $scope.discountPriceOfProduct;
                                            $scope.grandTotalAfterDiscount = $scope.grandTotalAfterDiscount + $scope.discountPriceOfProduct;
                                            if ($scope.priceWithDiscount > 999) {
                                                var unitPrice = ($scope.priceWithDiscount * 100) / (100 + 12);
                                                //  var tax = unitPrice * 0.12;
                                                var tax = $scope.priceWithDiscount * 0.12;
                                                cartProduct.product.gst = tax;
                                            } else {
                                                var unitPrice = ($scope.priceWithDiscount * 100) / (100 + 5);
                                                //  var tax = unitPrice * 0.05;
                                                var tax = $scope.priceWithDiscount * 0.05;
                                                cartProduct.product.gst = tax;
                                            }
                                            $scope.Couponmodal.close();
                                            break;
                                        case 6:
                                            cartProduct.product.discountApplicable = true;
                                            cartProduct.product.discountPriceOfProduct = $scope.discountPriceOfProduct = $scope.discountPriceOfProduct * 6;
                                            cartProduct.product.priceWithDiscount = $scope.priceWithDiscount = (cartProduct.product.price * cartProduct.quantity) - $scope.discountPriceOfProduct;
                                            $scope.grandTotalAfterDiscount = $scope.grandTotalAfterDiscount + $scope.discountPriceOfProduct;
                                            if ($scope.priceWithDiscount > 999) {
                                                var unitPrice = ($scope.priceWithDiscount * 100) / (100 + 12);
                                                //  var tax = unitPrice * 0.12;
                                                var tax = $scope.priceWithDiscount * 0.12;
                                                cartProduct.product.gst = tax;
                                            } else {
                                                var unitPrice = ($scope.priceWithDiscount * 100) / (100 + 5);
                                                //  var tax = unitPrice * 0.05;
                                                var tax = $scope.priceWithDiscount * 0.05;
                                                cartProduct.product.gst = tax;
                                            }
                                            $scope.Couponmodal.close();
                                            break;
                                        case 7:
                                            cartProduct.product.discountApplicable = true;
                                            cartProduct.product.discountPriceOfProduct = $scope.discountPriceOfProduct = $scope.discountPriceOfProduct * 7;
                                            cartProduct.product.priceWithDiscount = $scope.priceWithDiscount = (cartProduct.product.price * cartProduct.quantity) - $scope.discountPriceOfProduct;
                                            $scope.grandTotalAfterDiscount = $scope.grandTotalAfterDiscount + $scope.discountPriceOfProduct;
                                            if ($scope.priceWithDiscount > 999) {
                                                var unitPrice = ($scope.priceWithDiscount * 100) / (100 + 12);
                                                //  var tax = unitPrice * 0.12;
                                                var tax = $scope.priceWithDiscount * 0.12;
                                                cartProduct.product.gst = tax;
                                            } else {
                                                var unitPrice = ($scope.priceWithDiscount * 100) / (100 + 5);
                                                //  var tax = unitPrice * 0.05;
                                                var tax = $scope.priceWithDiscount * 0.05;
                                                cartProduct.product.gst = tax;
                                            }
                                            $scope.Couponmodal.close();
                                            break;
                                        default:
                                            cartProduct.product.discountApplicable = false;
                                            cartProduct.product.discountPriceOfProduct = $scope.discountPriceOfProduct = $scope.discountPriceOfProduct = 0;
                                            cartProduct.product.priceWithDiscount = $scope.priceWithDiscount = (cartProduct.product.price * cartProduct.quantity) - $scope.discountPriceOfProduct;
                                            $scope.grandTotalAfterDiscount = $scope.grandTotalAfterDiscount + $scope.discountPriceOfProduct;
                                            if (cartProduct.product.price != cartProduct.product.mrp) {
                                                if (cartProduct.product.price > 999) {
                                                    cartProduct.product.gst = $scope.priceWithDiscount * 0.12;
                                                } else {
                                                    cartProduct.product.gst = $scope.priceWithDiscount * 0.05;
                                                }
                                            } else {
                                                cartProduct.product.gst = 0;
                                            }

                                            $scope.Couponmodal.close();
                                            break;
                                    }
                                } else {
                                    //  cartProduct.product.discountApplicable = false;
                                }
                            });
                            $scope.productGst = $scope.productGst + cartProduct.product.gst;
                        });
                        $scope.discountValueObject = {
                            discountAmount: $scope.grandTotalAfterDiscount,
                            grandTotalAfterDiscount: $scope.total - $scope.grandTotalAfterDiscount,
                            grandTotalAfterGst: $scope.productGst,
                            gst: $scope.productGst,
                            selectedDiscount: $scope.discountSelected,
                            totalAmountOfOrder: $scope.total
                        }
                        console.log("$scope.discountValueObject", $scope.discountValueObject);
                        $.jStorage.set("discountValues", $scope.discountValueObject);
                        $.jStorage.set("myCart", $scope.mycartTable.products);
                        $.jStorage.set("gst", $scope.productGst);

                    });
                } else if ($scope.discountSelected.discountType == "59ede2fcd30c7e2ab3324ece") {
                    //for Discount of Rs X on Y amount shopping
                    $.jStorage.deleteKey("coupon");
                    $.jStorage.deleteKey("gifts");
                    $scope.productGst = 0;
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
                    _.each($scope.mycartTable.products, function (cartProduct) {
                        cartProduct.product.discountApplicable = false;
                        //  if (cartProduct.product.price != cartProduct.product.mrp) {
                        //      if (cartProduct.product.price > 999) {
                        //          cartProduct.product.gst = (cartProduct.product.price * cartProduct.quantity) * 0.12;
                        //      } else {
                        //          cartProduct.product.gst = (cartProduct.product.price * cartProduct.quantity) * 0.05;
                        //      }
                        //  }else{
                        //      cartProduct.product.gst=0;
                        //  }
                        $scope.productGst = $scope.productGst + cartProduct.product.gst;
                    });
                    if ($scope.grandTotal >= $scope.discountSelected.yValue) {
                        $scope.grandTotal = $scope.grandTotal - $scope.discountSelected.xValue;
                        $scope.grandTotalAfterDiscount = $scope.discountSelected.xValue;

                        $scope.discountValueObject = {
                            discountAmount: $scope.grandTotalAfterDiscount,
                            grandTotalAfterDiscount: $scope.grandTotal,
                            grandTotalAfterGst: $scope.productGst,
                            gst: $scope.productGst,
                            selectedDiscount: $scope.discountSelected,
                            totalAmountOfOrder: $scope.total
                        }
                        console.log("$scope.discountValueObject", $scope.discountValueObject);
                        $.jStorage.set("discountValues", $scope.discountValueObject);
                        $.jStorage.set("myCart", $scope.mycartTable.products);
                        $.jStorage.set("gst", $scope.productGst);
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
                        _.each($scope.mycartTable.products, function (cartProduct) {
                            //  if (cartProduct.product.price != cartProduct.product.mrp) {
                            //      if (cartProduct.product.price > 999) {
                            //          cartProduct.product.gst = (cartProduct.product.price * cartProduct.quantity) * 0.12;
                            //      } else {
                            //          cartProduct.product.gst = (cartProduct.product.price * cartProduct.quantity) * 0.005;
                            //      }
                            //  } else {
                            //      cartProduct.product.gst = 0;
                            //  }
                        });
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
                        _.each($scope.mycartTable.products, function (cartProduct) {
                            cartProduct.product.discountApplicable = false;
                            $scope.productGst = $scope.productGst + cartProduct.product.gst;
                        });
                        $.jStorage.set("myCart", $scope.mycartTable.products);
                        $scope.discountValueObject = {
                            discountAmount: $scope.grandTotalAfterDiscount,
                            grandTotalAfterDiscount: $scope.grandTotal,
                            grandTotalAfterGst: $scope.productGst,
                            gst: $scope.productGst,
                            selectedDiscount: $scope.discountSelected,
                            totalAmountOfOrder: $scope.total
                        }
                        console.log("$scope.discountValueObject", $scope.discountValueObject);
                        $.jStorage.set("discountValues", $scope.discountValueObject);
                        $.jStorage.set("gst", $scope.productGst);
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
                        $scope.productGst = 0;
                        _.each($scope.mycartTable.products, function (cartProduct) {
                            cartProduct.product.discountApplicable = false;
                            _.each(sortedArray, function (product) {
                                if (product._id == cartProduct.product._id) {
                                    //  cartProduct.product.discountApplicable = true;
                                    for (i = 0; i < cartProduct.quantity; i++) {
                                        seperateProductsInBOGOOffer.push(cartProduct);
                                    }
                                    console.log("seperateProductsInBOGOOffer", seperateProductsInBOGOOffer);
                                }
                            });
                            //  if (cartProduct.product.price != cartProduct.product.mrp) {
                            //      if (cartProduct.product.price > 999) {
                            //          cartProduct.product.gst = cartProduct.product.price * 0.12;
                            //      } else {
                            //          cartProduct.product.gst = cartProduct.product.price * 0.05;
                            //      }
                            //  } else {
                            //      cartProduct.product.gst = 0;
                            //  }
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
                        var descardedProductindex = seperateProductsInBOGOOfferLength - sumOfPricesToBeDiscard
                        console.log("descardedProductindex", descardedProductindex);
                        var totalDiscount = 0;
                        var iteration = 0;
                        $scope.productGst = 0;
                        var finalArray = seperateProductsInBOGOOffer.slice(0, -sumOfPricesToBeDiscard);
                        var uniqueProducts = [];
                        for (i = descardedProductindex - 1; i < seperateProductsInBOGOOfferLength - 1; i++) {
                            uniqueProducts.push(seperateProductsInBOGOOffer[i])
                        }
                        if (seperateProductsInBOGOOffer.length > 2) {
                            var current = uniqueProducts[0];
                            var cnt = 0;

                            for (var i = 0; i < uniqueProducts.length; i++) {
                                if (uniqueProducts[i] != current) {
                                    if (cnt > 0) {}
                                    current = uniqueProducts[i];
                                    cnt = 1;
                                } else {
                                    cnt++;
                                    _.each($scope.mycartTable.products, function (cartProduct) {
                                        if (cartProduct._id == current._id) {
                                            cartProduct.product.discountApplicable = true;
                                            cartProduct.product.discountPriceOfProduct = cartProduct.product.price * cnt;
                                            cartProduct.product.priceWithDiscount = (current.product.price * current.quantity) - cartProduct.product.discountPriceOfProduct;
                                            //  if ($scope.priceWithDiscount > 999) {
                                            //      cartProduct.product.gst = ((cartProduct.product.price - cartProduct.product.discountPriceOfProduct) * 0.12) * cartProduct.quantity;
                                            //  } else {
                                            //      cartProduct.product.gst = ((cartProduct.product.price - cartProduct.product.discountPriceOfProduct) * 0.05) * cartProduct.quantity;
                                            //  }
                                        }
                                        //  console.log("aaaaaaaaaaaaaaaaaaaaaaaa", cartProduct.product);
                                        //  $scope.productGst = $scope.productGst + cartProduct.product.gst;
                                    });
                                }
                            }
                            if (cnt > 0) {}
                        } else {
                            _.each(finalArray, function (val) {
                                _.each(seperateProductsInBOGOOffer, function (val1) {
                                    val.product.discountApplicable = true;
                                    if (val1.product._id == val.product._id) {
                                        val.product.discountApplicable = true;
                                        val.product.discountPriceOfProduct = val.product.price;
                                        val.product.priceWithDiscount = val.product.price * val.quantity - val.product.price;
                                        if (val.product.discountPriceOfProduct > 999) {
                                            var unitPrice = ((val.product.price - val.product.discountPriceOfProduct) * 100) / (100 + 12);
                                            //  var tax = unitPrice * 0.12;
                                            var tax = val.product.priceWithDiscount * 0.12;
                                            val.product.gst = tax * val.quantity;
                                        } else {
                                            var unitPrice = ((val.product.price - val.product.discountPriceOfProduct) * 100) / (100 + 5);
                                            //  var tax = unitPrice * 0.05;
                                            var tax = val.product.priceWithDiscount * 0.05;
                                            val.product.gst = tax * val.quantity;
                                        }
                                    } else {
                                        val.product.discountApplicable = true;
                                        val.product.discountPriceOfProduct = val.product.price;
                                        val.product.priceWithDiscount = 0;
                                        if ($scope.priceWithDiscount > 999) {
                                            val.product.gst = 0;
                                        } else {
                                            val.product.gst = 0;
                                        }
                                    }
                                });
                            });
                        }

                        if (finalArray) {
                            //  console.log("in if")
                            _.each(finalArray, function (last) {
                                totalDiscount = totalDiscount + last.product.price;
                                //  last.product.gst = (last.product.price * last.quantity - last.product.discountPriceOfProduct) * 0.12;
                                var unitPrice = ((last.product.price * last.quantity - last.product.discountPriceOfProduct) * 100) / (100 + 12);
                                //  var tax = unitPrice * 0.12;
                                var tax = (last.product.price * last.quantity - last.product.discountPriceOfProduct) * 0.12;
                                last.product.gst = tax;
                            });
                            //  console.log("totalDiscount in if last", totalDiscount);
                        } else {
                            //  console.log("In else");
                        }
                        //  console.log("after if else", allDiscountedProcuctsTotalQty - totalDiscount);
                        if (sumOfPricesToBeDiscard < 1) {
                            tC = 0;
                        } else {
                            var tC = allDiscountedProcuctsTotalQty - totalDiscount;
                        }
                        console.log("tC", tC);
                        if ($scope.mycartTable) {
                            $scope.grandTotal = $scope.total = CartService.getTotal($scope.mycartTable.products);
                            _.each($scope.mycartTable.products, function (cartProduct) {
                                $scope.productGst = $scope.productGst + cartProduct.product.gst;
                            });
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
                            grandTotalAfterGst: $scope.productGst,
                            gst: $scope.productGst,
                            selectedDiscount: $scope.discountSelected,
                            totalAmountOfOrder: $scope.total
                        }
                        console.log("$scope.discountValueObject", $scope.discountValueObject);
                        $.jStorage.set("discountValues", $scope.discountValueObject);
                        $.jStorage.set("myCart", $scope.mycartTable.products);
                        $.jStorage.set("gst", $scope.productGst);
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
            $scope.productGst = 0;
            _.forEach($scope.mycartTable.products, function (value) {
                console.log("else-", value);
                //  if (value.product.discountPriceOfProduct) {
                //      var dis = value.discountPriceOfProduct;
                //  } else {
                //      console.log("fdsssssfffffffffff")
                //      var dis = 0;
                //  }
                if (value.product.price != value.product.mrp) {
                    if (value.product.price > 999) {
                        var unitPrice = ((value.product.price) * 100) / (100 + 12);
                        var tax = unitPrice * 0.12;
                        value.product.gst = tax;
                    } else {
                        var unitPrice = ((value.product.price) * 100) / (100 + 5);
                        var tax = unitPrice * 0.05;
                        value.product.gst = tax;
                    }
                } else {
                    value.product.gst = 0;
                }
                $scope.productGst = $scope.productGst + value.product.gst;
                $scope.productArrayForDiscount.push(value.product._id);

            });
            console.log("$scope.productGst", $scope.productGst);
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
        //  $scope.applyCouponSubmit(null, $scope.mycartTable.products[index].product._id);
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

    $scope.openCoupon = function (product) {
        //  _.each($scope.mycartTable.products, function (cartProduct) {

        //  });

        //  myService.discountOfProduct(product, function (data) {
        //      $scope.applicableDiscountsOfProduct = data.data.data;
        //      $scope.applicableDiscountsOfProduct.productId = product._id;
        //  });

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

    $scope.redirectToCheckot = function () {
        console.log("$scope.discountApplicableforCart", $scope.discountApplicableforCart)
        var cart = {};
        cart.product = $.jStorage.get("myCart");
        cart.userId = $.jStorage.get("userId");
        cart.gst = $.jStorage.get("gst");
        cart.accessToken = $.jStorage.get("accessToken");
        if ($scope.discountApplicableforCart) {
            CartService.saveCartWithDiscount(cart, function (data) {
                console.log("in detailtab cart save", data)
            });
        }
        $state.go("checkout");
    }

})