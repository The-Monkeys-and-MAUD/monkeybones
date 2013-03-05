#!/usr/local/bin/node

/* node script to setup laravel framework */
(function(exports) {
  "use strict";
  exports.template = function() {
    var unzipper = require('./lib/process-zip');
    var request = require('request');
    var fs = require('fs');
    var Sink = require('pipette').Sink;
    var mkdirp = require('mkdirp');

    return {
      setup: function(grunt, init, done) {
        var self = this;
        unzipper.processZip(request('https://github.com/laravel/laravel/archive/develop.zip'), {
          fromdir: 'laravel-develop/',
          verbose: function(msg) {
            grunt.verbose.writeln(msg);
          },
          complete: function() {
            self.createLayout(grunt, init, function() {
              self.configureEnvironments(grunt, init, done);
            });
          },
          rename: function(file) {
            var matches = /^(.*)\.md$/.exec(file);
            if (matches) {
              return matches[1] + '-Laravel.md';
            }
            if (file === 'public/.htaccess') {
              // need to append this file because it already exists (comes with h5bp)
              new Sink(this).on('data', function(buffer) {
                var htaccess = '\n' +
                  '# ----------------------------------------------------------------------\n' +
                  '# Laravel framework\n' +
                  '# ----------------------------------------------------------------------\n' +
                  buffer.toString();
                fs.appendFileSync(file, htaccess);
              });
            }
            return file;
          }
        });
      },
      createLayout: function(grunt, init, done) {
        grunt.verbose.writeln('Replacing public/index.html with app/views/hello.blade.php...');

        // parse public/index.html and create a Laravel layout from it.
        mkdirp.sync('app/views/layouts');
        var layout = fs.readFileSync('public/index.html', 'utf-8');

        // add a @yield for the site title
        layout = layout.replace(/<title>[^<]*<\/title>/, '<title>@yield(\'title\')</title>');

        // add a @yield for the meta description
        layout = layout.replace(/(<meta[^>]+"description"[^>]+content=")("[^>]*>)/, '$1{{ trim($__env->yieldContent(\'description\')) }}$2');

        // add a @yield for the meta keywords
        layout = layout.replace(/(<meta[^>]+"keywords"[^>]+content=")("[^>]*>)/, '$1{{ trim($__env->yieldContent(\'keywords\')) }}$2');

        // add default @sections for title, keywords, description
        layout = layout.replace(/(<head.*[\r\n])/, '$1' +
          '{{-- Default title --}}\n' +
          '@section(\'title\')\n' +
          '  {{-- TODO --}}\n' +
          '@stop\n' +
          '\n' +
          '{{-- Default description --}}\n' +
          '@section(\'description\')\n' +
          '  {{-- TODO --}}\n' +
          '@stop\n' +
          '\n' +
          '{{-- Default keywords --}}\n' +
          '@section(\'keywords\')\n' +
          '  {{-- TODO --}}\n' +
          '@stop\n' +
          '\n');

        // add a yield at the end of the head
        layout = layout.replace(/(<\/head>\s*[\r\n]?)/g, '\n        @yield(\'head-append\')\n    $1');

        // add a default body class
        layout = layout.replace('<body', '<body class="{{ trim($__env->yieldContent(\'body-class\')) }}"');

        // replace the placeholder '<!-- Add your site or application content here -->' with a @yield
        var match = /<!--[^\r\n]*content here[^\r\n]*-->\s*<p>.*<\/p>\s*[\r\n]/.exec(layout);
        var placeholder;
        if (match) {
          layout = layout.substr(0, match.index) +
            '{{-- Global navigation --}}\n' +
            '        @include(\'partials.nav\')\n\n' +
            '        @yield(\'body\')\n\n' +
            '        @include(\'partials.footer\')\n\n' +
            layout.substr(match.index + match[0].length);
          placeholder = match[0];
        } else {
          grunt.log.warn('Unable to find content placeholder in h5bp index.html');
        }

        fs.writeFileSync('app/views/layouts/common.blade.php', layout);

        // create partials.nav and partials.footer
        mkdirp.sync('app/views/partials');
        fs.writeFileSync('app/views/partials/nav.blade.php', '');
        fs.writeFileSync('app/views/partials/footer.blade.php', '');

        // replace the Laravel default view placeholder with the h5bp placeholder
        if (fs.existsSync('app/views/hello.php')) {
          fs.unlinkSync('app/views/hello.php');
        }
        fs.writeFileSync('app/views/hello.blade.php', '@extends(\'layouts.common\')\n\n' +
          '@section(\'title\')\n' +
          '\tAdd your page title here\n' +
          '@stop\n\n' +
          '@section(\'body-class\')\n\n        ' +
          '\thello\n' +
          '@stop\n\n' +
          '@section(\'body\')\n\n        ' +
          placeholder +
          '@stop\n\n'
        );

        fs.unlinkSync('public/index.html');
        grunt.verbose.ok();

        done();
      },
      configureEnvironments: function(grunt, init, done) {
        grunt.verbose.writeln('Configuring Laravel environments in app/config...');

        mkdirp.sync('app/config/local');
        fs.writeFileSync('app/config/local/.gitignore', '*');

        mkdirp.sync('app/config/stage');
        fs.writeFileSync('app/config/stage/app.php',
          '<?php\n' +
          '/**\n' +
          ' * Configuration for staging server. Overrides defaults specified in ../app.php\n' +
          ' */\n' +
          'return array(\n' +
            '\t/*\n' +
            '\t |--------------------------------------------------------------------------\n' +
            '\t | Application Debug Mode\n' +
            '\t |--------------------------------------------------------------------------\n' +
            '\t |\n' +
            '\t | Disable detailed error messages on stage server so that a simple generic\n' +
            '\t | error page is shown.\n' +
            '\t |\n' +
            '\t */\n' +
            '\t\'debug\' => false\n' +
          ');'
        );

        mkdirp.sync('app/config/beta');
        fs.writeFileSync('app/config/beta/app.php',
          '<?php\n' +
            '/**\n' +
            ' * Configuration for beta server. Overrides defaults specified in ../app.php\n' +
            ' */\n' +
            'return array(\n' +
            '\t/*\n' +
            '\t |--------------------------------------------------------------------------\n' +
            '\t | Application Debug Mode\n' +
            '\t |--------------------------------------------------------------------------\n' +
            '\t |\n' +
            '\t | Disable detailed error messages on beta server so that a simple generic\n' +
            '\t | error page is shown.\n' +
            '\t |\n' +
            '\t */\n' +
            '\t\'debug\' => false\n' +
            ');'
        );

        mkdirp.sync('app/config/live');
        fs.writeFileSync('app/config/live/app.php',
          '<?php\n' +
            '/**\n' +
            ' * Configuration for live server. Overrides defaults specified in ../app.php\n' +
            ' */\n' +
            'return array(\n' +
            '\t/*\n' +
            '\t |--------------------------------------------------------------------------\n' +
            '\t | Application Debug Mode\n' +
            '\t |--------------------------------------------------------------------------\n' +
            '\t |\n' +
            '\t | Disable detailed error messages on live server so that a simple generic\n' +
            '\t | error page is shown.\n' +
            '\t |\n' +
            '\t */\n' +
            '\t\'debug\' => false\n' +
            ');'
        );

        // write environment configuration to bootstrap/start.php
        var start = fs.readFileSync('bootstrap/start.php', 'utf-8');
        /*
         'local' => array('localhost', '*.dev', '*.dev:*'),
         'stage' => array('your-stage-name.monkeylabs.com.au'),
         'beta' => array('your-beta-name.monkeylabs.com.au'),
         'live' => array('your-live-host.com')*/

        start = start.replace(/(detectEnvironment[^\r\n]+[\r\n])(?:.|[\n\r])*(\)\)\;)/g,
          '$1' +
            "\t'local' => array('localhost', '*.dev', '*.dev:*'),\n" +
            "\t'stage' => array('your-stage-name.monkeylabs.com.au'),\n" +
            "\t'beta' => array('your-beta-name.monkeylabs.com.au'),\n" +
            "\t'live' => array('your-live-host.com')\n" +
          '$2');

        fs.writeFileSync('bootstrap/start.php', start);

        grunt.verbose.ok();
        done();
      }
    };
  };

}(typeof exports === 'object' && exports || this));

