 myApp.controller('ListingPageCtrl', function ($scope, toastr, CartService, $rootScope, $stateParams, $state, WishlistService, TemplateService, NavigationService,
     SizeService, BannerService, CategoryService, myService, ProductService, $timeout, $uibModal, ModalService, ListingService) {
     $scope.template = TemplateService.getHTML("content/listing-page.html");
     TemplateService.title = "Form"; //This is the Title of the Website
     $scope.navigation = NavigationService.getNavigation();
     $scope.formSubmitted = false;
     myService.ctrlBanners("listing-page", function (data) {
         $scope.banner = data;
     });
     if (_.isEmpty($.jStorage.get('compareproduct'))) {
         $scope.showCheck = false

     } else {
         $scope.showCheck = true
         $scope.compareproduct = $.jStorage.get('compareproduct')
     }
     NavigationService.getListingCategories(function (data) {
         console.log('getProductsWithFilters', data);
         $scope.categories = data.data.data;

     });

     /******getting products based on category******* */
     $scope.filteredProducts = function (selectedCategory) {
         if ($.jStorage.get("selectedCategory") && selectedCategory != $.jStorage.get("selectedCategory").category) {
             $.jStorage.deleteKey("appliedFilters");
         }
         var input = {

             "category": selectedCategory,
             "page": 1
         }
         $.jStorage.set("selectedCategory", input);
         /***************retriving filters based on categories and respective filters**************** */
         ListingService.retriveProductsWithCategory(function (data) {

             if (data.data.data.length == 0) {
                 $scope.displayMessage = "No Data Found";
                 $scope.products = ""

             } else if (!_.isEmpty(data.data.data)) {
                 $scope.displayMessage = "";
                 $scope.products = _.chunk(data.data.data, 3);
                 console.log(data)

                 ListingService.retriveFiltersWithCategory(function (data) {
                     console.log("product category on basis of category", data.data.data)
                     $scope.filters = data.data.data;
                     $scope.min = $scope.filters.priceRange[0].min;
                     $scope.max = $scope.filters.priceRange[0].max;
                     console.log("filters", $scope.filters.priceRange[0].max)
                     $scope.slider_translate = {
                         minValue: 80,
                         maxValue: 100,
                         options: {
                             ceil: $scope.filters.priceRange[0].max,
                             floor: $scope.filters.priceRange[0].min,
                             id: 'translate-slider'
                             // translate: function (value, id, which) {
                             //     return '$' + value;
                             // }
                         }
                     };
                 })

             } else {
                 toastr.error('There was some error', 'Error');
             }
         })
     }
     if ($.jStorage.get('selectedCategory')) {
         $scope.filteredProducts($.jStorage.get('selectedCategory').category)
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
         } else {
             $scope.compareproduct.push(product);
             $.jStorage.set('compareproduct', $scope.compareproduct);
             console.log($.jStorage.get('compareproduct'))
         }

         if (_.isEmpty($.jStorage.get('compareproduct'))) {
             $scope.showCheck = false

         } else {
             $scope.showCheck = true
         }
     }
     /******function to remove product from compare list******* */
     $scope.removeFromCompare = function (prodId) {

         var removeCompare = $.jStorage.get("compareproduct");
         var result = _.remove(removeCompare, {
             productId: prodId
         });

         $.jStorage.set("compareproduct", removeCompare);
         $state.reload();
     }

     /**********logic for checkbox on reload************ */
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
     $scope.gotoComparePage = function () {
         $state.go("compare-products");
     }

     var appliedFilters = {};
     /*******retriving products based on filters********* */
     $scope.applyFilters = function (key, filter) {
         var appliedFilters = {};
         appliedFilters.appliedFilters = $.jStorage.get('appliedFilters') ? $.jStorage.get('appliedFilters') : {
             category: [],
             type: [],
             style: [],
             color: [],
             collection: [],
             size: [],
             fabric: [],
         };
         console.log(filter, key)
         appliedFilters.appliedFilters.category = [$.jStorage.get("selectedCategory").category];

         var result = _.indexOf(appliedFilters.appliedFilters[key], filter._id);
         console.log("check result", result)
         if (result != -1) {
             _.pullAt(appliedFilters.appliedFilters[key], result);
         } else {
             if (!_.isArrayLike(appliedFilters.appliedFilters[key])) {
                 appliedFilters.appliedFilters[key] = [];
             }
             appliedFilters.appliedFilters[key].push(filter._id);
         }
         appliedFilters.page = 1;
         $.jStorage.set('appliedFilters', appliedFilters)

         console.log("Jstoragefor filters::", $.jStorage.get("appliedFilters"))
         _.forIn(appliedFilters.appliedFilters, function (val, key, obj) {
             if (_.isEmpty(val)) {
                 console.log("key: ", key);
                 delete appliedFilters.appliedFilters[key];
             }
         });
         console.log("apply filters: ", appliedFilters);
         ProductService.getProductsWithAppliedFilters(appliedFilters, function (data) {
             console.log("filtersretrived:::", data.data.data);
             $scope.products = _.chunk(data.data.data.products, 3);
             // $scope.filters = data.data.data.filters;

         })

         //api call
     }
     /******checking filters after reload***** */
     $scope.checkFilterStatus = function (key, filter) {
         var appliedFilters = $.jStorage.get("appliedFilters");

         if (appliedFilters) {
             var result = _.indexOf(appliedFilters.appliedFilters[key], filter);

             if (result != -1) {
                 return true;
             } else {
                 return false;
             }
         }
     }
     /********check selected category******** */
     $scope.checkRadioCategory = function (catid) {
         if ($.jStorage.get("selectedCategory"))
             var selectedId = $.jStorage.get("selectedCategory").category;

         if (selectedId) {


             if (selectedId == catid) {
                 return true;
             } else {
                 return false;
             }
         }
     }

     $scope.submitForm = function (data) {
         console.log(data);
         $scope.formSubmitted = true;
     };

     $scope.displayCntent = function () {
         //$('.viewSize, .view--btn').css('opacity', '1');
         $('.viewSize, .view--btn').css('display', 'block');
         $(' .view--btn').css({
             'position': 'relative',
             'top': '3px'
         });

     }
     $scope.hideContent = function () {
         $('.viewSize, .view--btn').css('display', 'none');
     };

     // var filter = {
     //     category: "",
     //     page: 1
     // };
     // //TODO: For demo purpose. Use category with id in production
     // ProductService.getProductsWithCategory(filter, function (data) {
     //     console.log(data)
     //     $scope.products = _.chunk(data.data.data, 3);

     // });
     var userId = {
         userId: $.jStorage.get("userId"),
         accessToken: $.jStorage.get("accessToken")
     }
     if (userId.userId) {
         CartService.getCart(userId, function (data) {

             if (data.data.data) {

                 $scope.mycart = data.data.data.products;
                 $scope.tempcart = [];
                 for (var i = 0; i < $scope.mycart.length; i++) {
                     $scope.tempcart.push({
                         productId: $scope.mycart[i].product.productId
                     })
                 }
             }
         })
         WishlistService.getWishlist(userId, function (data) {
             if (data.data.data)
                 $scope.wishlist = data.data.data;
             console.log("Wishlist data::::::::", $scope.wishlist);
         });
     } else {
         $scope.mycart = []
         $scope.mycart = $.jStorage.get("cart");
         $scope.wishlist = $.jStorage.get("wishlist")

         if ($scope.mycart) {
             myservices
             $scope.mycart = $scope.mycart.products;
             console.log("mycartfor offlinetooltip::::", $scope.mycart)
             $scope.tempcart = [];
             if ($scope.mycart) {
                 for (var i = 0; i < $scope.mycart.length; i++) {
                     $scope.tempcart.push({
                         productId: $scope.mycart[i].product.productId
                     })
                 }
             }
         }
     }
     $scope.checkWishlist = function (productId) {
         if (userId.userId) {

             var result = _.find($scope.wishlist, {
                 "productId": productId
             });

             if (result) {
                 return "fa fa-heart";
             } else {
                 return "fa fa-heart-o";
             }
         } else {
             var result = _.find($scope.wishlist, {
                 "productId": productId
             });

             if (result) {
                 return "fa fa-heart";
             } else {
                 return "fa fa-heart-o";
             }
         }
     }

     $scope.checkInCart = function (productId) {

         if (userId.userId) {

             var result = _.find($scope.tempcart, {
                 "productId": productId
             });

             if (result) {
                 return true
             } else {
                 return false
             }
         } else {
             var result = _.find($scope.tempcart, {
                 "productId": productId
             });

             if (result) {
                 return true
             } else {
                 return false
             }
         }
     }
     $scope.reload = function () {
         $state.reload();
     }
     // This function is used to display the modal on quck view button
     $scope.quickviewProduct = function (prod) {
         $scope.product = prod;
         $scope.selectedImage = _.sortBy($scope.product.images, ['order'])[0];
         $scope.selectSize = function (sizeObj) {
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
                 } else {
                     $scope.product = {};
                     // TODO: show out of stock
                 }
             })
         }
         $scope.addToCart = function () {
             var comment = "";
             myService.addToCart($scope.product, $scope.reqQuantity, $scope.selectedSize, comment, function (data) {
                 ModalService.addcart();
                 $scope.reload();
             })
         }
         $scope.addToWishlist = function () {
             var data = {
                 "product": $scope.product
             }
             myService.addToWishlist(data, function (data) {

                 ModalService.addwishlist();
             })
         }
         $scope.changeImage = function (index) {
             $scope.selectedImage = $scope.product.images[index];
         };
         $scope.reqQuantity = 1;
         $scope.updateQuantity = function (oper) {
             $scope.reqQuantity += parseInt(oper);
             console.log($scope.reqQuantity)
         }
         var quickviewProduct = $uibModal.open({
             animation: true,
             templateUrl: 'views/modal/quickview-product.html',
             scope: $scope,
             size: 'lg',
             windowClass: 'quickview-modal-size'
         });

     };
     //End of  modal on quck view button


 })