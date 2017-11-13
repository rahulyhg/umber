module.exports = _.cloneDeep(require("sails-wohlig-controller"));
var controller = {
    applicableDiscounts: function (req, res) {
        console.log("inside Discount controller applicableDiscounts",req.body);
        if (req.body) {
            console.log("InController---------",req.body)
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

    getDiscountProducts: function (req, res) {
        console.log("inside Discount controller getDiscountProducts",req.body);
        if (req.body) {
            console.log("InController---------",req.body)
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
