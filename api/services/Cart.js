var schema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
        // TODO: remove comment
        //unique: true
        //required: true
    },
    products: [{
        id: {
            type: Schema.Types.ObjectId,
            ref: 'Product'
        },
        quantity: Number,
        size: {
            type: Schema.Types.ObjectId,
            ref: 'Size'
        },
        color: String,
        price: Number
    }]
});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('Cart', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {
    saveProduct: function (product, callback) {
        var cart = {};
        cart.products = [];
        cart.products.push({
            id: mongoose.Types.ObjectId(product._id),
            quantity: 1,
            color: product.baseColor,
            price: product.price
        });
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
    }
};
module.exports = _.assign(module.exports, exports, model);