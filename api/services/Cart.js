var schema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
        // TODO: remove comment
        //unique: true
        //required: true
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
            var cart = {};
            cart.products = [];
            console.log("Cart->saveProduct: ", product);
            cart.products.push({
                product: mongoose.Types.ObjectId(product._id),
                quantity: 1,
                color: product.baseColor
            });
            // Check whether a user exists with given access token
            User.findOne({
                accessToken: product.accessToken
            }).exec(function (err, data) {
                if (err) {
                    //send error
                    console.log("Cannot find user for cart");
                } else if (data) {
                    // TODO: Optimize this extensively
                    if (!_.isEmpty(data)) {
                        // Check if the retrieved user is same as the user claims
                        console.log("User: ", data);
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
                                        data.products.push({
                                            product: mongoose.Types.ObjectId(product._id),
                                            quantity: 1,
                                            color: product.baseColor
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

    getCart: function (callback) {
        Cart.find({}).deepPopulate("products.product products.color").exec(function (err, data) {
            if (err) {
                callback(err, null);
            } else if (data) {
                console.log("getcart-> ", data);
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

    updateCart: function (cart) {
        Cart.findOneAndUpdate({
            _id: cart._id
        }, cart).exec();
    }
};
module.exports = _.assign(module.exports, exports, model);