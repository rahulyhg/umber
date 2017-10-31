var schema = new Schema({
    orderNo: {
        type: String,
        required: true,
        unique: true,
        uniqueCaseInsensitive: true
    },
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
        price: Number,
        status: {
            type: String,
            enum: ['accept', 'returned', 'cancelled'],
            default: 'accept'
        },
        comment: String
    }],
    totalAmount: {
        type: Number,
        required: true
    },
    discountAmount: Number,
    shippingAmount: Number,
    amountAfterDiscount: Number,
    paymentMethod: {
        type: String,
        enum: ['cod', 'cc', 'dc', 'netbank'],
        default: 'cod'
    },
    courierType: {
        type: Schema.Types.ObjectId,
        ref: 'Courier'
    },
    trackingId: String,
    orderStatus: {
        type: String,
        enum: ['processing', 'shipped', 'delivered', 'returned', 'cancelled'],
        default: 'processing'
    },
    selectedDiscount: {
        type: Schema.Types.ObjectId,
        ref: 'Discount'
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'payment successfull'],
        default: 'pending'
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
        price: Number,
        status: {
            type: String,
            enum: ['returned', 'cancelled'],
            default: 'returned',
            index: true
        },
        comment: String
    }],
    comment: String
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
    createOrderFromCart: function (data, callback) {
        // console.log("In createorderfromcart", data);
        var allData = data;
        console.log("allData", allData);
        if (_.isEmpty(data.userId)) {
            // console.log("No user found for order");
            callback({
                message: "noUserFound"
            }, null);
        } else {
            Cart.getCart(data, function (err, cart) {
                if (!_.isEmpty(cart)) {
                    // console.log("cart: ", cart);
                    var order = {};
                    order.orderNo = Math.ceil(Math.random() * 10000000000000);
                    order.selectedDiscount = data.selectedDiscount.selectedDiscount._id;
                    // 59f06bc7647252477439a1e4
                    order.totalAmount = 0;
                    for (var idx = 0; idx < cart.products.length; idx++) {
                        var product = cart.products[idx];
                        var orderData = {
                            product: mongoose.Types.ObjectId(product.product._id),
                            quantity: product.quantity,
                            price: product.quantity * product.product.price,
                            comment: product.comment
                        };
                        if (!order.products) {
                            order.products = [];
                        }
                        order.products.push(orderData);
                        order.totalAmount += orderData.price;
                    }
                    order.user = mongoose.Types.ObjectId(data.userId);
                    order.shippingAmount = 0;
                    order.discountAmount = data.selectedDiscount.discountAmount;
                    order.amountAfterDiscount = data.selectedDiscount.grandTotalAfterDiscount
                    // console.log("order: ", order);
                    Order.saveData(order, function (err, data1) {
                        // console.log("$$$$$$$$$order: ", order);
                        if (err) {
                            callback(err, null);
                        } else if (data1) {
                            console.log("in else if avinash", allData);
                            Order.findOne({
                                _id: mongoose.Types.ObjectId(data1._id)
                            }).deepPopulate("products.product products.product.size products.product.color").exec(function (err, order) {
                                // console.log("*****DATA:***** ", order);
                                Cart.remove({
                                    _id: mongoose.Types.ObjectId(cart._id)
                                }).exec(function (err, result) {})
                                Product.subtractQuantity(data1.products, null);
                                if (allData.couponData && allData.selectedDiscount.selectedDiscount.discountType.toString() == "59f06bc7647252477439a1e4") {
                                    console.log("have selected right id to check");
                                    var couponDataToProcess = allData.couponData;
                                    console.log("couponDataToProcess Before", couponDataToProcess);
                                    couponDataToProcess.user = allData.userId;
                                    couponDataToProcess.generatedOrderId = data1._id;
                                    couponDataToProcess.usedOrderId=null;
                                    console.log("couponDataToProcess After", couponDataToProcess);
                                    Coupon.saveData(couponDataToProcess, function (err, couponDataReceived) {
                                        if (err) {
                                            console.log("errrrooooooooooorrrrrrrrrrrr",err);
                                            callback(err, null);
                                        } else {
                                            if (!_.isEmpty(couponDataReceived)) {
                                                order.couponDataReceived=couponDataReceived;
                                            }
                                            
                                        }
                                          callback(null, order);
                                    })
                                }
                              
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
        }).deepPopulate('products.product courierType products.product.size products.product.color').exec(function (err, orders) {
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
                        async.waterfall([
                            function findProduct(cbSubWaterfall) {
                                Product.findOne({
                                    _id: mongoose.Types.ObjectId(product.product)
                                }).exec(cbSubWaterfall);
                            },
                            function deductQuantity(foundProduct, cbSubWaterfall1) {
                                var deductPrice = foundProduct.price * product.quantity;

                                Order.findOneAndUpdate({
                                    _id: mongoose.Types.ObjectId(data.orderId),
                                    "products.product": mongoose.Types.ObjectId(product.product)
                                }, {
                                    $inc: {
                                        "products.$.quantity": -product.quantity,
                                        "products.$.price": -deductPrice,
                                        'totalAmount': -deductPrice,
                                    },
                                    $addToSet: {
                                        returnedProducts: {
                                            product: mongoose.Types.ObjectId(product.product),
                                            quantity: product.quantity,
                                            price: deductPrice,
                                            status: product.status,
                                            comment: product.comment
                                        }
                                    }
                                }, {
                                    new: true
                                }).exec(function (err, updatedProduct) {
                                    if (!_.isEmpty(updatedProduct)) {
                                        var cancelProduct = _.remove(updatedProduct.products, function (product) {
                                            return product.quantity == 0;
                                        });
                                        console.log("Cancelled product: ", updatedProduct);
                                        Order.saveData(updatedProduct, function (err, order) {
                                            console.log("Saving updated order: ", err, order);
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
        console.log("data", data);
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
                                            console.log("status", returnProduct.status);
                                            if (returnProduct.status == data.status) {
                                                console.log("match");
                                                order[index].returnCancelProduct.push(returnProduct);
                                                console.log("match2", order[index].returnCancelProduct);
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
                        emailData.discount = orderss.discountAmount;
                        emailData.tax = 0;
                        emailData.totalAmount = orderss.totalAmount;
                        // _.each(emailData.order, function (n) {
                        //     total = total + n.price;
                        // })
                        // emailData.totalAmount = total;
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
                        emailData.discount = orderss.discountAmount;
                        emailData.tax = 0;
                        // emailData.totalAmount = orderss.totalAmount;
                        _.each(emailData.order, function (n) {
                            total = total + n.price;
                        })
                        emailData.totalAmount = total;
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
        // console.log("User >>> cancelProductEmail >>> User.findOneAndUpdate >>> data", data);
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
                        emailData.subject = "BurntUmber returned product Order";
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
                        emailData.discount = orderss.discountAmount;
                        emailData.tax = 0;
                        // emailData.totalAmount = orderss.totalAmount;
                        _.each(emailData.order, function (n) {
                            total = total + n.price;
                        })
                        emailData.totalAmount = total;
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
        })
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
                        emailData.discount = orderss.discountAmount;
                        emailData.tax = 0;
                        emailData.totalAmount = orderss.totalAmount;
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
                })

            }
        })
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
                        emailData.discount = orderss.discountAmount;
                        emailData.tax = 0;
                        emailData.totalAmount = orderss.totalAmount;
                        // _.each(emailData.order, function (n) {
                        //     total = total + n.price;
                        // })
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
};
module.exports = _.assign(module.exports, exports, model);