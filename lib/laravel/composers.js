(function(exports) {
  "use strict";
  var fs = require('fs');

  exports.configureViewComposers = function(grunt, init, done) {
    grunt.verbose.write("Adding view composer file to Laravel...");

    // add code to app/start/global.php
    var php = fs.readFileSync('build/app/start/global.php', 'utf-8');

    php = php.replace(/filters.php\';$/m,
      '$&\n\n' +
        '/*\n' +
        '|--------------------------------------------------------------------------\n' +
        '| Require The View Composers File\n' +
        '|--------------------------------------------------------------------------\n' +
        '|\n' +
        '| Next we will load the view composers file for the application. This gives\n' +
        '| us a nice separate location to store our view composers and shared view\n' +
        '| data definitions instead of putting them all in the main routes file.\n' +
        '|\n' +
        '*/\n\n' +
        'require app_path().\'/viewcomposers.php\';');

    fs.writeFileSync('build/app/start/global.php', php);

    grunt.verbose.ok();
    done();
  };

})(typeof exports === 'object' && exports || this);
