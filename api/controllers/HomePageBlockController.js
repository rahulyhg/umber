module.exports = _.cloneDeep(require("sails-wohlig-controller"));
var controller = {
    getEnabledHomePageBlock: function (req, res) {
        if (req.body)
            HomePageBlock.getEnabledHomePageBlock(req.body, res.callback);
        else {
            res.json({
                value: false,
                data: {
                    message: "Invalid request"
                }
            })
        }
    },

    getCategoryWithId: function (req, res) {
        if (req.body)
            HomePageBlock.getCategoryWithId(req.body, res.callback);
        else {
            res.json({
                value: false,
                data: {
                    message: "Invalid request"
                }
            })
        }
    },
    getCategoryByName: function (req, res) {
        if (req.body) {
            HomePageBlock.getCategoryByName(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request!"
                }
            });
        }
    }
};
module.exports = _.assign(module.exports, controller);