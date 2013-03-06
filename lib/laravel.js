/* node script to setup laravel framework */
(function(exports) {
  "use strict";
  exports.prompt = 'Do you want to include Laravel 4.0 on the build?';

  var unzipper = require('./process-zip');
  var request = require('request');
  var fs = require('fs');
  var Sink = require('pipette').Sink;
  var mkdirp = require('mkdirp');

  function createLayout(grunt, init, done) {
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
  }

  function configureEnvironments(grunt, init, done) {
    grunt.verbose.writeln('Configuring Laravel environments in bootstrap/start.php...');

    // write environment configuration to bootstrap/start.php
    var start = fs.readFileSync('bootstrap/start.php', 'utf-8');

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

  function configureMail(grunt, init, done) {
    grunt.verbose.writeln('Configuring Laravel mail sender in app/config/mail.php...');

    var config = fs.readFileSync('app/config/mail.php', 'utf-8');
    config = config.replace(/(['"]host['"]\s*=>\s*['"])[^'"]+(['"])/, '$1smtp.gmail.com$2');
    config = config.replace(/(['"]port['"]\s*=>\s*)\d+/, '$1465');
    //'encryption' => 'ssl',
    config = config.replace(/(['"]encryption['"]\s*=>\s*['"])[^'"]+(['"])/, '$1ssl$2');
    config = config.replace(/(['"]username['"]\s*=>\s*)(?:null|['"][^'"]+['"])/, '$1\'smtp@themonkeys.com.au\'');
    config = config.replace(/(['"]password['"]\s*=>\s*)(?:null|['"][^'"]+['"])/, '$1\'devbananas\'');
    config = config.replace(/(['"]from['"][^\r\n]*['"]address['"]\s*=>\s*)(?:null|['"][^'"]+['"])/, '$1\'noreply@themonkeys.com.au\'');
    // there's no sensible default for the name

    fs.writeFileSync('app/config/mail.php', config);

    grunt.verbose.ok();
    done();
  }

  function downloadLaravel(grunt, init, done) {
    unzipper.processZip(request('https://github.com/laravel/laravel/archive/develop.zip'), {
      fromdir: 'laravel-develop/',
      verbose: function(msg) {
        grunt.verbose.writeln(msg);
      },
      complete: done,
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
  }

  exports.template = function(grunt, init, done) {
    grunt.log.write("Setting up Laravel framework...");

    var tasks = [
      downloadLaravel,
      createLayout,
      configureEnvironments,
      configureMail
    ];

    (function next() {
      (tasks.shift())(grunt, init, function() {
        if (tasks.length) {
          next();
        } else {
          done();
        }
      });
    }());
  };
}(typeof exports === 'object' && exports || this));

