myApp.service('ModalService', function ($http, $uibModal, WishlistService, BannerService, CartService, $timeout) {

    this.addwishlist = function () {
        var addwishlistmodal = $uibModal.open({
            animation: true,
            templateUrl: 'views/modal/wishlistadd.html',
            size: 'md',

        });
        $timeout(function () {
            addwishlistmodal.close();
        }, 2000)
    };
    this.addcart = function () {
        var addcartmodal = $uibModal.open({
            animation: true,
            templateUrl: 'views/modal/cartadd.html',
            size: 'md',

        });
        $timeout(function () {
            addcartmodal.close();
        }, 2000)
    };
})