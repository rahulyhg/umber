module.exports = function (grunt) {
    var folderName = grunt.option('target');
    grunt.registerTask('ui', ["ejs:ui", "sass:development", "concurrent:watchDevelopment"]);
};