(function(exports) {
  "use strict";
  var fs = require('fs');

  exports.configureTrustedProxies = function(grunt, init, done) {
    grunt.verbose.write("Adding trusted proxies configuration to Laravel startup...");

    // add code to app/start/global.php
    var php = fs.readFileSync('build/app/start/global.php', 'utf-8');

    php = php.replace(/(<\?php[ \t\r\n]+)(?=\S)/gm,
      '$1use \\Illuminate\\Support\\Facades\\Config;\nuse \\Illuminate\\Support\\Facades\\Request;\n\n');

    php = php.replace(/(App::down(?:.|[\n\r])*\}\);[\s\r\n]+)/gm,
      '$1' +
      '/*\n' +
      ' |--------------------------------------------------------------------------\n' +
      ' | Configure the server\'s reverse proxy, if applicable\n' +
      ' |--------------------------------------------------------------------------\n' +
      ' */\n' +
      'if (sizeof(Config::get(\'server.trusted_proxies\')) > 0) {\n' +
        '\tRequest::setTrustedProxies(Config::get(\'server.trusted_proxies\'));\n' +
      '}\n\n');

    fs.writeFileSync('build/app/start/global.php', php);

    grunt.verbose.ok();
    done();
  };

})(typeof exports === 'object' && exports || this);
