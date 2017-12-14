var schema = new Schema({
    city: {
        type: String,
        required: true
    },
    lat: String,
    long: String,
    subCity: [{
        brand: {
            type: String
        },
        name: String,
        subCity: String,
        url: String,
        address: String,
        contactNo: String,
        email: {
            type: String,
            validate: validators.isEmail()
        },
    }]
});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('StoreLocator', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {};
module.exports = _.assign(module.exports, exports, model);