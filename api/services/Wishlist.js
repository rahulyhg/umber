var schema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        unique: true,
        required: true
    },
    products: [{
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
    }]
});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('Wishlist', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {};
module.exports = _.assign(module.exports, exports, model);