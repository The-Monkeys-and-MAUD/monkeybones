/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %> */ \n',
    // Task configuration.
    concat: {
      prod: {
        src: ['web/js/vendor/*.js', 'web/js/vendor/**/*.js', 'web/js/lib/**/*.js', 'web/js/app/**/*.js' ],
        dest: 'public/js/main.debug.js',
        banner: '<%= banner %>',
        stripBanners: true
      },
      dev: {
        src: '<%= concat.prod.src %>',
        dest: 'public/js/main.js',
        banner: '<%= banner %>',
        stripBanners: false
      }
    },
    uglify: {
      options: {
        banner: '<%= banner %>',
        separtor: ';'
      },
      dist: {
        src: '<%= concat.prod.dest %>',
        dest: 'public/js/main.js'
      }
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        unused: true,
        boss: true,
        eqnull: true,
        browser: true,
        globals: {
            exports: true,
            module: false,
            jQuery: false,
            '$': false,
            console: false,
            Modernizr:false
        }
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      lib_test: {
        src: ['web/js/lib/**/*.js','web/js/app/**/*.js']
      }
    },
    nodeunit: {
        all: ['web/test/**/*_test.js']
    },
    compass: {  
        prod: {
            options: {
                sassDir: 'web/scss',
                cssDir: 'public/css',
                outputStyle: 'compressed',
                relativeAssets: false,
                noLineComments: false,
                debugInfo: false,
                environment: 'production'
            }
        },
        dev: {
            options: {
                sassDir: 'web/scss',
                cssDir: 'public/css',
                relativeAssets: false,
                noLineComments: false,
                outputStyle: 'nested',
                debugInfo: true
            }
        }
    },
    reload: {
        port: 35729, // LR default
        liveReload: {}, 
        proxy: {
            host: 'localhost'
            //port: '8888'
        }   
    },
    docco: {
      all: {
          src: ['<%= jshint.lib_test.src %>', 'web/test/**/*.js'],
          dest: 'doc/javascript'
      }   
    },
    watch: {
      all: {
          files: ['web/scss/**/*.scss', 'jshint:lib_test'],
          tasks: ['compass:dev', 'concat:dev', 'reload']
      },
      css: {
          files: '<%= compass.dev.sassDir %>',
          tasks: ['compass:dev', 'reload']
      },
      js: {
          files: ['<%= concat.prod.src %>'],
          tasks: ['concat:dev', 'reload']
      },
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      lib_test: {
        files: '<%= jshint.lib_test.src %>',
        tasks: ['jshint:lib_test', 'test']
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-compass');

  // Better naming conventions
  grunt.registerTask('lint', 'Lint javascript files with default validator', 'jshint');
  grunt.registerTask('min',  'Minify files with default minifier', 'uglify');
  grunt.registerTask('test', 'Unit testing on the command line with default testing framework', 'nodeunit');

  // reload
  grunt.loadNpmTasks('grunt-reload');

  // docco
  grunt.loadNpmTasks('grunt-docco');

  // watch tasks
  grunt.registerTask('dev',     ['watch:all']);
  grunt.registerTask('dev:css', ['watch:css']);
  grunt.registerTask('dev:js',  ['watch:js']);

  // Default task.
  grunt.registerTask('default', ['jshint', 'nodeunit', 'concat', 'uglify', 'compass:prod']);

};
