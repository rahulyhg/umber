module.exports = _.cloneDeep(require("sails-wohlig-controller"));
var controller = {
    getProducts: function (req, res) {
        if (req.body) {
            Product.getAllProducts(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid request"
                }
            })
        }
    },

    getEnabledProducts: function (req, res) {
        if (req.body) {
            Product.getEnabledProducts(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid request"
                }
            })
        }
    },

    getNewArrivals: function (req, res) {
        if (req.body) {
            Product.getNewArrivals(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid request"
                }
            })
        }
    },

    getFeatured: function (req, res) {
        if (req.body) {
            Product.getFeatured(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid request"
                }
            })
        }
    },

    getProductWithId: function (req, res) {
        if (req.body) {
            Product.getProductWithId(req.params.id, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid request"
                }
            })
        }
    }
};
module.exports = _.assign(module.exports, controller);