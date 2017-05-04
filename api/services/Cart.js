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
        var cart = {};
        cart.products = [];
        console.log("Cart->saveProduct: ");
        cart.products.push({
            product: mongoose.Types.ObjectId(product._id),
            quantity: 1,
            color: product.baseColor
        });
        Cart.find({}).exec(function (err, data) {
            if (err) {
                console.log("error: ", error);
                callback(err, null);
            } else if (data) {
                console.log("data: ", data.length);
                if (data.length < 1) {
                    Cart.saveData(cart, function (err, data) {
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
                } else {
                    data[0].products.push({
                        product: mongoose.Types.ObjectId(product._id),
                        quantity: 1,
                        color: product.baseColor
                    });
                    Cart.saveData(data[0], function (err, data) {
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
            } else {
                callback({
                    message: {
                        data: "Invalid credentials!"
                    }
                }, null);
            }
        });
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