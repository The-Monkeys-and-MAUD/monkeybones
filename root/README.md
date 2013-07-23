{%= title %}
=======================

{%= description %}

Your project summary here

Documentation
-------------

Your project-specific documentation here

Requirements
------------

### Apache 2

If you're on Mac OS X you can use MAMP for this if you like. However you set it up, you'll need to be able to edit your
virtual host configuration.

### Ruby

The version of Ruby that comes preinstalled on Mac OS X is fine; if you don't have Ruby 1.8 installed
then follow the instructions at [http://www.ruby-lang.org/en/downloads/](http://www.ruby-lang.org/en/downloads/).

### NodeJS

Follow NodeJS install instructions at [http://nodejs.org/download/](http://nodejs.org/download/).

Then install the build system's requirements like so:

```bash
sudo easy_install Pygments &&
    sudo npm install -g grunt-cli mocha testem livereload docco &&
    sudo gem install compass
```

Note that that also installed the Ruby module `compass`.

Setting up your development environment
---------------------------------------

Once you have the above requirements installed, you can set up your development server.

### Bootstrap your build environment

If you're on a unix-like environment, you can run:

```bash
./init.sh
```

Otherwise you'll need to do it manually:

```bash
cd build/
npm install
```

### Run a front-end production build

```
grunt
```

### Apache

Edit your /etc/hosts file (something like C:/Windows/System32/drivers/etc/hosts on Windows):

```
127.0.0.1       yoursite.dev
```

Then add a virtual host to your Apache configuration:

```
<VirtualHost *>
    DocumentRoot "/path/to/your-project/build/public/"
    ServerName yoursite.dev
    <Directory /path/to/your-project/build/public/>
        AllowOverride All
        Order allow,deny
        Allow from all
    </Directory>
</VirtualHost>

```

### Test

Visit [http://yoursite.dev/](http://yoursite.dev/) and you should see the home page. Check your browser's error console
for any load errors or javascript errors.

Building
--------

In development, run the following command to have the grunt watcher build your sass and js as you work:

    cd build/
    grunt dev

Prior to checkin or release, run a full grunt build to ensure the linter is happy with your code and all tests pass:

    cd build/
    grunt
