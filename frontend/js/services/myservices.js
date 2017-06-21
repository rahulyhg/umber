myApp.service('myService', function ($http, BannerService) {
    this.ctrlBanners = function (pagename, callback) {
        var banner = {
            pageName: pagename
        }
        BannerService.getBanner(banner, function (data) {
            console.log(data);
            callback(data.data.data)

        });
    }
})