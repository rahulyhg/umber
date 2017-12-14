// Fields fabric, type, baseColor are converted 
// into separate schemas for ease of query & retrieval.
var objectid = require("mongodb").ObjectID;
var schema = new Schema({
    // This is SKU no
    name: {
        type: String,
        unique: true,
        uniqueCaseInsensitive: true
    },
    // This will be same for the same product
    // regardless of size, color
    // LOTNO
    productId: {
        type: String,
        index: true
    },
    // Main categories
    homeCategory: {
        type: Schema.Types.ObjectId,
        ref: 'HomeCategory'
    },
    // This will be like full sleeve in Men's shirt
    // Categories on home page are different
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category'
    },
    type: {
        type: Schema.Types.ObjectId,
        ref: 'Type'
    },
    featured: Boolean,
    newArrival: Boolean,
    brand: {
        type: Schema.Types.ObjectId,
        ref: 'Brand'
    },
    prodCollection: {
        type: Schema.Types.ObjectId,
        ref: 'Collection'
    },
    // Sleeve /trouser style
    style: {
        type: String,
        index: true
    },
    styleNo: String,
    fabric: {
        type: Schema.Types.ObjectId,
        ref: 'Fabric'
    },
    washcare: String,
    description: String,
    productName: String,
    productCode: String,
    quantity: Number,
    ratings: Number,
    size: {
        type: Schema.Types.ObjectId,
        ref: 'Size'
    },
    color: {
        type: Schema.Types.ObjectId,
        ref: 'BaseColor'
    },
    mrp: Number,
    price: Number,
    images: [{
        image: String,
        order: Number
    }],
    status: {
        type: String,
        enum: ['Enabled', 'Disabled'],
        default: 'Enabled'
    }
});

// Select required fields
schema.plugin(deepPopulate, {
    populate: {
        'homeCategory': {
            select: ""
        },
        'category': {
            select: ""
        },
        'brand': {
            select: "name"
        },
        'prodCollection': {
            select: "name"
        },
        'fabric': {
            select: "name"
        },
        'type': {
            select: "name"
        },
        'color': {
            select: "name"
        },
        'size': {
            select: "name"
        }
    }
});

schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('Product', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema, "homeCategory category brand prodCollection fabric type color size",
    "homeCategory category brand prodCollection fabric type color size", "createdAt", "desc"));
var model = {
    manageForeignKey: function (model, data, callback) {
        model.getIdByName(data, function (err, id) {
            if (id)
                callback(null, id);
            else if (err.code == 11000)
                Product.manageForeignKey(model, data, callback);
            else
                callback(err, null);
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
                Model.save(data, function (err, data3) {
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
    manageForeignKeyForCategory: function (model, data, callback) {
        model.getIdByNameForCategory(data, function (err, id) {
            if (id)
                callback(null, id);
            else if (err.code == 11000)
                Product.manageForeignKeyForCategory(model, data, callback);
            else
                callback(err, null);
        });
    },
    manageForeignKeyForSubCategory: function (model, data, callback) {
        Category.getIdByNameForCategory(data, function (err, id) {
            if (id)
                callback(null, id);
            else if (err.code == 11000)
                Product.manageForeignKeyForSubCategory(model, data, callback);
            else
                callback(err, null);
        });
    },


    excelUpload: function (data, callback) {
        var filename = data.file;
        var retVal = [];
        Config.importGS(filename, function (err, data) {
            var i = 1;
            async.eachSeries(data, function (product, complete) {
                if (_.isEmpty(product.SKU)) {
                    complete({
                        "message": "No product SKU found"
                    }, null);
                } else {
                    async.waterfall([
                        function UpdateNormalFields(cbWaterfall1) {
                            var newProduct = {};
                            newProduct.images = [];
                            newProduct.name = product.SKU;
                            if (product.DESCRIPTION) {
                                newProduct.productName = product.DESCRIPTION;
                                newProduct.description = product.DESCRIPTION;
                            }

                            if (product.LOTNO)
                                newProduct.productId = product.LOTNO;

                            if (product.Featured)
                                newProduct.featured = (product.Featured == 'Y' || product.Featured == 'y') ? true : false;

                            if (product.NewArrival)
                                newProduct.newArrival = (product.NewArrival == 'Y' || product.NewArrival == 'y') ? true : false;

                            if (product.STYLE1)
                                newProduct.style = product.STYLE1;

                            if (product.STYLENO)
                                newProduct.styleNo = product.STYLENO;

                            if (product.Washcare)
                                newProduct.washcare = product.Washcare;

                            if (product['STOCK QTY'])
                                newProduct.quantity = product['STOCK QTY'];

                            if (product.price)
                                newProduct.price = product.price;

                            if (product.mrp)
                                newProduct.mrp = product.mrp;

                            if (product.productCode)
                                newProduct.productCode = product.productCode;
                            if (product.image1)
                                newProduct.images.push({
                                    image: product.image1,
                                    order: 1
                                });
                            if (product.image2)
                                newProduct.images.push({
                                    image: product.image2,
                                    order: 2
                                });
                            if (product.image3)
                                newProduct.images.push({
                                    image: product.image3,
                                    order: 3
                                });
                            if (product.IMAGE4)
                                newProduct.images.push({
                                    image: product.IMAGE4,
                                    order: 4
                                });
                            if (product.IMAGE5)
                                newProduct.images.push({
                                    image: product.IMAGE5,
                                    order: 5
                                });
                            if (product.IMAGE6)
                                newProduct.images.push({
                                    image: product.IMAGE6,
                                    order: 6
                                });
                            cbWaterfall1(null, newProduct);
                        },
                        function UpdateCategory(newProduct, cbWaterfall2) {
                            console.log("newProduct", newProduct);
                            if (product.Category) {
                                // Product.manageForeignKey(HomeCategory, {
                                Product.manageForeignKeyForCategory(HomeCategory, {
                                    name: product.Category
                                }, function (err, id) {
                                    console.log("HomeCategoryId in UpdateCategory", id);
                                    newProduct.homeCategory = id;
                                    if (product.Subcategory) {
                                        Product.manageForeignKeyForSubCategory(Category, {
                                            name: product.Subcategory,
                                            category: newProduct.homeCategory
                                        }, function (err, id) {
                                            newProduct.category = id;
                                            cbWaterfall2(err, newProduct);
                                        });
                                    } else {
                                        cbWaterfall2(err, newProduct);
                                    }
                                });
                            } else {
                                cbWaterfall2(null, newProduct);
                            }
                        },
                        function UpdateType(newProduct, cbWaterfall3) {
                            if (product.Type) {
                                Product.manageForeignKey(Type, {
                                    name: product.Type
                                }, function (err, id) {
                                    newProduct.type = id;
                                    cbWaterfall3(err, newProduct);
                                });
                            } else {
                                cbWaterfall3(null, newProduct);
                            }
                        },
                        function UpdateBrand(newProduct, cbWaterfall4) {
                            if (product.Brand) {
                                Product.manageForeignKey(Brand, {
                                    name: product.Brand
                                }, function (err, id) {
                                    newProduct.brand = id;
                                    cbWaterfall4(err, newProduct);
                                });
                            } else {
                                cbWaterfall4(null, newProduct);
                            }
                        },
                        function UpdateCollection(newProduct, cbWaterfall5) {
                            if (product.COLLECTION) {
                                Product.manageForeignKey(Collection, {
                                    name: product.COLLECTION
                                }, function (err, id) {
                                    newProduct.prodCollection = id;
                                    cbWaterfall5(err, newProduct);
                                });
                            } else {
                                cbWaterfall5(null, newProduct);
                            }
                        },
                        function UpdateFabric(newProduct, cbWaterfall6) {
                            if (product.Fabric) {
                                Product.manageForeignKey(Fabric, {
                                    name: product.Fabric
                                }, function (err, id) {
                                    newProduct.fabric = id;
                                    cbWaterfall6(err, newProduct);
                                });
                            } else {
                                cbWaterfall6(null, newProduct);
                            }
                        },
                        function UpdateColor(newProduct, cbWaterfall7) {
                            if (product.COLOR) {
                                Product.manageForeignKey(BaseColor, {
                                    name: product.COLOR,
                                    code: product.ColorCode
                                }, function (err, id) {
                                    newProduct.color = id;
                                    cbWaterfall7(err, newProduct);
                                });
                            } else {
                                cbWaterfall7(null, newProduct);
                            }
                        },
                        function UpdateSize(newProduct, cbWaterfall8) {
                            if (product.SIZE) {
                                Product.manageForeignKey(Size, {
                                    name: product.SIZE,
                                    description: product['Attribute Garment Size']
                                }, function (err, id) {
                                    newProduct.size = id;
                                    cbWaterfall8(err, newProduct);
                                });
                            } else {
                                cbWaterfall8(null, newProduct);
                            }
                        },
                        function (newProduct, cbWaterfall9) {
                            Product.getIdByName(newProduct, function (err, data) {
                                if (err) {
                                    cbWaterfall9(err, null);
                                } else {
                                    Product.findOneAndUpdate({
                                        _id: data
                                    }, newProduct, {
                                        upsert: true,
                                        new: true
                                    }, function (err, data) {
                                        if (err) {
                                            cbWaterfall9(err, null);
                                        } else {
                                            cbWaterfall9(null, data);
                                        }

                                    });
                                }

                            });
                        }
                    ], function (err, newProduct) { // waterfall callback
                        if (err) {
                            retVal.push(err);

                        } else {
                            retVal.push(newProduct._id);
                        }
                        complete(err, retVal);
                    });
                }
            }, function (err, data) {
                if (err)
                    console.log("async error: ", err);
                callback(null, {
                    total: retVal.length,
                    value: retVal
                });
            });
        });
    },

    getAllSKUsWithProductId: function (data, callback) {
        Product.find({
            productId: data.productId
        }).exec(function (err, SKUs) {
            callback(err, SKUs);
        });
    },

    getProductSizesWithProductId: function (data, callback) {
        Product.distinct("size", {
            productId: data.productId
        }).exec(function (err, sizes) {
            callback(err, sizes);
        })
    },

    getProductColorsWithProductId: function (data, callback) {
        Product.distinct("color", {
            productId: data.productId
        }).exec(function (err, sizes) {
            callback(err, sizes);
        })
    },

    // Get the common product details with 
    // Each product id is related with color
    // so no need to get color externally
    // SKU specific details like sizes
    getProductDetails: function (data, callback) {
        async.waterfall([
                // Color is fetched from this record only
                function commonDetails(cbWaterfall1) {
                    Product.findOne({
                        productId: data.productId,
                        name: {
                            $exists: true
                        },
                        category: {
                            $exists: true
                        },
                        images: {
                            $exists: true
                        } //,
                        // brand: {
                        //     $exists: true
                        // },
                        // prodCollection: {
                        //     $exists: true
                        // },
                        // type: {
                        //     $exists: true
                        // },
                        // fabric: {
                        //     $exists: true
                        // },
                        // washcare: {
                        //     $exists: true
                        // },
                        // description: {
                        //     $exists: true
                        // }
                    }).deepPopulate("prodCollection brand fabric color type category homeCategory").lean().exec(cbWaterfall1);
                },
                function getSizes(product, cbWaterfall2) {
                    if (product) {
                        Product.distinct("size", {
                            productId: product.productId
                        }).lean().exec(function (err, prodSizes) {
                            Size.find({
                                _id: {
                                    '$in': prodSizes
                                }
                            }).sort("name").exec(function (err, sizesDetails) {
                                product.sizes = sizesDetails.slice();
                                cbWaterfall2(err, product);
                            });
                        });
                    } else {
                        cbWaterfall2({
                            message: "Product not found"
                        }, null);
                    }
                },
                function getMinPrice(product, cbWaterfall4) {
                    Product.aggregate([{
                        $group: {
                            _id: "$productId",
                            minPrice: {
                                $min: '$price'
                            }
                        }
                    }]).exec(function (err, price) {
                        var idx = _.findIndex(price, function (prod) {
                            return prod._id == product.productId
                        });
                        product.price = price[idx].minPrice;
                        cbWaterfall4(err, product);
                    });
                }
            ],
            function (err, productDetails) {
                callback(err, productDetails);
            });
    },

    // For listing page
    // This function will retrieve products grouped by product id and 
    // with available details
    // req-> {category: category.slug}
    getProductsWithCategory: function (data, callback) {
        if (!data.page) {
            data.page = 1;
        }

        async.waterfall([
            function getCategoryBySlug(callback) {
                Category.getCategoryBySlug(data, callback);
            },
            // Gets all the unique product ids related to the category
            function getCategoryProducts(category, callback1) {
                var pipeline = [];
                // If category filter is applied
                if (category)
                    pipeline.push({
                        $match: {
                            category: mongoose.Types.ObjectId(category._id)
                        }
                    });
                // Get products sorted on creation date
                pipeline.push({
                    $sort: {
                        price: 1
                    }
                });

                // Remove null values for product id
                pipeline.push({
                    $match: {
                        "productId": {
                            "$exists": true
                        }
                    }
                });
                // Get unique products
                pipeline.push({
                    $group: {
                        _id: "$productId"
                    }
                });
                pipeline.push({
                    $project: {
                        productId: '$_id'
                    }
                });
                Product.aggregate(pipeline).skip(data.skip).limit(data.limit).exec(callback1);
            },
            // Retrieve one document containing all the detail based on product id.
            // for individual page
            function getDetailsOfProducts(categoryProducts, callback2) {
                var consolidatedProducts = [];
                async.each(categoryProducts, function (product, eachCallback) {
                    Product.getProductDetails(product, function (err, productDetails) {
                        if (!_.isEmpty(productDetails))
                            consolidatedProducts.push(productDetails);
                        eachCallback(null, productDetails);
                    });
                }, function (err1) {
                    callback2(null, consolidatedProducts);
                });
            },
        ], function (err, products) {
            callback(null, products);
        });
    },

    //getProductWithCategory through nav
    productWithCategory: function (data, callback) {
        // console.log("productWithCategory^^^^^", data);
        Product.find({
            category: data.catId
        }).deepPopulate("homeCategory category brand prodCollection fabric type color size").limit(data.limit).skip(data.skip).exec(function (err, product) {
            if (err) {
                callback(err, "error in mongoose productWithCategory");
            } else {
                if (_.isEmpty(product)) {
                    callback(null, []);
                } else {
                    // console.log("productWithCategory^^^^^", product);
                    callback(null, product);
                }
            }
        })
    },

    // Function to retrieve specific SKU with specified parameters
    // Parameters include color, size
    getSKUWithParameter: function (data, callback) {
        console.log("data in sku", data)
        Product.findOne({
            productId: data.productId,
            size: mongoose.Types.ObjectId(data.size),
            color: mongoose.Types.ObjectId(data.color)
        }).deepPopulate('color size brand prodCollection fabric type category homeCategory').exec(function (err, product) {
            console.log("in Sku parameter", product);
            if (err) {
                callback(err, "error in mongoose productWithCategory");
            } else {
                if (_.isEmpty(product)) {
                    callback(null, false);
                } else {
                    callback(null, product);
                }
            }

        });
    },

    // Function to retrieve filters on listing page
    // req -> {category: category._id}
    getFiltersWithCategory: function (data, callback) {
        console.log("Filters with category data: ", data);
        Category.findOne({
            slug: data.slug
        }).exec(function (err, category) {
            // console.log("Filters with category data:category ", category);
            var match = {
                category: mongoose.Types.ObjectId(category._id)
            };

            if (data.products) {
                match.productId = {
                    $in: data.products
                }
            }

            async.parallel({
                    types: function (cbParallel1) {
                        Product.distinct("type", match).exec(function (err, types) {
                            Type.find({
                                _id: {
                                    $in: types
                                }
                            }).sort("name").exec(cbParallel1);
                        });
                    },
                    collections: function (cbParallel2) {
                        Product.distinct("prodCollection", match).exec(function (err, collections) {
                            Collection.find({
                                _id: {
                                    $in: collections
                                }
                            }).sort("name").exec(cbParallel2);
                        });
                    },
                    sizes: function (cbParallel3) {
                        Product.distinct("size", match).exec(function (err, sizes) {
                            Size.find({
                                _id: {
                                    $in: sizes
                                }
                            }).sort("order").exec(cbParallel3);
                        });
                    },
                    colors: function (cbParallel4) {
                        Product.distinct("color", match).exec(function (err, colors) {
                            BaseColor.find({
                                _id: {
                                    $in: colors
                                }
                            }).sort("name").exec(cbParallel4);
                        });
                    },
                    fabrics: function (cbParallel5) {
                        Product.distinct("fabric", match).exec(function (err, fabrics) {
                            Fabric.find({
                                _id: {
                                    $in: fabrics
                                }
                            }).sort("name").exec(cbParallel5);
                        });
                    },
                    priceRange: function (cbParallel6) {
                        Product.aggregate([{
                            $match: match
                        }, {
                            $group: {
                                _id: null,
                                min: {
                                    $min: '$price'
                                },
                                max: {
                                    $max: '$price'
                                }
                            }
                        }]).exec(cbParallel6);
                    },
                    styles: function (cbParallel7) {
                        Product.distinct("style", match).exec(function (err, styles) {
                            cbParallel7(err, styles);
                        });
                    }
                },
                function (err, filters) {
                    callback(err, filters);
                });
        });
    },

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
        }).deepPopulate("category brand prodCollection fabric type color size").exec(function (error, data) {
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

    getNewArrivals: function (callback) {
        // Product.find({
        //     newArrival: true
        // }).exec(callback);
        async.waterfall([
            function (callback1) {
                Product.aggregate([{
                    $sort: {
                        createdAt: -1
                    }
                }, {
                    $group: {
                        _id: '$productId'
                    }
                }, {
                    $limit: 15
                }]).exec(function (err, products) {
                    callback1(err, products);
                });
            },
            function (products, callback2) {
                var newArrivals = [];
                async.each(products, function (product, eachCallback) {
                    Product.findOne({
                            productId: product._id,
                            newArrival: true
                        }).deepPopulate("homecategory category prodCollection color size fabric type brand")
                        .exec(function (err, product) {
                            if (!_.isEmpty(product)) {
                                newArrivals.push(product);
                                eachCallback(err, product);
                            } else {
                                eachCallback(null, {
                                    message: "No data found"
                                });
                            }
                        });
                }, function (err) {
                    callback2(err, newArrivals);
                });
            }
        ], function (err, results) {
            callback(err, results);
        });
    },

    getFeatured: function (callback) {
        // Product.find({
        //     featured: true
        // }).exec(callback);
        async.waterfall([
            function (callback1) {
                Product.aggregate([{
                    $sort: {
                        createdAt: -1
                    }
                }, {
                    $group: {
                        _id: '$productId'
                    }
                }, {
                    $limit: 15
                }]).exec(function (err, products) {
                    callback1(err, products);
                });
            },
            function (products, callback2) {
                // var featureds = [];
                var featureds = {
                    featureds: [],
                    category: [],
                    type: [],
                    price: [],
                    collection: [],
                    size: [],
                    style: [],
                    color: [],
                    fabric: [],
                    brand: []
                };
                async.each(products, function (product, eachCallback) {
                    Product.findOne({
                            productId: product._id,
                            featured: true
                        }).deepPopulate("homecategory category.name prodCollection.name color.name size.name fabric.name type.name brand.name")
                        .exec(function (err, product) {
                            if (!_.isEmpty(product)) {
                                // featureds.push(product);
                                featureds.featureds.push(product);
                                if (product.style) {
                                    featureds.style.push(product.style);
                                }
                                featureds.price.push(product.price);
                                featureds.category.push(product.category);
                                // featureds.homeCategory.push(product);
                                if (product.style) {
                                    featureds.collection.push(product.prodCollection);
                                }
                                if (product.color) {
                                    featureds.color.push(product.color);
                                }
                                if (product.size) {
                                    featureds.size.push(product.size);
                                }
                                if (product.fabric) {
                                    featureds.fabric.push(product.fabric);
                                }
                                if (product.type) {
                                    featureds.type.push(product.type);
                                }
                                if (product.brand) {
                                    featureds.brand.push(product.brand);
                                }

                                // console.log("unique product: ", featureds);

                                eachCallback(err, product);
                            } else {
                                eachCallback(null, {
                                    message: "No data found"
                                });
                            }
                        });
                }, function (err) {
                    featureds.style = _.uniq(featureds.style);
                    featureds.price = _.uniq(featureds.price);
                    featureds.category = _.uniqBy(featureds.category, 'name');
                    featureds.collection = _.uniqBy(featureds.collection, 'name');
                    featureds.color = _.uniqBy(featureds.color, 'name');
                    featureds.size = _.uniqBy(featureds.size, 'name');
                    featureds.fabric = _.uniqBy(featureds.fabric, 'name');
                    featureds.type = _.uniqBy(featureds.type, 'name');
                    featureds.brand = _.uniqBy(featureds.brand, 'name');
                    callback2(err, featureds);
                });
            }
        ], function (err, results) {
            // console.log("in result", results)
            callback(err, results);
        });
    },

    getProductWithId: function (data, callback) {
        Product.findOne({
            _id: mongoose.Types.ObjectId(data.id)
        }).deepPopulate('category brand prodCollection fabric type color size').exec(function (err, data) {
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
    },

    // API for backend buy the look
    // Sending only productId field results in error
    // Cannot cast to string. Dashboard returns object {productId: $productId}
    // in case only if productId sent, which it tries to map to string.
    getUniqueProducts: function (callback) {
        async.waterfall([
            function findDistinctProducts(cbWaterfall1) {
                Product.distinct("productId", {
                    status: 'Enabled'
                }).exec(function (err, data) {
                    cbWaterfall1(err, data);
                });
            },
            function getProductDetails(products, cbWaterfall2) {
                var productsDetails = [];
                async.each(products, function (product, callback) {
                    Product.findOne({
                        productId: product
                    }).exec(function (err, productDetails) {
                        productsDetails.push(productDetails);
                        callback(err);
                    });
                }, function (err) {
                    var finalData = {};
                    finalData.results = productsDetails;
                    cbWaterfall2(err, finalData);
                });
            }
        ], function (err, productDetails) {
            callback(err, productDetails);
        });
    },


    // API to filter products based on selected criteria
    // For listing page
    // req.body-> {appliedFilters: {key: [val1, val2, ...], key1: [val1, val2, ..], ..}, page: n}
    // Converts this object into queryable object
    getProductsWithFilters: function (filters, callback) {
        // console.log("Filters!!!!!!!!!!!!!11: ", filters, "################", filters.skip, filters.limit);
        if (!filters.page) {
            filters.page = 1;
        }
        if (filters.appliedFilters) {
            var slug = filters.appliedFilters.slug[0]
        } else if (filters.slug) {
            var slug = filters.slug
        }

        Category.findOne({
            slug: slug
        }).exec(function (err, category) {
            if (!_.isEmpty(category)) {
                async.waterfall([
                        function applyFilters(cbWaterfall1) {

                            var pipeline = [];
                            var filterType = [];
                            var filterCategory = [];
                            var filterCollection = [];
                            var filterPriceRange = {
                                min: [],
                                max: []
                            }
                            var filterPriceRangeMin = [];
                            var filterPriceRangeMax = [];
                            var filterColor = [];
                            var filterSize = [];
                            var filterFabric = [];
                            var filterStyle = [];
                            var filterDiscount = [];
                            filterCategory.push(ObjectId(category._id));
                            // _.each(filters.appliedFilters.category, function (cat) {
                            //     filterCategory.push(ObjectId(cat));
                            // });
                            _.each(filters.appliedFilters.category, function (categorys) {
                                filterCategory.push(ObjectId(categorys));
                            });
                            _.each(filters.appliedFilters.type, function (type) {
                                filterType.push(ObjectId(type));
                            });
                            _.each(filters.appliedFilters.color, function (color) {
                                filterColor.push(ObjectId(color));
                            });
                            _.each(filters.appliedFilters.min, function (min) {
                                filterPriceRange.min.push(min);
                            });
                            _.each(filters.appliedFilters.max, function (max) {
                                filterPriceRange.max.push(max);
                            });
                            _.each(filters.appliedFilters.collection, function (collection) {
                                filterCollection.push(ObjectId(collection));
                            });
                            _.each(filters.appliedFilters.size, function (size) {
                                filterSize.push(ObjectId(size));
                            });
                            _.each(filters.appliedFilters.style, function (style) {
                                filterStyle.push(style);
                            });
                            _.each(filters.appliedFilters.fabric, function (fabric) {
                                filterFabric.push(ObjectId(fabric));
                            });
                            // _.each(filters.appliedFilters.discount, function (discount) {
                            //     filterDiscount.push(ObjectId(discount));
                            // });

                            // old code is here


                            if (!_.isEmpty(category)) {

                                pipeline.push({
                                    $match: {
                                        "category": {
                                            $in: filterCategory
                                        }
                                    }
                                });
                            }
                            if (!_.isEmpty(filters.appliedFilters.category)) {
                                // console.log("!_.isEmpty(filters.appliedFilters.category)")
                                pipeline.push({
                                    $match: {
                                        "category": {
                                            $in: filterCategory
                                        }
                                    }
                                });
                            }
                            if (!_.isEmpty(filters.appliedFilters.type)) {

                                pipeline.push({
                                    $match: {
                                        "type": {
                                            $in: filterType
                                        }
                                    }
                                });
                            }
                            if (!_.isEmpty(filters.appliedFilters.color)) {

                                pipeline.push({
                                    $match: {
                                        "color": {
                                            $in: filterColor
                                        },
                                    }
                                })
                            }
                            if (!_.isEmpty(filters.appliedFilters.min)) {

                                pipeline.push({

                                    $match: {

                                        $and: [{
                                            "price": {
                                                $lte: filterPriceRange.max[filterPriceRange.max.length - 1]
                                            }
                                        }, {
                                            "price": {
                                                $gte: filterPriceRange.min[filterPriceRange.min.length - 1]
                                            }
                                        }]
                                    }
                                })
                            }
                            if (!_.isEmpty(filters.appliedFilters.priceRange)) {

                                pipeline.push({

                                    $match: {

                                        $and: [{
                                            "price": {
                                                $lte: filterPriceRange.max
                                            }
                                        }, {
                                            "price": {
                                                $gte: filterPriceRange.min
                                            }
                                        }]
                                    }
                                })
                            }

                            if (!_.isEmpty(filters.appliedFilters.collection)) {

                                pipeline.push({
                                    $match: {
                                        "prodCollection": {
                                            $in: filterCollection
                                        }
                                    }
                                });
                            }
                            if (!_.isEmpty(filters.appliedFilters.size)) {

                                pipeline.push({
                                    $match: {
                                        "size": {
                                            $in: filterSize
                                        }
                                    }
                                });
                            }
                            if (!_.isEmpty(filters.appliedFilters.style)) {

                                pipeline.push({
                                    $match: {
                                        "style": {
                                            $in: filterStyle
                                        }
                                    }
                                });
                            }
                            if (!_.isEmpty(filters.appliedFilters.fabric)) {

                                pipeline.push({
                                    $match: {
                                        "fabric": {
                                            $in: filterFabric
                                        }
                                    }
                                });
                            }
                            console.log("filters.appliedFilters.discount", filters.appliedFilters.discount);
                            if (filters.appliedFilters.discount) {
                                async.each(filters.appliedFilters.discount, function (dis, eachCallback) {
                                    Discount.findOne({
                                        _id: dis
                                    }, {
                                        products: 1
                                    }).exec(function (err, discountProducts) {
                                        // console.log("in data.appliedFilters.discount", discountProducts);
                                        if (err) {
                                            console.log("in discounrt findOne", err);
                                            callback(err, null);
                                        } else {
                                            if (discountProducts.products) {
                                                console.log("in discounrt findOne if", discountProducts.products);
                                                _.each(discountProducts.products, function (val) {
                                                    filterDiscount.push(ObjectId(val));
                                                });

                                            }
                                            eachCallback(null, discountProducts.products);
                                        }
                                    });
                                }, function (err) {
                                    if (err) {
                                        callback(err, null);
                                    }
                                    if (!_.isEmpty(filterDiscount)) {
                                        // console.log("filterDiscount", filterDiscount)
                                        pipeline.push({
                                            $match: {
                                                "_id": {
                                                    $in: filterDiscount
                                                }
                                            }
                                        });
                                        console.log("filterDiscount", filterDiscount);
                                        console.log("pipeline catArr", pipeline);
                                        callProduct();
                                    }
                                });
                            } else {
                                callProduct();
                            }

                            function callProduct() {
                                pipeline.push({
                                    $sort: {
                                        price: 1
                                    }
                                });
                                pipeline.push({
                                    $group: {
                                        _id: '$productId'
                                    }
                                });
                                pipeline.push({
                                    $project: {
                                        productId: '$_id'
                                    }
                                });
                                console.log("filter pipeline", pipeline);
                                Product.aggregate(pipeline).
                                skip(filters.skip).limit(filters.limit).exec(function (err, products) {
                                    console.log("aggregate product in pipeline", products)
                                    cbWaterfall1(err, products);
                                });
                            }
                        },
                        function getProductDetails(products, cbWaterfall2) {
                            var filteredProductsDetails = [];
                            async.each(products, function (product, eachCallback) {
                                Product.getProductDetails(product, function (err, productDetails) {
                                    if (productDetails && !_.isEmpty(productDetails))
                                        filteredProductsDetails.push(productDetails);
                                    // console.log("filteredProductsDetails", filteredProductsDetails)
                                    eachCallback(err, productDetails);
                                });
                            }, function (err) {
                                cbWaterfall2(err, filteredProductsDetails);
                            });
                        },
                        function getProductFilters(products, cbWaterfall3) {
                            var data = {};
                            data.products = [];
                            var filterDetails = {};
                            filterDetails.products = products;
                            async.each(products, function (product, eachCallback) {
                                data.products.push(product.productId);
                                eachCallback(null);
                            }, function (err) {
                                data.slug = filters.appliedFilters.slug[0];
                                Product.getFiltersWithCategory(data, function (err, filters) {
                                    if (filters && !_.isEmpty(filters)) {
                                        filterDetails.filters = filters;
                                    }
                                    cbWaterfall3(null, filterDetails);
                                });
                            });
                        }
                    ],
                    function (err, products) {
                        // console.log("!!!!11", products)
                        callback(err, products);
                    });
            } else {
                callback("Invalid category", null);
            }
        });
    },

    cloneProduct: function (formData, callback) {
        delete formData._id;
        Product.saveData(formData, callback)
    },
    subtractQuantity: function (products, callback) {
        console.log("*******product", products);
        _.each(products, function (product) {
            Product.findOneAndUpdate({
                _id: mongoose.Types.ObjectId(product.product)
            }, {
                $inc: {
                    quantity: -product.quantity
                }
            }, {
                new: true
            }).exec(function (err, data) {
                if (data.quantity < 0) {
                    Product.update({
                        _id: product._id
                    }, {
                        $inc: {
                            quantity: product.quantity
                        }
                    }).exec(function (err, data) {
                        if (callback) {
                            if (data) {
                                callback({
                                    message: {
                                        data: "productOutOfStock " + product._id
                                    }
                                }, null);
                            } else {
                                callback(err, null);
                            }
                        }
                    });
                } else {
                    if (callback)
                        callback(null, {
                            message: "success"
                        });
                }
            });
        })
    },
    // get product based on sku
    /**
     * this function provides product based on SKU and
     * update the product according SKU in discount
     * @param {skuOfProducts} input skuOfProducts
     * @param {discoutId} input discoutId
     * @param {callback} callback function with err and response
     */
    getProductAccordingSku: function (skuOfProducts, discoutId, callback) {
        if (skuOfProducts) {
            var array = _.map(skuOfProducts.split(','), function (n) {
                return _.trim(n);
            });
            Product.find({
                "name": {
                    $in: array
                }
            }).exec(function (err, products) {
                if (err || _.isEmpty(products)) {
                    callback(err, null);
                } else {
                    Discount.findOneAndUpdate({
                        _id: discoutId
                    }, {
                        $set: {
                            "products": _.map(products, "_id"),
                            skuOfProducts: _.join(array, ", ")
                        }
                    }).exec(callback);
                }
            });
        }
    },
    //for global search
    getAggregatePipeLine: function (data) {
        // console.log("**** in  getAggregatePipeLine***", data)

        var pipeline = [
            // Stage 1
            {
                $lookup: {
                    "from": "categories",
                    "localField": "category",
                    "foreignField": "_id",
                    "as": "category"
                }
            },

            // Stage 2
            {
                $unwind: {
                    path: "$category",
                    preserveNullAndEmptyArrays: true // optional

                }
            },

            // Stage 3
            {
                $lookup: {
                    "from": "homecategories",
                    "localField": "homeCategory",
                    "foreignField": "_id",
                    "as": "homeCategory"
                }
            },

            // Stage 4
            {
                $unwind: {
                    path: "$homeCategory",
                    preserveNullAndEmptyArrays: true // optional

                }
            },

            // Stage 5
            {
                $lookup: {
                    "from": "collections",
                    "localField": "prodCollection",
                    "foreignField": "_id",
                    "as": "prodCollection"
                }
            },

            // Stage 6
            {
                $unwind: {
                    path: "$prodCollection",
                    preserveNullAndEmptyArrays: true // optional

                }
            },

            // Stage 7
            {
                $lookup: {
                    "from": "basecolors",
                    "localField": "color",
                    "foreignField": "_id",
                    "as": "color"
                }
            },

            // Stage 8
            {
                $unwind: {
                    path: "$color",
                    preserveNullAndEmptyArrays: true // optional

                }
            },

            // Stage 9
            {
                $lookup: {
                    "from": "sizes",
                    "localField": "size",
                    "foreignField": "_id",
                    "as": "size"
                }
            },

            // Stage 10
            {
                $unwind: {
                    path: "$size",
                    preserveNullAndEmptyArrays: true // optional

                }
            },

            // Stage 11
            {
                $lookup: {
                    "from": "fabrics",
                    "localField": "fabric",
                    "foreignField": "_id",
                    "as": "fabric"
                }
            },

            // Stage 12
            {
                $lookup: {
                    "from": "types",
                    "localField": "type",
                    "foreignField": "_id",
                    "as": "type"
                }
            },

            // Stage 13
            {
                $lookup: {
                    "from": "brands",
                    "localField": "brand",
                    "foreignField": "_id",
                    "as": "brand"
                }
            },

            // Stage 14
            {
                $unwind: {
                    path: "$fabric",
                    preserveNullAndEmptyArrays: true // optional

                }
            },

            // Stage 15
            {
                $unwind: {
                    path: "$type",
                    preserveNullAndEmptyArrays: true // optional
                }
            },

            // Stage 16
            {
                $unwind: {
                    path: "$brand",
                    preserveNullAndEmptyArrays: true // optional
                }
            },

            // Stage 17
            {
                $match: {
                    $or: [{
                            "style": {
                                $regex: data.keyword,
                                $options: "i"
                            }
                        }, {
                            "productName": {
                                $regex: data.keyword,
                                $options: "i"
                            }
                        },
                        {
                            "category.name": {
                                $regex: data.keyword,
                                $options: "i"
                            }
                        },
                        {
                            "homeCategory.name": {
                                $regex: data.keyword,
                                $options: "i"
                            }
                        },
                        {
                            "prodCollection.name": {
                                $regex: data.keyword,
                                $options: "i"
                            }
                        },
                        {
                            "color.name": {
                                $regex: data.keyword,
                                $options: "i"
                            }
                        },
                        {
                            "size.name": {
                                $regex: data.keyword,
                                $options: "i"
                            }
                        },
                        {
                            "fabric.name": {
                                $regex: data.keyword,
                                $options: "i"
                            }
                        },
                        {
                            "type.name": {
                                $regex: data.keyword,
                                $options: "i"
                            }
                        },
                        {
                            "brand.name": {
                                $regex: data.keyword,
                                $options: "i"
                            }
                        }
                    ]
                }
            },
            {
                $skip: data.skip
            },
            {
                $limit: data.limit
            }

        ];
        return pipeline;
    },
    //data.keyword
    globalSearch: function (data, callback) {
        // console.log("**** in global search***", data);
        var pipeLine = Product.getAggregatePipeLine(data);
        Product.aggregate(pipeLine, function (err, found) {
            console.log("**** in global search***", found)
            if (err) {
                callback(err, "error in mongoose");
            } else {
                if (_.isEmpty(found)) {
                    callback(null, []);
                } else {

                    callback(null, found);
                }
            }
        });

    },


    searchWithFilters1: function (data, callback) {
        console.log("333333data", data)
        async.waterfall([
            function globalsSearch(callback) {
                // operation to be performed
                var pipeLine = Product.getAggregatePipeLine(data);
                Product.aggregate(pipeLine, function (err, found) {
                    // console.log("**** in global search***", found)
                    if (err) {
                        callback(err, null);
                    } else {
                        if (_.isEmpty(found)) {
                            callback(null, []);
                        } else {
                            callback(null, found);
                        }
                    }
                });
            },
            function filtersP(found, callback) {
                // operation to be performed
                // console.log("found11111111111", found);
                if (!_.isEmpty(found)) {
                    var appliedFilters = {}
                    appliedFilters.slug = [];
                    appliedFilters.category = [];
                    appliedFilters.type = [];
                    appliedFilters.style = [];
                    appliedFilters.color = [];
                    appliedFilters.priceRange = [];
                    appliedFilters.collection = [];
                    appliedFilters.category = [];
                    appliedFilters.size = [];
                    appliedFilters.fabric = [];
                    _.each(found, function (product) {
                        console.log("product", product)
                        appliedFilters.slug.push(product.category.slug);
                        appliedFilters.category.push(product.category._id)
                        if (product.type) {
                            appliedFilters.type.push(product.type._id);
                        }
                        if (product.style) {
                            appliedFilters.style.push(product.style);
                        }
                        if (product.color) {
                            appliedFilters.color.push(product.color._id);
                        }
                        // if (product.price) {
                        //     appliedFilters.priceRange = [product.price]
                        // }
                        if (product.prodCollection) {
                            appliedFilters.collection.push(product.prodCollection._id);
                        }
                        if (product.size) {
                            appliedFilters.size.push(product.size._id);
                        }
                        if (product.fabric) {
                            appliedFilters.fabric.push(product.fabric._id);
                        }

                        var filters = {};
                        filters.appliedFilters = appliedFilters;
                        // console.log("filters111", filters);
                        Product.getProductsWithFilters(filters, function (err, filterProduct) {
                            if (err) {
                                callback(err, "error in mongoose");
                            } else {
                                if (_.isEmpty(filterProduct)) {
                                    callback(null, []);
                                } else {

                                    callback(null, filterProduct);
                                }
                            }
                        })
                    })
                }
                if (_.isEmpty(found)) {
                    callback(null, [])
                }
            }
        ], function (err, finalResult) {
            if (err) {
                console.log('***** error at final response of async.waterfall in searchWithFilters *****', err);
            } else {
                callback(null, finalResult);
            }
        });
    },

    searchWithFilters: function (data, callback) {
        // console.log("in serachWithFilters", data)
        if (!data.page) {
            data.page = 1;
        }
        var pipeline = [];
        if (!_.isEmpty(data.appliedFilters.category)) {
            // console.log("!_.isEmpty(filters.appliedFilters.category)", data.appliedFilters.category)
            pipeline.push({
                "category": {
                    $in: _.map(data.appliedFilters.category, function (n) {
                        return mongoose.Types.ObjectId(n)
                    })
                }
            });
        }
        if (!_.isEmpty(data.appliedFilters.type)) {

            pipeline.push({
                "type": {
                    $in: _.map(data.appliedFilters.type, function (n) {
                        return mongoose.Types.ObjectId(n)
                    })
                }
            });
        }
        if (!_.isEmpty(data.appliedFilters.color)) {

            pipeline.push({
                "color": {
                    $in: _.map(data.appliedFilters.color, function (n) {
                        return mongoose.Types.ObjectId(n)
                    })
                },
            })
        }
        if (!_.isEmpty(data.appliedFilters.priceRange)) {

            pipeline.push({


                $and: [{
                    "price": {
                        $lte: data.appliedFilters.priceRange
                    }
                }, {
                    "price": {
                        $gte: data.appliedFilters.priceRange
                    }
                }]
            })
        }
        if (!_.isEmpty(data.appliedFilters.max)) {
            pipeline.push({
                $and: [{
                    "price": {
                        $lte: data.appliedFilters.max[data.appliedFilters.max.length - 1]
                    }
                }, {
                    "price": {
                        $gte: data.appliedFilters.min[data.appliedFilters.min.length - 1]
                    }
                }]
            })
        }

        if (!_.isEmpty(data.appliedFilters.collection)) {

            pipeline.push({
                "prodCollection": {
                    $in: _.map(data.appliedFilters.collection, function (n) {
                        return mongoose.Types.ObjectId(n)
                    })
                }
            });
        }
        if (!_.isEmpty(data.appliedFilters.style)) {
            pipeline.push({

                "style": {
                    $in: data.appliedFilters.style
                }
            });
        }
        if (!_.isEmpty(data.appliedFilters.size)) {
            console.log("in appliedFilters.size", data.appliedFilters.size)
            pipeline.push({
                "size": {
                    $in: _.map(data.appliedFilters.size, function (n) {
                        return mongoose.Types.ObjectId(n)
                    })
                }
            });
        }
        if (!_.isEmpty(data.appliedFilters.fabric)) {

            pipeline.push({
                "fabric": {
                    $in: _.map(data.appliedFilters.fabric, function (n) {
                        return mongoose.Types.ObjectId(n)
                    })
                }
            });
        }
        if (!_.isEmpty(data.appliedFilters.discount)) {
            var filterDiscount = [];
            async.each(data.appliedFilters.discount, function (dis, eachCallback) {
                Discount.findOne({
                    _id: dis
                }, {
                    products: 1
                }).exec(function (err, discountProducts) {
                    console.log("in data.appliedFilters.discount", discountProducts);
                    if (err) {
                        console.log("in discounrt findOne", err);
                        callback(err, null);
                    } else {
                        if (discountProducts.products) {
                            console.log("in discounrt findOne if", discountProducts.products);
                            _.each(discountProducts.products, function (val) {
                                filterDiscount.push(ObjectId(val));
                            });

                        }
                        eachCallback(null, discountProducts.products);
                    }
                });
            }, function (err) {
                if (err) {
                    callback(err, null);
                }
                if (!_.isEmpty(filterDiscount)) {
                    console.log("filterDiscount", filterDiscount)
                    pipeline.push({
                        "_id": {
                            $in: _.map(filterDiscount, function (n) {
                                return mongoose.Types.ObjectId(n)
                            })
                        }
                    });
                    console.log("filterDiscount", filterDiscount);
                    console.log("pipeline catArr", pipeline);
                    callProduct();
                }
            });
        } else {
            callProduct();
        }

        function callProduct() {
            if (!_.isEmpty(pipeline)) {
                console.log("pipeline is not empty")
                var lookupArr = [{
                        $match: {
                            $and: pipeline
                        }
                    },
                    {
                        $lookup: {
                            "from": "categories",
                            "localField": "category",
                            "foreignField": "_id",
                            "as": "category"
                        }
                    },

                    // Stage 2
                    {
                        $unwind: {
                            path: "$category",
                            preserveNullAndEmptyArrays: true // optional

                        }
                    },

                    // Stage 3
                    {
                        $lookup: {
                            "from": "homecategories",
                            "localField": "homeCategory",
                            "foreignField": "_id",
                            "as": "homeCategory"
                        }
                    },

                    // Stage 4
                    {
                        $unwind: {
                            path: "$homeCategory",
                            preserveNullAndEmptyArrays: true // optional

                        }
                    },

                    // Stage 5
                    {
                        $lookup: {
                            "from": "collections",
                            "localField": "prodCollection",
                            "foreignField": "_id",
                            "as": "prodCollection"
                        }
                    },

                    // Stage 6
                    {
                        $unwind: {
                            path: "$prodCollection",
                            preserveNullAndEmptyArrays: true // optional

                        }
                    },

                    // Stage 7
                    {
                        $lookup: {
                            "from": "basecolors",
                            "localField": "color",
                            "foreignField": "_id",
                            "as": "color"
                        }
                    },

                    // Stage 8
                    {
                        $unwind: {
                            path: "$color",
                            preserveNullAndEmptyArrays: true // optional

                        }
                    },

                    // Stage 9
                    {
                        $lookup: {
                            "from": "sizes",
                            "localField": "size",
                            "foreignField": "_id",
                            "as": "size"
                        }
                    },

                    // Stage 10
                    {
                        $unwind: {
                            path: "$size",
                            preserveNullAndEmptyArrays: true // optional

                        }
                    },

                    // Stage 11
                    {
                        $lookup: {
                            "from": "fabrics",
                            "localField": "fabric",
                            "foreignField": "_id",
                            "as": "fabric"
                        }
                    },

                    // Stage 12
                    {
                        $lookup: {
                            "from": "types",
                            "localField": "type",
                            "foreignField": "_id",
                            "as": "type"
                        }
                    },

                    // Stage 13
                    {
                        $lookup: {
                            "from": "brands",
                            "localField": "brand",
                            "foreignField": "_id",
                            "as": "brand"
                        }
                    },

                    // Stage 14
                    {
                        $unwind: {
                            path: "$fabric",
                            preserveNullAndEmptyArrays: true // optional

                        }
                    },

                    // Stage 15
                    {
                        $unwind: {
                            path: "$type",
                            preserveNullAndEmptyArrays: true // optional
                        }
                    },

                    // Stage 16
                    {
                        $unwind: {
                            path: "$brand",
                            preserveNullAndEmptyArrays: true // optional
                        }
                    }, {
                        $match: {
                            $or: [{
                                    "style": {
                                        $regex: data.keyword,
                                        $options: "i"
                                    }
                                }, {
                                    "productName": {
                                        $regex: data.keyword,
                                        $options: "i"
                                    }
                                },
                                {
                                    "category.name": {
                                        $regex: data.keyword,
                                        $options: "i"
                                    }
                                },
                                {
                                    "homeCategory.name": {
                                        $regex: data.keyword,
                                        $options: "i"
                                    }
                                },
                                {
                                    "prodCollection.name": {
                                        $regex: data.keyword,
                                        $options: "i"
                                    }
                                },
                                {
                                    "color.name": {
                                        $regex: data.keyword,
                                        $options: "i"
                                    }
                                },
                                {
                                    "size.name": {
                                        $regex: data.keyword,
                                        $options: "i"
                                    }
                                },
                                {
                                    "fabric.name": {
                                        $regex: data.keyword,
                                        $options: "i"
                                    }
                                },
                                {
                                    "type.name": {
                                        $regex: data.keyword,
                                        $options: "i"
                                    }
                                },
                                {
                                    "brand.name": {
                                        $regex: data.keyword,
                                        $options: "i"
                                    }
                                }
                            ]
                            // ,
                            // $and: pipeline
                        }
                    }
                ];
            } else
            if (_.isEmpty(pipeline)) {
                console.log("pipeline is empty")
                var lookupArr = [{
                        $lookup: {
                            "from": "categories",
                            "localField": "category",
                            "foreignField": "_id",
                            "as": "category"
                        }
                    },

                    // Stage 2
                    {
                        $unwind: {
                            path: "$category",
                            preserveNullAndEmptyArrays: true // optional

                        }
                    },

                    // Stage 3
                    {
                        $lookup: {
                            "from": "homecategories",
                            "localField": "homeCategory",
                            "foreignField": "_id",
                            "as": "homeCategory"
                        }
                    },

                    // Stage 4
                    {
                        $unwind: {
                            path: "$homeCategory",
                            preserveNullAndEmptyArrays: true // optional

                        }
                    },

                    // Stage 5
                    {
                        $lookup: {
                            "from": "collections",
                            "localField": "prodCollection",
                            "foreignField": "_id",
                            "as": "prodCollection"
                        }
                    },

                    // Stage 6
                    {
                        $unwind: {
                            path: "$prodCollection",
                            preserveNullAndEmptyArrays: true // optional

                        }
                    },

                    // Stage 7
                    {
                        $lookup: {
                            "from": "basecolors",
                            "localField": "color",
                            "foreignField": "_id",
                            "as": "color"
                        }
                    },

                    // Stage 8
                    {
                        $unwind: {
                            path: "$color",
                            preserveNullAndEmptyArrays: true // optional

                        }
                    },

                    // Stage 9
                    {
                        $lookup: {
                            "from": "sizes",
                            "localField": "size",
                            "foreignField": "_id",
                            "as": "size"
                        }
                    },

                    // Stage 10
                    {
                        $unwind: {
                            path: "$size",
                            preserveNullAndEmptyArrays: true // optional

                        }
                    },

                    // Stage 11
                    {
                        $lookup: {
                            "from": "fabrics",
                            "localField": "fabric",
                            "foreignField": "_id",
                            "as": "fabric"
                        }
                    },

                    // Stage 12
                    {
                        $lookup: {
                            "from": "types",
                            "localField": "type",
                            "foreignField": "_id",
                            "as": "type"
                        }
                    },

                    // Stage 13
                    {
                        $lookup: {
                            "from": "brands",
                            "localField": "brand",
                            "foreignField": "_id",
                            "as": "brand"
                        }
                    },

                    // Stage 14
                    {
                        $unwind: {
                            path: "$fabric",
                            preserveNullAndEmptyArrays: true // optional

                        }
                    },

                    // Stage 15
                    {
                        $unwind: {
                            path: "$type",
                            preserveNullAndEmptyArrays: true // optional
                        }
                    },

                    // Stage 16
                    {
                        $unwind: {
                            path: "$brand",
                            preserveNullAndEmptyArrays: true // optional
                        }
                    }, {
                        $match: {
                            $or: [{
                                    "style": {
                                        $regex: data.keyword,
                                        $options: "i"
                                    }
                                }, {
                                    "productName": {
                                        $regex: data.keyword,
                                        $options: "i"
                                    }
                                },
                                {
                                    "category.name": {
                                        $regex: data.keyword,
                                        $options: "i"
                                    }
                                },
                                {
                                    "homeCategory.name": {
                                        $regex: data.keyword,
                                        $options: "i"
                                    }
                                },
                                {
                                    "prodCollection.name": {
                                        $regex: data.keyword,
                                        $options: "i"
                                    }
                                },
                                {
                                    "color.name": {
                                        $regex: data.keyword,
                                        $options: "i"
                                    }
                                },
                                {
                                    "size.name": {
                                        $regex: data.keyword,
                                        $options: "i"
                                    }
                                },
                                {
                                    "fabric.name": {
                                        $regex: data.keyword,
                                        $options: "i"
                                    }
                                },
                                {
                                    "type.name": {
                                        $regex: data.keyword,
                                        $options: "i"
                                    }
                                },
                                {
                                    "brand.name": {
                                        $regex: data.keyword,
                                        $options: "i"
                                    }
                                }
                            ]
                            // ,
                            // $and: pipeline
                        }
                    }
                ];
            }

            console.log("inpipeline", pipeline);
            async.parallel([
                    //Start Product
                    function (callback) {
                        // console.log("data filter",objthickness);

                        Product.aggregate(_.compact(_.concat(lookupArr, [{
                                $group: {
                                    _id: "$productId",
                                    style: {
                                        $first: "$style"
                                    },
                                    productName: {
                                        $first: "$productName"
                                    },
                                    productId: {
                                        $first: "$productId"
                                    },
                                    description: {
                                        $first: "$description"
                                    },
                                    category: {
                                        $first: "$category"
                                    },
                                    price: {
                                        $first: "$price"
                                    },
                                    mrp: {
                                        $first: "$mrp"
                                    },
                                    homeCategory: {
                                        $first: "$homeCategory.name"
                                    },
                                    prodCollection: {
                                        $first: "$prodCollection.name"
                                    },
                                    color: {
                                        $first: "$color.name"
                                    },
                                    size: {
                                        $push: "$size"
                                    },
                                    fabric: {
                                        $first: "$fabric.name"
                                    },
                                    type: {
                                        $first: "$type.name"
                                    },
                                    brand: {
                                        $first: "$brand.name"
                                    },
                                    images: {
                                        $first: "$images"
                                    }
                                }
                            }, {
                                '$skip': data.skip
                            }, {
                                '$limit': data.limit
                            }])),
                            function (err, data1) {
                                if (err) {
                                    console.log("error : ", err);
                                    callback(null, err);
                                } else if (data1) {
                                    console.log("data1 length", data1);
                                    if (_.isEmpty(data1)) {
                                        callback("No data found", null);
                                    } else {
                                        callback(null, data1);
                                    }
                                } else {
                                    callback("Invalid data", null);
                                }
                            });
                    },

                    function (callback) {
                        Product.aggregate(_.compact(_.concat(lookupArr, [{
                                $group: {
                                    _id: "$productId",
                                    style: {
                                        $first: "$style"
                                    },
                                    productName: {
                                        $first: "$productName"
                                    },
                                    productId: {
                                        $first: "$productId"
                                    },
                                    description: {
                                        $first: "$description"
                                    },
                                    category: {
                                        $first: "$category._id"
                                    },
                                    price: {
                                        $first: "$price"
                                    },
                                    mrp: {
                                        $first: "$mrp"
                                    },
                                    homeCategory: {
                                        $first: "$homeCategory._id"
                                    },
                                    prodCollection: {
                                        $first: "$prodCollection._id"
                                    },
                                    color: {
                                        $first: "$color._id"
                                    },
                                    size: {
                                        $push: "$size._id"
                                    },
                                    fabric: {
                                        $first: "$fabric._id"
                                    },
                                    type: {
                                        $first: "$type._id"
                                    },
                                    brand: {
                                        $first: "$brand._id"
                                    },
                                    images: {
                                        $first: "$images"
                                    },
                                    count: {
                                        $sum: 1
                                    }
                                }
                            }])),
                            function (err, data2) {
                                var countData = [];
                                if (err) {
                                    console.log(err);
                                    callback(err, null);
                                } else if (data2) {
                                    if (_.isEmpty(data2)) {
                                        callback("No data found", null);
                                    } else {
                                        // console.log("data2@@@@", data2)
                                        // countData.push(data2);
                                        callback(null, data2);
                                    }
                                } else {
                                    callback("Invalid data", null);
                                }
                            });
                    }
                ],
                function (err, data3) {
                    if (err) {
                        callback(err, null);
                    }
                    // callback(null, data3);

                    var data4 = {};

                    if (_.isEmpty(data3[0])) {
                        data3[0] = [];
                    } else if (_.isEmpty(data3[0])) {
                        callback(null, "no data found");
                    } else {
                        console.log("data3", data3[0]);
                        data4.products = data3[0];
                        data4.count = data3[1].count;
                        var style = [];
                        var price = [];
                        var productName = [];
                        var productId = [];
                        var categoryIds = [];
                        var homeCategoryIds = [];
                        var prodCollectionIds = [];
                        var colorIds = [];
                        var sizeIds = [];
                        var fabricIds = [];
                        var typeIds = [];
                        var brandIds = [];
                        var categoryData = [];
                        var homeCategoryData = [];
                        var prodCollectionData = [];
                        var colorData = [];
                        var sizeData = [];
                        var fabricData = [];
                        var typeData = [];
                        var brandData = [];
                        var sizeArr = [];

                        _.map(data3[1], function (key, value) {
                            key.category = key.category.toString();
                            // key.homeCategory = key.homeCategory.toString();
                            key.prodCollection = key.prodCollection.toString();
                            key.color = key.color.toString();
                            _.each(key.size, function (val) {
                                sizeArr.push(val.toString())
                            });

                            if (!_.isEmpty(key.fabric)) {
                                key.fabric = key.fabric.toString();
                            }
                            if (!_.isEmpty(key.type)) {
                                key.type = key.type.toString();
                            }
                            if (!_.isEmpty(key.discount)) {
                                key.discount = key.discount.toString();
                            }
                            if (!_.isEmpty(key.brand)) {
                                key.brand = key.brand.toString();
                            }

                        })

                        //category = lodash.uniqBy(data3[1].product, 'category');
                        category = _.uniqBy(data3[1], 'category');
                        homeCategory = _.uniqBy(data3[1], 'homeCategory');
                        prodCollection = _.uniqBy(data3[1], 'prodCollection');
                        color = _.uniqBy(data3[1], 'color');
                        size = _.uniqBy(sizeArr, 'size');
                        fabric = _.uniqBy(data3[1], 'fabric');
                        type = _.uniqBy(data3[1], 'type');
                        brand = _.uniqBy(data3[1], 'brand');
                        productId = _.uniqBy(data3[1], 'productId');


                        // For removing empty type in array
                        _.each(category, function (value1) {
                            categoryIds.push(value1.category);
                        });
                        _.each(category, function (value1) {
                            categoryIds.push(value1.category);
                        });

                        _.each(homeCategory, function (value2) {
                            homeCategoryIds.push(value2.homeCategory);
                        });

                        _.each(prodCollection, function (value3) {
                            prodCollectionIds.push(value3.prodCollection);
                        });

                        _.each(color, function (value4) {
                            colorIds.push(value4.color);
                        });
                        // _.each(size, function (value1) {
                        //     sizeIds.push(value1.size);
                        // });

                        _.each(fabric, function (value2) {
                            fabricIds.push(value2.fabric);
                        });

                        _.each(type, function (value3) {
                            typeIds.push(value3.type);
                        });

                        _.each(brand, function (value4) {
                            brandIds.push(value4.brand);
                        });
                        _.each(data3[0], function (value5) {
                            // var uniqStyle = _.uniqBy(value5, value5.style)
                            style.push(value5.style);
                        });
                        _.each(data3[0], function (value6) {
                            price.push(value6.price);
                        });

                        async.parallel([
                            //Category
                            function (callback) {
                                Category.find({
                                    _id: {
                                        $in: categoryIds
                                    }
                                }, {
                                    "_id": 1,
                                    "name": 1
                                }).sort({
                                    name: 1
                                }).lean().exec(function (err, data1) {
                                    if (err) {
                                        console.log("error :", err);
                                        callback(null, err);
                                    } else if (data1) {
                                        categoryData.push(data1);
                                        callback(null, data1);
                                    } else {
                                        callback("Invalid data", null);
                                    }
                                });
                            },
                            //End Category

                            //HomeCategory
                            function (callback) {
                                HomeCategory.find({
                                    _id: {
                                        $in: homeCategoryIds
                                    }
                                }, {
                                    "_id": 1,
                                    "name": 1
                                }).sort({
                                    name: 1
                                }).lean().exec(function (err, data2) {
                                    if (err) {
                                        console.log("error :", err);
                                        callback(null, err);
                                    } else if (data2) {
                                        homeCategoryData.push(data2);
                                        callback(null, data2);
                                    } else {
                                        callback("Invalid data", null);
                                    }
                                });
                            },
                            //End HomeCategory

                            //collection
                            function (callback) {
                                Collection.find({
                                    _id: {
                                        $in: prodCollectionIds
                                    }
                                }, {
                                    "_id": 1,
                                    "name": 1
                                }).sort({
                                    name: 1
                                }).lean().exec(function (err, data3) {
                                    if (err) {
                                        console.log("error :", err);
                                        callback(null, err);
                                    } else if (data3) {
                                        prodCollectionData.push(data3);
                                        callback(null, data3);
                                    } else {
                                        callback("Invalid data", null);
                                    }
                                });
                            },
                            //End collection

                            //BaseColor
                            function (callback) {
                                BaseColor.find({
                                    _id: {
                                        $in: colorIds
                                    }
                                }, {
                                    "_id": 1,
                                    "name": 1
                                }).sort({
                                    name: 1
                                }).lean().exec(function (err, data4) {
                                    if (err) {
                                        console.log(err);
                                        callback(err, null);
                                    } else if (data3) {
                                        colorData.push(data4);
                                        callback(null, data4);
                                    } else {
                                        callback("Invalid data", null);
                                    }
                                });
                            },
                            //End BaseColor
                            //size
                            function (callback) {
                                Size.find({
                                    _id: {
                                        $in: sizeArr
                                    }
                                }, {
                                    "_id": 1,
                                    "name": 1,
                                    "description": 1,
                                }).sort({
                                    name: 1
                                }).lean().exec(function (err, data3) {
                                    if (err) {
                                        console.log("error :", err);
                                        callback(null, err);
                                    } else if (data3) {
                                        sizeData.push(data3);
                                        callback(null, data3);
                                    } else {
                                        callback("Invalid data", null);
                                    }
                                });
                            },
                            //End size
                            //fabric
                            function (callback) {
                                Fabric.find({
                                    _id: {
                                        $in: fabricIds
                                    }
                                }, {
                                    "_id": 1,
                                    "name": 1
                                }).sort({
                                    name: 1
                                }).lean().exec(function (err, data3) {
                                    if (err) {
                                        console.log("error :", err);
                                        callback(null, err);
                                    } else if (data3) {
                                        fabricData.push(data3);
                                        callback(null, data3);
                                    } else {
                                        callback("Invalid data", null);
                                    }
                                });
                            },
                            //End fabric
                            //type
                            function (callback) {
                                Type.find({
                                    _id: {
                                        $in: typeIds
                                    }
                                }, {
                                    "_id": 1,
                                    "name": 1
                                }).sort({
                                    name: 1
                                }).lean().exec(function (err, data3) {
                                    if (err) {
                                        console.log("error :", err);
                                        callback(null, err);
                                    } else if (data3) {
                                        typeData.push(data3);
                                        callback(null, data3);
                                    } else {
                                        callback("Invalid data", null);
                                    }
                                });
                            },
                            //End Type
                            //Brand
                            function (callback) {
                                Brand.find({
                                    _id: {
                                        $in: brandIds
                                    }
                                }, {
                                    "_id": 1,
                                    "name": 1
                                }).sort({
                                    name: 1
                                }).lean().exec(function (err, data3) {
                                    if (err) {
                                        console.log("error :", err);
                                        callback(null, err);
                                    } else if (data3) {
                                        brandData.push(data3);
                                        callback(null, data3);
                                    } else {
                                        callback("Invalid data", null);
                                    }
                                });
                            }
                            //End Brand
                        ], function (err, data5) {
                            if (err) {
                                callback(err, null);
                            } else {
                                console.log("****", data5);
                                data4.category = categoryData[0];
                                data4.homeCategory = homeCategoryData[0];
                                data4.prodCollection = prodCollectionData[0];
                                data4.color = colorData[0];
                                data4.size = sizeData[0];
                                data4.fabric = fabricData[0];
                                data4.type = typeData[0];
                                data4.brand = brandData[0];
                                data4.style = style;
                                data4.price = price;
                                data4.productId = productId;
                                callback(null, data4);
                            }
                        });
                    }

                });
        }

    },

};
module.exports = _.assign(module.exports, exports, model);