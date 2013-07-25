(function(exports) {
  "use strict";

  exports.integrateBladeCacheFilter = function(grunt, init, done) {
    grunt.verbose.write("Integrating blade cache filter into Laravel...");

    // add lines to composer.json
    var content = grunt.file.read('build/composer.json');
    content = content.replace(/("require"(?:.|[\r\n])*?)([ \t\r\n]*\})/, '$1,\n\t\t"themonkeys/blade-cache-filter": "dev-master"$2');
    grunt.file.write('build/composer.json', content);

    // add lines to app/config/app.php
    content = grunt.file.read('build/app/config/app.php');
    content = content.replace(/(providers['"]\s*=>\s*array\((?:.|[\r\n])*?)([ \t\r\n]*\))/, '$1\n\t\t\'Themonkeys\\BladeCacheFilter\\BladeCacheFilterServiceProvider\',$2');
    grunt.file.write('build/app/config/app.php', content);

    // add lines to app/filters.php
    content = grunt.file.read('build/app/filters.php') +
      '\nif (Config::get(\'blade-cache-filter::bladeCacheExpiry\') > 0) {\n' +
        '\tRoute::filter(\'cache\', \'BladeCacheFilter\');\n' +
      '}\n';
    grunt.file.write('build/app/filters.php', content);

    grunt.verbose.ok();
    done();
  };

})(typeof exports === 'object' && exports || this);
