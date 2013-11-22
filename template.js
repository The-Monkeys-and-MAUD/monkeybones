(function(exports) {
  "use strict";

  var fs = require('fs');


  // Add a template
  //subtemplates.add([{ name: foo, prop = bar, index = n },..])
  //subtemplates.add({ name: foo, prop = bar, index = n })
  //subtemplates.add( name, prop, index )
  var 
  subtemplates = {};
  subtemplates.que = [];
  subtemplates.add = function( template, prop, index ) {

    var _name, _prop, _index;

    if (!Array.isArray( template )) {
        _name = template.name || template;
        _prop = template.prop || prop;
        _index = template.index || index;

        // if we havent added the template yet
        if (typeof subtemplates[ _name ] === "undefined") {
            subtemplates.que.splice( _index || subtemplates.que.length, 0, _name );
            subtemplates[ _name ] = _prop;
        }
    } else {
        for( var i=0, len=template.length; i<len; i++ ) {
            subtemplates.add(template[i]);
        }
    }

    return this;
  };

  var S_IXUSR = parseInt('0000100', 8);
  function grantExecutePermission(file) {
    /*jshint bitwise: false*/
    var stat = fs.statSync(file);
    if (!(stat.mode & S_IXUSR)) {
      fs.chmodSync(file, stat.mode | S_IXUSR);
    }
  }

  function installDependencies(grunt, init, done) {
    var npm;

    try {
      // as a global library, requiring npm needs NODE_PATH to be set, and it's often not set by default.
      // in that case let's try to help the user a bit
      npm = require('npm');

    } catch (e) {
      var suggestion = '';
      if (typeof process.env.NODE_PATH === 'undefined') {
        suggestion = ' Hint: environment variable *NODE_PATH* is not set.';

        if (fs.existsSync('/usr/local/lib/node_modules/')) {
          suggestion += ' Try setting it to _/usr/local/lib/node_modules/_.';

          // why not just try loading it directly then?
          try {
            npm = require('/usr/local/lib/node_modules/npm/lib/npm');
          } catch (error) {
            // give up...
          }
        }
      }
      if (!npm) {
        grunt.log.error('Cannot find module \'npm\'.' + suggestion);
        return done();
      }
    }

    // first, use npm to get our dependencies
    grunt.log.writeln('_Using npm install to get template script dependencies._');
    var dir = process.cwd();
    process.chdir(__dirname);

    function installed(success, msg) {
      process.chdir(dir);

      if (success) {
        grunt.log.ok();
        done();
      } else {
        grunt.log.error(msg);
        done();
      }
    }

    npm.load({}, function (er) {
      if (er) {
        installed(false, 'Error executing npm install: ' + er);
      } else {
        npm.commands.install([], function (er, data) {
          if (er) {
            installed(false, 'Error executing npm install: ' + er);
          } else {
            installed(true);
          }
        });
        npm.on("log", function (message) {
          grunt.log.writeln(message);
        });
      }
    });
  }


  exports.description = 'Monkeybones website project template';

  exports.notes = 'A web project template with a ready-made Gruntfile to give you javascript minification, Sass compilation, unit testing and more, as well as optional Laravel 4.0, backbone.js and/or acceptance testing framework.';

  exports.warnOn = '*';


  function template(grunt, init, done) {
    // Here is where we going to specify which files should be downloaded
    // by bower, default is only jquery.
    init.bowerJson = {
        "dependencies": {
            "requirejs": "",
            "almond": "",
            "jquery": ""
        },
        "private": true
    };


    var prompts = [
      init.prompt('name'),
      init.prompt('title'),
      init.prompt('description'),
      init.prompt('version'),
      init.prompt('repository'),
      init.prompt('homepage'),
      init.prompt('bugs'),
      init.prompt('licenses'),
      init.prompt('author_name'),
      init.prompt('author_email'),
      init.prompt('author_url')
    ];

    // add prompts to enable/disable subtemplates
    subtemplates.que.forEach(function(subtemplate) {
      if (subtemplates[subtemplate].prompt) {
        prompts.push({
          name: subtemplate,
          message: subtemplates[subtemplate].prompt,
          'default': 'Y/n'
        });
      }
    });

    init.process({}, prompts, function(err, props) {
      init.bowerJson.name = props.name;
      init.bowerJson.version = props.version;

      props.keywords = [];

      // give sub-templates a chance to modify init.renames prior to getting a list of files to copy
      grunt.util.async.forEachSeries(subtemplates.que, function(name, next) {
        var subtemplate = subtemplates[name];
        if ((!subtemplate.prompt || /y/i.test(props[name])) && typeof subtemplate.initTemplate === 'function') {
          subtemplate.initTemplate(grunt, init, function() {
            // merge template's props with our props
            props = grunt.util._.extend(props, subtemplate.props);
            next();
          });
        } else {
          next();
        }
      }, function() {
        var files = init.filesToCopy(props);

        //init.addLicenseFiles(files, props.licenses); //TODO reinstate once we've added a Monkeys licence to the list

        init.copyAndProcess(files, props);

        init.writePackageJSON('build/package.json', {
          name: props.name,
          description: props.title + (props.description ? ': ' + props.description : ''),
          version: props.version,
          repository: props.repository,
          npm_test: 'grunt test',
          node_version: '>= 0.8.0',
          devDependencies: {
            'grunt-contrib-jshint': 'latest',
            'grunt-contrib-concat': 'latest',
            'grunt-contrib-nodeunit': 'latest',
            'grunt-contrib-requirejs': 'latest',
            'grunt-contrib-uglify': 'latest',
            'grunt-contrib-watch': 'latest',
            'grunt-contrib-clean': 'latest',
            'grunt-contrib-copy': 'latest',
            'grunt-contrib-compass': 'latest',
            'grunt-contrib-connect': 'latest',
            'grunt-monkeytestjs': 'latest',
            'grunt-dox': 'latest',
            'grunt-jsbeautifier': 'latest',
            'nodemock': 'latest',
            'backbone': 'latest',
            'underscore': 'latest',
            'jquery': 'latest',
            'requirejs': 'latest',
            'grunt-phpunit': 'latest',
            'grunt-phpdocumentor': 'git://github.com/gomoob/grunt-phpdocumentor.git',
            'grunt-reload': 'git://github.com/webxl/grunt-reload.git'
          }
        });

        grantExecutePermission('init.sh');

        // now call the template() entry point function for each subtemplate in order.
        // first construct a queue of the enabled subtemplates
        var tasks = [];
        subtemplates.que.forEach(function(subtemplate) {
          if (!subtemplates[subtemplate].prompt || /y/i.test( props[subtemplate] ) ) {
            tasks.push(subtemplates[subtemplate].template);
          }
        });

        // if user chose not to run init.sh automatically, remind them they'll need to run it later.
        if( !/y/i.test( props.runInitSh ) ) {
          exports.after = 'Next, run _./init.sh_ to download and install dependencies.';
        }

        init.props = props;

        // now work through the queue asynchronously
        (function next() {
          (tasks.shift())(grunt, init, function() {
            if (tasks.length) {
              next();
            } else {
              done();
            }
          });
        }());
      });
    });
  }

  exports.template = function(grunt, init, done) {
    installDependencies(grunt, init, function() {
      subtemplates
      .add( 'h5bp',       require('./lib/h5bp') )
      .add( 'laravel',    require('./lib/laravel') )
      .add( 'backbone',   require('./lib/backbone') )
      .add( 'acceptance', require('./lib/acceptance') )
      .add([ 
            {
              name: 'writeBowerJson',
              prop: {
                  prompt: false,
                  template: function(grunt, init, done) {
                    // create a project json file on which projects will be read from
                    fs.writeFileSync('build/bower.json', JSON.stringify(init.bowerJson));
                    done();
                  }
             }
          },
          {
              name: 'runInitSh',
              prop: {
                  prompt: 'Do you want me to automatically download dependencies and build after setting up your project?',
                  template: function(grunt, init, done) {
                    grunt.log.writeln('Running _./init.sh_ ...');

                    var spawn = require('child_process').spawn;
                    var child = spawn('./init.sh', [], {
                      stdio: 'inherit'
                    });
                    child.on('exit', function(code) {
                      if (code === 0) {
                        grunt.log.writeln().ok();
                      } else {
                        grunt.fail.warn('./init.sh failed (status ' + code + ').');
                      }
                      done();
                    });
                  }
              }
          }
      ]);

      if (grunt.task.current.errorCount) {
        done();
      } else {
        // dependencies were installed successfully, so proceed with template installation.
        template(grunt, init, done);
      }
    });
  };

}(typeof exports === 'templateect' && exports || this));
