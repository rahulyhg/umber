module.exports = _.cloneDeep(require("sails-wohlig-controller"));
var controller = {
    updateUser: function (req, res) {
        if (req.body) {
            User.updateUser(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            })
        }
    },
    deleteShippingAddress: function (req, res) {
        if (req.body) {
            User.deleteShippingAddress(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            })
        }
    },
    loginFacebook: function (req, res) {
        passport.authenticate('facebook', {
            scope: ['public_profile', 'user_friends', 'email'],
            failureRedirect: '/'
        }, res.socialLogin)(req, res);
    },
    loginGoogle: function (req, res) {
        if (req.query.returnUrl) {
            req.session.returnUrl = req.query.returnUrl;
        } else {

        }

        passport.authenticate('google', {
            scope: ['openid', 'profile', 'email'],
            failureRedirect: '/'
        }, res.socialLogin)(req, res);
    },
    profile: function (req, res) {
        if (req.body && req.body.accessToken) {
            User.profile(req.body, res.callback);
        } else {
            res.callback("Please provide Valid AccessToken", null);
        }
    },
    pdf: function (req, res) {

        var html = fs.readFileSync('./views/pdf/demo.ejs', 'utf8');
        var options = {
            format: 'A4'
        };
        var id = mongoose.Types.ObjectId();
        var newFilename = id + ".pdf";
        var writestream = gfs.createWriteStream({
            filename: newFilename
        });
        writestream.on('finish', function () {
            res.callback(null, {
                name: newFilename
            });
        });
        pdf.create(html).toStream(function (err, stream) {
            stream.pipe(writestream);
        });
    },
    backupDatabase: function (req, res) {
        var q = req.ip.search("127.0.0.1");
        if (q >= 0) {
            var jagz = _.map(mongoose.models, function (Model, key) {
                var name = Model.collection.collectionName;
                return {
                    key: key,
                    name: name,
                };
            });
            var isBackup = fs.existsSync("./backup");
            if (!isBackup) {
                fs.mkdirSync("./backup");
            }
            var mom = moment();
            var folderName = "./backup/" + mom.format("ddd-Do-MMM-YYYY-HH-mm-SSSSS");
            var retVal = [];
            fs.mkdirSync(folderName);
            async.eachSeries(jagz, function (obj, callback) {
                exec("mongoexport --db " + database + " --collection " + obj.name + " --out " + folderName + "/" + obj.name + ".json", function (data1, data2, data3) {
                    retVal.push(data3 + " VALUES OF " + obj.name + " MODEL NAME " + obj.key);
                    callback();
                });
            }, function () {
                res.json(retVal);
            });
        } else {
            res.callback("Access Denied for Database Backup");
        }
    },

    registration: function (req, res) {
        if (req.body) {
            User.registration(req.body, res.callback);
        } else {
            res.json({
                message: {
                    data: "Invalid request!"
                }
            })
        }
    },

    verifyRegisterUserWithOtp: function (req, res) {
        if (req.body) {
            User.verifyRegisterUserWithOtp(req.body, res.callback);
        } else {
            res.json({
                message: {
                    data: "Invalid request!"
                }
            });
        }
    },

    resendOtp: function (req, res) {
        if (req.body) {
            User.resendOtp(req.body, res.callback);
        } else {
            res.json({
                message: {
                    data: "Invalid request!"
                }
            });
        }
    },

    login: function (req, res) {
        if (req.body) {
            User.login(req.body, res.callback);
        } else {
            res.json({
                message: {
                    data: "Invalid request!"
                }
            });
        }
    },

    logout: function (req, res) {
        if (req.body) {
            User.logout(req.body, res.callback);
        } else {
            res.json({
                message: {
                    data: "Invalid request!"
                }
            });
        }
    },

    getDetails: function (req, res) {
        if (req.body) {
            User.getDetails(req.body, res.callback);
        } else {
            res.json({
                message: {
                    data: "Invalid request!"
                }
            })
        }
    },
    isUserLoggedIn: function (req, res) {
        if (req.body)
            User.isUserLoggedIn(req.body, res.callback);
        else
            res.json({
                message: {
                    data: "Invalid request!"
                }
            })
    },
    saveAddresses: function (req, res) {
        if (req.body) {
            User.saveAddresses(req.body, res.callback);
        } else {
            res.json({
                message: {
                    data: "Invalid request!"
                }
            });
        }
    },
    saveAddress: function (req, res) {
        if (req.body) {
            User.saveAddress(req.body, res.callback);
        } else {
            res.json({
                message: {
                    data: "Invalid request!"
                }
            });
        }
    },
    changeDefaultAddress: function (req, res) {
        if (req.body) {
            User.changeDefaultAddress(req.body, res.callback);
        } else {
            res.json({
                message: {
                    data: "Invalid request!"
                }
            });
        }
    },
    getDefaultAddress: function (req, res) {
        if (req.body) {
            User.getDefaultAddress(req.body, res.callback);
        } else {
            res.json({
                message: {
                    data: "Invalid request!"
                }
            });
        }
    },
    sendForgotPasswordOtp: function (req, res) {
        console.log("in sendForgotPasswordOtp controller")
        if (req.body) {
            User.sendForgotPasswordOtp(req.body, res.callback);
        } else {
            res.json({
                message: {
                    data: "Invalid request!"
                }
            });
        }
    },
    confirmForgotPasswordOtp: function (req, res) {
        if (req.body) {
            User.confirmForgotPasswordOtp(req.body, res.callback);
        } else {
            res.json({
                message: {
                    data: "Invalid request!"
                }
            });
        }
    },
    resendOtpForPwd: function (req, res) {
        if (req.body) {
            User.resendOtpForPwd(req.body, res.callback);
        } else {
            res.json({
                message: {
                    data: "Invalid request!"
                }
            });
        }
    },
    forgotPasswordSave: function (req, res) {
        if (req.body) {
            User.forgotPasswordSave(req.body, res.callback);
        } else {
            res.json({
                message: {
                    data: "Invalid request!"
                }
            });
        }
    },
    dochangepassword: function (req, res) {
        if (req.body) {
            User.dochangepassword(req.body, res.callback);
        } else {
            res.json({
                message: {
                    data: "Invalid request!"
                }
            });
        }
    },
    welcomeEmail: function (req, res) {
        if (req.body) {
            User.welcomeEmail(req.body, res.callback);
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