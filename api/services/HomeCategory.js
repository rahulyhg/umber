var schema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        uniqueCaseInsensitive: true
    },
    // Not needed. Instead urlSlug package is installed
    //urlSlug: String,
    priority: Number,
    imageSize: String,
    imgLink: String,
    extLink: String,
    status: String
});

schema.plugin(URLSlugs('name'), {
    update: true
});
schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('HomeCategory', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {
    //Retrieves all categories in order
    getAllCategories: function (data, callback) {
        HomeCategory.find({

        }).sort({
            'priority': 1
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
    },

    getEnabledCategories: function (data, callback) {
        HomeCategory.find({
            'status': 'Enabled'
        }).sort({
            'priority': 1
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
    },

    getCategoryWithId: function (data, callback) {
        HomeCategory.find({
            '_id': data
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
    },

    getCategoryByName: function (data, callback) {
        HomeCategory.findOne({
            name: data.name
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