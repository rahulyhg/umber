module.exports = _.cloneDeep(require("sails-wohlig-controller"));
var controller = {
    saveProduct: function (req, res) {
        console.log("CartController->saveProduct");
        if (req.body) {
            Cart.saveProduct(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid request"
                }
            })
        }
    },

    getCart: function (req, res) {
        console.log("getCart");
        if (req.body) {
            Cart.getCart(res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid request"
                }
            })
        }
    },

    updateCart: function (req, res) {
        if (req.body) {
            Cart.updateCart(req.body);
        } else {
            console.log("No cart found");
        }
    }
};
module.exports = _.assign(module.exports, controller);
