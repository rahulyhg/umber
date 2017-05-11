module.exports = _.cloneDeep(require("sails-wohlig-controller"));
var controller = {
    getBanner: function (req, res) {
        if (req.body) {
            Banner.getBanner(req.body, res.callback);
        } else {
            res.json({
                message: {
                    data: "Invalid request!"
                }
            })
        }
    }
};
module.exports = _.assign(module.exports, controller);
