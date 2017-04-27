module.exports = _.cloneDeep(require("sails-wohlig-controller"));
var controller = {
    getEnabledFabrics: function (req, res) {
        if (req.body) {
            BaseColor.getEnabledFabrics(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid request"
                }
            })
        }
    },

    getListingFilterFields: function (req, res) {
        var listingFilterFields = [];
        if (req.body) {
            Fabric.getEnabledFabrics(req.body, function (err, data) {
                if (err) {
                    res.callback(err, null);
                } else if (data) {
                    listingFilterFields.push(data);
                    Type.getEnabledTypes(req.body, function (err, data) {
                        if (err) {
                            res.callback(err, null);
                        } else if (data) {
                            listingFilterFields.push(data);
                            BaseColor.getEnabledBaseColors(req.body, function (err, data) {
                                if (err) {
                                    res.callback(err, null);
                                } else if (data) {
                                    listingFilterFields.push(data);
                                    res.callback(null, listingFilterFields);
                                }
                            });
                        }
                    });
                }
            });
        }
    }
};
module.exports = _.assign(module.exports, controller);