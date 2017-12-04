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
    shippingAddresses: [{
        name: String,
        line1: {
            type: String
        },
        line2: String,
        line3: String,
        line4: String,
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
        isDefault: Boolean,
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
        line4: String,
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
    otpTime: Date,
    verifyAcc: Boolean,
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
        // User.findOne({
        //     email: userData.email,
        //     verifyAcc: false
        // }).exec(function (err, user) {
        //     delete user
        //     console.log("deleted2", user);
        // })

        var user = {};
        user.firstName = userData.firstname;
        user.lastName = userData.lastname;
        user.email = userData.email;
        user.password = md5(userData.password);
        user.mobile = userData.mobile;
        user.otp = Math.random().toString().substring(2, 6);
        user.otpSplit = user.otp.split("");
        user.verifyAcc = false;

        User.findOne({
            email: user.email
        }).exec(function (err, created) {
            if (!_.isEmpty(created)) {
                console.log("deleted2", created);
                if (created.verifyAcc == false) {
                    created.remove();
                    var emailData = {};
                    emailData.otp = user.otpSplit;
                    emailData.email = user.email;
                    emailData.subject = "SignUp OTP";
                    emailData.filename = "user-registration-otp.ejs";
                    emailData.from = "harsh@wohlig.com"
                    // emailData.name = created.firstName + created.lastName;
                    emailData.firstName = user.firstName;
                    emailData.lastName = user.lastName;
                    // console.log(">>>emailData", emailData);
                    // callback(null, created);
                    Config.email(emailData, function (err, response) {
                        if (err) {
                            console.log("error in email", err)
                            User.findOneAndUpdate({
                                _id: user._id
                            }, {
                                $set: {
                                    verifyAcc: false,
                                    otp: null,
                                    otpTime: null
                                }
                            }, {
                                new: true
                            }).exec(function (err, result) {});
                            callback("emailError", null);
                        } else if (response) {
                            // console.log("in register user mail response", response)
                            var sendData = {};
                            // sendData._id = created._id;
                            sendData.email = user.email;
                            // sendData.accessToken = created.accessToken;
                            sendData.mobile = user.mobile;
                            sendData.firstName = user.firstName;
                            sendData.lastName = user.lastName;
                            sendData.lastName = user.lastName;
                            sendData.password = user.password;
                            sendData.verifyAcc = user.verifyAcc;
                            sendData.otp = user.otp;
                            // callback(null, sendData);
                            User.saveData(sendData, function (err, data) {
                                if (err) {
                                    callback(err, null);
                                } else if (data) {
                                    if (!_.isEmpty(data)) {
                                        var accessToken = uid(16);
                                        data.accessToken.push(accessToken);
                                        console.log("data:in  registration ", data);
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
                        } else {
                            callback("errorOccurredRegister", null);
                        }
                    });
                } else {
                    callback({
                        message: "userExists"
                    }, null);
                }
            } else {
                var emailData = {};
                emailData.otp = user.otpSplit;
                emailData.email = user.email;
                emailData.subject = "SignUp OTP";
                emailData.filename = "user-registration-otp.ejs";
                emailData.from = "harsh@wohlig.com"
                // emailData.name = created.firstName + created.lastName;
                emailData.firstName = user.firstName;
                emailData.lastName = user.lastName;
                // console.log(">>>emailData", emailData);
                // callback(null, created);
                Config.email(emailData, function (err, response) {
                    if (err) {
                        console.log("error in email", err)
                        User.findOneAndUpdate({
                            _id: user._id
                        }, {
                            $set: {
                                verifyAcc: false,
                                otp: null,
                                otpTime: null
                            }
                        }, {
                            new: true
                        }).exec(function (err, result) {});
                        callback("emailError", null);
                    } else if (response) {
                        // console.log("in register user mail response", response)
                        var sendData = {};
                        // sendData._id = created._id;
                        sendData.email = user.email;
                        // sendData.accessToken = created.accessToken;
                        sendData.mobile = user.mobile;
                        sendData.firstName = user.firstName;
                        sendData.lastName = user.lastName;
                        sendData.password = user.password;
                        sendData.verifyAcc = user.verifyAcc;
                        sendData.otp = user.otp;
                        // callback(null, sendData);
                        User.saveData(sendData, function (err, data) {
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
                    } else {
                        callback("errorOccurredRegister", null);
                    }
                });
                // User.saveData(user, function (err, data) {
                //     if (err) {
                //         callback(err, null);
                //     } else if (data) {
                //         if (!_.isEmpty(data)) {
                //             var accessToken = uid(16);
                //             data.accessToken.push(accessToken);
                //             User.saveData(data, function () {});
                //             console.log("data: ", data);
                //             callback(null, data);
                //         }
                //     } else {
                //         callback({
                //             message: {
                //                 data: "Invalid credentials!"
                //             }
                //         })
                //     }
                // });
            }
        });
    },
    verifyRegisterUserWithOtp: function (data, callback) {
        console.log("Verify otp: ", data);
        async.waterfall([
                function getUser(cbWaterfall) {
                    User.findOne({
                        _id: mongoose.Types.ObjectId(data._id)
                    }).exec(cbWaterfall);
                },
                function checkOtp(user, cbWaterfall1) {
                    console.log("checkOtp: ", user);
                    // If user already verified
                    if (user.verifyAcc) {
                        console.log("user.verifyAcc")
                        User.findOneAndUpdate({
                            _id: mongoose.Types.ObjectId(user._id)
                        }, {
                            $set: {
                                accessToken: [uid(16)]
                            }
                        }, {
                            new: true
                        }).exec(cbWaterfall1);
                    } else if (!user.otp) {
                        cbWaterfall1("noOtpFound", null);
                    } else {
                        console.log("if !verifyAccount")
                        // Check if otp is expired
                        var diff = moment(new Date()).diff(user.otpTime, 'minutes');
                        if (diff > 10) {
                            User.findOneAndUpdate({
                                _id: mongoose.Types.ObjectId(data._id)
                            }, {
                                $set: {
                                    verifyAcc: false,
                                    otp: null,
                                    otpTime: null
                                }
                            }, {
                                new: true
                            }).exec(function (err, removed) {
                                cbWaterfall1("otpExpired", null);
                            });
                        } else {
                            if (user.otp == data.otp) {
                                console.log("in comparing");
                                accessToken = [uid(16)];
                                User.findOneAndUpdate({
                                    _id: mongoose.Types.ObjectId(data._id)
                                }, {
                                    $set: {
                                        verifyAcc: true,
                                        otp: null,
                                        otpTime: null,
                                        accessToken: accessToken
                                    }
                                }, {
                                    new: true
                                }).exec(function (err, updatedUser) {
                                    cbWaterfall1(err, updatedUser);
                                });
                            } else {
                                cbWaterfall1("otpNoMatch", null);
                            }
                        }
                    }
                }
            ],
            function (err, data) {
                callback(err, data);
            });
    },
    resendOtp: function (data, callback) {
        console.log("in resend data", data);
        // user.otp = Math.random().toString().substring(2, 6);
        User.findOneAndUpdate({
            _id: mongoose.Types.ObjectId(data._id)
        }, {
            $set: {
                otp: Math.random().toString().substring(2, 6),
                otpTime: new Date(),
                verifyAcc: false
            }
        }, {
            new: true
        }).exec(function (err, user) {
            console.log("user", user)
            var emailData = {};
            emailData.otp = user.otp.split("");
            emailData.email = user.email;
            emailData.subject = "SignUp OTP";
            // emailData.filename = "otp.ejs";
            emailData.filename = "user-registration-otp.ejs";
            emailData.from = "harsh@wohlig.com"
            emailData.firstName = user.firstName;
            emailData.lastName = user.lastName;
            Config.email(emailData, function (err, response) {
                if (err) {
                    User.findOneAndUpdate({
                        _id: user._id
                    }, {
                        $set: {
                            verifyAcc: false,
                            otp: null,
                            otpTime: null
                        }
                    }, {
                        new: true
                    }).exec(function (err, result) {});
                    callback("emailError", null);
                } else if (response) {
                    var sendData = {};
                    // sendData._id = created._id;
                    // sendData.email = user.email;
                    // sendData.accessToken = created.accessToken;
                    // sendData.mobile = user.mobile;
                    // sendData.firstName = user.firstName;
                    // sendData.lastName = user.lastName;
                    // sendData.lastName = user.lastName;
                    // sendData.password = user.password;
                    sendData.otp = user.otp;
                    callback(null, sendData);
                    // User.saveData(sendData, function (err, data) {
                    //     if (err) {
                    //         callback(err, null);
                    //     } else if (data) {
                    //         if (!_.isEmpty(data)) {
                    //             var accessToken = uid(16);
                    //             data.accessToken.push(accessToken);
                    //             User.saveData(data, function () {});
                    //             console.log("data: ", data);
                    //             callback(null, data);
                    //         }
                    //     } else {
                    //         callback({
                    //             message: {
                    //                 data: "Invalid credentials!"
                    //             }
                    //         })
                    //     }
                    // });
                } else {
                    callback("errorOccurredRegister", null);
                }
            });
        })
    },

    registerUser: function (data, callback) {
        console.log("#####in User", data);
        if (!data._id) {
            console.log("m in if");

            // data._id = new mongoose.mongo.ObjectID();
            data.password = md5(data.password);
            data.otp = Math.random().toString().substring(2, 6);
            data.verifyAcc = false;
            data.otpTime = new Date();
            console.log("********Data: ", data);

            User.findOneAndUpdate({
                email: data.email
            }, data, {
                new: true,
                upsert: true
            }).exec(function (error, created) {
                if (error, created == undefined) {
                    console.log("User >>> registerUser >>> User.findOneAndUpdate >>> error", error);
                    callback(error, null);
                } else {
                    var emailData = {};
                    emailData.otp = created.otp;
                    emailData.email = created.email;
                    emailData.subject = "SignUp OTP";
                    // emailData.filename = "otp.ejs";
                    emailData.filename = "otp-email.ejs";
                    emailData.from = "harsh@wohlig.com"
                    // emailData.name = created.firstName + created.lastName;
                    emailData.firstname = created.firstName;
                    emailData.lastName = created.lastName;
                    // console.log(">>>emailData", emailData);
                    // callback(null, created);
                    Config.email(emailData, function (err, response) {
                        if (err) {
                            console.log("error in email", err)
                            User.findOneAndUpdate({
                                _id: created._id
                            }, {
                                $set: {
                                    verifyAcc: false,
                                    otp: null,
                                    otpTime: null
                                }
                            }, {
                                new: true
                            }).exec(function (err, result) {});
                            callback("emailError", null);
                        } else if (response) {
                            var sendData = {};
                            sendData._id = created._id;
                            sendData.email = created.email;
                            sendData.accessToken = created.accessToken;
                            sendData.firstName = created.firstName;
                            sendData.lastName = created.lastName;
                            callback(null, sendData);
                        } else {
                            callback("errorOccurredRegister", null);
                        }
                    });
                }
            })
        } else {
            console.log("m in else");
            var user = this(data);
            User.findOne({
                "_id": user._id
            }).exec(function (err, fdata) {
                fdata.firstName = data.firstName;
                fdata.lastName = data.lastName;
                fdata.mobile = data.mobile;
                if (data.password) {
                    fdata.password = md5(data.password);
                }
                if (data.photo) {
                    fdata.photo = data.photo;
                }
                User.saveData(fdata, function (err, updated) {
                    if (err) {
                        callback(err, null);
                    } else if (updated) {
                        callback(null, updated);
                    } else {
                        callback(null, {});
                    }
                });
            });
        }
    },
    login: function (userData, callback) {
        User.findOne({
            email: userData.email,
            password: md5(userData.password),
            verifyAcc: true
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
                    if (!_.isEmpty(data.shippingAddresses)) {
                        data.shippingAddress = JSON.parse(JSON.stringify(data.shippingAddresses[0]));
                        delete data.shippingAddresses;
                    }
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
    },
    sendForgotPasswordOtp: function (data, callback) {
        console.log(" ***** inside sendForgotPasswordOtp of config ***** ", data);

        var userData = {};
        // check whether user is available or not ?
        // if --> yes --> generate OTP & send email to user with otp
        async.waterfall([
            // Check whether user is present
            function (callback) {
                User.findOne({
                    email: data.email,
                    verifyAcc: true
                }).exec(callback);
            },
            function (user, callback) { // Change password to random String
                console.log(user);
                if (_.isEmpty(user)) {
                    callback(null, false);
                } else {
                    // Generate random String as a password
                    // var verificationCode = Math.floor(Math.random() * 1000000).toString().substring(2, 6);
                    var verificationCode = Math.random().toString().substring(2, 6);
                    user.forgotPassword = verificationCode;
                    User.saveData(user, function (err, result) {
                        if (err) {
                            callback(err, null);
                        } else {
                            User.findOne({
                                _id: user._id,
                                verifyAcc: true
                            }).exec(callback);
                        }
                    });
                }
            },
            function (user, callback) { // Send forget password email
                if (_.isEmpty(user)) {
                    callback(null, false);
                } else {
                    console.log("in forgot*****", user)
                    userData.userId = user._id;
                    var emailData = {};
                    emailData.otp = user.forgotPassword.split("");
                    emailData.email = data.email;
                    emailData.subject = "Forgot Password";
                    emailData.filename = "forgot-pwd-emailer.ejs";
                    emailData.from = "harsh@wohlig.com"
                    // emailData.name = user.firstName + user.lastName;
                    emailData.firstName = user.firstName;
                    emailData.lastName = user.lastName;
                    Config.emailForResetPassword(emailData, callback);
                    callback(null, user);
                }
            }
        ], function (err, result) {
            console.log(" ***** async.waterfall final response of sendForgotPasswordOtp ***** ", result);
            callback(err, result);
        });

    },
    confirmForgotPasswordOtp: function (data, callback) {
        console.log(" **** inside confirmForgotPasswordOtp *** ", data);
        User.findOne({
            _id: data._id,
            forgotPassword: data.verifyOtp
        }).lean().exec(function (err, data) {
            if (err) {
                console.log(" *** inside confirmForgotPasswordOtp err *** ", err);
                callback(null, err);
            } else if (!_.isEmpty(data)) {
                console.log("##############", data)
                var accessToken = uid(16);
                data.accessToken.push(accessToken);
                User.saveData(data, function () {});
                console.log("data:confirmForgotPassword ", data);
                callback(null, data);
            } else {
                console.log(" *** inside confirmForgotPasswordOtp *** empty", data);
                callback(null, false);
            }
        });
    },
    resendOtpForPwd: function (data, callback) {
        console.log("in resend data", data);
        // user.otp = Math.random().toString().substring(2, 6);
        User.findOneAndUpdate({
            _id: mongoose.Types.ObjectId(data._id)
        }, {
            $set: {
                forgotPassword: Math.random().toString().substring(2, 6),
                otpTime: new Date(),
                verifyAcc: false
            }
        }, {
            new: true
        }).exec(function (err, user) {
            console.log("user", user)
            var emailData = {};
            emailData.otp = user.forgotPassword.split("");
            emailData.email = user.email;
            emailData.subject = "Forgot OTP";
            // emailData.filename = "otp.ejs";
            emailData.filename = "otp-email.ejs";
            emailData.from = "harsh@wohlig.com"
            emailData.firstname = user.firstName;
            emailData.lastName = user.lastName;
            Config.emailForResetPassword(emailData, function (err, response) {
                if (err) {
                    User.findOneAndUpdate({
                        _id: user._id
                    }, {
                        $set: {
                            verifyAcc: false,
                            otp: null,
                            otpTime: null
                        }
                    }, {
                        new: true
                    }).exec(function (err, result) {});
                    callback("emailError", null);
                } else if (response) {
                    var sendData = {};
                    // sendData._id = created._id;
                    // sendData.email = user.email;
                    // sendData.accessToken = created.accessToken;
                    // sendData.mobile = user.mobile;
                    // sendData.firstName = user.firstName;
                    // sendData.lastName = user.lastName;
                    // sendData.lastName = user.lastName;
                    // sendData.password = user.password;
                    sendData.otp = user.otp;
                    // callback(null, sendData);
                    User.saveData(sendData, function (err, data) {
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
                } else {
                    callback("errorOccurredRegister", null);
                }
            });
        })
    },
    forgotPasswordSave: function (data, callback) {
        console.log(" **** forgotPasswordSave *** ", data);
        User.findOneAndUpdate({
            _id: data._id
        }, {
            $set: {
                password: md5(data.password)
            }
        }, {
            new: true
        }).exec(function (err, user) {
            console.log(" *** inside confirmForgotPasswordOtp  *** ", user);
            if (err) {
                console.log(" *** inside confirmForgotPasswordOtp err *** ", err);
                callback(null, err);
            } else if (_.isEmpty(user)) {
                callback(null, false);
            } else {
                callback(null, user);
            }
        });
    },
    dochangepassword: function (data, callback) {
        console.log(" ***** inside dochangepassword ***** ", data);

        User.findOneAndUpdate({
            _id: data.userId,
            // password: md5(data.current)
        }, {
            $set: {
                password: md5(data.new)
            }
        }, {
            new: true
        }).exec(function (err, user) {
            if (err) {
                console.log("not found", null);

            } else if (user == null) {
                console.log("user not found");
                callback("not found", null)
            } else {
                user.save(user);
                callback(null, user)
            }

        })
    },
    isUserLoggedIn: function (accessToken, callback) {
        User.findOne({
            accessToken: {
                '$in': [accessToken]
            }
        }).lean().exec(function (err, user) {
            if (err)
                callback(err, null);
            else if (!_.isEmpty(user))
                callback(null, user);
            else
                callback({
                    message: "userNotFound"
                }, null);
        })
    },
    updateUser: function (data, callback) {
        console.log("data inside removeWishListFromUser: ", data.shippingAddress.data);
        // console.log("data inside removeWishListFromUser: ", data.product);
        User.update({
            _id: mongoose.Types.ObjectId(data.shippingAddress.data._id)
        }, {
            $set: {
                email: data.shippingAddress.data.email,
                firstName: data.shippingAddress.data.firstName,
                lastName: data.shippingAddress.data.lastName,
                mobile: data.shippingAddress.data.mobile
            }
        }).exec(function (err, found) {
            if (err) {
                console.log("inside error")
                callback(err, null);
            } else if (_.isEmpty(found)) {
                callback(null, "noDataound");
            } else {
                console.log("found", found)
                callback(null, found);
            }

        });
    },
    deleteShippingAddress: function (data, callback) {
        console.log("data inside rdeleteShippingAddress: ", data);
        // console.log("data inside removeWishListFromUser: ", data.product);

        User.update({
            _id: data.user_id
        }, {
            $pull: {
                'shippingAddresses': {
                    _id: data.shippingAddress_id,
                }
            }
        }).exec(function (err, found) {
            if (err) {
                console.log("inside error");
                callback(err, null);
            } else if (_.isEmpty(found)) {
                callback(null, "noDataound");
            } else {
                console.log("found", found);
                callback(null, found);
            }

        });
    },
    // API for order details checkout page
    // When user goes to checkout page to create an order & enters the addresses, call this API
    // to store/edit addresses.
    // for shippingAddress if entered address match stored shipping address it's edited
    // input: data: {billingAddress, shippingAddress}
    saveAddresses: function (data, callback) {
        var updateObj = {};
        if (_.isEmpty(data.user)) {
            callback({
                message: "noUserFound"
            }, null);
        } else {
            async.waterfall([
                function findUser(cbWaterfall) {
                    console.log("in findUser:");
                    User.findOne({
                        _id: mongoose.Types.ObjectId(data.user)
                    }).lean().exec(cbWaterfall);
                },
                function updateAddress(user, cbWaterfall1) {
                    if (data.billingAddress) {
                        user.billingAddress = data.billingAddress;
                    }

                    if (data.shippingAddress) {
                        var idx = _.findIndex(user.shippingAddresses, function (userAddress) {
                            return User.checkShippingAddress(userAddress, data.shippingAddress);
                        });

                        if (idx < 0) {
                            if (!_.isArrayLike(user.shippingAddresses)) {
                                user.shippingAddresses = [];
                            }
                            user.shippingAddresses.push(data.shippingAddress);
                        }
                    }

                    User.findOneAndUpdate({
                        _id: mongoose.Types.ObjectId(user._id)
                    }, user, function (err, updatedUser) {
                        cbWaterfall1(err, updatedUser);
                    });
                }
            ], function (err, data) {
                callback(err, data);
            });
        }
    },

    // function to check whether two addresses match
    checkShippingAddress: function (address1, address2) {
        // console.log("!!!!address1", address1);
        // console.log("!!!!address2", address2);
        var keys1 = _.keys(address1);
        var keys2 = _.keys(address2);
        var idIndex = keys1.indexOf('_id');
        // console.log("!!!!keys1", keys1);
        // console.log("!!!!keys2", keys2);
        // console.log("!!!!idIndex", idIndex);

        if (idIndex > -1) {
            keys1.splice(idIndex, 1);
        }

        idIndex = keys1.indexOf('status');
        if (idIndex > -1) {
            keys1.splice(idIndex, 1);
        }
        console.log("keys1 after: ", keys1);

        if (keys1.length != keys2.length) {
            return false;
        } else {
            for (var idx = 0; idx < keys1.length; idx++) {
                if (address1[keys1[idx]] != address2[keys2[idx]]) {
                    return false;
                }
            }
            return true;
        }
    },

    // API to edit/save current billing & shipping address
    // Designed mainly for account page 
    // input: address: {accessToken, type, shippingAddress/billingAddress}
    // input details: type - which address to be saved billingAddress or shippingAddress
    //                shippingAddress/billingAddress - object to be stored/edit
    saveAddress: function (address, callback) {
        async.waterfall([
            function checkUser(cbWaterfall) {
                User.isUserLoggedIn(address.accessToken, cbWaterfall);
            },

            function saveUserAddress(user, cbWaterfall1) {
                if (address.type == 'billingAddress') {
                    user.billingAddress = address.billingAddress;
                } else {
                    var idx = _.findIndex(user.shippingAddresses, function (userAddress) {
                        return User.checkShippingAddress(userAddress, address.shippingAddress);
                    });

                    if (idx >= 0) {
                        user.shippingAddresses[idx] = address.shippingAddress;
                    } else {
                        user.shippingAddresses.push(address.shippingAddress);
                    }
                }

                User.saveData(user, cbWaterfall1);
            }
        ], function (err, data) {
            callback(err, data);
        });
    },


    // API to change default shipping address.
    // Designed for my account page.
    // input -> address: {accessToken, _id}
    // input details: _id is shipping address id & accessToken is user's accessToken
    changeDefaultAddress: function (address, callback) {
        async.waterfall([
            function checkUser(cbWaterfall) {
                User.isUserLoggedIn(address.accessToken, cbWaterfall);
            },

            function changePrevDefault(user, cbWaterfall1) {
                User.findOneAndUpdate({
                    _id: mongoose.Types.ObjectId(user._id),
                    "shippingAddresses.isDefault": true
                }, {
                    $set: {
                        "shippingAddresses.$.isDefault": false
                    }
                }, {
                    new: true
                }).exec(cbWaterfall1);
            },

            function createNewDefault(user, cbWaterfall2) {
                User.findOneAndUpdate({
                    _id: mongoose.Types.ObjectId(user._id),
                    "shippingAddresses._id": mongoose.Types.ObjectId(address._id)
                }, {
                    $set: {
                        "shippingAddresses.$.isDefault": true
                    }
                }, {
                    new: true
                }).exec(cbWaterfall2);
            }
        ], function (err, data) {
            callback(err, data);
        });
    },

    // API to get default shipping address for order page
    // input: user: {_id}
    getDefaultAddress: function (user, callback) {
        User.findOne({
            _id: mongoose.Types.ObjectId(user._id),
            "shippingAddresses.isDefault": true
        }, {
            "shippingAddresses.$": 1
        }).exec(callback);
    },
    // API to send Welcome email
    // input: users _id
    welcomeEmail: function (data, callback) {
        User.findOne({
            _id: data._id
        }).exec(function (error, created) {
            if (error, created == undefined) {
                console.log("User >>> welcomeEmail >>> User.findOneAndUpdate >>> error", error);
                callback(error, null);
            } else {
                // console.log("User >>> welcomeEmail >>> User.findOneAndUpdate >>> error", created);
                var emailData = {};
                emailData.email = created.email;
                emailData.subject = "Welcome in BurntUmber";
                emailData.filename = "welcome-emailer.ejs";
                emailData.from = "harsh@wohlig.com"
                emailData.firstname = created.firstName;
                emailData.lastName = created.lastName;
                Config.emailwelcome(emailData, function (err, response) {
                    if (err) {
                        console.log("error in email", err);
                        callback("emailError", null);
                    } else if (response) {
                        var sendData = {};
                        sendData._id = created._id;
                        sendData.email = created.email;
                        sendData.accessToken = created.accessToken;
                        sendData.firstName = created.firstName;
                        sendData.lastName = created.lastName;
                        callback(null, sendData);
                    } else {
                        callback("errorOccurredRegister", null);
                    }
                });
            }
        })
    }
};
module.exports = _.assign(module.exports, exports, model);