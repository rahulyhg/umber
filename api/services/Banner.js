var schema = new Schema({
    image: {
        type: String,
        required: true,
        excel: {
            name: "Image"
        }
    },
    page: {
        type: String,
        unique: true,
        required: true
    },
    status: {
        type: String,
        enum: ['Enabled', 'Disabled'],
        default: 'Enabled'
    }
});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('Banner', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {
    getBanner: function (pageName, callback) {
        console.log("getting banner: ", pageName);
        Banner.findOne({
            page: pageName.pageName
        }).exec(function (err, banner) {
            callback(err, banner);
        })
    }
};
module.exports = _.assign(module.exports, exports, model);