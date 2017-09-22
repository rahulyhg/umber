 myApp.controller('searchCtrl', function ($scope, toastr, CartService, $rootScope, $stateParams, $state, $filter, WishlistService, TemplateService, NavigationService,
     SizeService, BannerService, CategoryService, myService, ProductService, $timeout, $uibModal, ModalService, ListingService) {
     $scope.template = TemplateService.getHTML("content/search.html");
     TemplateService.title = "Form"; //This is the Title of the Website
     $scope.navigation = NavigationService.getNavigation();
     $scope.formSubmitted = false;

     $.jStorage.deleteKey("selectedCategory")
     myService.ctrlBanners("listing-page", function (data) {
         $scope.banner = data;
     });
     if (_.isEmpty($.jStorage.get('compareproduct'))) {
         $scope.showCheck = false

     } else {
         $scope.showCheck = true
         $scope.compareproduct = $.jStorage.get('compareproduct')
     }
     //  NavigationService.getListingCategories(function (data) {
     //      console.log('getProductsWithFilters', data);
     //      $scope.categories = data.data.data;

     //  });
     var parentCat = $stateParams.id;
     //  var data = {
     //      slug: $stateParams.id
     //  }

     $scope.data1 = {};
     $scope.data1.keyword = $stateParams.id
     $scope.products = [];
     $scope.product = [];
     $scope.data1.skip = 0;
     $scope.data1.limit = 9;
     $scope.loadingDisable = false;
     $scope.fetching = false;

     $scope.globalsSearch = function () {
         //  console.log("in global search****")
         ProductService.globalSearch($scope.data1, function (data) {
             if (!_.isEmpty(data.data.data)) {
                 $scope.product = _.chunk(data.data.data, 3);
                 _.each($scope.product, function (n) {
                     $scope.products.push(n);
                 })
                 $scope.loadingDisable = false;
                 $scope.data1.skip = $scope.data1.skip + 9;
                 if($scope.product.length<=0){
                    
                        $scope.empty = "No Products Found"
                    
                 }
             }
            
             $scope.searchFilters();
         })
     }



     $scope.loadMore1 = function () {
         $scope.globalsSearch();
         $scope.loadingDisable = true;
     }
     $scope.searchFilters = function () {
         var data = {};
         $scope.pro = _.flattenDeep($scope.products)
         _.each($scope.pro, function (n) {
             data.slug = n.homeCategory.slug;

             CategoryService.getCategoryWithParent(data, function (data) {
                 $scope.categories = data.data.data;
                 $scope.filteredProducts($scope.categories[0].slug)
             })
         })

     }

     /******getting products based on category******* */
     $scope.filteredProducts = function (selectedCategory) {
         $.jStorage.deleteKey("appliedFilters");
         if ($.jStorage.get("selectedCategory") && selectedCategory != $.jStorage.get("selectedCategory").slug) {
             $.jStorage.deleteKey("appliedFilters");
         }
         var input = {
             "slug": selectedCategory,
             "page": 1
         }
         $.jStorage.set("selectedCategory", input);
         /***************retriving filters based on categories and respective filters**************** */
         ListingService.retriveProductsWithCategory(function (data) {

             if (data.data.data.length == 0) {
                 $scope.displayMessage = "No Product Found";
                 //  $scope.products = ""

             } else if (!_.isEmpty(data.data.data)) {
                 $scope.displayMessage = "";
                 $scope.products = _.chunk(data.data.data, 3);
                 //  console.log("productretruved based on category", data);

                 ListingService.retriveFiltersWithCategory(function (data) {
                     //  console.log("product category on basis of category", data.data.data)
                     $scope.filters = data.data.data;
                     $scope.min = $scope.filters.priceRange[0].min;
                     $scope.max = $scope.filters.priceRange[0].max;
                     //  console.log("filters", $scope.filters.priceRange[0].max)
                     $scope.slider_translate = {
                         minValue: 0,
                         maxValue: 100,
                         options: {

                             floor: $scope.filters.priceRange[0].min,
                             ceil: $scope.filters.priceRange[0].max,
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
         $scope.filteredProducts($.jStorage.get('selectedCategory').slug)
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

         appliedFilters = $.jStorage.get('appliedFilters') ? $.jStorage.get('appliedFilters') : {
             appliedFilters: {
                 slug: [],
                 type: [],
                 style: [],
                 color: [],
                 collection: [],
                 size: [],
                 fabric: [],
             }
         };
         console.log(filter, key);
         var cat = $.jStorage.get("selectedCategory").slug;
         appliedFilters.appliedFilters.slug = [cat];

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
             //  console.log("filtersretrived:::", data.data.data);
             $scope.products = _.chunk(data.data.data.products, 3);
             $scope.filters = data.data.data.filters;

         })

         //api call
     }
     /******filters applied automatic if already applied****** */
     if ($.jStorage.get("appliedFilters")) {
         ProductService.getProductsWithAppliedFilters($.jStorage.get("appliedFilters"), function (data) {
             //  console.log("filtersretrived:::", data.data.data);
             $scope.products = _.chunk(data.data.data.products, 3);
             $scope.filters = data.data.data.filters;

         })
     }
     $scope.loadMore = function () {
         var appliedFilters = $.jStorage.get("appliedFilters");
         appliedFilters.page++;
         ProductService.getProductsWithAppliedFilters(appliedFilters, function (data) {
             //  console.log("filtersretrived:::", data.data.data);
             //  $scope.products.push(_.chunk(data.data.data.products, 3));
             var arrray = _.flattenDeep($scope.products);
             arrray.push(data.data.data.products);
             $scope.products = _.chunk(arrray, 3);
             $scope.filters = data.data.data.filters;
         })
     }
     $scope.priceSet = function (min, max) {
         console.log(min, max)
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
             var selectedId = $.jStorage.get("selectedCategory").slug;

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

     $scope.sortButton = 'Sort By';
     $scope.menu = ['Name', 'Price Low to High', 'Price High to Low'];
     $scope.changeSorting = function (name) {
         $scope.sortButton = name;
         console.log("Hi", $scope.products);
         if (name == 'Name') {
             var arrray = _.flattenDeep($scope.products);
             var test = $filter('orderBy')(arrray, 'productName');
             $scope.products = _.chunk(test, 3);
         } else if (name == 'Price Low to High') {
             var arrray = _.flattenDeep($scope.products);
             var test = $filter('orderBy')(arrray, 'price');
             $scope.products = _.chunk(test, 3);
         } else if (name == 'Price High to Low') {
             var arrray = _.flattenDeep($scope.products);
             var test = $filter('orderBy')(arrray, '-price');
             $scope.products = _.chunk(test, 3);
         }
     };



     // This function is used to display the modal on quck view button
     $scope.quickviewProduct = function (prod) {
         //  console.log("prod", prod);
         $scope.product = prod;
         $scope.sizes = $scope.product.size;
         //  console.log("$scope.sizes", $scope.sizes);
         //  $scope.activeButton = $scope.sizes[0].name;
         $scope.activeButton = $scope.sizes.name;
         $scope.selectedSize = $scope.sizes;
         $scope.arrayCheck = angular.isArray($scope.sizes);
         //  console.log("$scope.arrayCheck", $scope.arrayCheck);
         //  console.log("$scope.selectedSize", $scope.selectedSize);
         $scope.selectedImage = _.sortBy($scope.product.images, ['order'])[0];
         $scope.selectSize = function (sizeObj) {
             $scope.activeButton = sizeObj.name;
             $scope.selectedSize = sizeObj;
             var data = {
                 productId: $scope.product.productId,
                 size: sizeObj._id,
                 color: $scope.product.color._id
             }

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
         $scope.closeModal = function () {
             quickviewProduct.close();
         }
     };
     //End of  modal on quck view button
     if (_.isEmpty($scope.products))
         $scope.displayMessage = "No Product Found";

     // Start of UIB Carousel slider's function for gird view
     $scope.gridViewSlideInterval = 5000;
     $scope.active = 0;
     $scope.currentGridViewSlideIndex = 0;
     $scope.gridViewSlide = [{
         img: 'frontend/img/individual/product-test.jpg',
         text: 'Cool Shirt',
         id: 1
     }, {
         img: 'frontend/img/individual/7.jpg',
         text: 'Nice Shirt',
         id: 2
     }];
     
     //   $scope.addgridViewSlide = function () {
     //       slides.push({

     //       })
     //   };

     //End of UIB Carousel slider's function for gird view

 })