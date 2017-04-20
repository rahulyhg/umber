var schema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        uniqueCaseInsensitive: true
    },
    // Not needed. Instead urlSlug package is installed
    //urlSlug: String,
    imgLink: String,
    status: String
});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('Category', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {
    getAllCategories: function (data, callback) {
        Category.find({
            'status': 'Enabled'
        }).exec(function (err, data) {
            if (err) {
                callback(err, null);
            } else if (data) {
                callback(null, data);
            } else {
                callback({
                    message: "Incorrect Credentials!"
                }, null);
            }
        });
    }
};
module.exports = _.assign(module.exports, exports, model);