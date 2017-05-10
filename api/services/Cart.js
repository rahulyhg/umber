var schema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        unique: true,
        required: true
    },
    products: [{
        product: {
            type: Schema.Types.ObjectId,
            ref: 'Product'
        },
        quantity: Number,
        size: {
            type: Schema.Types.ObjectId,
            ref: 'Size'
        },
        color: {
            type: Schema.Types.ObjectId,
            ref: 'BaseColor'
        }
    }]
});

schema.plugin(deepPopulate, {
    populate: {
        "products.product": {
            select: ""
        },
        "products.color": {
            select: ""
        }
    }
});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('Cart', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema, "products.product products.color", "products.product products.color"));
var model = {
    saveProduct: function (product, callback) {
        if (!_.isEmpty(product.accessToken)) {
            // Product.isProductAvailable(product, function (err, data) {
            //     if (err) {
            //         callback(err, null);
            //     } else if (data) {
            //         // TODO: Proceed with the process
            //     } else {
            //         callback({
            //             message: {
            //                 data: "Invalid request!"
            //             }
            //         }, null);
            //     }
            // });
            var cart = {};
            cart.products = [];
            cart.products.push({
                product: mongoose.Types.ObjectId(product._id),
                quantity: product.reqQuantity,
                color: product.baseColor[0]._id,
                size: product.selectedSize
            });
            // Check whether a user exists with given access token
            User.findOne({
                accessToken: product.accessToken
            }).exec(function (err, data) {
                if (err) {
                    callback(err, null);
                } else if (data) {
                    // TODO: Optimize this extensively
                    if (!_.isEmpty(data)) {
                        // Check if the retrieved user is same as the user claims
                        if (data._id == product.userId) {
                            cart.userId = product.userId;
                            // If user is same retrieve its cart
                            Cart.findOne({
                                userId: product.userId
                            }).exec(function (err, data) {
                                if (err) {
                                    console.log("error: ", error);
                                    callback(err, null);
                                } else {
                                    /*Cart.findOneAndUpdate({
                                            products: {
                                                product: product._id,
                                                //TODO: add size
                                                color: product.baseColor
                                            }
                                        }, {
                                            $inc: {
                                                products: {
                                                    quantity: product.reqQuantity
                                                }
                                            }
                                        }, {
                                            upsert: true,
                                            new: true
                                        })
                                        .exec(function (err, data) {
                                            if (err) {
                                                callback(err, null);
                                            } else if (data) {
                                                callback(null, data);
                                            } else {
                                                callback({
                                                    message: {
                                                        data: "Invalid credentials!"
                                                    }
                                                }, null);
                                            }
                                        });*/
                                    // If cart is not present, create cart
                                    if (!data) {
                                        Cart.saveData(cart, function (err, data) {
                                            if (err) {
                                                callback(err, null);
                                            } else if (data) {
                                                callback(null, data);
                                            } else {
                                                callback({
                                                    message: {
                                                        data: "Invalid credentials1!"
                                                    }
                                                }, null);
                                            }
                                        });
                                    } else {
                                        console.log("Product: ", product);
                                        var idx = _.findIndex(data.products, function (prodVal) {
                                            console.log("Cart product: ", prodVal);
                                            return prodVal.product == product._id &&
                                                prodVal.color == product.baseColor[0]._id &&
                                                prodVal.size == product.selectedSize
                                        });
                                        console.log("Index: ", idx);
                                        if (idx < 0) {
                                            // Insert if proudct isn't present
                                            data.products.push({
                                                product: mongoose.Types.ObjectId(product._id),
                                                quantity: product.reqQuantity,
                                                color: product.baseColor[0]._id,
                                                size: product.selectedSize
                                            });
                                            data.userId = product.userId;
                                            Cart.saveData(data, function (err, data) {
                                                if (err) {
                                                    callback(err, null);
                                                } else if (data) {
                                                    callback(null, data);
                                                } else {
                                                    callback({
                                                        message: {
                                                            data: "Invalid credentials2!"
                                                        }
                                                    }, null);
                                                }
                                            });
                                        } else {
                                            // Update cart product quantity if present
                                            console.log("Matching product: ", data.products[idx]);
                                            data.products[idx].quantity += product.reqQuantity;
                                            Cart.saveData(data, function (err, data) {
                                                if (err) {
                                                    callback(err, null);
                                                } else if (data) {
                                                    callback(null, data);
                                                } else {
                                                    callback({
                                                        message: {
                                                            data: "Invalid credentials!"
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    }
                                }
                            });
                        }
                    } else {
                        callback({
                            message: {
                                data: "User not logged in"
                            }
                        }, null);
                    }
                }
            })
        } else {
            callback({
                message: {
                    data: "User not logged in"
                }
            }, null);
        }
    },

    getCart: function (userId, callback) {
        Cart.findOne({
            userId: userId.userId
        }).deepPopulate("products.product products.color products.size").exec(function (err, data) {
            if (err) {
                callback(err, null);
            } else if (data) {
                callback(null, data);
            } else {
                callback({
                    message: {
                        data: "Invalid credentials!"
                    }
                }, null);
            }
        })
    },

    updateCartQuantity: function (cart) {
        Cart.findOneAndUpdate({
            _id: cart._id
        }, cart).exec();
    },

    removeProduct: function (product, callback) {
        Cart.findOne({
            _id: mongoose.Types.ObjectId(product.cartId)
        }).exec(function (err, data) {
            if (err) {
                callback(err, null);
            } else if (data) {
                var index = data.products.findIndex(function (value) {
                    if (value._id.toString() == product.productId)
                        return true;
                    else
                        return false;
                });

                data.products.splice(index, 1);
                if (_.isEmpty(data.products)) {
                    Cart.findOne({
                        _id: data._id
                    }).remove().exec(function (err, datat) {
                        if (err)
                            console.log("Error: ", err);
                        else if (data) {
                            console.log("Data: ", data);

                        }
                    });
                }
                Cart.saveData(data, function (err, data) {
                    if (err) {
                        callback(err, null);
                    } else if (data) {
                        callback(null, data);
                    } else {
                        callback({
                            message: {
                                data: "Invalid credentials!"
                            }
                        }, null);
                    }
                });
            }
        })
    }
};
module.exports = _.assign(module.exports, exports, model);