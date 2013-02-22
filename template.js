
"use strict";

exports.description = 'The monkeys base project';

exports.notes = 'By default we will create a Laravel backend with Backbone.js';

exports.warnOn = '*';

exports.template = function(grunt, init, done) {

  init.process({}, [
    init.prompt('name'),
    init.prompt('title', 'The monkeys project'), 
    init.prompt('description', 'Website'), 
    init.prompt('version', '0.1.0'), 
    init.prompt('repository'),
    init.prompt('homepage'),
    init.prompt('bugs'),
    init.prompt('licenses', 'MIT'),
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
        }
  ], function(err, props) {

    props.keywords = [];

    var red   = '\u001b[31m',
        blue  = '\u001b[34m',
        green = '\u001b[32m',
        reset = '\u001b[0m';

    var files = init.filesToCopy(props);

    init.addLicenseFiles(files, props.licenses);

    init.copyAndProcess(files, props);

    init.writePackageJSON('package.json', {
      name: props.name,
      description: props.description,
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
      },
    });

    if( props.laravel === "YES" ) {
        process.stdout.write("\nSetting up laravel...");

        // laravel commands will go in here
        var module = require("./bin/laravel.js")

        module.laravel().setup();
        
        process.stdout.write(green + "OK" + reset );
    }

    if( props.backbone === "YES" ) {
        process.stdout.write("\nSetting up backbone...");

        // backbone build commands will go in here
        var module = require("./bin/backbone.js")

        module.backbone().setup();

        process.stdout.write(green + "OK" + reset );
    }

    done();
  });
};
