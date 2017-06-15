module.exports = _.cloneDeep(require("sails-wohlig-controller"));
var controller = {
    getEnabledLook: function (req, res) {
        Buythelook.getEnabledLook(res.callback);
    }
};
module.exports = _.assign(module.exports, controller);
