(function(exports) {
  "use strict";
  var fs = require('fs');

  exports.configureEnvironments = function(grunt, init, done) {
    grunt.verbose.writeln('Configuring Laravel environments in bootstrap/start.php...');

    // write environment configuration to bootstrap/start.php
    var start = fs.readFileSync('build/bootstrap/start.php', 'utf-8');

    var config = '';
    init.props.environments.forEach(function(environment) {
      config += "\t'" + environment + "' => array(" +
        init.props['environment-' + environment].map(function(pattern) {
          return "'" + pattern + "'";
        }).join(', ') +
        "),\n";
    });

    start = start.replace(/(detectEnvironment[^\r\n]+[\r\n])(?:.|[\n\r])*(\)\)\;)/g,
      '$1' + config + '$2');

    fs.writeFileSync('build/bootstrap/start.php', start);

    grunt.verbose.ok();
    done();
  };

})(typeof exports === 'object' && exports || this);
