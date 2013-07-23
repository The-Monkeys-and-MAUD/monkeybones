(function(exports) {
  "use strict";
  var mkdirp = require('mkdirp');
  var fs = require('fs');

  exports.createLayout = function(grunt, init, done) {
    grunt.verbose.writeln('Replacing build/public/index.html with build/app/views/hello.blade.php...');

    // parse public/index.html and create a Laravel layout from it.
    mkdirp.sync('build/app/views/layouts');
    var layout = fs.readFileSync('build/public/index.html', 'utf-8');

    // add a @yield for the site title
    layout = layout.replace(/<title>[^<]*<\/title>/, '<title>@yield(\'title\')</title>');

    // add a @yield for the meta description
    layout = layout.replace(/(<meta[^>]+"description"[^>]+content=")("[^>]*>)/, '$1{{ preg_replace(\'/\\s{2,}/\', \' \', trim($__env->yieldContent(\'description\'))) }}$2');

    // add a @yield for the meta keywords
    layout = layout.replace(/(<meta[^>]+"keywords"[^>]+content=")("[^>]*>)/, '$1{{ preg_replace(\'/\\s{2,}/\', \' \', trim($__env->yieldContent(\'keywords\'))) }}$2');

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
    layout = layout.replace('<body', '<body class="{{ preg_replace(\'/\\s{2,}/\', \' \', trim($__env->yieldContent(\'body-class\'))) }}"');

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

    fs.writeFileSync('build/app/views/layouts/common.blade.php', layout);

    // create partials.nav and partials.footer
    mkdirp.sync('build/app/views/partials');
    fs.writeFileSync('build/app/views/partials/nav.blade.php', '');
    fs.writeFileSync('build/app/views/partials/footer.blade.php', '');

    // replace the Laravel default view placeholder with the h5bp placeholder
    if (fs.existsSync('build/app/views/hello.php')) {
      fs.unlinkSync('build/app/views/hello.php');
    }
    fs.writeFileSync('build/app/views/hello.blade.php', '@extends(\'layouts.common\')\n\n' +
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

    fs.unlinkSync('build/public/index.html');
    grunt.verbose.ok();

    done();
  };
})(typeof exports === 'object' && exports || this);
