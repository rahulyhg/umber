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
        returnQuantity: Number,
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
    orderStatus: {
        type: String,
        enum: ['processing', 'shipped', 'delivered', 'returned', 'cancelled'],
        default: 'processing'
    },
    returnReason: {
        type: String
    },
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

var exports = _.cloneDeep(require("sails-wohlig-service")(schema, "user", "user"));
var model = {
    createOrderFromCart: function (data, callback) {
        if (_.isEmpty(data.userId)) {
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
                    Order.saveData(order, callback);
                } else {
                    callback(err, null);
                }
            });
        }
    },

    updateOrderAddress: function (data, callback) {
        Order.findOneAndUpdate({
            _id: data._id
        }, {
            billingAddress: data.billingAddress,
            shippingAddress: data.shippingAddress
        }, {
            new: true
        }, function (err, data) {
            User.saveAddresses(data, callback);
        });
    },

    getUserOrders: function (data, callback) {
        Order.find({
            user: data.userId
        }).deepPopulate('products.product products.product.size products.product.color').exec(function (err, orders) {
            callback(err, orders);
        });
    }
};
module.exports = _.assign(module.exports, exports, model);