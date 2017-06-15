var schema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        uniqueCaseInsensitive: true,
        excel: {
            name: "Name"
        }
    },
    description: String,
    order: Number,
    status: String
});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('Size', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {
    getEnabledSizes: function (callback) {
        Size.find({}).exec(
            function (err, data) {
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
            }
        );
    }
};
module.exports = _.assign(module.exports, exports, model);