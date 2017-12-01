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

    updateOrderAddress: function (req, res) {
        if (req.body) {
            Order.updateOrderAddress(req.body, res.callback);
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
    },
    ConfirmOrderPlacedMail: function (req, res) {
        if (req.body) {
            Order.ConfirmOrderPlacedMail(req.body, res.callback);
        } else {
            res.json({
                message: {
                    data: "Invalid request!"
                }
            });
        }
    },
    returnedProductEmail: function (req, res) {
        if (req.body) {
            Order.returnedProductEmail(req.body, res.callback);
        } else {
            res.json({
                message: {
                    data: "Invalid request!"
                }
            });
        }
    },
    cancelProductEmail: function (req, res) {
        if (req.body) {
            Order.cancelProductEmail(req.body, res.callback);
        } else {
            res.json({
                message: {
                    data: "Invalid request!"
                }
            });
        }
    },
    deliveredProductEmail: function (req, res) {
        if (req.body) {
            Order.deliveredProductEmail(req.body, res.callback);
        } else {
            res.json({
                message: {
                    data: "Invalid request!"
                }
            });
        }
    },
    shippedProductEmail: function (req, res) {
        if (req.body) {
            Order.shippedProductEmail(req.body, res.callback);
        } else {
            res.json({
                message: {
                    data: "Invalid request!"
                }
            });
        }
    },
    redirectUrl: function (req, res) {
        if (req.body) {
            console.log(req.body);
            var http = require('http'),
                fs = require('fs'),
                qs = require('querystring');
            var ccav = require('./ccavutil.js');
            var body = '',
                workingKey = '236E7613D01B3B0BDAA4805D6A1162DB', //Put in the 32-Bit key shared by CCAvenues.
                accessCode = 'AVOH01EK30BS66HOSB', //Put in the Access Code shared by CCAvenues.
                encRequest = '';

            var ccavEncResponse = '',
                ccavResponse = '',
                ccavPOST = '';

            ccavEncResponse += req.body;
            ccavPOST = qs.parse(ccavEncResponse);
            var encryption = ccavPOST.encResp;
            ccavResponse += ccav.decrypt(req.body.encResp, workingKey);
            console.log(ccavEncResponse);


        } else {
            res.redirect(env.realHost + "/error");
        }
    },
    cancelUrl: function (req, res) {
        if (req.body) {} else {
            res.redirect(env.realHost + "/error");
        }
    },
    formRedirect: function (req, res) {
        console.log(req.query.orderId);
        Order.findOne({
            _id: mongoose.Types.ObjectId(req.query.orderId)
        }).populate('user').exec(function (err, order) {
            var toPayment = {
                "merchant_id": "150530",
                "order_id": order.orderNo,
                "currency": "INR",
                "amount": order.totalAmount,
                "redirect_url": "http://umber.wohlig.co.in/api/Order/redirectUrl",
                "cancel_url": "http://umber.wohlig.co.in/api/Cart/cancelUrl",
                "language": "EN",
                "billing_name": order.user.firstName + " " + order.user.lastName,
                "billing_address": order.billingAddress.line1 + " " + order.billingAddress.line2 + " " + order.billingAddress.line3,
                "billing_city": order.billingAddress.city,
                "billing_state": order.billingAddress.state,
                "billing_zip": order.billingAddress.pincode,
                "billing_country": order.billingAddress.country,
                "billing_tel": order.user.mobile,
                "billing_email": order.email,
                "delivery_name": order.firstName + " " + order.lastName,
                "delivery_address": order.shippingAddress.line1 + " " + order.shippingAddress.line2 + " " + order.shippingAddress.line3,
                "delivery_city": order.shippingAddress.city,
                "delivery_state": order.shippingAddress.state,
                "delivery_zip": order.shippingAddress.pincode,
                "delivery_country": order.shippingAddress.country,
                "delivery_tel": order.mobileNo
            }
            console.log(order);
            res.view("payment", toPayment);
        });

    },
    postReq: function (req, res) {
        console.log("in post request");
        var http = require('http'),
            fs = require('fs'),
            qs = require('querystring');
        var ccav = require('./ccavutil.js');
        var body = '',
            workingKey = '236E7613D01B3B0BDAA4805D6A1162DB', //Put in the 32-Bit key shared by CCAvenues.
            accessCode = 'AVOH01EK30BS66HOSB', //Put in the Access Code shared by CCAvenues.
            encRequest = '',
            formbody = '';

        _.each(req.body, function (val, key) {
            body += key + '=' + val + '&';
        });
        console.log(body);
        encRequest = ccav.encrypt(body, workingKey);
        formbody = '<form id="nonseamless" method="post" name="redirect" action="https://test.ccavenue.com/transaction/transaction.do?command=initiateTransaction"/> <input type="hidden" id="encRequest" name="encRequest" value="' + encRequest + '"><input type="hidden" name="access_code" id="access_code" value="' + accessCode + '"><script language="javascript">document.redirect.submit();</script></form>';

        res.send(formbody);
    },
    hdfcPaymentGateway: function (req, res) {
        // Order.hdfcPaymentGateway(req.body, res)
        console.log("in hdfc payment gateway");
        var ccav = require('./ccavutil.js');


        var body = '',
            workingKey = '236E7613D01B3B0BDAA4805D6A1162DB', //Put in the 32-Bit key shared by CCAvenues.
            accessCode = 'AVOH01EK30BS66HOSB', //Put in the Access Code shared by CCAvenues.
            encRequest = '',
            formbody = '';

        // req.on('data', function (data) {
        body += req.data;
        encRequest = ccav.encrypt(body, workingKey);
        var formData = {
            encRequest: encRequest,
            access_code: accessCode
        };
        console.log(formData);
        res.view("payment", formData);
        // formbody = '<form id="nonseamless" method="post" name="redirect" action="https://test.ccavenue.com/transaction/transaction.do?command=initiateTransaction"/> <input type="hidden" id="encRequest" name="encRequest" value="' + encRequest + '"><input type="hidden" name="access_code" id="access_code" value="' + accessCode + '"><script language="javascript">document.redirect.submit();</script></form>';
        // });

    }
};
module.exports = _.assign(module.exports, controller);