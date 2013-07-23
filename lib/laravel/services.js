(function(exports) {
  "use strict";
  var fs = require('fs');

  exports.configureServices = function(grunt, init, done) {
    grunt.verbose.write("Adding autoloaded services folder to Laravel...");

    // add code to app/start/global.php
    var php = fs.readFileSync('build/app/start/global.php', 'utf-8');

    php = php.replace(/(ClassLoader::addDirectories(?:.|[\n\r])*)(,[\s\n\r]*\)\);)/gm,
      '$1,\n\tapp_path().\'/services\'$2');

    fs.writeFileSync('build/app/start/global.php', php);

    // create the folder, too
    fs.mkdir('build/app/services');
    grunt.file.write('build/app/services/.gitkeep', '');

    grunt.verbose.ok();
    done();
  };

})(typeof exports === 'object' && exports || this);
