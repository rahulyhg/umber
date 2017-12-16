module.exports = _.cloneDeep(require("sails-wohlig-controller"));
var controller = {
    applicableDiscounts: function (req, res) {
        if (req.body) {
            Discount.applicableDiscounts(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            })
        }
    },
    discountsParticularProduct: function (req, res) {
        if (req.body) {
            Discount.discountsParticularProduct(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            })
        }
    },
    getDiscountProducts: function (req, res) {
        if (req.body) {
            Discount.getDiscountProducts(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            })
        }
    }

};
module.exports = _.assign(module.exports, controller);