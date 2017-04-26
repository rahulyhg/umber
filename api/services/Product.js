var schema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        uniqueCaseInsensitive: true
    },
    code: String,
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category'
    },
    subCategory: {
        type: Schema.Types.ObjectId,
        ref: 'Subcategory'
    },
    price: Number,
    images: [{
        bigImage: {
            type: String
        },
        smallImage: {
            type: String
        }
    }],
    type: String,
    featured: Boolean,
    newArrival: Boolean,
    brand: {
        type: Schema.Types.ObjectId,
        ref: 'Brand'
    },
    prodCollection: [{
        type: Schema.Types.ObjectId,
        ref: 'Collection',
        unique: true
    }],
    sleeve: {
        type: String,
        enum: ["Half sleeve", "Full sleeve"]
    },
    fabric: String,
    baseColor: String,
    washcare: String,
    description: String,
    size: Number,
    quantity: Number,
    status: String
});

schema.plugin(deepPopulate, {
    populate: {
        'category': {
            select: "name"
        },
        'subCategory': {
            select: "name"
        },
        'brand': {
            select: "name"
        },
        'prodCollection': [{
            select: "name"
        }]
    }
});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('Product', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema, "category subCategory brand prodCollection", "category subCategory brand prodCollection"));
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
    },

    getProductWithId: function (data, callback) {
        Product.findOne({
            _id: mongoose.Types.ObjectId(data)
        }).deepPopulate('brand prodCollection').exec(function (err, data) {
            if (err) {
                callback(err, null);
            } else if (data) {
                callback(null, data);
            } else {
                callback({
                    message: "Incorrect credentials!"
                }, null);
            }
        });
    }
};
module.exports = _.assign(module.exports, exports, model);