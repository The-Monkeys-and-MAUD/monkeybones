[![The Monkeys](http://www.themonkeys.com.au/img/monkey_logo.png)](http://www.themonkeys.com.au/)

Monkeybones
===========
## The bones of a productive web project

Monkeybones is a [grunt-init][1] project template developed and used by [The Monkeys][2] that brings together the best
of our ideas about web development done well.

Based on your answers to a few questions about your project, Monkeybones will generate a project scaffold for you
complete with the mod cons we think are essential to doing the best possible work. Those include [h5bp][3],
[Modernizr][4], [Compass][5], [Grunt][6], [Laravel 4.0][7] and an acceptance testing framework built on [qunit][8].

Getting Started
---------------

## Step 1: Clone the project template

To make the project template available for use via grunt-init, you need to install it into your ~/.grunt-init/ directory (%USERPROFILE%\.grunt-init\ on Windows).

It's recommended that you use git to clone the template into that directory like so:

  ```
  git clone git@github.com:TheMonkeys/monkeybones.git ~/.grunt-init/monkeybones
  ```

## Step 2: Execute grunt-init

Execute the following commands:

  ```
  cd /path/to/project
  grunt-init monkeybones
  ```

Note that the template generates files in the current directory, so be sure to change to a new directory first. If there are any existing files in the current directory, grunt-init will fail with the message Warning: Existing files may be overwritten! Use –force to continue.

After you've answered all of grunt-init's questions and grunt-init has finished, you'll have a project structure ready to go in your current directory. Open the folder in your IDE and have a look!

Next, you'll need to download the build dependencies (development tools) by: bash ./init.sh

Because the project is currently an exact copy of the template, only the core dependencies used by all projects (like grunt, compass, a js unit testing framework, html5boilerplate scss and html) will be downloaded by init.sh at this stage.


## Step 3: Update init.sh

By default init.sh will only make changes if all executable dependencies have been met.

If your project need any extra executable other than the defaults just edit the file ./init.sh and edit this line:

  ```
  commandependencies=( php mysql npm grunt mocha docco testem compass composer )
  ```

by adding the new command to the end of the list, for example:

  ```
  commandependencies=( php mysql npm grunt mocha docco testem compass composer newexeccommand )
  ```

[1]: https://github.com/gruntjs/grunt-init
[2]: http://www.themonkeys.com.au/
[3]: http://html5boilerplate.com/
[4]: http://modernizr.com/
[5]: http://compass-style.org/
[6]: http://gruntjs.com/
[7]: http://four.laravel.com/
[8]: http://qunitjs.com/
