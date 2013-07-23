(function(exports) {
  "use strict";
  var fs = require('fs');

  exports.configureMail = function(grunt, init, done) {
    grunt.verbose.writeln('Configuring Laravel mail sender in build/app/config/mail.php...');

    var config = fs.readFileSync('build/app/config/mail.php', 'utf-8');
    config = config.replace(/(['"]host['"]\s*=>\s*['"])[^'"]+(['"])/, '$1' + init.props.smtphost + '$2');
    config = config.replace(/(['"]port['"]\s*=>\s*)\d+/, '$1' + init.props.smtpport);
    //'encryption' => 'ssl',
    config = config.replace(/(['"]encryption['"]\s*=>\s*)['"][^'"]+['"]/, '$1' + (init.props.smtpencryption === '' ? 'null' : '\'' + init.props.smtpencryption + '\''));
    config = config.replace(/(['"]username['"]\s*=>\s*)(?:null|['"][^'"]+['"])/, '$1' + (init.props.smtpusername === '' ? 'null' : '\'' + init.props.smtpusername + '\''));
    config = config.replace(/(['"]password['"]\s*=>\s*)(?:null|['"][^'"]+['"])/, '$1' + (init.props.smtppassword === '' ? 'null' : '\'' + init.props.smtppassword + '\''));
    config = config.replace(/(['"]from['"][^\r\n]*['"]address['"]\s*=>\s*)(?:null|['"][^'"]+['"])/, '$1' + (init.props.smtpfrom === '' ? 'null' : '\'' + init.props.smtpfrom + '\''));
    config = config.replace(/(['"]from['"][^\r\n]*['"]name['"]\s*=>\s*)(?:null|['"][^'"]+['"])/, '$1' + (init.props.smtpfromname === '' ? 'null' : '\'' + init.props.smtpfromname + '\''));

    fs.writeFileSync('build/app/config/mail.php', config);

    grunt.verbose.ok();
    done();
  };

})(typeof exports === 'object' && exports || this);
