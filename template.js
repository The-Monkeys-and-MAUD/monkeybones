"use strict";

function setupLaravel(grunt, init, done) {
  runSetupScript('./bin/laravel.js', 'Laravel', grunt, init, done);
}

function setupHtml5Boilerplate(grunt, init, done) {
  runSetupScript('./bin/h5bp.js', 'HTML5 Boilerplate', grunt, init, done);
}

function setupBackbone(grunt, init, done) {
  // this will set to the latest version
  projectDefaultjson.underscore = "";

  // this will set to the latest version
  projectDefaultjson.backbone = "";

  runSetupScript('./bin/backbone.js', 'Backbonejs', grunt, init, done);
}

function setupAcceptanceFramework(grunt, init, done) {
  runSetupScript('./bin/acceptance.js', 'Acceptance Testing Framework', grunt, init, done);
}

function runSetupScript(script, title, grunt, init, done) {
  grunt.log.write("Setting up " + title + "...");

  require(script).template().setup(grunt, init, function() {
    grunt.log.ok();
    done();
  });
}

function installDependencies(grunt, init, done) {
  var npm;

  try {
    // as a global library, requiring npm needs NODE_PATH to be set, and it's often not set by default.
    // in that case let's try to help the user a bit
    npm = require('npm');

  } catch (e) {
    var suggestion = '';
    var fs = require('fs');
    if (typeof process.env.NODE_PATH === 'undefined') {
      suggestion = ' Hint: environment variable *NODE_PATH* is not set.';

      if (fs.existsSync('/usr/local/lib/node_modules/')) {
        suggestion += ' Try setting it to _/usr/local/lib/node_modules/_.';

        // why not just try loading it directly then?
        try {
          npm = require('/usr/local/lib/node_modules/npm/lib/npm');
        } catch (e) {
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
      template(grunt, init, done);
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


exports.description = 'The monkeys base project';

exports.notes = 'By default we will create a Laravel backend with Backbone.js';

exports.warnOn = '*';

// Here is where we going to specify which files should be downloaded
// by bower, default is only jquery.
var projectDefaultjson = {
  jquery: ""
};


function template(grunt, init, done) {

  var fs = require('fs');
  var S_IXUSR = parseInt('0000100', 8);
  var grantExecutePermission = function(file) {
    /*jshint bitwise: false*/
    var stat = fs.statSync(file);
    if (stat.mode & S_IXUSR) {
      grunt.verbose.writeln('Owner execute bit already set on ' + file + '.');
    } else {
      grunt.verbose.write('Setting owner execute bit on ' + file + '...');
      fs.chmodSync(file, stat.mode | S_IXUSR);
      grunt.verbose.ok();
    }
  };

  init.process({}, [
    init.prompt('name'),
    init.prompt('title', 'The monkeys project'), 
    init.prompt('description', 'Website'), 
    init.prompt('version', '0.1.0'), 
    init.prompt('repository'),
    init.prompt('homepage'),
    init.prompt('bugs'),
    //init.prompt('licenses', 'MIT'), //TODO we need a default Monkeys licence
    init.prompt('author_name', 'The Monkeys'),
    init.prompt('author_email', 'developers@themonkeys.com.au'),
    init.prompt('author_url', 'http://themonkeys.com.au'),
        {
          name: 'laravel',
          message: 'Do you want to include Laravel on the build ? (YES/NO)',
          'default': 'YES'
        },
        {
          name: 'backbone',
          message: 'Do you want to include Backbone.js on the build ? (YES/NO)',
          'default': 'YES'
        },
        {
          name: 'acceptanceFramework',
          message: 'Do you want to include acceptanceFramework on the build ? (YES/NO)',
          'default': 'YES'
        },
        {
          name: 'initsh',
          message: 'Do you want me to automatically download dependencies and build after setting up your project ? (YES/NO)',
          'default': 'YES'
        }

  ], function(err, props) {

    props.keywords = [];

    var files = init.filesToCopy(props);

    //init.addLicenseFiles(files, props.licenses); //TODO reinstate once we've added a Monkeys licence to the list

    init.copyAndProcess(files, props);

    init.writePackageJSON('package.json', {
      name: props.name,
      description: props.title + (props.description ? ': ' + props.description : ''),
      version: props.version,
      repository: props.repository,
      npm_test: 'grunt test',
      node_version: '>= 0.8.0',
      devDependencies: {
        'grunt-contrib-jshint': '~0.1.1',
        'grunt-contrib-concat': '~0.1.2',
        'grunt-contrib-nodeunit': '~0.1.2',
        'grunt-contrib-uglify': '~0.1.1',
        'grunt-contrib-watch': '~0.2.0',
        'grunt-contrib-clean': '~0.4.0',
        'grunt-contrib-compass': '~0.1.2',
        'grunt-contrib-connect': '~0.1.2',
        'grunt-docco': 'git://github.com/DavidSouther/grunt-docco.git',
        'grunt-reload': 'git://github.com/webxl/grunt-reload.git',
        'nodemock': '~0.2.17',
        'grunt-bowerful': 'latest'
      }
    });

    grantExecutePermission('bin/init.sh');

    var tasks = [ setupHtml5Boilerplate ];

    if( props.laravel === "YES" ) {
      tasks.push(setupLaravel);
    }
    if ( props.backbone === "YES" ) {
      tasks.push(setupBackbone);
    }
    if( props.acceptanceFramework === "YES" ) {
      tasks.push(setupAcceptanceFramework);
    }
    tasks.push(function(grunt, init, done) {
      // create a project json file on which projects will be read from
      fs.writeFile('projectDefault.json', JSON.stringify(projectDefaultjson));

      if( props.initsh === "YES" ) {
        grunt.log.writeln('Running _./bin/init.sh_ ...');

        var spawn = require('child_process').spawn;
        var child = spawn('./bin/init.sh', [], {
          stdio: 'inherit'
        });
        child.on('exit', function(code) {
          if (code === 0) {
            grunt.log.writeln().ok();
          } else {
            grunt.fail.warn('./bin/init.sh failed (status ' + code + ').');
          }
          done();
        });

      } else {
        exports.after = 'Next, run _./bin/init.sh_ to download and install dependencies.';
        done();
      }
    });

    (function next() {
      (tasks.shift())(grunt, init, function() {
        if (tasks.length) {
          next();
        } else {
          done();
        }
      });
    })();
  });
}
exports.template = installDependencies;
