(function(exports) {
  "use strict";

  exports.integrateCachebuster = function(grunt, init, done) {
    grunt.verbose.write("Integrating cachebuster into Laravel...");

    // add lines to composer.json
    var content = grunt.file.read('build/composer.json');
    content = content.replace(/("require"(?:.|[\r\n])*?)([ \t\r\n]*\})/, '$1,\n\t\t"themonkeys/cachebuster": "dev-master"$2');
    grunt.file.write('build/composer.json', content);

    // add lines to app/config/app.php
    content = grunt.file.read('build/app/config/app.php');
    content = content.replace(/(providers['"]\s*=>\s*array\((?:.|[\r\n])*?)([ \t\r\n]*\))/, '$1\n\t\t\'Themonkeys\\Cachebuster\\CachebusterServiceProvider\',$2');
    content = content.replace(/(aliases['"]\s*=>\s*array\((?:.|[\r\n])*?)([ \t\r\n]*\))/, '$1\n\t\t\'Bust\'            => \'Themonkeys\\Cachebuster\\Cachebuster\',$2');
    grunt.file.write('build/app/config/app.php', content);

    // add lines to .htaccess
    // BEFORE # Laravel framework
    content = grunt.file.read('build/public/.htaccess');
    content = content.replace(/(# -+[ \t\r\n]+# Laravel framework)/,
      '# ----------------------------------------------------------------------\n' +
      '# Remove cachebuster hash from request URLs if present\n' +
      '# ----------------------------------------------------------------------\n' +
      '<IfModule mod_rewrite.c>\n' +
        '\tRewriteRule ^(.*)-[0-9a-f]{32}(\\.(.*))$ $$1$$2 [DPI]\n' +
      '</IfModule>\n\n$1') +
      '\n\n' +

      '# ----------------------------------------------------------------------\n' +
      '# Allow Laravel to pre-process the css to add cachebusters to image urls\n' +
      '# ----------------------------------------------------------------------\n' +
      '<IfModule mod_rewrite.c>\n' +
        '\tRewriteCond %{REQUEST_URI} !^/index.php\n' +
        '\tRewriteRule ^(.*\\.css)$ index.php [L]\n' +
      '</IfModule>\n';
    grunt.file.write('build/public/.htaccess', content);

    content = grunt.file.read('build/app/routes.php') +
      '\n\n' +
      "// These routes will be cached, if you configure a non-zero bladeCacheExpiry.\n" +
      "// Full documentation at https://github.com/TheMonkeys/laravel-blade-cache-filter\n" +
      "Route::group(array('before' => 'cache', 'after' => 'cache'), function() {\n\n" +
        "\tRoute::get('/css/{filename}.css', function($filename) {\n" +
          "\t\treturn Bust::css(\"/css/$filename.css\");\n" +
        "\t});\n\n" +
      "});\n" +
      "App::make('cachebuster.StripSessionCookiesFilter')->addPattern('|css/|');\n";

    grunt.file.write('build/app/routes.php', content);

    // add Bust calls to common.blade.php
    content = grunt.file.read('build/app/views/layouts/common.blade.php');
    content = content.replace(/\/(?:css|js)\/[^"]*\.(?:css|js)/g, '{{ Bust::url(\'$&\') }}');
    grunt.file.write('build/app/views/layouts/common.blade.php', content);


    grunt.verbose.ok();
    done();
  };

})(typeof exports === 'object' && exports || this);
