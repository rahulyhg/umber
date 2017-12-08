var schema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        uniqueCaseInsensitive: true
    },
    imgLink: String,
    category: {
        type: Schema.Types.ObjectId,
        ref: 'HomeCategory'
    },
    status: String,
    slug: {
        type: String,
        required: true,
        unique: true
    },
    sizeChartImage: {
        image: String
    },
});



schema.plugin(deepPopulate, {
    populate: {
        category: {
            select: ""
        }
    }
});
// schema.plugin(URLSlugs('name'), {
//     update: true
// });
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('Category', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema, "category", "category"));
var model = {
    getEnabledCategories: function (callback) {
        Category.find({
            status: 'Enabled'
        }).exec(function (err, data) {
            if (err)
                callback(err, null);
            else if (data)
                callback(null, data);
            else
                callback({
                    message: {
                        data: "Invalid credentials!"
                    }
                }, null);
        });
    },

    getCategorySlug: function (data, callback) {
        Category.find({
            _id: data._id
        }).exec(function (err, data) {
            if (err)
                callback(err, null);
            else if (data)
                callback(null, data);
            else
                callback({
                    message: {
                        data: "Invalid credentials!"
                    }
                }, null);
        })
    },
    getCategoriesWithParent: function (data, callback) {
        // console.log("Category with parent: ", data);
        HomeCategory.findOne({
            slug: data.slug
        }).exec(function (err, category) {
            // console.log("category", category)
            if (!_.isEmpty(category)) {
                Category.find({
                    category: mongoose.Types.ObjectId(category._id)
                }).exec(function (err, categories) {
                    console.log("category", categories)
                    callback(err, categories);
                });
            } else {
                callback("No Primary category found", null);
            }
        })
    },

    getAllCategories: function (callback) {
        Category.find().exec(function (err, categories) {
            callback(err, categories);
        });
    },

    getCategoryByName: function (data, callback) {
        Category.findOne({
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

    getCategoryBySlug: function (data, callback) {
        if (data.slug) {
            Category.findOne({
                slug: data.slug
            }).exec(callback);
        } else {
            callback("Invalid parameters", null);
        }
    },
    getIdByNameForCategory: function (data, callback) {
        var Model = this;
        var Const = this(data);
        console.log("#######################", Model, "@@@@2", Const);

        Category.findOne({
            name: data.name
        }, function (err, data2) {
            if (err) {
                callback(err);
            } else if (_.isEmpty(data2)) {
                var slugValue = data.name.replace(/\s/g, "");
                data.slug = slugValue;
                Category.saveData(data, function (err, data3) {
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