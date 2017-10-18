 myApp.controller('ListingPageCtrl', function ($scope, toastr, CartService, $rootScope, $stateParams, $state, $filter, WishlistService, TemplateService, NavigationService,
     SizeService, BannerService, CategoryService, myService, ProductService, $timeout, $uibModal, ModalService, ListingService) {
     $scope.template = TemplateService.getHTML("content/listing-page.html");
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
     console.log("stateParam", $stateParams)
     var parentCat = $stateParams.id;
     var data = {
         slug: $stateParams.id,
         catId: $stateParams.cat
     }

     if ($stateParams.cat) {
         ProductService.productWithCategory(data, function (data) {
             //  console.log("$$$$$$$in categoryProduct cat", data.data.data)
             $scope.products = _.chunk(data.data.data, 3);
         })
     }

     if (!$stateParams.cat) {
         ProductService.getFeatured(function (data) {
             //  console.log("$$$$$$$in categoryProduct", data.data.data);
             $scope.filters = {};
             $scope.products = _.chunk(data.data.data.featureds, 3);
             $scope.categories = data.data.data.category;
             $scope.filters.types = data.data.data.type;
             $scope.filters.collections = data.data.data.collection;
             $scope.filters.sizes = data.data.data.size;
             $scope.filters.styles = data.data.data.style;
             $scope.filters.colors = data.data.data.color;
             $scope.filters.fabrics = data.data.data.fabric;
             $scope.filters.price = data.data.data.price;
             $scope.max = Math.max.apply(null, $scope.filters.price);
             $scope.min = Math.min.apply(null, $scope.filters.price);
             //  console.log("$scope.categories", $scope.categories[0].slug)
             var input = {
                 "slug": $scope.categories[0].slug,
                 "page": 1
             }
             $.jStorage.set("selectedCategory", input);
             if (!$stateParams.id) {
                 var data = {};
                 data.slug = $scope.categories[0].slug;
                 $scope.filteredProducts(slug)
             }
         })
     }



     $scope.loadMore1 = function () {
         console.log("$scope.data1.skip", $scope.data1.skip)
         $scope.globalsSearch();
         $scope.loadingDisable = true;
     }



     //  if ($stateParams.id === "search") {
     //      console.log("rootscope", $rootScope.searchedProduct)
     //      $scope.products = _.chunk($.jStorage.get("searchedProduct"), 3)

     //      console.log($scope.products)

     //  }
     if ($stateParams.id) {
         CategoryService.getCategoryWithParent(data, function (data) {
             console.log("cat from parentctrl", data.data.data);
             $scope.categories = data.data.data;
             $scope.filteredProducts($scope.categories[0].slug)
         })
     } else {
         //  $scope.filteredProducts($scope.categories[0].slug)
     }

     /******getting products based on category******* */
     $scope.filteredProducts = function (selectedCategory) {
         console.log("selectedCategory", selectedCategory)
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
                 $scope.products = ""

             } else if (!_.isEmpty(data.data.data)) {
                 $scope.displayMessage = "";
                 $scope.products = _.chunk(data.data.data, 3);
                 console.log("productretruved based on category", data)

                 ListingService.retriveFiltersWithCategory(function (data) {
                     console.log("product category on basis of category", data.data.data)
                     $scope.filters = data.data.data;
                     $scope.min = $scope.filters.priceRange[0].min;
                     $scope.max = $scope.filters.priceRange[0].max;
                     console.log("filters", $scope.filters.priceRange[0].max)
                     //  $scope.sliderTranslate = {
                     //      options: {
                     //          floor: 45,
                     //          ceil: $scope.filters.priceRange[0].max,
                     //          id: 'translate-slider'
                     //          // translate: function (value, id, which) {
                     //          //     return '$' + value;
                     //          // }
                     //      }
                     //  };
                 })

             } else {
                 toastr.error('There was some error', 'Error');
             }
         })
     }
     //  console.log("$.jStorage.get('selectedCategory')", $.jStorage.get('selectedCategory'))
     if ($.jStorage.get('selectedCategory')) {
         //  console.log("$.jStorage.get('selectedCategory')", $.jStorage.get('selectedCategory'))
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
     $scope.applyFilters = function (key, filter, key1, filter1) {
         //  console.log("$.jStorage.get('selectedCategory').slug", $.jStorage.get("selectedCategory").slug);
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
         console.log("###filter", filter, key, filter1, key1);
         var cat = $.jStorage.get("selectedCategory").slug;
         appliedFilters.appliedFilters.slug = [cat];
         if (filter._id) {
             var result = _.indexOf(appliedFilters.appliedFilters[key], filter._id);
         } else {
             //  var result = _.indexOf(appliedFilters.appliedFilters[key], filter);
         }
         //  if (filter1) {
         //      var result = _.indexOf(appliedFilters.appliedFilters[key], filter);
         //  }
         if (filter1) {
             console.log("!!!!!!!!!!!!!!!!!")
             if (!_.isArrayLike(appliedFilters.appliedFilters[key])) {
                 appliedFilters.appliedFilters[key] = [];
                 appliedFilters.appliedFilters[key1] = [];
             }
             if (filter._id) {
                 appliedFilters.appliedFilters[key].push(filter._id);
             } else {
                 appliedFilters.appliedFilters[key].push(filter);
                 appliedFilters.appliedFilters[key1].push(filter1);
             }
         }
         console.log("check result", result)
         if (result != -1) {
             if (filter1) {
                 _.pullAt(appliedFilters.appliedFilters[key1], result);
             }
             if (filter) {
                 _.pullAt(appliedFilters.appliedFilters[key], result);
             }
         } else {
             //  if (filter1) {
             //      if (!_.isArrayLike(appliedFilters.appliedFilters[key1])) {
             //          appliedFilters.appliedFilters[key1] = [];
             //      }
             //      if (filter._id) {
             //          appliedFilters.appliedFilters[key1].push(filter1._id);
             //      } else {
             //          appliedFilters.appliedFilters[key1].push(filter1);
             //      }
             //  }
             if (filter) {
                 if (!_.isArrayLike(appliedFilters.appliedFilters[key])) {
                     appliedFilters.appliedFilters[key] = [];
                 }
                 if (filter._id) {
                     appliedFilters.appliedFilters[key].push(filter._id);
                 } else {
                     appliedFilters.appliedFilters[key].push(filter);
                 }
             }
         }
         appliedFilters.page = 1;
         console.log("appliedFilters!!!!!!!!", appliedFilters)
         $.jStorage.set('appliedFilters', appliedFilters)

         console.log("Jstoragefor filters::", $.jStorage.get("appliedFilters"))
         _.forIn(appliedFilters.appliedFilters, function (val, key, obj) {
             if (_.isEmpty(val)) {
                 console.log("key: ", key);
                 delete appliedFilters.appliedFilters[key];
             }
         });
         console.log("apply filters:before ", appliedFilters);
         ProductService.getProductsWithAppliedFilters(appliedFilters, function (data) {
             console.log("filtersretrived:::", data.data.data);
             $scope.products = _.chunk(data.data.data.products, 3);
             $scope.filters = data.data.data.filters;

         })

         //api call
     }
     /******filters applied automatic if already applied****** */
     if ($.jStorage.get("appliedFilters")) {
         ProductService.getProductsWithAppliedFilters($.jStorage.get("appliedFilters"), function (data) {
             console.log("filtersretrived:::", data.data.data);
             $scope.products = _.chunk(data.data.data.products, 3);
             $scope.filters = data.data.data.filters;

         })
     }
     $scope.loadMore = function () {
         var appliedFilters = $.jStorage.get("appliedFilters");
         appliedFilters.page++;
         ProductService.getProductsWithAppliedFilters(appliedFilters, function (data) {
             console.log("filtersretrived:::", data.data.data);
             //  $scope.products.push(_.chunk(data.data.data.products, 3));
             var arrray = _.flattenDeep($scope.products);
             arrray.push(data.data.data.products);
             $scope.products = _.chunk(arrray, 3);
             $scope.filters = data.data.data.filters;
         })
     }
     $scope.priceSet = function (min, max) {
         console.log(min, max);
         $scope.applyFilters('min', min, 'max', max);
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
     $scope.addToWishlist = function (prod) {
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
         console.log("in addremoveToWishList product", product);
         console.log("(userId.userId", userId.userId);
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
         console.log("in quick view", prod);
         $scope.product = prod;

         if ($scope.product.sizes) {
             $scope.sizes = $scope.product.sizes
         } else if (!$scope.product.sizes) {
             $scope.sizes = $scope.product.size;
         }
         console.log($scope.sizes);
         if (angular.isArray($scope.sizes)) {
             $scope.activeButton = $scope.sizes[0].name;
             $scope.selectedSize = $scope.sizes[0];
         } else {
             $scope.activeButton = $scope.sizes.name;
             $scope.selectedSize = $scope.sizes;
         }


         $scope.arrayCheck = angular.isArray($scope.sizes);
         //  console.log("$scope.arrayCheck", $scope.arrayCheck);
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
                 console.log("SKU:", data.data);
                 if (data.data.value) {
                     console.log("after sku if ", $scope.product);
                     $scope.product = data.data.data;
                 } else {
                     console.log("after sku", $scope.product);
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

     $scope.listViewSlide = [{
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