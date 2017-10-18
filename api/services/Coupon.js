var schema = new Schema({
    name: {
        type: String,
        required: true,
        index: true,
        excel: {
            name: "Name"
        }
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    amount: Number,
    generatedOrderId: {
        type: Schema.Types.ObjectId,
        ref: 'Order'
    },
    usedOrderId: {
        type: Schema.Types.ObjectId,
        ref: 'Order'
    },
    status: {
        type: String,
        enum: ['Used', 'unUsed'],
        default: 'unUsed'
    }
});

schema.plugin(deepPopulate, {
    Populate: {
        'generatedOrderId': {
            select: '_id name'
        },
        'usedOrderId': {
            select: '_id name'
        },
        'user':{
            select:'_id firstName'
        }
    }
});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('Coupon', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema, "generatedOrderId usedOrderId user", "generatedOrderId usedOrderId user"));
var model = {};
module.exports = _.assign(module.exports, exports, model);