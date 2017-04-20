var schema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        uniqueCaseInsensitive: true
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category'
    },
    subCategory: {
        type: Schema.Types.ObjectId,
        ref: 'Subcategory'
    },
    price: Number,
    image: String,
    type: String,
    featured: Boolean,
    newArrival: Boolean,
    brand: String,
    size: Number,
    status: String
});

schema.plugin(deepPopulate, {
    populate: {
        category: {
            select: ""
        },
        subCategory: {
            select: ""
        }
    }
});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('Product', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema, "Category Subcategory", "Category Subcategory"));
var model = {
    getAllProducts: function (data, callback) {
        Product.find({}).exec(function (error, data) {
            if (error) {
                callback(error, null);
            } else if (data) {
                callback(null, data);
            } else {
                callback({
                    message: "Incorrect credentials"
                }, null);
            }
        });
    },

    getNewArrivals: function (data, callback) {
        Product.find({
            newArrival: true,
            status: 'Enabled'
        }).exec(function (error, data) {
            if (error) {
                callback(error, null);
            } else if (data) {
                callback(null, data);
            } else {
                callback({
                    message: "Incorrect credentials"
                }, null);
            }
        });
    },

    getFeatured: function (data, callback) {
        Product.find({
            featured: true,
            status: 'Enabled'
        }).exec(function (error, data) {
            if (error) {
                callback(error, null);
            } else if (data) {
                callback(null, data);
            } else {
                callback({
                    message: "Incorrect credentials"
                }, null);
            }
        });
    }
};
module.exports = _.assign(module.exports, exports, model);