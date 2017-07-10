module.exports = _.cloneDeep(require("sails-wohlig-controller"));
var controller = {
    createOrderFromCart: function (req, res) {
        if (req.body) {
            Order.createOrderFromCart(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid request!"
                }
            });
        }
    },

    getUserOrders: function (req, res) {
        if (req.body) {
            Order.getUserOrders(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid request!"
                }
            });
        }
    },

    cancelProducts: function (req, res) {
        if (req.body) {
            Order.cancelProducts(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid request!"
                }
            });
        }
    },

    getCancelledOrdersForUser: function (req, res) {
        if (req.body) {
            Order.getCancelledOrdersForUser(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid request!"
                }
            });
        }
    },

    getAnOrderDetail: function (req, res) {
        if (req.body) {
            Order.getAnOrderDetail(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid request!"
                }
            });
        }
    }
};
module.exports = _.assign(module.exports, controller);