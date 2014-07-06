module.exports = (grunt) ->

  grunt.loadNpmTasks 'grunt-karma'

  grunt.initConfig
    pkg: require './package.json'

    karma:
      unit:
        configFile: './karma.conf.js'