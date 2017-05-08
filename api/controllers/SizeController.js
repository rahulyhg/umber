module.exports = _.cloneDeep(require("sails-wohlig-controller"));
var controller = {
    getSizes: function (req, res) {
        if (req.body) {
            Size.getSizes(res.callback);
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
