var schema = new Schema({
    title: {
        type: String,
        unique: true,
        uniqueCaseInsensitive: true,
        excel: {
            name: "Name"
        }
    },
    description: String,
    majorImage: String,
    insideImage: String,
    products: [{
        product: {
            _id: {
                type: Schema.Types.ObjectId,
                ref: 'Product'
            },
            productId: {
                type: String,
                index: true
            }
        }
    }],
    status: {
        type: String,
        enum: ['Enabled', 'Disabled']
    }
});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('Buythelook', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {
    getEnabledLook: function (callback) {
        Buythelook.findOne({
            status: 'Enabled'
        }).exec(function (err, data) {
            callback(err, data);
        });
    }
};
module.exports = _.assign(module.exports, exports, model);