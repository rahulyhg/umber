module.exports = _.cloneDeep(require("sails-wohlig-controller"));
var controller = {
    getEnabledLook: function (req, res) {
        Buythelook.getEnabledLook(res.callback);
    },

    getBuyTheLookDetails: function (req, res) {
        if (req.body) {
            Buythelook.getBuyTheLookDetails(req.body, res.callback);
        } else {
            res.json({
                message: {
                    data: "Invalid request!"
                }
            });
        }
    }
};
module.exports = _.assign(module.exports, controller);
