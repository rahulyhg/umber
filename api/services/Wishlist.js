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
    setProductInWishlist: function (userId, product, callback) {
        Wishlist.update({
                'userId': userId
            }, {
                $addToSet: {
                    products: product
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
    },

    saveProduct: function (product, callback) {
        async.waterfall([
            function isUserLogged(cbWaterfall1) {
                User.isUserLoggedIn(product.accessToken, function (err, user) {
                    if (!_.isEmpty(user))
                        cbWaterfall1(null, user._id);
                    else
                        cbWaterfall1(err, null);
                });
            },

            function addToWishlist(userId, cbWaterfall2) {
                if (product.products instanceof Array) {
                    async.eachSeries(product.products, function (eachProduct, eachCallback) {
                        Wishlist.setProductInWishlist(userId, eachProduct, eachCallback);
                    }, function (err) {
                        cbWaterfall2(err, null);
                    });
                } else {
                    setProductInWishlist(product, cbWaterfall2);
                }
            }
        ], function (err, data) {
            if (err)
                callback(err, null);
            else
                callback(null, {
                    message: "Wishlist added successfully!"
                });
        });
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
    },
    //input accessToken,productId
    removeProductFromWishlist: function (products, callback) {
        async.waterfall([
            function findUserWithAccessToken(cbWaterfall1) {
                User.isUserLoggedIn(products.accessToken, cbWaterfall1);
            },
            function removeFromWishlist(user, cbWaterfall2) {
                Wishlist.findOneAndUpdate({
                    userId: user._id
                }, {
                    $pull: {
                        products: {
                            '$in': [products.productId]
                        }
                    }
                }).exec(cbWaterfall2)
            }
        ], function (err, data) {
            console.log("Wishlist remove error: ", err);
            callback(err, data);
        });
    }
};
module.exports = _.assign(module.exports, exports, model);