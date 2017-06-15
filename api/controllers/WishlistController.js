module.exports = _.cloneDeep(require("sails-wohlig-controller"));
var controller = {
    saveProduct: function (req, res) {
        if (req.body) {
            Wishlist.saveProduct(req.body, res.callback);
        } else {
            res.json({
                message: {
                    data: "Invalid request!"
                }
            })
        }
    },

    getWishlist: function (req, res) {
        if (req.body) {
            Wishlist.getWishlist(req.body, res.callback);
        } else {
            res.json({
                message: {
                    data: "Invalid request!"
                }
            })
        }
    },

    removeProductFromWishlist: function (req, res) {
        if (req.body) {
            Wishlist.removeProductFromWishlist(req.body, res.callback);
        } else {
            res.json({
                message: {
                    data: "Invalid request!"
                }
            });
        }
    }
};
module.exports = _.assign(module.exports, controller);
