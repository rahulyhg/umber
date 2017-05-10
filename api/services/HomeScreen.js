var schema = new Schema({
    name: String,
    image: String,
    desc: String,
    extLink: String,
    order: Number,
    status: String
});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('HomeScreen', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {

    getEnabledHomeContent: function (data, callback) {
        HomeScreen.find({
            'status': 'Enabled'
        }).sort({
            'order': 1
        }).exec(function (err, found) {
            if (err) {
                callback(err, null);
            } else {
                if (found) {
                    callback(null, found);
                } else {
                    callback({
                        message: "Incorrect Credentials!"
                    }, null);
                }
            }

        });
    },

};
module.exports = _.assign(module.exports, exports, model);