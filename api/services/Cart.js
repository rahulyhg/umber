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
        style: String,
        color: String,
        comment: {
            type: String
        }
    }]
});

schema.plugin(deepPopulate, {
    populate: {
        "products.product": {
            select: ""
        }
    }
});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('Cart', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema, "products.product", "products.product"));
var model = {
    setProductInCart: function (userId, product, callback) {
        // console.log("Each product: ", product);
        var cart = {};
        cart.products = [];
        cart.products.push({
            product: mongoose.Types.ObjectId(product._id),
            quantity: product.reqQuantity,
            style: product.style,
            color: product.color.name,
            comment: product.comment
        });
        // console.log("#########product in cart#####", cart.products);
        cart.userId = userId;

        async.waterfall([
                function checkProduct(cbWaterfall1) {
                    // Check if product is available
                    Product.findById(product._id).exec(function (err, foundProd) {
                        if (foundProd && (foundProd.quantity >= product.reqQuantity)) {
                            cbWaterfall1(null);
                        } else {
                            cbWaterfall1({
                                message: {
                                    data: "productOutOfStock " + product._id + " " + product.reqQuantity
                                }
                            });
                        }
                    });
                },

                function saveIntoCart(cbWaterfall2) {
                    // If user is same retrieve its cart
                    Cart.findOne({
                        userId: cart.userId
                    }).lean().exec(function (err, foundCart) {
                        if (err) {
                            cbWaterfall2(err, null);
                        } else {
                            // If cart is not present, create cart
                            if (_.isEmpty(foundCart)) {
                                Cart.saveData(cart, function (err, data) {
                                    if (err) {
                                        cbWaterfall2(err, null);
                                    } else if (data) {
                                        cbWaterfall2(null, data);
                                    } else {
                                        cbWaterfall2({
                                            message: {
                                                data: "Invalid credentials1!"
                                            }
                                        }, null);
                                    }
                                });
                            } else {
                                // Cart is present. Check if product is already added
                                // console.log("Product: ", product);
                                var idx = _.findIndex(foundCart.products, function (prodVal) {
                                    return prodVal.product == product._id;
                                });
                                // console.log("Index: ", idx);
                                if (idx < 0) {
                                    // Insert if proudct isn't present
                                    foundCart.products.push({
                                        product: mongoose.Types.ObjectId(product._id),
                                        quantity: product.reqQuantity,
                                        style: product.style,
                                        color: product.color.name,
                                        comment: product.comment
                                    });
                                    foundCart.userId = userId;
                                    Cart.saveData(foundCart, function (err, data) {
                                        console.log("!!!!!!foundcart in saveData", foundCart)
                                        if (err) {
                                            cbWaterfall2(err, null);
                                        } else if (data) {
                                            cbWaterfall2(null, data);
                                        } else {
                                            cbWaterfall2({
                                                message: {
                                                    data: "Invalid credentials2!"
                                                }
                                            }, null);
                                        }
                                    });
                                } else {
                                    // Update cart product quantity if present
                                    // console.log("Matching product: ", data.products[idx]);
                                    foundCart.products[idx].quantity += product.reqQuantity;
                                    foundCart.products[idx].comment = product.comment;
                                    Cart.saveData(foundCart, function (err, data) {
                                        if (err) {
                                            cbWaterfall2(err, null);
                                        } else if (data) {
                                            // Product.subtractQuantity(product, null);
                                            cbWaterfall2(null, data);
                                        } else {
                                            cbWaterfall2({
                                                message: {
                                                    data: "Invalid credentials!in update cart"
                                                }
                                            }, null);
                                        }
                                    });
                                }
                            }
                        }
                    });
                }
            ],
            function (err, data) {
                console.log("ERror: ", err);
                if (err)
                    callback(err, null);
                else
                    callback(null, data);
            });
    },

    saveProduct: function (product, callback) {
        // console.log("Save product: ", JSON.stringify(product));
        async.waterfall([
            function isUserLoggedIn(cbWaterfall1) {
                // Check whether a user exists with given access token
                User.findOne({
                    accessToken: product.accessToken
                }).exec(function (err, data) {
                    if (err) {
                        cbWaterfall1(err, null);
                    } else if (!_.isEmpty(data)) {
                        // Check if the retrieved user is same as the user claims
                        if (data._id == product.userId) {
                            cbWaterfall1(null, product.userId);
                        }
                    } else {
                        cbWaterfall1({
                            message: {
                                data: "noLogin"
                            }
                        }, null);
                    }
                });
            },

            function saveCart(userId, cbWaterfall2) {
                if (product.products instanceof Array) {
                    async.eachSeries(product.products, function (eachProduct, eachCallback) {
                        Cart.setProductInCart(userId, eachProduct.product, eachCallback);
                    }, function (err) {
                        if (err) {
                            cbWaterfall2(err, null);
                        } else {
                            cbWaterfall2(null, {
                                message: "Cart updated successfully"
                            });
                        }
                    });
                } else {
                    Cart.setProductInCart(userId, product, cbWaterfall2);
                }
            }
        ], function (err, data) {
            console.log("err: ", err);
            if (err) {
                callback(err, null);
            } else {
                callback(null, data);
            }
        });
    },

    getCart: function (userId, callback) {
        // console.log("In getCart");
        Cart.findOne({
            userId: mongoose.Types.ObjectId(userId.userId)
        }).deepPopulate("products.product products.product.size products.product.color").exec(function (err, data) {
            if (err) {
                callback(err, null);
            } else if (data) {
                callback(null, data);
            } else {
                callback({
                    message: {
                        data: "Invalid credentials! in cart"
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
        }).lean().exec(function (err, data) {
            if (err) {
                callback(err, null);
            } else if (data) {
                var index = data.products.findIndex(function (value) {
                    if (value.product.toString() == product.productId)
                        return true;
                    else
                        return false;
                });

                var removeProduct = data.products.splice(index, 1);

                if (_.isEmpty(data.products)) {
                    Cart.findOne({
                        _id: data._id
                    }).remove().exec(function (err, data) {
                        if (err) {
                            console.log("Error: ", err);
                            callback(err, null);
                        } else if (data) {
                            console.log("Data: ", data);
                            callback(null, data);
                        }
                    });
                } else {
                    Cart.saveData(data, function (err, cart) {
                        if (err) {
                            callback(err, null);
                        } else if (cart) {
                            callback(null, cart);
                        } else {
                            callback({
                                message: {
                                    data: "Invalid credentials!for remove product"
                                }
                            }, null);
                        }
                    });
                }
            } else {
                callback({
                    message: {
                        data: "noCartFound!"
                    }
                }, null);
            }
        })
    }
};
module.exports = _.assign(module.exports, exports, model);