"use strict";

exports.description = 'The monkeys base project';

exports.notes = 'By default we will create a Laravel backend with Backbone.js';

exports.warnOn = '*';

exports.template = function(grunt, init, done) {

  var fs = require('fs');
  var http = require('http');
  var S_IXUSR = parseInt('0000100', 8);
  var grantExecutePermission = function(file) {
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
          default: 'YES'
        },
        {
          name: 'backbone',
          message: 'Do you want to include Backbone.js on the build ? (YES/NO)',
          default: 'YES'
        },
        {
          name: 'acceptanceFramework',
          message: 'Do you want to include acceptanceFramework on the build ? (YES/NO)',
          default: 'YES'
        },
        {
          name: 'initsh',
          message: 'Do you want me to automatically download dependencies and build after setting up your project ? (YES/NO)',
          default: 'YES'
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

    // Here is where we going to specify which files should be downloaded
    // by bower, default is only jquery.
    var projectDefaultjson = {
        jquery: ""
    };

    if( props.laravel === "YES" ) {
      grunt.log.write("Setting up Laravel...");

      require("./bin/laravel.js").laravel().setup();

      grunt.log.ok();

    } else {
      grunt.log.write("Setting up HTML5 Boilerplate...");

      require("./bin/h5bp.js").h5bp().setup();

      grunt.log.ok();
    }

    if( props.backbone === "YES" ) {
      grunt.log.write("Setting up Backbonejs...");

      // this will set to the latest version
      projectDefaultjson.underscore = "";

      // this will set to the latest version
      projectDefaultjson.backbone = "";
      
      require("./bin/backbone.js").backbone().setup();

      grunt.log.ok();
    }

    if( props.acceptanceFramework === "YES" ) {
      grunt.log.write("Setting up acceptanceFramework...");

      require("./bin/acceptance.js").acceptance().setup();
     
      grunt.log.ok();
    }

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
};
