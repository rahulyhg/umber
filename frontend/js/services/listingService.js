myApp.service('ListingService', function ($http, WishlistService, BannerService, CartService, ProductService) {


    this.retriveProductsWithCategory = function (callback) {
        var input = $.jStorage.get("selectedCategory");
        ProductService.getProductsWithFilters(input, function (data) {

            callback(data);
        })
    }


    this.retriveFiltersWithCategory = function (callback) {
        var input = {
            category: $.jStorage.get("selectedCategory").category
        }
        ProductService.getFiltersWithCategory(input, function (data) {
            callback(data);

        })
    }
})