var schema = new Schema({
    couponCode: String,
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    userFirstName: {
        type: String
    },
    userLastName: {
        type: String
    },
    userMobile: {
        type: Number
    },
    userEmail: {
        type: String
    },
    frndFirstName: {
        type: String
    },
    frndLastName: {
        type: String
    },
    frndMobile: {
        type: Number
    },
    frndEmail: {
        type: String
    },
    giftAmount: {
        type: Number
    },
    message: {
        type: String
    }
});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('GiftCard', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {};
module.exports = _.assign(module.exports, exports, model);