var schema = new Schema({
    title: {
        type: String,
        unique: true,
        uniqueCaseInsensitive: true,
        excel: {
            name: "Name"
        }
    },
    description: String,
    majorImage: String,
    insideImage: String,
    products: [{
        product: {
            productId: {
                type: String,
                index: true
            }
        }
    }],
    status: {
        type: String,
        enum: ['Enabled', 'Disabled']
    }
});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('Buythelook', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {

    getEnabledLook: function (callback) {
        Buythelook.findOne({
            status: 'Enabled'
        }).exec(function (err, data) {
            callback(err, data);
        });
    },

    getBuyTheLookDetails: function (data, callback) {
        var lookProducts = [];
        Buythelook.findById(mongoose.Types.ObjectId(data._id)).exec(function (err, look) {
            if (look && !_.isEmpty(look)) {
                console.log("@@@@@@@@@look", look);
                async.each(look.products, function (data, eachCallback) {
                    Product.getProductDetails(data.product, function (err, productDetails) {
                        if (productDetails && !_.isEmpty(productDetails)) {
                            lookProducts.push(productDetails);
                            console.log("*****lookProducts", lookProducts);

                        }
                        eachCallback(null, productDetails);

                    });
                }, function (err) {
                    var lookData = {};
                    lookData.products = lookProducts;
                    lookData.look = look;
                    console.log("*****.look", lookData);

                    callback(null, lookData);
                });
            }
        });
    }
};
module.exports = _.assign(module.exports, exports, model);