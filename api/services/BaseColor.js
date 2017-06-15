var schema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        uniqueCaseInsensitive: true
    },
    code: String,
    status: {
        type: String,
        enum: ['Enabled', 'Disabled'],
        default: 'Enabled'
    }
});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('BaseColor', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {
    getEnabledBaseColors: function (data, callback) {
        BaseColor.find({
            status: 'Enabled'
        }).exec(function (err, data) {
            if (err) {
                callback(err, null);
            } else if (data) {
                callback(null, data);
            } else {
                callback({
                    message: "Invalid credentials"
                }, null);
            }
        });
    }
};
module.exports = _.assign(module.exports, exports, model);