'use strict';

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
          message: 'Do you want to include Laravel on the build ?',
          default: 'YES'
        },
        {
          name: 'backbone',
          message: 'Do you want to include Backbone.js on the build ?',
          default: 'YES'
        }
  ], function(err, props) {

    props.keywords = [];

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
        'grunt-contrib-qunit': '~0.1.1',
        'grunt-contrib-concat': '~0.1.2',
        'grunt-contrib-uglify': '~0.1.1',
        'grunt-contrib-watch': '~0.2.0',
        'grunt-contrib-clean': '~0.4.0',
      },
    });

    done();
  });
};
