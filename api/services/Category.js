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
    status: String
});



schema.plugin(deepPopulate, {
    populate: {
        category: {
            select: "name"
        }
    }
});
schema.plugin(URLSlugs('name'), {
    update: true
});
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

    getCategoriesWithParent: function (data, callback) {
        console.log("Category with parent: ", data);
        HomeCategory.findOne({
            slug: data.slug
        }).exec(function (err, category) {
            if (!_.isEmpty(category)) {
                Category.find({
                    category: mongoose.Types.ObjectId(category._id)
                }).exec(function (err, categories) {
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
    }
};
module.exports = _.assign(module.exports, exports, model);