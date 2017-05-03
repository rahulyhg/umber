module.exports = _.cloneDeep(require("sails-wohlig-controller"));
var controller = {
    saveProduct: function (req, res) {
        if (req) {
            Cart.saveProduct(req, res.callback);
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
