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
        src: ['web/js/vendor/*.js', 'web/js/vendor/**/*.js', 'web/js/lib/**/*.js', 'web/js/app/**/*.js', 'web/js/*.js' ],
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
            __dirname: false,
            require: false,
            exports: true,
            module: false,
            jQuery: false,
            '$': false,
            '_': false,
            'Backbone': false,
            console: false,
            Modernizr:false
        }
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      lib_test: {
        src: ['web/js/lib/**/*.js','web/js/app/**/*.js', 'web/js/*.js']
      }
    },
    nodeunit: {
        all: ['web/test/**/*_test.js']
    },
    phpunit: {
        classes: {
            dir: 'app/tests/'
        },  
        options: {
            configuration: 'phpunit.xml'
        }   
    }, 
    compass: {
        options: {
            sassDir: 'web/scss',
            cssDir: 'public/css',
            imagesDir: 'public/img',
            raw: 'http_images_path = "/img"',
            relativeAssets: false,
            noLineComments: true,
            debugInfo: false
        },
        prod: {
            options: {
                outputStyle: 'compressed',
                environment: 'production'
            }
        },
        dev: {
            options: {
                outputStyle: 'nested'
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
    dox: {
      libdocs : {
          src: ['<%= jshint.lib_test.src %>', 'web/test/**/*.js'],
          dest: 'doc/javascript'
      }
    },
    phpdocumentor: {
        dist : { 
            directory : ['app'],
            target : 'doc/php/doc'
        }   
    },  
    watch: {
      all: {
          files: ['web/scss/**/*.scss', '<%= jshint.lib_test.src %>'],
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
      php: {
        files: '<%= phpunit.classes.dir %>',
        tasks: ['phpunit']
      },
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      lib_test: {
        files: '<%= jshint.lib_test.src %>',
        tasks: ['jshint:lib_test', 'test']
      }
    },  
    bowerful: {
        dist: {
            store: 'components',
            dest: 'web/js/vendor',
            destfile: 'vendor',
            /*
             * can specify custom targets
            customtarget: {
                'web/js/vendor/jquery.js'
            },
            */
            /*
            packages: {
                jquery: ''//, 
                //underscore: '', 
                //backbone: ''
            }   
            */
            packages: grunt.file.readJSON('projectDefault.json')
        }
    }, 
    jsbeautifier : { 
        files : ['<%= concat.prod.src %>'],
        options : { 
            indent_size: 4,
            indent_char: " ",
            indent_level: 0,
            indent_with_tabs: false,
            preserve_newlines: true,
            max_preserve_newlines: 10, 
            jslint_happy: true,
            brace_style: "expand",
            keep_array_indentation: false,
            keep_function_indentation: false,
            space_before_conditional: true,
            eval_code: false,
            indent_case: false,
            wrap_line_length: 80, 
            unescape_strings: false
        }   
    },  
    monkeytestjs: {
      url: {
        options: {
          urls: [
            // this will later on point to the monkeytestJS web demo page
            'http://prototype.dev/tests/index.html'
          ]   
        }   
      }   
    },
    clean: {
        install: {
            src: '<%= bowerful.dist.store.src %>'
        },
        debug: {
            src: '<%= concat.prod.dest %>'
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
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-monkeytestjs');
  grunt.loadNpmTasks('grunt-bowerful');

  // Better naming conventions
  grunt.registerTask('lint', 'Lint javascript files with default validator', 'jshint');
  grunt.registerTask('min',  'Minify files with default minifier', 'uglify');
  grunt.registerTask('test', 'Unit testing on the command line with default testing framework', 'nodeunit');
  grunt.registerTask('itest', 'Integration testing on the command line using monkeytestjs', 'monkeytestjs');

  // reload
  grunt.loadNpmTasks('grunt-reload');

  // beautifier
  grunt.loadNpmTasks('grunt-jsbeautifier');

  // php unit
  grunt.loadNpmTasks('grunt-phpunit');

  // documentation generation
  grunt.loadNpmTasks('grunt-dox');
  grunt.loadNpmTasks('grunt-phpdocumentor');

  // watch tasks
  grunt.registerTask('dev',     ['reload', 'watch:all']);
  grunt.registerTask('dev:css', ['reload', 'watch:css']);
  grunt.registerTask('dev:js',  ['reload', 'watch:js']);

  // generate all docs
  grunt.registerTask('docs',    ['dox', 'phpdocumentor']);

  // install 
  grunt.registerTask('install', 'Install javascript components defined on Gruntfile',  ['bowerful', 'clean:install']);

  // Default task.
  grunt.registerTask('default', ['jshint', 'nodeunit', 'concat', 'jsbeautifier', 'uglify', 'clean:debug', 'compass:prod']);

};
