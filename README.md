[![MonkeyBones](http://monkeybones.io/img/logo_mb_small.png)][10]

Monkeybones
===========
## For the bones of a productive web project

Monkeybones is a [grunt-init][1] project template developed and used by
[The Monkeys][2] whenever it's time to set up a new project.

The Problem
-----------

There's been a seizemic shift in front end web development happening over the last few years. As [Rebecca Murphey blogged recently][9]:

  >...I think we’re seeing the emphasis shift from valuing trivia to valuing tools. There’s a new set of baseline skills required in order to be successful as a front-end developer, and developers who don’t meet this baseline are going to start feeling more and more left behind as those who are sharing their knowledge start to assume that certain things go without saying.

We're talking about everything from boilerplates like [h5bp][3] to frameworks like [Compass][5] and [Backbone.js][11] to build tools like [Grunt][6] to tesing frameworks like [Mocha][12].

The problem is that using these tools takes work and time. They come with a learning curve and they're all updated regularly. We have to spend time learning how to use them, keeping them up to date, managing dependencies and finding out about new tools that come online.

The temptation is not to use tools for small jobs or when developers join our team for a short stint. For a three day build, is it really feasible to make a new developer spend a day or two getting set up with a suite of tools and learning how to use them? In reality, it often isn't

The Solution
------------

MonkeyBones automates the setup of new projects, which are complete with all the tools and a system for getting new developers up to speed very quickly.

If you're setting up a new project, MonkeyBones will ask you questions about the tools you want to use, and will generate a project scaffold based on your answers.

Once the project is set up and checked into git, another developer can clone it and run a script to configure their environemtn and install the tools they need for the project.


Getting Started: Setting up a new MonkeyBones project
------------------------------------------------------

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

## Step 3: Check your project into git

You know how to do that, right?


Getting Other Developers Up To Speed
------------------------------------

This is where we talk about running init.sh



[1]: https://github.com/gruntjs/grunt-init
[2]: http://www.themonkeys.com.au/
[3]: http://html5boilerplate.com/
[4]: http://modernizr.com/
[5]: http://compass-style.org/
[6]: http://gruntjs.com/
[7]: http://four.laravel.com/
[8]: http://qunitjs.com/
[9]: http://rmurphey.com/blog/2012/04/12/a-baseline-for-front-end-developers/
[10]: http://monkeybones.io/
[11]: http://backbonejs.org/
[12]: http://visionmedia.github.io/mocha/



Monkeybones is created and maintained by:

[![The Monkeys](http://www.themonkeys.com.au/img/monkey_logo.png)](http://www.themonkeys.com.au/)
