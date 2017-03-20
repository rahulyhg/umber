var historyApiFallback = require('connect-history-api-fallback');
module.exports = function (grunt) {

    grunt.config.set('browserSync', {
        bsFiles: {
            src: ['frontend/**/*.css', "frontend/**/*.js", "frontend/**/*.html", "frontend/img/**"]
        },
        options: {
            server: {
                baseDir: "frontend",
                routes: {
                    "/bower_components": "bower_components"
                },
                middleware: [historyApiFallback()]
            },
            port: 8080,
            notify: false,
            browser: "google chrome",
        }
    });

    grunt.loadNpmTasks('grunt-browser-sync');
};