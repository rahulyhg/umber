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
    postReq: function (request, response) {
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

        request.on('data', function (data) {
            console.log(data);
            body += data;
            encRequest = ccav.encrypt(body, workingKey);
            formbody = '<form id="nonseamless" method="post" name="redirect" action="https://test.ccavenue.com/transaction/transaction.do?command=initiateTransaction"/> <input type="hidden" id="encRequest" name="encRequest" value="' + encRequest + '"><input type="hidden" name="access_code" id="access_code" value="' + accessCode + '"><script language="javascript">document.redirect.submit();</script></form>';
        });

        request.on('end', function () {
            response.writeHeader(200, {
                "Content-Type": "text/html"
            });
            response.write(formbody);
            response.end();
        });
        return;
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
        encRequest = ccav.encrypt("tid=1511879093778&merchant_id=150530&order_id=123654789&amount=1.00currency=INR&redirect_url=http://wohlig.co.in/umber/PHP_Kit/NON_SEAMLESS_KIT/ccavResponseHandler.php&cancel_url=http://wohlig.co.in/umber/PHP_Kit/NON_SEAMLESS_KIT/ccavResponseHandler.php&language=EN&billing_name=&billing_address=&billing_city=&billing_state=&billing_zip=&billing_country=&billing_tel=&billing_email=&delivery_name=&delivery_address=&delivery_city=&delivery_state=&delivery_zip=&delivery_country=&delivery_tel=&merchant_param1=&merchant_param2=&merchant_param3=&merchant_param4=&merchant_param5=&promo_code=&customer_identifier=&", workingKey);
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