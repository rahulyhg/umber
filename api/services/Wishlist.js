var schema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        unique: true,
        required: true
    },
    products: [new Schema({
        product: {
            type: Schema.Types.ObjectId,
            ref: 'Product'
        },
        size: {
            type: Schema.Types.ObjectId,
            ref: 'Size'
        },
        color: {
            type: Schema.Types.ObjectId,
            ref: 'BaseColor'
        }
    }, {
        _id: false
    })]
});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('Wishlist', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {
    saveProduct: function (product, callback) {
        User.findOne({
            accessToken: product.accessToken
        }).exec(function (err, user) {
            if (err) {
                callback(err, null);
            } else if (user) {
                console.log(product);
                var wishlist = {};
                wishlist.userId = product.userId;
                wishlist.products = [];
                wishlist.products.push({
                    product: product._id,
                    size: product.selectedSize,
                    color: product.baseColor
                });
                Wishlist.update({
                        'userId': wishlist.userId
                    }, {
                        $addToSet: {
                            products: wishlist.products[0]
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
                            });
                        }
                    });
            } else {
                callback({
                    message: {
                        data: "Invalid credentials!"
                    }
                }, null);
            }
        })
    },

    getWishlist: function (user, callback) {

    }
};
module.exports = _.assign(module.exports, exports, model);