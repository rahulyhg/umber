module.exports = _.cloneDeep(require("sails-wohlig-controller"));
var controller = {
    getBlogs: function (req, res) {
        if (req.body) {
            Blog.getAllBlogs(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid request"
                }
            })
        }
    },

    getEnabledBlogs: function (req, res) {
        if (req.body) {
            Blog.getEnabledBlogs(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid request"
                }
            })
        }
    },
    getEnabledInnerBlogs: function (req, res) {
        if (req.body) {
            Blog.getEnabledInnerBlogs(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid request"
                }
            })
        }
    }
};
module.exports = _.assign(module.exports, controller);