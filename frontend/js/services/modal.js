myApp.service('ModalService', function ($http, $uibModal, WishlistService, BannerService, CartService) {

    this.addwishlist = function () {
        this.addwishlistmodal = $uibModal.open({
            animation: true,
            templateUrl: 'views/modal/wishlistadd.html',
            size: 'md',

        });
    };

})