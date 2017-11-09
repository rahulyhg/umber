myApp.service('ListingService', function ($http, WishlistService, BannerService, CartService, ProductService) {


    this.retriveProductsWithCategory = function (callback) {
        var input = $.jStorage.get("selectedCategory");
        ProductService.getProductsWithFilters(input, function (data) {

            callback(data);
        })
    }


    this.retriveFiltersWithCategory = function (callback) {
        var input = {
            slug: $.jStorage.get("selectedCategory").slug
        }
        ProductService.getFiltersWithCategory(input, function (data) {
            callback(data);
        })
    }

    this.getAllDiscounts = function (callback) {
        DiscountService.getAllDiscounts(function (data) {
            console.log(data)
            callback(data);
        })
    }
})