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
     NavigationService.getAllDiscounts(function (data) {
         $scope.discounts = data.data.data.results;

     });

     $scope.data1 = {};
     $scope.data1.keyword = $stateParams.id
     $scope.products = [];
     $scope.product = [];
     $scope.productss = [];
     $scope.data1.skip = 0;
     $scope.data1.limit = 9;
     $scope.data1.appliedFilters = {};
     $scope.loadingDisable = false;
     $scope.fetching = false;
     $scope.categories = [];
     $scope.priceRange = []
     $scope.appliedFilters = {};
     $scope.appliedFilters.category = [];
     $scope.appliedFilters.type = [];
     $scope.appliedFilters.collection = [];
     $scope.appliedFilters.size = [];
     $scope.appliedFilters.style = [];
     $scope.appliedFilters.color = [];
     $scope.appliedFilters.fabric = [];
     $scope.appliedFilters.discount = [];
     $scope.appliedFilters.page = 1;
     $scope.filter = {
         keyword: $scope.data1.keyword,
         limit: 12,
         appliedFilters: $scope.appliedFilters
     }
     $scope.filter.skip = 0

     $scope.globalsSearch = function () {
         //  console.log("in global search****11111", $scope.filter)
         //  $scope.filter = {
         //      keyword: $scope.data1.keyword,
         //      skip: 0,
         //      limit: 9,
         //      appliedFilters: $scope.appliedFilters
         //  }
         ProductService.searchWithFilters($scope.filter, function (data) {
             if (!_.isEmpty(data.data.data)) {
                 _.each(data.data.data.products, function (n) {
                     $scope.product.push(n);
                 })
                 //  _.each($scope.product, function (n) {
                 //      $scope.productss.push(n);
                 //  })
                 _.each($scope.product, function (prod) {
                     prod.size = _.sortBy(prod.size, [function (o) {
                         return o.order;
                     }]);
                     $scope.sortesSize = true;
                 });
                 if ($scope.sortesSize) {
                     $scope.products = _.chunk($scope.product, 3);
                 }
                 $scope.filters = data.data.data;
                 $scope.priceRange.push(data.data.data.price);
                 $scope.priceRange = _.flattenDeep($scope.priceRange)
                 $scope.price = {
                     max: Math.max.apply(null, $scope.priceRange),
                     min: Math.min.apply(null, $scope.priceRange)
                 }
                 $scope.max = $scope.price.max;
                 $scope.min = $scope.price.min;
                 $scope.loadingDisable = false;
                 //  $scope.data1.skip = $scope.data1.skip + 9;
                 $scope.filter.skip = $scope.filter.skip + 9;
                 if ($scope.product.length <= 0) {
                     $scope.empty = "No Products Found"
                 }
                 if (!_.isEmpty($scope.filters.type)) {
                     $scope.showType = true;
                 }
                 if (!_.isEmpty($scope.filters.color)) {
                     $scope.showcolor = true;
                 }
                 if (!_.isEmpty($scope.filters.prodCollection)) {
                     $scope.showprodCollection = true;
                 }
                 if (!_.isEmpty($scope.filters.fabric)) {
                     $scope.showfabric = true;
                 }
                 if (!_.isEmpty($scope.filters.size)) {
                     $scope.showsize = true;
                 }
                 if (!_.isEmpty($scope.filters.style)) {
                     $scope.showstyle = true;
                 }
             } else if ($scope.filter.appliedFilters.max && $scope.filter.skip == 0 && _.isEmpty(data.data.data)) {
                 $scope.products = [];
             } else {
                 //  $scope.empty = "No Products Found"
                 //  $scope.products = [];
                 console.log('enter');
             }
             //  if (!_.isEmpty(data.data.data) && $scope.appliedFilters.max || $scope.appliedFilters.min) {
             //      console.log("##########not empty###")
             //      $scope.products = _.chunk(data.data.data.products);
             //  } else {
             //      $scope.products = [];
             //  }

         })
     }

     $scope.loadMore1 = function () {
         $scope.globalsSearch();
         $scope.loadingDisable = true;
     }

     $scope.applyFilters = function (key, filter, key1, filter1) {
         $scope.product = [];
         $scope.products = [];
         console.log("in apply filters", key, "value", filter, "key1", key1, "filter1", filter1);
         var result = _.indexOf($scope.appliedFilters[key], filter._id);
         console.log("check result", result)
         if (result != -1) {
             _.pullAt($scope.appliedFilters[key], result);
         } else {
             if (!_.isArrayLike($scope.appliedFilters[key])) {
                 $scope.appliedFilters[key] = [];
             }
             if (!_.isArrayLike($scope.appliedFilters[key1])) {
                 $scope.appliedFilters[key1] = [];
             }
             if (filter._id) {
                 $scope.appliedFilters[key].push(filter._id);
             } else if (!filter._id) {
                 $scope.appliedFilters[key].push(filter);
             }
             $scope.appliedFilters[key1].push(filter1);
             //  console.log("$$$$$$$$$$$$$in apply filters", $scope.appliedFilters)
         }
         $.jStorage.set('appliedFilterss', $scope.appliedFilters);

         //  ProductService.searchWithFilters($scope.filter, function (data) {
         //      console.log("in apply filters searchWithFilters****", data.data);
         //      if (!_.isEmpty(data.data.data)) {
         //          $scope.product = _.chunk(data.data.data.products, 3);
         //          console.log("in global search****", $scope.product);
         //          _.each($scope.product, function (n) {
         //              $scope.products.push(n);
         //          })
         //          //  $scope.filters = data.data.data
         //          //  $scope.loadingDisable = false;
         //          //  $scope.filter.skip = $scope.filter.skip + 9;
         //          //  filter.skip = $scope.data1.skip
         //          if ($scope.product.length <= 0) {

         //              $scope.empty = "No Products Found"

         //          }
         //      } else {
         //          //  $scope.empty = "No Products Found"

         //      }

         //  })
         $scope.filter.skip = 0
         //  ProductService.searchWithFilters($scope.filter, function (data) {

         //  })
         $timeout(function () {
             $scope.globalsSearch();
         }, 1000);
         //  $scope.globalsSearch();
     }

     $rootScope.clickfun = function (product) {
         console.log("in clickfun", product)
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
         $scope.result = _.remove(removeCompare, {
             productId: prodId
         });
         $scope.compareproduct = removeCompare;
         $.jStorage.set("compareproduct", removeCompare);
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

     /******filters applied automatic if already applied****** */

     $scope.loadMore = function () {
         console.log("loadMore:::", loadMore);
         var appliedFilters = $.jStorage.get("appliedFilters");
         appliedFilters.page++;
         ProductService.getProductsWithAppliedFilters(appliedFilters, function (data) {
             //  console.log("filtersretrived:::", data.data.data);
             //  $scope.products.push(_.chunk(data.data.data.products, 3));
             var arrray = _.flattenDeep($scope.products);
             arrray.push(data.data.data.products);
             _.each(arrray, function (arr) {
                 arr.size = _.sortBy(arr.size, [function (o) {
                     return o.order;
                 }]);
                 $scope.sortesSize = true;
             })
             $scope.products = _.chunk(arrray, 3);
             $scope.filters = data.data.data.filters;
         })
     }
     $scope.priceSet = function (min, max) {
         console.log(min, max);
         $scope.applyFilters('min', min, 'max', max)

     }

     //  var input = {
     //      "slug": $scope.categories[0].slug,
     //      "page": 1
     //  }
     //  console.log("input", input);
     //  $.jStorage.set("selectedCategory", input);


     //  console.log("$.jStorage.set('selectedCategory', input)", $.jStorage.get('selectedCategory'));
     //  $scope.searchFilters();

     /******checking filters after reload***** */
     $scope.checkFilterStatus = function (key, filter) {
         var appliedFilters = $.jStorage.get("appliedFilterss");

         if (appliedFilters) {
             //  console.log("appliedFilters", appliedFilters[key], "filter", filter)
             var result = _.indexOf(appliedFilters[key], filter);
             //  console.log("result", result)
             if (result != -1) {
                 return true;
             } else {
                 return false;
             }
         }
     }
     /********check selected category******** */
     $scope.checkRadioCategory = function (catid) {
         //  console.log("catid", catid)
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
     $scope.addToWishlist = function (prod) {
         console.log("addToWishlist", prod);
         var data = {
             "product": prod,
         }
         myService.addToWishlist(data, function (data) {
             ModalService.addwishlist();
         })
     }
     $scope.removeWishlist = function (prodId) {
         var data = {};
         if ($.jStorage.get("accessToken")) {
             data.accessToken = $.jStorage.get("accessToken");
             data.productId = prodId;
             WishlistService.removeProduct(data, function (data) {
                 console.log(data);
                 $state.reload();
             })
         } else {
             myService.removeWishlist(data, function (data) {
                 $state.reload();
             })
         }
     }

     $scope.addRemoveToWishlist = function (product) {
         if (userId.userId) {

             var result = _.find($scope.wishlist, {
                 "productId": product.productId
             });
             if (result) {
                 $scope.removeWishlist(product.productId);
             } else {
                 $scope.addToWishlist(product);
             }
         } else {
             $scope.mycart = $.jStorage.get("cart");
             $scope.wishlist = $.jStorage.get("wishlist")
             var result = _.find($scope.wishlist, {
                 "productId": product.productId
             });
             if (result) {
                 console.log("removeWishLst", result)
                 $scope.removeWishlist(product);
             } else {
                 $scope.addToWishlist(product);
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
         console.log("prod", prod);
         $scope.product = prod;
         //  $scope.sizes = $scope.product.size;
         $scope.sizes = _.sortBy($scope.product.size, [function (o) {
             return o.order;
         }]);
         $scope.activeButton = $scope.sizes[0].name;
         //  $scope.activeButton = $scope.sizes.name;
         $scope.selectedSize = $scope.sizes;
         $scope.arrayCheck = angular.isArray($scope.sizes);
         //  console.log("$scope.arrayCheck", $scope.arrayCheck);
         //  console.log("$scope.selectedSize", $scope.selectedSize);
         $scope.selectedImage = _.sortBy($scope.product.images, ['order'])[0];
         $scope.selectSize = function (sizeObj) {
             console.log("$scope.selectedSize", sizeObj);
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
                     //  $scope.product = {};
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
         $scope.selectedImageIndex = 0;
         $scope.changeImage = function (index) {
             $scope.selectedImageIndex = index;
         };
         $scope.reqQuantity = 1;
         $scope.updateQuantity = function (oper) {
             $scope.reqQuantity += parseInt(oper);
             console.log($scope.reqQuantity)
         }
         $scope.quickviewProduct = $uibModal.open({
             animation: true,
             templateUrl: 'views/modal/quickview-product.html',
             scope: $scope,
             size: 'lg',
             windowClass: 'quickview-modal-size'
         });
         $scope.closeModal = function () {
             $scope.quickviewProduct.close();
         }
     };
     //End of  modal on quck view button
     //To open size chart on quick
     $scope.openSizeChart = function () {
         $scope.openSizeChartModal = $uibModal.open({
             animation: true,
             templateUrl: 'views/modal/size-chart.html',
             size: 'md',
             scope: $scope
         });
     };

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