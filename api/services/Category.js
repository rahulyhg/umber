var schema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        uniqueCaseInsensitive: true
    },
    //urlSlug: String,
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
        Category.find({
            category: mongoose.Types.ObjectId(data.category)
        }).exec(function (err, categories) {
            callback(err, categories);
        });
    },

    getAllCategories: function (callback) {
        Category.find().exec(function (err, categories) {
            callback(err, categories);
        });
    }
};
module.exports = _.assign(module.exports, exports, model);