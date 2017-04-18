module.exports = function (grunt) {
    var folderName = grunt.option('target');
    var dev = {
        options: {
            sourceMap: true
        },
        files: {}
    };
    dev.files[folderName + "/css/import.css"] = folderName + "/sass/import.scss";
    grunt.config.set('sass', {
        development: dev,
        backendDevelopment: {
            options: {
                sourceMap: true
            },
            files: {
                ".tmp/public/backend/css/main.css": "backend/sass/main.scss"
            }
        },
        production: {
            options: {
                sourceMap: false
            },
            files: {
                ".tmp/public/frontend/css/import.css": "frontend/sass/import.scss"
            }
        }
    });
    grunt.loadNpmTasks('grunt-sass');
};