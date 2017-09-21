var schema = new Schema({
    name: {
        type: String,
        required: true,
        index: true,
        excel: {
            name: "Name"
        }
    },
    variables: Number,
    products: [{
        type: Schema.Types.ObjectId,
        Ref: 'Product'
    }],
    coupons: [{
        type: String
    }],
    gifts: [{
        photo: {
            type: String
        },
        name: String
    }],
    amount: Number,
    percent: Number,
    minAmount: Number,
    minDiscountAmount: Number,
    type: {
        type: Schema.Types.ObjectId,
        Ref: 'DiscountType'
    }
});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('Discount', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {};
module.exports = _.assign(module.exports, exports, model);