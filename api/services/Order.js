//import { prependListener } from 'cluster';

// import { disconnect } from 'cluster';
var autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose);
require('mongoose-middleware').initialize(mongoose);

var crypto = require('crypto');
var http = require('http'),
    fs = require('fs'),
    qs = require('querystring');


// var workingKey = "81D48FFD602819EBA40B68CF90C8B6C6"; //local
var workingKey = "B019F1AD7402B5C7C90FFA59317D2D5A";
var schema = new Schema({
    orderNo: {
        type: String,
        required: true,
        unique: true,
        uniqueCaseInsensitive: true
    },
    date: Date,
    billingAddress: {
        line1: String,
        line2: String,
        line3: String,
        line4: String,
        city: String,
        state: String,
        pincode: Number,
        country: String
    },
    shippingAddress: {
        name: String,
        line1: String,
        line2: String,
        line3: String,
        line4: String,
        city: String,
        state: String,
        pincode: Number,
        country: String
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    products: [{
        product: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: Number,
        style: String,
        color: String,
        status: {
            type: String,
            enum: ['accept', 'returned', 'cancelled'],
            default: 'accept'
        },
        comment: String,
        unitPrice: Number,
        discountAmount: Number,
        discountPercent: Number,
        taxAmt: Number,
        taxPercent: Number
    }],
    giftVoucher: [{
        type: Schema.Types.ObjectId,
        ref: 'GiftCard'
    }],
    totalAmount: {
        type: Number,
        required: true
    },
    totalAmountgiftVoucher: Number,
    gst: Number,
    gstPercent: Number,
    subTotal: Number,
    shippingAmount: Number,
    totalDiscount: Number,
    invoiceNumberIncr: Number,
    invoiceNumber: String,
    orderNumberIncr: Number,
    paymentMethod: {
        type: String,
        enum: ['cod', 'cc', 'dc', 'netbank'],
        default: 'cod'
    },
    invoicePdfName: String,
    courierType: {
        type: Schema.Types.ObjectId,
        ref: 'Courier'
    },
    courierAmount: Number,
    trackingId: String,
    orderStatus: {
        type: String,
        enum: ['processing', 'shipped', 'delivered', 'returned', 'cancelled', 'pending'],
        default: 'processing'
    },
    invoiceStatus: {
        type: String,
        enum: ["unmoderated", "moderated"],
        default: 'unmoderated'
    },
    discountCouponId: {
        type: Schema.Types.ObjectId,
        ref: 'Coupon'
    },
    gifts: {
        _id: String,
        name: String,
        description: String,
        photo: String,
    },
    selectedDiscount: {
        type: Schema.Types.ObjectId,
        ref: 'Discount'
    },
    paymentStatus: {
        type: String,
        enum: ['Success', 'Aborted', 'Failure', 'Illegal', 'pending']
    },
    returnReason: {
        type: String
    },
    returnedProducts: [{
        product: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: Number,
        style: String,
        color: String,
        status: {
            type: String,
            enum: ['returned', 'cancelled'],
            default: 'returned',
            index: true
        },
        priceAfterDiscount: Number,
        unitPrice: Number,
        discountAmount: Number,
        discountPriceOfProductApplied: Number,
        discountPercent: Number,
        taxAmt: Number,
        taxPercent: Number,
        comment: String
    }],
    comment: String,
    firstName: String,
    lastName: String,
    mobileNo: String,
    email: String,
    paymentResponse: {
        type: {}
    }
});

schema.plugin(autoIncrement.plugin, {
    model: 'Order',
    field: 'invoiceNumberIncr',
    startAt: 0000001,
    incrementBy: 1
});

schema.plugin(autoIncrement.plugin, {
    model: 'Order',
    field: 'orderNumberIncr',
    startAt: 0000001,
    incrementBy: 1
});

schema.plugin(deepPopulate, {
    populate: {
        select: 'firstName lastName'
    }
});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('Order', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema, "user  products.product courierType returnedProducts.product", "user", "createdAt", "desc"));
var model = {
    //Function for HDFC
    // hdfcPaymentGateway: function (data, callback) {
    //     // var m = crypto.createHash('md5');
    //     // m.update(workingKey);
    //     // var key = m.digest('binary');
    //     // var iv = '\x00\x01\x02\x03\x04\x05\x06\x07\x08\x09\x0a\x0b\x0c\x0d\x0e\x0f';
    //     // var cipher = crypto.createCipheriv('aes-128-cbc', key, iv);
    //     // var encoded = cipher.update(JSON.stringify(data), 'utf8', 'hex');
    //     // encoded += cipher.final('hex');
    //     var data = {
    //         "order_id": "59e4cfd658946c313e655b30",
    //         "createdAt": "2017-10-16T15:27:18.441+0000",
    //         "updatedAt": "2017-10-16T15:27:18.568+0000",
    //         "orderNo": "2954436897216",
    //         "merchant_id": "150530",
    //         "currency": "INR",
    //         "redirect_url": "https://www.google.co.in/",
    //         "cancel_url": "https://www.google.co.in/",
    //         "language": "EN",
    //         "totalAmount": 2098,
    //         "amount": 2098,
    //         "user": "59e4c055fde2d42791850689",
    //         "shippingAmount": 0,
    //         "discountAmount": 0,
    //         "returnedProducts": [

    //         ],
    //         "orderStatus": "processing",
    //         "paymentMethod": "cod",
    //         "products": [{
    //             "product": "59de31a6af88fb51a6d1e124",
    //             "quantity": 1,
    //             "price": 2098,
    //             "comment": null,
    //             "_id": "59e4cfd658946c313e655b31",
    //             "status": "accept"
    //         }],
    //         "__v": 0,
    //         "shippingAddress": {
    //             "pincode": 400022,
    //             "state": "Maharashtra",
    //             "city": "a",
    //             "line3": "a",
    //             "line2": "a",
    //             "line1": "a",
    //             "country": "India"
    //         },
    //         "billingAddress": {
    //             "state": "Maharashtra",
    //             "pincode": 400022,
    //             "city": "a",
    //             "line3": "a",
    //             "line2": "a",
    //             "line1": "a",
    //             "country": "India"
    //         }
    //     }
    //     var m = crypto.createHash('md5');
    //     m.update(workingKey);
    //     var key = m.digest('buffer');
    //     var iv = '\x00\x01\x02\x03\x04\x05\x06\x07\x08\x09\x0a\x0b\x0c\x0d\x0e\x0f';
    //     var cipher = crypto.createCipheriv('aes-128-cbc', key, iv);
    //     var encoded = cipher.update(JSON.stringify(data), 'utf8', 'hex');
    //     encoded += cipher.final('hex');

    //     // var m = crypto.createHash('md5');
    //     // m.update(workingKey);
    //     // var key = m.digest('binary');
    //     // var iv = '\x00\x01\x02\x03\x04\x05\x06\x07\x08\x09\x0a\x0b\x0c\x0d\x0e\x0f';
    //     // var cipher = crypto.createCipheriv('aes-128-cbc', key, iv);
    //     // var encoded = cipher.update(JSON.stringify(data), 'utf8', 'hex');
    //     // encoded += cipher.final('hex');
    //     // // return encoded;
    //     // return encoded;

    //     // var accessCode = "AVHR01EK28AH98RHHA";

    //     var body = '', //Put in the 32-Bit Key provided by CCAvenue.
    //         // accessCode = 'AVHR01EK28AH98RHHA',	//local
    //         accessCode = "AVBG01EK29BB84GBBB", //Put in the Access Code provided by CCAvenue.

    //         encRequest = '',
    //         formbody = '';
    //     // request("https://test.ccavenue.com/transaction/transaction.do?command=initiateTransaction")
    //     //     .on('data', function (data) {
    //     //         console.log("This is the start...", data);
    //     //         encRequest = encoded;
    //     //         formbody = '<form id="nonseamless" method="post" name="redirect" action=" https://test.ccavenue.com/transaction/transaction.do?command=initiateTransaction"> <input type="hidden" id="encRequest" name="encRequest" value="' + encRequest + '"><input type="hidden" name="access_code" id="access_code" value="' + accessCode + '"><input type="hidden" name="merchant_id" id="merchant_id" value="150530"><script language="javascript">document.redirect.submit();</script></form>';
    //     //     })
    //     //     .on('end', function () {
    //     //         console.log("This is the end...");
    //     //         callback.writeHeader(200, {
    //     //             "Content-Type": "text/html"
    //     //         });

    //     // var m = crypto.createHash('md5');
    //     // m.update(workingKey)
    //     // var key = m.digest('buffer');
    //     // var iv = '\x00\x01\x02\x03\x04\x05\x06\x07\x08\x09\x0a\x0b\x0c\x0d\x0e\x0f';
    //     // var decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
    //     // var decoded = decipher.update(formbody, 'hex', 'utf8');
    //     // decoded += decipher.final('utf8');
    //     // return decoded;
    //     //     console.log("formbody", formbody);
    //     //     callback.write(formbody);
    //     //     callback.end();
    //     // });
    //     // return;


    //     // callback(null, encoded);
    //     request.post({
    //         url: 'https://test.ccavenue.com/transaction/transaction.do?command=initiateTransaction',
    //         body: '<form id="nonseamless" method="post" name="redirect" action=" https://test.ccavenue.com/transaction/transaction.do?command=initiateTransaction"> <input type="hidden" id="enc_request" name="enc_request" value="' + encRequest + '"><input type="hidden" name="access_code" id="access_code" value="' + accessCode + '"><script language="javascript">document.redirect.submit();</script></form>'
    //     }, function (error, response, body) {
    //         console.log(error, body);
    //         callback.write(body);
    //         callback.end();
    //     });
    // },

    hdfcPaymentGateway: function (data, resp) {
        console.log("in hdfc payment gateway");
        var ccav = require('./ccavutil.js');
        var body = "tid=1234&merchant_id=150530&order_id=123456789&currency=INR&amount=20&redirect_url=http://umber.wohlig.co.in/api/order/gatewayResponse&cancel_url=http://umber.wohlig.co.in/api/order/cancelResponse&language=EN";

        var workingKey = '236E7613D01B3B0BDAA4805D6A1162DB';
        var accessCode = 'AVOH01EK30BS66HOSB';
        var encRequest = ccav.encrypt(body, workingKey);
        var reqdata = "encRequest=" + encRequest + "&" + "access_code=" + accessCode;

        var formData = {
            encRequest: encRequest,
            access_code: accessCode
        };
        console.log(formData);
        resp.view("payment", formData);

        //   var url = {
        //     url: 'https://test.ccavenue.com/transaction/transaction.do?command=initiateTransaction',
        //      body: reqdata
        //      };
        //      console.log(url)
        //   request.post(url, function(error, response, body){
        //         console.log(error,body);
        //         resp.send(body)
        // });

    },

    createOrderFromCart: function (data, callback) {
        console.log("In createorderfromcart", data);
        if (data.paymentMethod == "Cash on delivery") {
            var paymentMethod = "cod";
        } else if (data.paymentMethod == "Credit Card") {
            var paymentMethod = "cc";
        } else if (data.paymentMethod == "Debit card") {
            var paymentMethod = "dc";
        } else {
            var paymentMethod = "netbank";
        }
        var gifts = data.gifts;
        var allData = data;
        var couponGiftArr = [];
        // console.log("allData", allData);
        if (_.isEmpty(data.userId)) {
            // console.log("No user found for order");
            callback({
                message: "noUserFound"
            }, null);
        } else {
            Cart.getCart(data, function (err, cart) {
                if (!_.isEmpty(cart)) {
                    // console.log("$$$$$$$$$$$$$$$", cart);
                    var order = {};
                    order.firstName = data.firstName;
                    order.lastName = data.lastName;
                    order.mobileNo = data.mobileNo;
                    order.email = data.email;
                    order.orderNo = Math.ceil(Math.random() * 10000000000000);
                    if (data.selectedDiscount) {
                        if (data.selectedDiscount.selectedDiscount) {
                            order.selectedDiscount = data.selectedDiscount.selectedDiscount._id;
                        }
                    }
                    // 59f06bc7647252477439a1e4
                    order.totalAmount = 0;
                    order.totalDiscount = 0;
                    order.totalAmountgiftVoucher = 0;
                    for (var idx = 0; idx < cart.products.length; idx++) {
                        var product = cart.products[idx];
                        var orderData = {
                            product: mongoose.Types.ObjectId(product.product._id),
                            quantity: product.quantity,
                            price: product.quantity * _.round(product.product.price),
                            color: product.product.color.name,
                            style: product.product.style,
                            discountAmount: product.discountAmount,
                            discountPriceOfProductApplied: product.discountPriceOfProductApplied,
                            comment: product.comment
                        };
                        if (!order.products) {
                            order.products = [];
                        }
                        order.products.push(orderData);
                        order.totalAmount += _.round(orderData.price);
                        if (orderData.discountAmount > 0) {
                            order.totalDiscount = order.totalDiscount + _.round(orderData.discountAmount) + _.round(orderData.discountPriceOfProductApplied);
                            order.totalAmount = order.totalAmount - _.round(orderData.discountAmount);
                        } else {
                            order.totalDiscount = order.totalDiscount + _.round(orderData.discountAmount) + _.round(orderData.discountPriceOfProductApplied);
                            order.totalAmount -= _.round(orderData.discountAmount);
                        }
                    }
                    for (var idx = 0; idx < cart.giftVoucher.length; idx++) {
                        var giftVoucher = cart.giftVoucher[idx];
                        var orderVoucher = {};
                        var couponGift = {};
                        GiftCard.findOne({
                            _id: giftVoucher
                        }).exec(function (err, voucher) {
                            if (err) {
                                console.log("error in cart giftvoucher", err);
                                callback(err, null);
                            } else {
                                if (!_.isEmpty(voucher)) {
                                    orderVoucher = voucher;
                                    order.totalAmountgiftVoucher += _.round(orderVoucher.giftAmount);
                                    couponGift.name = orderVoucher.couponCode;
                                    couponGift.cAmount = orderVoucher.giftAmount;
                                    couponGift.isActive = "True";
                                    couponGift.status = "unUsed";
                                    couponGift.startDate = new Date();
                                    couponGift.endDate = (new Date(+new Date() + 365 * 24 * 60 * 60 * 1000));
                                }
                            }
                        });
                        if (!order.giftVoucher) {
                            order.giftVoucher = [];
                        }
                        order.giftVoucher.push(giftVoucher);
                        couponGiftArr.push(couponGift);
                    }
                    // order.totalAmount -= _.round(order.totalDiscount);
                    order.user = mongoose.Types.ObjectId(data.userId);
                    order.gst = _.round(cart.gst);
                    order.totalAmount += _.round(order.gst);
                    order.totalAmount = _.round(order.totalAmount)
                    order.shippingAmount = 0;
                    if (data.selectedDiscount) {
                        order.discountAmount = data.selectedDiscount.discountAmount;
                        order.amountAfterDiscount = data.selectedDiscount.grandTotalAfterDiscount;
                        order.discountPriceOfProductApplied = data.discountPriceOfProductApplied;
                    }
                    if (paymentMethod != "cod") {
                        order.orderStatus = "pending";
                    }
                    order.paymentMethod = paymentMethod;
                    order.gifts = gifts;

                    console.log("order: ", order);
                    Order.saveData(order, function (err, data1) {
                        //console.log("$$$$$$$$$order: ", order);
                        if (err) {
                            callback(err, null);
                        } else if (data1) {
                            // console.log("in else if avinash", allData);
                            Order.findOne({
                                _id: mongoose.Types.ObjectId(data1._id)
                            }).deepPopulate("products.product products.product.size products.product.color").exec(function (err, order) {
                                // console.log("*****DATA:***** ", order);
                                if (paymentMethod == "cod") {
                                    Cart.remove({
                                        _id: mongoose.Types.ObjectId(cart._id)
                                    }).exec(function (err, result) {})
                                    Product.subtractQuantity(data1.products, null);
                                }
                                if (cart.giftVoucher.length > 0) {
                                    Coupon.saveData(couponGift, function (err, couponGiftReceived) {
                                        if (err) {
                                            console.log("errrrooooooooooorrrrrrrrrrrr", err);
                                            callback(err, null);
                                        } else {
                                            if (!_.isEmpty(couponGiftReceived)) {
                                                console.log("!!!!!!!!!!!!!!!!!!!!save coupon", couponGiftReceived)
                                            }

                                        }
                                        // callback(null, order);
                                    })
                                }
                                if (allData.selectedDiscount) {
                                    if (allData.selectedDiscount.selectedDiscount) {
                                        if (allData.couponData && allData.selectedDiscount.selectedDiscount.discountType.toString() == "59f06bc7647252477439a1e4") {
                                            var couponDataToProcess = allData.couponData;
                                            couponDataToProcess.user = allData.userId;
                                            couponDataToProcess.generatedOrderId = data1._id;
                                            couponDataToProcess.cAmount = allData.selectedDiscount.selectedDiscount.xValue;
                                            couponDataToProcess.startDate = new Date();
                                            couponDataToProcess.endDate = (new Date(+new Date() + 365 * 24 * 60 * 60 * 1000))
                                            couponDataToProcess.usedOrderId = null;
                                            Coupon.saveData(couponDataToProcess, function (err, couponDataReceived) {
                                                if (err) {
                                                    console.log("errrrooooooooooorrrrrrrrrrrr", err);
                                                    callback(err, null);
                                                } else {
                                                    if (!_.isEmpty(couponDataReceived)) {
                                                        order.couponDataReceived = couponDataReceived;
                                                    }

                                                }
                                                // callback(null, order);
                                            })
                                        }

                                    } else if (allData.selectedDiscount.coupon) {
                                        console.log("toSert!!", data1._id);
                                        Coupon.findOneAndUpdate({
                                            _id: allData.selectedDiscount.coupon._id
                                        }, {
                                            $set: {
                                                usedOrderId: data1._id,
                                                status: "Used",
                                                isActive: "False"
                                            }
                                        }, {
                                            new: true
                                        }).exec();
                                        Order.findOneAndUpdate({
                                            _id: data1._id
                                        }, {
                                            $set: {
                                                discountCouponId: allData.selectedDiscount.coupon._id
                                            }
                                        }, {
                                            new: true
                                        }).exec()
                                        // callback(null, order);
                                    }
                                }
                                model.generateInvoiceOrOrderYear("OR", function (err, orderYear) {
                                    num = order.orderNumberIncr;
                                    num = '' + num;
                                    while (num.length < 7) {
                                        num = '0' + num;
                                    }
                                    order.orderNo = orderYear + num;
                                    Order.saveData(order, function (err, data) {
                                        if (err) {
                                            console.log(err);
                                        }
                                    })
                                })
                                callback(null, order);
                            });
                        }
                    });
                }
            });
        }
    },

    updateOrderAddress: function (data, callback) {
        var billingAddress = {};
        var shippingAddress = {};
        var keys = _.keys(data.billingAddress);

        for (var key of keys) {
            // console.log("155: ", key);
            billingAddress[key] = data.billingAddress[key];
        }

        keys = _.keys(data.shippingAddress);
        for (var key of keys) {
            shippingAddress[key] = data.shippingAddress[key];
        }

        // console.log("@@@@@data@@@@", data)
        Order.findOneAndUpdate({
            _id: mongoose.Types.ObjectId(data._id)
        }, {
            $set: {
                billingAddress: billingAddress,
                shippingAddress: shippingAddress
            }

        }, {
            new: true
        }, function (err, order) {
            console.log("Order update address error: ", err);
            User.saveAddresses(data, callback);
        });
    },

    getUserOrders: function (data, callback) {
        Order.find({
            user: data.userId
        }).deepPopulate('products.product courierType products.product.size products.product.color').sort({
            createdAt: -1
        }).exec(function (err, orders) {
            callback(err, orders);
        });
    },

    // API to cancel/return order products
    // input: data: {accessToken, user, products}
    // inputDetails: user - unique user id
    //               products - list of product objects to be cancelled/returned. Contains following fields
    //                        - product: product unique id
    //                        - quantity: cancelled/returned quantity
    //                        - status: status of the product 'returned/cancelled'
    //                        - comment: comment associated with product if any
    //               status - 'returned/cancelled'
    cancelProducts: function (data, callback) {
        var updatedOrder = [];
        async.waterfall([
            function checkUser(cbWaterfall) {
                User.isUserLoggedIn(data.accessToken, cbWaterfall);
            },
            function cancelProducts(user, cbWaterfall1) {
                if (user._id == data.user) {
                    async.each(data.products, function (product, eachCallback) {
                        // console.log("productproductproduct", product);
                        // var discount = product.discountAmount;
                        // var discountPercent = product.discountPercent;
                        // var taxAmt = product.taxAmt;
                        // var taxPercent = product.taxPercent;
                        async.waterfall([
                            function findProduct(cbSubWaterfall) {
                                Product.findOne({
                                    _id: mongoose.Types.ObjectId(product.product)
                                }).exec(cbSubWaterfall);
                            },
                            function deductQuantity(foundProduct, cbSubWaterfall1) {
                                var deductPrice = _.round(foundProduct.price) * product.quantity;
                                if (data.return) {
                                    var orderStatus = "returned"
                                } else {
                                    var orderStatus = "cancelled"
                                }
                                Order.findOneAndUpdate({
                                    _id: mongoose.Types.ObjectId(data.orderId),
                                    "products.product": mongoose.Types.ObjectId(product.product)
                                }, {
                                    $inc: {
                                        "products.$.quantity": -product.quantity,
                                        "products.$.price": -deductPrice,
                                        // 'totalAmount': 0,
                                    },
                                    $addToSet: {
                                        returnedProducts: {
                                            product: mongoose.Types.ObjectId(product.product),
                                            quantity: product.quantity,
                                            price: deductPrice,
                                            status: orderStatus,
                                            comment: product.comment,
                                            // discountAmount: discount,
                                            // discountPercent: discountPercent,
                                            // taxAmt: taxAmt,
                                            // taxPercent: taxPercent
                                        }
                                    },
                                    $set: {
                                        totalAmount: 0
                                    }
                                    // $set: {
                                    //     orderStatus: orderStatus
                                    // }
                                }, {
                                    new: true
                                }).exec(function (err, updatedProduct) {
                                    if (!_.isEmpty(updatedProduct)) {
                                        var cancelProduct = _.remove(updatedProduct.products, function (product) {
                                            return product.quantity == 0;
                                        });
                                        // console.log("Cancelled product: ", updatedProduct);
                                        Order.saveData(updatedProduct, function (err, order) {
                                            // console.log("Saving updated order: ", err, order);
                                            updatedOrder.push(updatedProduct);
                                            cbSubWaterfall1(null, order);
                                        });
                                    }
                                });
                            }
                        ], function (err, data) {
                            eachCallback(err, data);
                        });
                    }, function (err) {
                        cbWaterfall1(null, updatedOrder);
                    });
                } else {
                    cbWaterfall1("userNotFound", null);
                }
            }
        ], function (err, data) {
            callback(err, updatedOrder);
        });
    },

    // API for cancel/return orders page
    // This API returns all the cancelled/returned orders for the user
    // input: data: {accessToken, user, status}
    // inputDetails: user - user unique id
    //               status - status of orders to be retrieved - cancelled/returned
    getCancelledOrdersForUser: function (data, callback) {
        // console.log("data getCancelledOrdersForUser", data);
        var returnCanelProduct = [];
        var order = [];
        var index = 0;
        async.waterfall([
                function checkUser(cbWaterfall) {
                    User.isUserLoggedIn(data.accessToken, cbWaterfall);
                },
                function getOrders(user, cbWaterfall1) {
                    console.log("found: ", user._id);
                    console.log("sent: ", data.user);

                    // Is user same
                    if (user._id == data.user) {
                        console.log("inside")
                        Order.find({
                                user: mongoose.Types.ObjectId(data.user)
                            }).deepPopulate("returnedProducts.product order._id returnedProducts.product.size returnedProducts.product.color")
                            .exec(function (err, orders) {
                                console.log("in exec", orders);
                                if (!_.isEmpty(orders)) {
                                    _.each(orders, function (value) {
                                        console.log("in returnedProducts object", value);
                                        order[index] = {};
                                        order[index]._id = value._id;
                                        order[index].createdAt = value.createdAt;
                                        order[index].orderNo = value.orderNo;
                                        order[index].orderStatus = value.orderStatus;
                                        order[index].totalAmount = value.totalAmount;
                                        order[index].returnCancelProduct = [];
                                        _.each(value.returnedProducts, function (returnProduct) {
                                            // console.log("status", returnProduct.status);
                                            if (returnProduct.status == data.status) {
                                                order[index].returnCancelProduct.push(returnProduct);
                                            }
                                        });
                                        if (_.isEmpty(order[index].returnCancelProduct)) {
                                            order.splice(index)
                                        } else {
                                            index++;
                                        }
                                    });
                                    cbWaterfall1(null, order);
                                } else {
                                    cbWaterfall1(err, null);
                                }
                            })
                    } else {
                        cbWaterfall1("noUserFound", null);
                    }
                }
            ],
            function (err, data) {
                callback(err, order);
            });
    },

    getAnOrderDetail: function (data, callback) {

        Order.findOne({
                _id: mongoose.Types.ObjectId(data._id)
            })
            .deepPopulate("products.product products.product.size products.product.color " +
                "returnedProducts.product returnedProducts.product.size returnedProducts.product.color")
            .exec(function (err, order) {

                callback(err, order)
            });
    },
    //API to send order placed Email
    ConfirmOrderPlacedMail: function (data, callback) {

        User.findOne({
            _id: data._id
        }).exec(function (error, created) {
            if (error, created == undefined) {
                console.log("User >>> ConfirmOrderPlaced >>> User.findOneAndUpdate >>> error", error);
                callback(error, null);
            } else {
                Order.findOne({
                    orderNo: data.order.orderNo
                }).deepPopulate("products.product products.product.size").lean().exec(function (error, orderss) {
                    // console.log("User >>> ConfirmOrderPlaced >>>^^^^orderDetail", orderss.products[0].product, "++++++++++++++++++++");
                    if (error, orderss == undefined) {
                        console.log("User >>> ConfirmOrderPlaced >>> User.findOneAndUpdate >>> error", error);
                        callback(error, null);
                    } else {

                        var emailData = {};
                        var total = 0;
                        var cartAmount = 0;
                        emailData.email = created.email;
                        emailData.subject = "BurntUmber product Order";
                        emailData.filename = "confirmed-product-order-emailer.ejs";
                        emailData.from = "harsh@wohlig.com"
                        emailData.firstname = created.firstName;
                        emailData.lastName = created.lastName;
                        emailData.order = orderss.products;
                        emailData.orderNo = data.order.orderNo;
                        emailData.orderStatus = data.order.orderStatus;
                        emailData.createdAt = moment(data.order.createdAt).format('ll');
                        emailData.paymentMethod = data.order.paymentMethod;
                        emailData.billingAddress = orderss.billingAddress;
                        emailData.shippingAddress = orderss.shippingAddress;
                        emailData.shipping = orderss.shippingAmount;
                        // if (orderss.discountAmount) {
                        //     emailData.discount = orderss.discountAmount;
                        // } else {
                        //     emailData.discount = 0;
                        // }
                        emailData.discount = 0;
                        emailData.cartAmount = 0;
                        emailData.disAfter = 0;
                        if (orderss.gst) {
                            emailData.tax = _.round(orderss.gst);
                        } else {
                            emailData.tax = 0;
                        }
                        _.each(emailData.order, function (n) {
                            emailData.cartAmount = emailData.cartAmount + (_.round(n.product.price) * n.quantity);
                        });
                        emailData.cartAmount = _.round(emailData.cartAmount);
                        emailData.totalAmount = _.round(orderss.totalAmount);

                        _.each(emailData.order, function (n) {
                            if (n.discountAmount || n.discountPriceOfProductApplied) {
                                emailData.discount = emailData.discount + _.round(n.discountAmount) + _.round(n.discountPriceOfProductApplied);
                                emailData.dis = emailData.dis + _.round(n.discountPriceOfProductApplied);
                                emailData.disAfter = emailData.disAfter + _.round(n.discountAmount)
                            } else {
                                emailData.discount += 0;
                                emailData.dis += 0;
                                emailData.disAfter += 0;
                            }
                        });
                        emailData.discount = _.round(emailData.discount);
                        emailData.totalAfterGst = emailData.cartAmount + emailData.tax;
                        Config.ConfirmOrderPlacedMail(emailData, function (err, response) {
                            if (err) {
                                console.log("error in email", err);
                                callback("emailError", null);
                            } else if (response) {
                                var sendData = {};
                                sendData._id = created._id;
                                sendData.email = created.email;
                                sendData.accessToken = created.accessToken;
                                sendData.firstName = created.firstName;
                                sendData.lastName = created.lastName;
                                emailData.email = "siddhesh@wohlig.com";
                                Config.ConfirmOrderPlacedMail(emailData, function (err, response) {
                                    if (err) {
                                        console.log("error in email", err);
                                        callback("emailError", null);
                                    } else if (response) {
                                        // callback(null, sendData);
                                    } else {
                                        callback("errorOccurredRegister", null);
                                    }
                                });
                                callback(null, sendData);
                            } else {
                                callback("errorOccurredRegister", null);
                            }
                        });
                    }
                })

            }
        })
    },
    //API to send returned product email
    returnedProductEmail: function (data, callback) {
        // console.log("User >>> returnedProductEmail >>> User.findOneAndUpdate >>> data", data);
        User.findOne({
            _id: data._id
        }).exec(function (error, created) {
            if (error, created == undefined) {
                console.log("User >>> returnedProductEmail >>> User.findOneAndUpdate >>> error", error);
                callback(error, null);
            } else {
                Order.findOne({
                    _id: data.orderId
                }).deepPopulate("returnedProducts.product returnedProducts.product.size").lean().exec(function (error, orderss) {
                    // console.log("User >>> returnedProductEmail >>>^^^^orderDetail", orderss, "++++++++++++++++++++");
                    if (error, orderss == undefined) {
                        console.log("User >>> returnedProductEmail >>> User.findOneAndUpdate >>> error", error);
                        callback(error, null);
                    } else {

                        var emailData = {};
                        var total = 0;
                        emailData.email = created.email;
                        emailData.subject = "BurntUmber returned product Order";
                        emailData.filename = "returned-product-emailer.ejs";
                        emailData.from = "harsh@wohlig.com"
                        emailData.firstname = created.firstName;
                        emailData.lastName = created.lastName;
                        emailData.order = orderss.returnedProducts;
                        emailData.orderNo = orderss.orderNo;
                        emailData.orderStatus = orderss.orderStatus;
                        emailData.createdAt = moment(orderss.createdAt).format('ll');
                        emailData.paymentMethod = orderss.paymentMethod;
                        emailData.billingAddress = orderss.billingAddress;
                        emailData.shippingAddress = orderss.shippingAddress;
                        emailData.shipping = orderss.shippingAmount;
                        emailData.discount = 0;
                        emailData.cartAmount = 0;
                        if (orderss.gst) {
                            emailData.tax = _.round(orderss.gst);
                        } else {
                            emailData.tax = 0;
                        }
                        emailData.totalAmount = _.round(orderss.totalAmount);
                        _.each(emailData.order, function (n) {
                            if (n.discountAmount) {
                                emailData.discount += _.round(n.discountAmount);
                            } else {
                                emailData.discount += 0;
                            }
                        })
                        emailData.discount = _.round(emailData.discount);

                        // emailData.totalAmount = orderss.totalAmount;
                        // _.each(emailData.order, function (n) {
                        //     total = total + n.price;
                        // })
                        // emailData.totalAmount = _.round(total);
                        _.each(emailData.order, function (n) {
                            emailData.cartAmount = emailData.cartAmount + (_.round(n.product.price) * n.quantity);
                        });
                        emailData.cartAmount = _.round(emailData.cartAmount);
                        Config.returnedProductEmail(emailData, function (err, response) {
                            if (err) {
                                console.log("error in email", err);
                                callback("emailError", null);
                            } else if (response) {
                                var sendData = {};
                                sendData._id = created._id;
                                sendData.email = created.email;
                                sendData.accessToken = created.accessToken;
                                sendData.firstName = created.firstName;
                                sendData.lastName = created.lastName;
                                callback(null, sendData);
                            } else {
                                callback("errorOccurredRegister", null);
                            }
                        });
                    }
                })

            }
        })
    },
    //API to send cancel product email
    cancelProductEmail: function (data, callback) {
        console.log("User >>> cancelProductEmail >>> User.findOneAndUpdate >>> data", data);
        User.findOne({
            _id: data._id
        }).exec(function (error, created) {
            if (error, created == undefined) {
                console.log("User >>> cancelProductEmail >>> User.findOneAndUpdate >>> error", error);
                callback(error, null);
            } else {
                Order.findOne({
                    _id: data.orderId
                }).deepPopulate("returnedProducts.product returnedProducts.product.size").lean().exec(function (error, orderss) {
                    // console.log("User >>> cancelProductEmail >>>^^^^orderDetail", orderss, "++++++++++++++++++++");
                    if (error, orderss == undefined) {
                        console.log("User >>> cancelProductEmail >>> User.findOneAndUpdate >>> error", error);
                        callback(error, null);
                    } else {

                        var emailData = {};
                        var total = 0;
                        emailData.email = created.email;
                        emailData.subject = "BurntUmber cancelled product Order";
                        emailData.filename = "cancelled-product-emailer.ejs";
                        emailData.from = "harsh@wohlig.com"
                        emailData.firstname = created.firstName;
                        emailData.lastName = created.lastName;
                        emailData.order = orderss.returnedProducts;
                        emailData.orderNo = orderss.orderNo;
                        emailData.orderStatus = orderss.orderStatus;
                        emailData.createdAt = moment(orderss.createdAt).format('ll');
                        emailData.paymentMethod = orderss.paymentMethod;
                        emailData.billingAddress = orderss.billingAddress;
                        emailData.shippingAddress = orderss.shippingAddress;
                        emailData.shipping = orderss.shippingAmount;
                        emailData.discount = 0;
                        emailData.cartAmount = 0;
                        if (orderss.gst) {
                            emailData.tax = _.round(orderss.gst);
                        } else {
                            emailData.tax = 0;
                        }
                        emailData.totalAmount = orderss.totalAmount;
                        _.each(emailData.order, function (n) {
                            if (n.discountAmount) {
                                emailData.discount += _.round(n.discountAmount);
                            } else {
                                emailData.discount += 0;
                            }
                        })
                        emailData.discount = _.round(emailData.discount);

                        // emailData.totalAmount = orderss.totalAmount;
                        _.each(emailData.order, function (n) {
                            total = total + n.price;
                        })
                        emailData.totalAmount = _.round(total);
                        _.each(emailData.order, function (n) {
                            emailData.cartAmount = emailData.cartAmount + (_.round(n.product.price) * n.quantity);
                        });
                        emailData.cartAmount = _.round(emailData.cartAmount);
                        Config.cancelProductEmail(emailData, function (err, response) {
                            if (err) {
                                console.log("error in email", err);
                                callback("emailError", null);
                            } else if (response) {
                                var sendData = {};
                                sendData._id = created._id;
                                sendData.email = created.email;
                                sendData.accessToken = created.accessToken;
                                sendData.firstName = created.firstName;
                                sendData.lastName = created.lastName;
                                callback(null, sendData);
                            } else {
                                callback("errorOccurredRegister", null);
                            }
                        });
                    }
                })

            }
        });
    },
    //API to send delivered product email
    deliveredProductEmail: function (data, callback) {
        User.findOne({
            _id: data._id
        }).exec(function (error, created) {
            if (error, created == undefined) {
                // console.log("User >>> deliveredProductEmail >>> User.findOneAndUpdate >>> error", error);
                callback(error, null);
            } else {
                Order.findOne({
                    _id: data.orderId
                }).deepPopulate("products.product products.product.size").lean().exec(function (error, orderss) {
                    // console.log("User >>> ConfirmOrderPlaced >>>^^^^orderDetail", orderss.products[0].product, "++++++++++++++++++++");
                    if (error, orderss == undefined) {
                        console.log("User >>> ConfirmOrderPlaced >>> User.findOneAndUpdate >>> error", error);
                        callback(error, null);
                    } else {

                        var emailData = {};
                        var total = 0;
                        emailData.email = created.email;
                        emailData.subject = "BurntUmber product Order Delivered";
                        emailData.filename = "product-order-delivered.ejs";
                        emailData.from = "harsh@wohlig.com"
                        emailData.firstname = created.firstName;
                        emailData.lastName = created.lastName;
                        emailData.order = orderss.products;
                        emailData.orderNo = orderss.orderNo;
                        emailData.orderStatus = orderss.orderStatus;
                        emailData.createdAt = moment(orderss.createdAt).format('ll');
                        emailData.paymentMethod = orderss.paymentMethod;
                        emailData.billingAddress = orderss.billingAddress;
                        emailData.shippingAddress = orderss.shippingAddress;
                        emailData.shipping = orderss.shippingAmount;
                        emailData.discount = 0;
                        emailData.cartAmount = 0;
                        if (orderss.gst) {
                            emailData.tax = _.round(orderss.gst);
                        } else {
                            emailData.tax = 0;
                        }
                        emailData.totalAmount = _.round(orderss.totalAmount);
                        _.each(emailData.order, function (n) {
                            if (n.discountAmount) {
                                emailData.discount += _.round(n.discountAmount);
                            } else {
                                emailData.discount += 0;
                            }
                        })
                        emailData.discount = _.round(emailData.discount);
                        _.each(emailData.order, function (n) {
                            emailData.cartAmount = emailData.cartAmount + (_.round(n.product.price) * n.quantity);
                        });
                        emailData.cartAmount = _.round(emailData.cartAmount);
                        // _.each(emailData.order, function (n) {
                        //     total = total + n.price;
                        // })
                        // emailData.totalAmount = total;
                        Config.deliveredProductEmail(emailData, function (err, response) {
                            if (err) {
                                console.log("error in email", err);
                                callback("emailError", null);
                            } else if (response) {
                                var sendData = {};
                                sendData._id = created._id;
                                sendData.email = created.email;
                                sendData.accessToken = created.accessToken;
                                sendData.firstName = created.firstName;
                                sendData.lastName = created.lastName;
                                callback(null, sendData);
                            } else {
                                callback("errorOccurredRegister", null);
                            }
                        });
                    }
                });

            }
        });
    },
    //API to send shipped product email
    shippedProductEmail: function (data, callback) {
        User.findOne({
            _id: data._id
        }).exec(function (error, created) {
            if (error, created == undefined) {
                // console.log("User >>> deliveredProductEmail >>> User.findOneAndUpdate >>> error", error);
                callback(error, null);
            } else {
                Order.findOne({
                    _id: data.orderId
                }).deepPopulate("products.product products.product.size").lean().exec(function (error, orderss) {
                    // console.log("User >>> ConfirmOrderPlaced >>>^^^^orderDetail", orderss.products[0].product, "++++++++++++++++++++");
                    if (error, orderss == undefined) {
                        console.log("User >>> ConfirmOrderPlaced >>> User.findOneAndUpdate >>> error", error);
                        callback(error, null);
                    } else {
                        var emailData = {};
                        var total = 0;
                        emailData.email = created.email;
                        emailData.subject = "BurntUmber product Order";
                        emailData.filename = "product-order-shipped-emailer.ejs";
                        emailData.from = "harsh@wohlig.com"
                        emailData.firstname = created.firstName;
                        emailData.lastName = created.lastName;
                        emailData.order = orderss.products;
                        emailData.orderNo = orderss.orderNo;
                        emailData.orderStatus = orderss.orderStatus;
                        emailData.createdAt = moment(orderss.createdAt).format('ll');
                        emailData.paymentMethod = orderss.paymentMethod;
                        emailData.billingAddress = orderss.billingAddress;
                        emailData.shippingAddress = orderss.shippingAddress;
                        emailData.shipping = orderss.shippingAmount;
                        emailData.discount = 0;
                        emailData.cartAmount = 0;
                        if (orderss.gst) {
                            emailData.tax = _.round(orderss.gst);
                        } else {
                            emailData.tax = 0;
                        }
                        emailData.totalAmount = _.round(orderss.totalAmount);
                        _.each(emailData.order, function (n) {
                            if (n.discountAmount) {
                                emailData.discount += _.round(n.discountAmount);
                            } else {
                                emailData.discount += 0;
                            }
                        })
                        emailData.discount = _.round(emailData.discount);
                        _.each(emailData.order, function (n) {
                            emailData.cartAmount = emailData.cartAmount + (_.round(n.product.price) * n.quantity);
                        });
                        emailData.cartAmount = _.round(emailData.cartAmount);
                        _.each(emailData.order, function (n) {
                            total = total + n.price;
                        })
                        // emailData.totalAmount = total;
                        Config.shippedProductEmail(emailData, function (err, response) {
                            if (err) {
                                console.log("error in email", err);
                                callback("emailError", null);
                            } else if (response) {
                                var sendData = {};
                                sendData._id = created._id;
                                sendData.email = created.email;
                                sendData.accessToken = created.accessToken;
                                sendData.firstName = created.firstName;
                                sendData.lastName = created.lastName;
                                callback(null, sendData);
                            } else {
                                callback("errorOccurredRegister", null);
                            }
                        });
                    }
                })

            }
        })
    },
    //API to send coupon code via email
    giftVoucherCodeMail: function (data, callback) {
        User.findOne({
            _id: data._id
        }).exec(function (error, created) {
            if (error, created == undefined) {
                console.log("User >>> giftVoucherCodeMail >>> User.findOneAndUpdate >>> error", error);
                callback(error, null);
            } else {
                Order.findOne({
                    orderNo: data.order.orderNo
                }).deepPopulate("giftVoucher").lean().exec(function (error, orderss) {
                    // console.log("User >>> ConfirmOrderPlaced >>>^^^^orderDetail", orderss.products[0].product, "++++++++++++++++++++");
                    if (error, orderss == undefined) {
                        console.log("User >>> ConfirmOrderPlaced >>> User.findOneAndUpdate >>> error", error);
                        callback(error, null);
                    } else {
                        var emailData = {};
                        var sendDataArray = [];
                        var total = 0;
                        var cartAmount = 0;
                        emailData.subject = "BurntUmber Gift Voucher";
                        emailData.filename = "gift-voucher.ejs";
                        emailData.from = "harsh@wohlig.com";
                        async.eachSeries(orderss.giftVoucher, function (voucher, callback1) {
                            emailData.email = voucher.frndEmail;
                            emailData.firstname = voucher.frndFirstName;
                            emailData.lastName = voucher.frndLastName;
                            emailData.frndName = voucher.userFirstName;
                            emailData.giftAmount = voucher.giftAmount;
                            emailData.couponCode = voucher.couponCode;
                            Config.giftVoucherCodeMail(emailData, function (err, response) {
                                if (err) {
                                    console.log("error in email", err);
                                    callback1("emailError", null);
                                } else if (response) {
                                    var sendData = {}
                                    sendData.email = voucher.frndEmail;
                                    sendData.firstName = voucher.userFirstName;
                                    sendData.lastName = voucher.userLastName;
                                    sendDataArray.push(sendData);
                                    callback1();
                                } else {
                                    callback1("errorOccurredRegister", null);
                                }
                            });
                        }, function (err) {
                            callback(null, sendDataArray);
                        });
                    }
                });
            }
        })
    },
    generateInvoiceOrOrderYear: function (str, callback) {
        var today = new Date();
        var lastTwoDigitYear = today.getFullYear().toString().substr(2, 2);
        var dateLimit = new Date(today.getFullYear().toString() + "-04-01");
        var strYear = "";
        if (today > dateLimit) {
            strYear = lastTwoDigitYear + (parseInt(lastTwoDigitYear) + 1).toString();
        } else {
            strYear = (parseInt(lastTwoDigitYear) - 1).toString() + lastTwoDigitYear;
        }
        callback(null, str + strYear.toString());
    },
    generateInvoice: function (data, callback) {
        var taxPercent = 0;
        var taxAmt = 0;
        var unitPrice = 0;
        var unitPriceSum = 0;
        var priceAfterDiscount = 0;
        var discountPercent = 0;
        var discountPrice = 0;
        var taxLimiter = 1000;
        var gst = 0;
        var subTotal = 0;
        var totalDiscount = 0;
        var totalAmount = 0;
        var value = 0;
        Order.findOne({
            _id: data.orderId
        }).lean().deepPopulate("products.product user").exec(function (err, order) {
            _.each(order.products, function (product, index) {
                value = _.round(product.product.price) * product.quantity;
                discountPercent = (product.discountAmount * 100) / (product.product.price);
                priceAfterDiscount = value - product.discountAmount;
                if (priceAfterDiscount <= taxLimiter) {
                    taxPercent = 5;
                } else {
                    taxPercent = 12;
                }
                unitPrice = (priceAfterDiscount * 100) / (100 + taxPercent);
                taxAmt = _.round(((taxPercent / 100) * unitPrice));
                if (product.product.price != product.product.mrp) {
                    unitPriceSum = unitPriceSum + unitPrice;
                    gst = gst + taxAmt;
                }
                product.unitPrice = _.round(unitPrice);
                product.priceAfterDiscount = priceAfterDiscount;
                product.taxAmt = _.round(taxAmt);
                product.taxPercent = taxPercent;
                product.discountPercent = discountPercent;
                subTotal = subTotal + _.round(value);
                totalDiscount = totalDiscount + (_.round(product.discountAmount));
            });
            model.generateInvoiceOrOrderYear("BU", function (err, invoiceYear) {
                num = order.invoiceNumberIncr;
                num = '' + num;
                while (num.length < 7) {
                    num = '0' + num;
                }
                order.invoiceNumber = invoiceYear + num;
            });
            if (unitPriceSum > 0) {
                order.gstPercent = _.round(((gst * 100) / unitPriceSum), 2);
            } else {
                order.gstPercent = 0;
            }
            order.gst = _.round(gst);
            order.totalDiscount = totalDiscount;
            order.subTotal = subTotal;
            order.totalAmount = _.round((subTotal - totalDiscount) + gst + order.shippingAmount);
            order.date = (new Date()).toLocaleDateString();
            Order.saveData(order, function (err, data) {
                if (err) {
                    console.log(err);
                    callback(err, null)
                } else {
                    callback(null, order);
                }
            })

        });
    },
    sendEmail: function (order, prevCallback) {
        async.waterfall([
            function (callback) {
                Config.generatePdf("invoice-actual", order, callback);
            },
            function (data, callback) {
                order.invoicePdfName = data.name;
                Order.saveData(order, function (err, data) {
                    if (err) {
                        console.log(err);
                        obj
                    } else {
                        callback(null, order);
                    }
                })
            },
            function (data, callback) {
                var emailData = {};
                emailData.email = order.user.email;
                emailData.subject = "Invoice PDF";
                emailData.body = "Invoice";
                emailData.from = "supriya.kadam478@hotmail.com";
                emailData.filename = data.invoicePdfName;
                Config.sendEmailAttachment(emailData, callback);
            }
        ], function (err, results) {
            if (err) {
                console.log("Error", err);
                prevCallback(err, null);
            } else {
                console.log("Results");
                prevCallback(null, results);
            }
        })
    },

    populateOrderData: function (data, callback) {
        Order.find({}).deepPopulate("products.product products.product.size products.product.prodCollection products.product.color user courierType returnedProducts.product returnedProducts.product.size returnedProducts.product.color").lean().exec(function (err, order) {
            if (err || _.isEmpty(order)) {
                callback(err, []);
            } else {
                callback(null, order);
            }
        })
    },
    generateExcelSalesReport: function (order, prevCallback) {
        async.concatSeries(order, function (orderData, callback) {
                var obj = {};
                obj["InvoiceNumber"] = orderData.invoiceNumber;
                if (orderData.date) {
                    var date = new Date(orderData.date);
                    obj["Date"] = date.toLocaleDateString();
                } else {
                    obj["Date"] = "";
                }
                obj["TotalDiscount"] = orderData.totalDiscount;
                obj["GST"] = orderData.gst;
                obj["GSTpercentage"] = orderData.gstPercent;
                obj["TotalAmt"] = orderData.totalAmount;
                var productId = "";
                var size = "";
                var color = "";
                var discountPercent = "";
                var quantity = "";
                var name = "";
                if (orderData.products) {
                    _.each(orderData.products, function (product) {

                        if (product.quantity) {
                            if (quantity == "") {
                                quantity = product.quantity;
                            } else {
                                quantity = quantity + '\n' + product.quantity;
                            }
                        }
                        if (product.discountPercent) {
                            if (discountPercent == "") {
                                discountPercent = product.discountPercent.toString();
                            } else {
                                discountPercent = discountPercent + '\n' + product.discountPercent.toString();
                            }
                        }
                        if (product.product) {
                            if (product.product.productId) {
                                if (productId == "") {
                                    productId = product.product.productId;
                                } else {

                                    productId = productId + '\n' + product.product.productId;
                                }
                            }
                            if (product.product.name) {
                                if (name == "") {
                                    name = product.product.name;
                                } else {

                                    name = name + '\n' + product.product.name;
                                }
                            }
                            if (product.product.size) {
                                if (size == "") {
                                    size = product.product.size.name;
                                } else {
                                    size = size + '\n' + product.product.size.name;
                                }
                            }

                            if (product.product.color) {
                                if (color == "") {
                                    color = product.product.color.name;
                                } else {
                                    color = color + '\n' + product.product.color.name;
                                }
                            }
                        }
                    })
                    obj["SKU"] = name;
                    obj["productId"] = productId;
                    obj["discountPercent"] = discountPercent;
                    obj["color"] = color;
                    obj["size"] = size;
                    obj["quantity"] = quantity;
                }
                callback(null, obj);
            },
            function (err, order) {
                prevCallback(null, order);
            });
    },
    generateReturnProductsReport: function (order, prevCallback) {
        var obj = {};
        var results = [];
        async.each(order, function (orderData, callback) {
                var productId = "";
                var size = "";
                var color = "";
                var quantity = "";
                var name = "";
                var date = "";
                if (!_.isEmpty(orderData.returnedProducts)) {
                    if (orderData.date) {
                        var date1 = new Date(orderData.date);
                        date = date1.toLocaleDateString();
                    } else {
                        date = "";
                    }
                    obj["InvoiceNumber"] = orderData.invoiceNumber;
                    obj["Date"] = date;
                    obj["TotalDiscount"] = orderData.totalDiscount;
                    obj["GST"] = orderData.gst;
                    obj["GSTpercentage"] = orderData.gstPercent;
                    obj["TotalAmt"] = orderData.totalAmount;
                }
                _.each(orderData.returnedProducts, function (product) {
                    if (!_.isEmpty(product)) {
                        if (product.quantity) {
                            if (quantity == "") {
                                quantity = product.quantity;
                            } else {
                                quantity = quantity + '\n' + product.quantity;
                            }
                        }
                        if (product.product) {
                            if (product.product.productId) {
                                if (productId == "") {
                                    productId = product.product.productId;
                                } else {
                                    productId = productId + '\n' + product.product.productId;
                                }
                            }
                            if (product.product.name) {
                                if (name == "") {
                                    name = product.product.name;
                                } else {

                                    name = name + '\n' + product.product.name;
                                }
                            }
                            if (product.product.size) {
                                if (size == "") {
                                    size = product.product.size.name;
                                } else {
                                    size = size + '\n' + product.product.size.name;
                                }
                            }

                            if (product.product.color) {
                                if (color == "") {
                                    color = product.product.color.name;
                                } else {
                                    color = color + '\n' + product.product.color.name;
                                }
                            }
                        }
                    }
                    obj["SKU"] = name;
                    obj["productId"] = productId;
                    obj["color"] = color;
                    obj["size"] = size;
                    obj["quantity"] = quantity;
                    results.push(obj);
                    obj = {};
                })
                callback()
            },
            function (err) {
                if( err ) {
                    console.log('A file failed to process');
                  } else {
                    prevCallback(null, results);
                  }
               
            });
    },

    generateGSTReport: function (order, prevCallback) {
        async.concatSeries(order, function (orderData, callback) {
                var obj = {};
                obj["InvoiceNumber"] = orderData.invoiceNumber;
                if (orderData.date) {
                    var date = new Date(orderData.date);
                    obj["Date"] = date.toLocaleDateString();
                } else {
                    obj["Date"] = "";
                }
                obj["GST"] = orderData.gst;
                obj["GSTpercentage"] = orderData.gstPercent;
                obj["totalAmt"] = orderData.totalAmount;
                var productId = "";
                var size = "";
                var quantity = "";
                var name = "";
                if (orderData.products) {
                    _.each(orderData.products, function (product) {
                        if (product.quantity) {
                            if (quantity == "") {
                                quantity = product.quantity;
                            } else {
                                quantity = quantity + '\n' + product.quantity;
                            }
                        }
                        if (product.product) {
                            if (product.product.productId) {

                                if (productId == "") {
                                    productId = product.product.productId;
                                } else {

                                    productId = productId + '\n' + product.product.productId;
                                }
                            }
                            if (product.product.name) {
                                if (name == "") {
                                    name = product.product.name;
                                } else {

                                    name = name + '\n' + product.product.name;
                                }
                            }
                            if (product.product.size) {
                                if (size == "") {
                                    size = product.product.size.name;
                                } else {
                                    size = size + '\n' + product.product.size.name;
                                }
                            }
                        }
                    })
                    obj["productId"] = productId;
                    obj["SKU"] = name;
                    obj["quantity"] = quantity;
                    obj["size"] = size;
                }
                callback(null, obj);
            },


            function (err, order) {
                prevCallback(null, order);
            });


    },

    generateCourierReport: function (order, prevCallback) {
        async.concatSeries(order, function (orderData, callback) {
                var obj = {};
                obj["InvoiceNumber"] = orderData.invoiceNumber;
                obj["CourierCharges"] = orderData.courierAmount;
                if (orderData.shippingAddress) {
                    obj["city"] = orderData.shippingAddress.city;
                    obj["state"] = orderData.shippingAddress.state;
                } else {
                    obj["city"] = "";
                    obj["state"] = "";
                }
                if (orderData.courierType) {
                    obj["courierName"] = orderData.courierType.name;
                } else {
                    obj["courierName"] = "";
                }
                var productId = "";
                var size = "";
                var color = "";
                var courierName = "";
                var quantity = "";
                var name = "";
                if (orderData.products) {
                    _.each(orderData.products, function (product) {
                        if (product.quantity) {
                            if (quantity == "") {
                                quantity = product.quantity;
                            } else {
                                quantity = quantity + '\n' + product.quantity;
                            }
                        }
                        if (product.product) {
                            if (product.product.productId) {
                                if (productId == "") {
                                    productId = product.product.productId;
                                } else {
                                    productId = productId + '\n' + product.product.productId;
                                }
                            }
                            if (product.product.name) {
                                if (name == "") {
                                    name = product.product.name;
                                } else {
                                    name = name + '\n' + product.product.name;
                                }
                            }
                            if (product.product.size) {
                                if (size == "") {
                                    size = product.product.size.name;
                                } else {
                                    size = size + '\n' + product.product.size.name;
                                }
                            }

                            if (product.product.color) {
                                if (color == "") {
                                    color = product.product.color.name;
                                } else {
                                    color = color + '\n' + product.product.color.name;
                                }
                            }

                        }
                    })
                    obj["SKU"] = name;
                    obj["productId"] = productId;
                    obj["color"] = color;
                    obj["size"] = size;
                    obj["quantity"] = quantity;
                }
                callback(null, obj);
            },
            function (err, order) {
                prevCallback(null, order);
            });


    }
};
module.exports = _.assign(module.exports, exports, model);