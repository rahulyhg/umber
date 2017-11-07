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
    status: String,
    isView: Boolean,
    slug: {
        type: String,
        required: true,
        unique: true
    }
});

// schema.plugin(URLSlugs('name'), {
//     update: true
// });
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

    getCategoryBySlug: function (data, callback) {
        if (data.slug) {
            HomeCategory.findOne({
                slug: data.slug
            }).exec(callback);
        } else {
            callback("Invalid parameters", null);
        }
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
    },
    getIdByNameForCategory: function (data, callback) {
        var Model = this;
        var Const = this(data);
        Model.findOne({
            name: data.name
        }, function (err, data2) {
            if (err) {
                callback(err);
            } else if (_.isEmpty(data2)) {
                var slugValue = data.name.replace(/\s/g, "");
                data.slug = slugValue;
                Model.saveData(data, function (err, data3) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, data3._id);
                    }
                });
            } else {
                callback(null, data2._id);
            }
        });
    },
};
module.exports = _.assign(module.exports, exports, model);