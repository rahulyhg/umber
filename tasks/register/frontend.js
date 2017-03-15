module.exports = function (grunt) {
    grunt.registerTask('frontend', ["ejs:frontend", "sass:development", "concurrent:watchDevelopment"]);
};