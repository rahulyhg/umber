var schema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        unique: true,
        required: true
    },
    products: [String]
});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('Wishlist', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {
    setProductInWishlist: function (product, callback) {
        User.findOne({
            accessToken: product.accessToken
        }).exec(function (err, user) {
            if (err) {
                callback(err, null);
            } else if (user) {
                console.log(product);
                Wishlist.update({
                        'userId': product.userId
                    }, {
                        $addToSet: {
                            products: product.productId
                        }
                    }, {
                        new: true,
                        upsert: true
                    },
                    function (err, wishlist) {
                        if (err) {
                            callback(err, null);
                        } else if (wishlist) {
                            callback(null, wishlist);
                        } else {
                            callback({
                                message: {
                                    data: "Invalid credentials!"
                                }
                            }, null);
                        }
                    });
            } else {
                callback({
                    message: {
                        data: "Invalid credentials!"
                    }
                }, null);
            }
        });
    },

    saveProduct: function (product, callback) {
        if (product.products instanceof Array) {
            async.eachSeries(product, function (eachProduct, eachCallback) {
                setProductInWishlist(eachProduct, eachCallback);
            }, function (err) {
                callback(err, null);
            });
        } else {
            setProductInWishlist(product, callback);
        }
    },

    getWishlist: function (user, callback) {
        var wishlistProducts = [];
        Wishlist.findOne({
            userId: user.userId
        }).exec(function (err, wishlist) {
            if (!_.isEmpty(wishlist)) {
                async.each(wishlist.products, function (productId, eachCallback) {
                    Product.getProductDetails({
                        productId: productId
                    }, function (err, productDetails) {
                        if (!_.isEmpty(productDetails))
                            wishlistProducts.push(productDetails);
                        eachCallback();
                    })
                }, function (err) {
                    callback(null, wishlistProducts);
                });
            }
        });
    }
};
module.exports = _.assign(module.exports, exports, model);