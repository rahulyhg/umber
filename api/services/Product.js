// Fields fabric, type, baseColor are converted 
// into separate schemas for ease of query & retrieval.
var schema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        uniqueCaseInsensitive: true
    },
    code: String,
    category: [{
        type: Schema.Types.ObjectId,
        ref: 'Category'
    }],
    subCategory: [{
        type: Schema.Types.ObjectId,
        ref: 'Subcategory'
    }],
    price: Number,
    images: [String],
    type: [{
        type: Schema.Types.ObjectId,
        ref: 'Type'
    }],
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
    //TODO: Will the fabric & basecolor be multiple?
    fabric: [{
        type: Schema.Types.ObjectId,
        ref: 'Fabric'
    }],
    baseColor: [{
        type: Schema.Types.ObjectId,
        ref: 'BaseColor'
    }],
    washcare: String,
    description: String,
    size: [{
        type: Schema.Types.ObjectId,
        ref: 'Size',
        unique: true
    }],
    quantity: Number,
    status: {
        type: String,
        enum: ['Enabled', 'Disabled'],
        default: 'Enabled'
    }
});

// Select required fields
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
        'prodCollection': {
            select: "name"
        },
        'baseColor': {
            select: "name"
        },
        'fabric': {
            select: "name"
        },
        'type': {
            select: "name"
        },
        'size': {
            select: "name order"
        }
    }
});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('Product', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema, "category subCategory brand prodCollection baseColor fabric type size",
    "category subCategory brand prodCollection baseColor fabric type size"));
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

    getEnabledProducts: function (data, callback) {
        Product.find({
            status: 'Enabled'
        }).deepPopulate("category subCategory brand prodCollection baseColor fabric type size").exec(function (error, data) {
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
        }).deepPopulate('type').exec(function (error, data) {
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
        }).deepPopulate('type').exec(function (error, data) {
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
        }).deepPopulate('category subCategory brand prodCollection baseColor fabric type size').exec(function (err, data) {
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
    },

    isProductAvailable: function (product, callback) {
        Product.findOne({
            _id: mongoose.Types.ObjectId(product._id)
        }).exec(function (err, data) {
            if (err) {
                callback(err, null);
            } else if (data) {
                if (product.reqQuatity <= product.quantity)
                    callback(null, data);
                else
                    callback(null, {});
            } else {
                callback({
                    message: {
                        data: "Invalid credentials!"
                    }
                }, null);
            }
        })
    },

    updateProductQuantity: function (product, count, callback) {
        Product.findOne({
            _id: product._id
        }).exec(function (err, data) {
            data.quantity += count;
            Product.saveData(data, function (err, data) {
                if (err) {
                    callback(err, null);
                } else if (data) {
                    callback(null, data);
                } else {
                    callback({
                        message: {
                            data: "Invalid credentials!"
                        }
                    }, null);
                }
            })
        });
    }
};
module.exports = _.assign(module.exports, exports, model);