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
    paymentMethod: {
        type: String,
        enum: ['cod', 'cc', 'dc', 'netbank'],
        default: 'cod'
    },
    trackingId: String,
    orderStatus: {
        type: String,
        enum: ['processing', 'shipped', 'delivered', 'returned', 'cancelled'],
        default: 'processing'
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

var exports = _.cloneDeep(require("sails-wohlig-service")(schema, "user  products.product returnedProducts.product", "user", "createdAt", "desc"));
var model = {
    createOrderFromCart: function (data, callback) {
        console.log("In createorderfromcart");
        if (_.isEmpty(data.userId)) {
            console.log("No user found for order");
            callback({
                message: "noUserFound"
            }, null);
        } else {
            Cart.getCart(data, function (err, cart) {
                if (!_.isEmpty(cart)) {
                    console.log("cart: ", cart);
                    var order = {};
                    order.orderNo = Math.ceil(Math.random() * 10000000000000);
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
                    order.discountAmount = 0;
                    console.log("order: ", order);
                    Order.saveData(order, function (err, data) {
                        console.log("$$$$$$$$$order: ", order);
                        if (err) {
                            callback(err, null);
                        } else if (data) {
                            Order.findOne({
                                _id: mongoose.Types.ObjectId(data._id)
                            }).deepPopulate("products.product products.product.size products.product.color").exec(function (err, order) {
                                console.log("*****DATA:***** ", order);
                                Cart.remove({
                                    _id: mongoose.Types.ObjectId(cart._id)
                                }).exec(function (err, result) {})
                                Product.subtractQuantity(data.products, null);
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
            console.log("155: ", key);
            billingAddress[key] = data.billingAddress[key];
        }

        keys = _.keys(data.shippingAddress);
        for (var key of keys) {
            shippingAddress[key] = data.shippingAddress[key];
        }

        console.log("@@@@@data@@@@", data)
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
        }).deepPopulate('products.product products.product.size products.product.color').exec(function (err, orders) {
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
        async.waterfall([
            function checkUser(cbWaterfall) {
                User.isUserLoggedIn(data.accessToken, cbWaterfall);
            },
            function getOrders(user, cbWaterfall1) {
                console.log("found: ", user._id);
                console.log("sent: ", data.user);

                if (user._id == data.user) {
                    console.log("inside")
                    Order.find({

                        user: mongoose.Types.ObjectId(data.user),
                        // "returnedProducts.status": data.status
                    }).deepPopulate("returnedProducts.product order._id returnedProducts.product.size returnedProducts.product.color").exec(function (err, orders) {
                        console.log("in deepPopulate", orders);
                        if (_.isObject(orders)) {
                            _.each(orders, function (value) {
                                console.log("in returnedProducts object", value);
                                // _.each(returnedProducts, function (value) {
                                _.each(value.returnedProducts, function (returnProduct) {
                                    console.log("status", returnProduct.status);
                                    if (returnProduct.status == data.status) {
                                        console.log("match");
                                        returnCanelProduct.push(returnProduct);
                                        console.log("match2", returnCanelProduct);
                                    }
                                    // });

                                });
                                order.push({
                                    _id: value._id,
                                    createdAt: value.createdAt,
                                    orderNo: value.orderNo,
                                    orderStatus: value.orderStatus,
                                    totalAmount: value.totalAmount,
                                    returnCancelProduct: returnCanelProduct
                                });



                                // order['_id'] = value._id;
                                // order['returnCancelProduct'] = returnCanelProduct;
                                // order['createdAt'] = value.createdAt;
                                // order['orderNo'] = value.orderNo;
                                // order['orderStatus'] = value.orderStatus;
                                // order['totalAmount'] = value.totalAmount;
                            });
                            // console.log("&&&&&&&&&&order", );
                        }
                        console.log("&&&&&&&&&&order", order);
                        cbWaterfall1(null, order);


                        // console.log("%%%%%%%OrderDetails", orders);
                        // cbWaterfall1(null, orders)
                    })
                } else {
                    cbWaterfall1("noUserFound", null);
                }
            }
        ], function (err, data) {
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
    }
};
module.exports = _.assign(module.exports, exports, model);