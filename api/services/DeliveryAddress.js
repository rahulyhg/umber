var schema = new Schema({
    line1: {
        type: String,
        required: true
    },
    line2: String,
    line3: String,
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    pincode: {
        type: Number,
        required: true
    },
    country: String,
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ['Enable', 'Disable'],
        default: 'Enable'
    }
});

schema.plugin(deepPopulate, {
    populate: {
        userId: {
            select: "name"
        }
    }
});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('DeliveryAddress', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema, "userId", "userId"));
var model = {};
module.exports = _.assign(module.exports, exports, model);