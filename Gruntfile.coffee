module.exports = (grunt) ->

  grunt.loadNpmTasks 'grunt-karma'
  grunt.loadNpmTasks 'grunt-contrib-clean'
  grunt.loadNpmTasks 'grunt-contrib-copy'
  grunt.loadNpmTasks 'grunt-contrib-cssmin'
  grunt.loadNpmTasks 'grunt-contrib-concat'
  grunt.loadNpmTasks 'grunt-contrib-uglify'

  grunt.initConfig
    pkg: require './package.json'

    banner: [
      '/**',
      ' * <%= pkg.name %> - <%= pkg.version %>',
      ' *',
      ' * <%= pkg.description %>',
      ' *',
      ' * <%= pkg.author.url %>',
      ' *',
      ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;',
      ' * Licensed <%= pkg.license %>',
      ' */',
      ''
    ].join('\r\n')

    clean: ['dist']

    karma:
      unit:
        configFile: './karma.conf.js'
      single:
        options:
          singleRun: true
        configFile: './karma.conf.js'

    concat:
      options:
        banner: '<%= banner %>\r\n\r\n(function (window, xtag, undefined) {\r\n\r\n'
        footer: '\r\n\r\n})(window, xtag);'
      all:
        src: ['src/<%= pkg.name %>.js']
        dest: 'dist/scripts/<%= pkg.name %>.js'

    uglify:
      options:
        banner: '<%= banner %>'
      all:
        files:
          'dist/scripts/<%= pkg.name %>.min.js': ['dist/scripts/<%= pkg.name %>.js']

    copy:
      styles:
        options:
          process: (content) ->
            (grunt.config.get 'banner') + content
        files:
          'dist/styles/<%= pkg.name %>.css': 'src/<%= pkg.name %>.css'

    cssmin:
      styles:
        options:
          banner: '<%= banner %>'
        files:
          'dist/styles/<%= pkg.name %>.min.css': 'dist/styles/<%= pkg.name %>.css'

  grunt.registerTask 'default', ['karma:single', 'clean', 'concat', 'uglify', 'copy', 'cssmin']
