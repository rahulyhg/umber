module.exports = function (grunt) {
    var jsFiles = require("../../frontend/files.js");
    var env = require("../../config/env/development.js");
    grunt.config.set('ejs', {
        frontend: {
            src: 'views/development.ejs',
            dest: 'frontend/index.html',
            options: {
                _: require("lodash"),
                jsFiles: jsFiles,
                adminurl: env.realHost + "/api/",
            }
        }
    });

    grunt.loadNpmTasks('grunt-ejs-locals');
};