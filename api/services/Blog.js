var schema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        uniqueCaseInsensitive: true
    },
    image: String,
    description: String,
    link: String,
    status: String
});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('Blog', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {
    // Retrieves all blogs including disabled.
    getAllBlogs: function (data, callback) {
        Blog.find({}).exec(function (err, data) {
            if (err) {
                callback(err, null);
            } else if (data) {
                callback(null, data);
            } else {
                callback({
                    message: "Incorrect credentials"
                }, null);
            }
        })
    },

    // Retrieves only enabled blogs
    getEnabledBlogs: function (data, callback) {
        Blog.find({
            status: 'Enabled'
        }).exec(function (err, data) {
            if (err) {
                callback(err, null);
            } else if (data) {
                callback(null, data);
            } else {
                callback({
                    message: "Incorrect credentials"
                }, null);
            }
        })
    },
    // To Get a particular blog
    //Input : id
    getEnabledInnerBlogs: function (data, callback) {
        console.log(data);
        Blog.findOne({
            _id: data.id
        }).exec(function (err, blog) {
            if (err) {
                callback(err, null);
            } else if (blog) {
                callback(null, blog);
            } else {
                callback({
                    message: "Incorrect credentials"
                }, null);
            }
        })
    }
};
module.exports = _.assign(module.exports, exports, model);