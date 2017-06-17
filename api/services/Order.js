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
        price: Number
    }],
    totalAmount: {
        type: Number,
        required: true
    },
    discountAmount: Number,
    shippingAmount: Number,
    orderStatus: {
        type: String,
        enum: ['processing', 'shipped', 'delivered', 'returned', 'cancelled']
    }
});

schema.plugin(deepPopulate, {
    populate: {
        select: 'firstName lastName'
    }
});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('Order', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema, "userId", "userId"));
var model = {};
module.exports = _.assign(module.exports, exports, model);