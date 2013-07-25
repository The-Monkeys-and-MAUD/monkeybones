(function(exports) {
  "use strict";

  exports.integrateErrorEmailer = function(grunt, init, done) {
    grunt.verbose.write("Integrating error emailer into Laravel...");

    // add lines to composer.json
    var content = grunt.file.read('build/composer.json');
    content = content.replace(/("require"(?:.|[\r\n])*?)([ \t\r\n]*\})/, '$1,\n\t\t"themonkeys/error-emailer": "dev-master"$2');
    grunt.file.write('build/composer.json', content);

    // add lines to app/config/app.php
    content = grunt.file.read('build/app/config/app.php');
    content = content.replace(/(providers['"]\s*=>\s*array\((?:.|[\r\n])*?)([ \t\r\n]*\))/, '$1\n\t\t\'Themonkeys\\ErrorEmailer\\ErrorEmailerServiceProvider\',$2');
    grunt.file.write('build/app/config/app.php', content);

    grunt.verbose.ok();
    done();
  };

})(typeof exports === 'object' && exports || this);
