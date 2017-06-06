var md5 = require('md5');
var schema = new Schema({
    firstName: {
        type: String,
        excel: true
    },
    middleName: {
        type: String
    },
    lastName: {
        type: String
    },
    email: {
        type: String,
        validate: validators.isEmail(),
        excel: "User Email",
        unique: true,
        uniqueCaseInsensitive: true
    },
    deliveryAddresses: [{
        line1: {
            type: String
        },
        line2: String,
        line3: String,
        city: {
            type: String
        },
        state: {
            type: String
        },
        pincode: {
            type: Number
        },
        country: String,
        status: {
            type: String,
            enum: ['Enabled', 'Disabled'],
            default: 'Enabled'
        }
    }],
    billingAddress: {
        line1: {
            type: String
        },
        line2: String,
        line3: String,
        city: {
            type: String
        },
        state: {
            type: String
        },
        pincode: {
            type: Number
        },
        country: String
    },
    dob: {
        type: Date,
        excel: {
            name: "Birthday",
            modify: function (val, data) {
                return moment(val).format("MMM DD YYYY");
            }
        }
    },
    photo: {
        type: String,
        default: "",
        excel: [{
            name: "Photo Val"
        }, {
            name: "Photo String",
            modify: function (val, data) {
                return "http://abc/" + val;
            }
        }, {
            name: "Photo Kebab",
            modify: function (val, data) {
                return data.name + " " + moment(data.dob).format("MMM DD YYYY");
            }
        }]
    },
    password: {
        type: String,
        default: ""
    },
    forgotPassword: {
        type: String,
        default: ""
    },
    membership: {
        type: Schema.Types.ObjectId,
        ref: ['Membership']
    },
    mobile: {
        type: String,
        default: ""
    },
    otp: {
        type: String,
        default: ""
    },
    accessToken: {
        type: [String],
        index: true
    },
    googleAccessToken: String,
    googleRefreshToken: String,
    oauthLogin: {
        type: [{
            socialId: String,
            socialProvider: String
        }],
        index: true
    },
    accessLevel: {
        type: String,
        default: "User",
        enum: ['User', 'Admin']
    },
    gender: {
        type: String,
        enum: ["M", "F"]
    },
    lastAccessed: Date,
    emailConfirmed: Boolean,
    status: {
        type: String,
        enum: ['Enabled', 'Disabled'],
        default: 'Enabled'
    }
});

schema.plugin(deepPopulate, {
    populate: {
        'user': {
            select: 'firstName lastName fullName _id'
        }
    }
});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
schema.virtual('fullName').get(function () {
    return this.firstName + ' ' + this.lastName;
});

module.exports = mongoose.model('User', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema, "user", "user"));
var model = {

    existsSocial: function (user, callback) {
        var Model = this;
        Model.findOne({
            "oauthLogin.socialId": user.id,
            "oauthLogin.socialProvider": user.provider,
        }).exec(function (err, data) {
            if (err) {
                callback(err, data);
            } else if (_.isEmpty(data)) {
                var modelUser = {
                    name: user.displayName,
                    accessToken: [uid(16)],
                    oauthLogin: [{
                        socialId: user.id,
                        socialProvider: user.provider,
                    }]
                };
                if (user.emails && user.emails.length > 0) {
                    modelUser.email = user.emails[0].value;
                    var envEmailIndex = _.indexOf(env.emails, modelUser.email);
                    if (envEmailIndex >= 0) {
                        modelUser.accessLevel = "Admin";
                    }
                }
                modelUser.googleAccessToken = user.googleAccessToken;
                modelUser.googleRefreshToken = user.googleRefreshToken;
                if (user.image && user.image.url) {
                    modelUser.photo = user.image.url;
                }
                Model.saveData(modelUser, function (err, data2) {
                    if (err) {
                        callback(err, data2);
                    } else {
                        data3 = data2.toObject();
                        delete data3.oauthLogin;
                        delete data3.password;
                        delete data3.forgotPassword;
                        delete data3.otp;
                        callback(err, data3);
                    }
                });
            } else {
                delete data.oauthLogin;
                delete data.password;
                delete data.forgotPassword;
                delete data.otp;
                data.googleAccessToken = user.googleAccessToken;
                data.save(function () {});
                callback(err, data);
            }
        });
    },
    profile: function (data, callback, getGoogle) {
        var str = "name email photo mobile accessLevel";
        if (getGoogle) {
            str += " googleAccessToken googleRefreshToken";
        }
        User.findOne({
            accessToken: data.accessToken
        }, str).exec(function (err, data) {
            if (err) {
                callback(err);
            } else if (data) {
                callback(null, data);
            } else {
                callback("No Data Found", data);
            }
        });
    },
    updateAccessToken: function (id, accessToken) {
        User.findOne({
            "_id": id
        }).exec(function (err, data) {
            data.googleAccessToken = accessToken;
            data.save(function () {});
        });
    },
    registration: function (userData, callback) {
        console.log(userData);
        var user = {};
        user.firstName = userData.firstname;
        user.lastName = userData.lastname;
        user.email = userData.email;
        user.password = md5(userData.password);
        user.mobile = userData.mobile;

        User.saveData(user, function (err, data) {
            if (err) {
                callback(err, null);
            } else if (data) {
                if (!_.isEmpty(data)) {
                    var accessToken = uid(16);
                    data.accessToken.push(accessToken);
                    User.saveData(data, function () {});
                    console.log("data: ", data);
                    callback(null, data);
                }
            } else {
                callback({
                    message: {
                        data: "Invalid credentials!"
                    }
                })
            }
        });
    },
    login: function (userData, callback) {
        User.findOne({
            email: userData.email,
            password: md5(userData.password)
        }).exec(function (err, data) {
            if (err) {
                console.log("err: ", err);
                callback(err, null);
            } else if (data) {
                if (!_.isEmpty(data)) {
                    var accessToken = uid(16);
                    data.accessToken.push(accessToken);
                    User.saveData(data, function () {});
                    console.log("data: ", data);
                    callback(null, data);
                } else {
                    callback(null, {});
                }
            } else {
                console.log("Big mistake");
                callback({
                    message: {
                        data: "Something terrible happened! Please contact administrator"
                    }
                }, null);
            }
        })
    },

    logout: function (userData, callback) {
        User.update({
            _id: userData.userId
        }, {
            $pull: {
                'accessToken': userData.accessToken
            }
        }).exec(function (err, data) {
            if (err) {
                callback(err, null);
            } else if (data) {
                callback(null, data);
            } else {
                callback({
                    message: {
                        data: "Invalid credentials!"
                    }
                }, null);
            }
        })
    },

    getDetails: function (userData, callback) {
        User.findOne({
            _id: userData.userId
        }).exec(function (err, data) {
            if (err) {
                callback(err, null);
            } else if (data) {
                if (!_.isEmpty(data)) {
                    data.deliveryAddress = JSON.parse(JSON.stringify(data.deliveryAddresses[0]));
                    delete data.deliveryAddresses;
                    callback(null, data);
                } else {
                    callback(null, {
                        message: {
                            data: "User not found"
                        }
                    });
                }
            } else {
                callback({
                    message: {
                        data: "Invalid credentials!"
                    }
                }, null);
            }
        })
    }

};
module.exports = _.assign(module.exports, exports, model);