[![MonkeyBones](http://monkeybones.io/img/logo_mb_small.png)][10]



Monkeybones
===========

### For the bones of a productive web project

Monkeybones is a [grunt-init][1] template developed and used by
[The Monkeys][2] when it's time to set up a new project.

[From now on, when we say "MonkeyBones", we mean "grunt-init, using the monkeybones
template".]

MonkeyBones automates the setup of all the tools we like to use and makes it easier
for developers to checkout the new project and get up to speed quickly.

Maybe an example would be good.

While every project is different, some things are the same across all our projects. We always
start with [HTML5Boilerplate][3] and we always use [Compass][5]. One of the things Monkeybones
does for every new project is to split up the boilerplate CSS across the appropriate SASS
templates in Compass.

For a new project, MonkeyBones will ask you questions about the tools you want and will
generate a project scaffold based on your answers. 

Once the project is set up and checked into git, another developer can clone it
and run a script ("init.sh") to configure their environment and install the tools
they need for the project.


#### Background:

There has been a seizemic shift happening in front end web development over the last
few years. In a nutshell, ["we’re seeing the emphasis shift from valuing trivia to valuing
tools"][9].

The tools we're talking about are everything from boilerplates like [h5bp][3] to
frameworks like [Compass][5] and [Backbone.js][11] to build tools like [Grunt][6]
to tesing frameworks like [Mocha][12].

The problem is that using these tools takes work and time. They come with a learning
curve and they're updated regularly. We have to spend time learning how to use them,
keeping them up to date, managing dependencies and finding out about new tools that
come online.

That's fine if you're working on a few projects a year, but we do dozens of
projects every year and some of them are very small. The temptation is to not
use all the tools for small jobs especially with new developers. For a three
day front end build, is it really feasible for a new developer to spend the
time getting up and running with a suite of unfamiliar tools? Unfortunately
for the developers who have to maintain or extend that project later, it usually
isn't. But with MonkeyBones, it is.


Getting MonkeyBones
-------------------

You install MonkeyBones once on your development machine and thereafter you can use it to start new project.

#### Step 1: Make sure you have what you need to run MonkeyBones

MonkeyBones uses [grunt][1], which uses [node][13] and the node package manager [npm][14].

If you don't already have them installed, find the instructions for your platform and install them in this order:

[NodeJS][13] - npm is bundled with NodeJS
[Grunt](http://gruntjs.com/getting-started)


#### Step 2: Clone the MonkeyBones repo from GitHub

To make the project template available for use via grunt-init, you need to install it into your ~/.grunt-init/ directory (%USERPROFILE%\.grunt-init\ on Windows).

The simplest approach is to use git to clone the template into that directory, ie:

  ```
  git clone git@github.com:TheMonkeys/monkeybones.git ~/.grunt-init/monkeybones
  ```

#### Step 3: There isn't really a step 3

That's it, MonkeyBones is all set up. To make sure, have a look in your .grunt-init directory:

```
ls ~/.grunt-init/
```

You should see a directory called "monkeybones". There's a bunch of stuff in there which you can look at one day when you have to look busy. For now, just rest assured that the installation of MonkeyBones has all gone according to plan.




Setting up a new web project with MonkeyBones
---------------------------------------------

#### Step 1: Make a new directory for your project

MonkeyBones will generate the files in the current directory, so be sure to make a new directory and then cd into it.

  ```
  mkdir MyProject
  cd /path/to/MyProject
  ```

#### Step 2: Run grunt-init, specifying MonkeyBones as the project template

  ```
  grunt-init monkeybones
  ```

You'll see some standard messages eg (at the time of writing this):

```
Running "init:monkeybones" (init) task
This task will create one or more files in the current directory, based on the
environment and the answers to a few questions. Note that answering "?" to any
question will show question-specific help and answering "none" to most questions
will leave its value blank.

"monkeybones" template notes:
A web project template with a ready-made Gruntfile to give you javascript
minification, Sass compilation, unit testing and more, as well as optional
Laravel 4.0, backbone.js and/or acceptance testing framework.
Using npm install to get template script dependencies.
```

Note that if there are any existing files in the current directory, grunt-init will fail and you will see this message:

```
Warning: Existing files may be overwritten! Use –force to continue.
```

If that happens, start again from Step 1.

If all is going according to plan, you'll see another message:

```
"monkeybones" template notes:
A web project template with a ready-made Gruntfile to give you javascript
minification, Sass compilation, unit testing and more, as well as optional
Laravel 4.0, backbone.js and/or acceptance testing framework.
```
And a message to let you know that npm is about to scour the internetz for the packages MonkeyBones needs:

```
Using npm install to get template script dependencies.
```

Following that there'll be a long list of packages, like:

```
npm http GET https://registry.npmjs.org/unzip/0.1.6
npm http GET https://registry.npmjs.org/request/2.16.6
npm http GET https://registry.npmjs.org/chmodr/0.1.0
npm http GET https://registry.npmjs.org/pipette/0.9.3
```
etc.

MonkeyBones will then start asking you questions and waiting for answers before continuing:

```
Please answer the following:
[?] Project name (MyProject)
```

MonkeyBones takes guesses and provides you with default answers. Pressing return without answering a question will automatically choose the default option. If you don't like the default, type in another answer and press return.

Most of the questions should be pretty self explanatory. One thing that's worth noting is that
MonkeyBones assumes that you're using git (and suggests a repo name):

```
[?] Project git repository (git://github.com/presentation/MyProject.git) 
```

You should probably make sure that the repo you specify exists when you get to that point.

When you get to this one, if you don't have a strong opinion about that then the correct answer is probably yes (which is the default):

```
[?] Do you want me to automatically download dependencies and build after setting up your project? (Y/n)
```
If you amswer "Y", MonkeyBones will run the "init.sh" script automatically after the project is set up. This script checks that you have all the system dependencies that are required to run the tools that MonkeyBones has just downloaded. If you choose not to run init.sh automatically, you should run it manually:

```
bash ./init.sh
```

Once you're done with all the questions, MonkeyBones will start setting up your new project based on the answers you gave. It will go off into the internetz and get the packages you need, install them and maybe do a bit of jiggery and pokery to integrate into your project. You'll get progress updates, eg:

```
Writing .gitattributes...OK
Writing .gitignore...OK
Writing README.md...OK
```

And so on.

#### Step 3: Tidying up

There are probably a few things that you'll want to tweak before you and others start working on your new project.

At the very least, you'll check the new project into Git, eg:

```
git init
git remote add origin git://github.com/presentation/MyProject.git
```


Working on a MonkeyBones project
--------------------------------

There are two ways that you might come into posession of a project that has been set up with MonkeyBones - either you set one up using MonkeyBones, or you cloned a git repo. Either way, once you have it, working on it is the same.

Your project will obviously need to be served up using whatever webserver you usually use in your
local dev environment so you'll need to know which folder to set as your webroot. You might also
be new to some of the tools (like Grunt), so it's worth clarifying what's what.

If you open the project directory in your IDE, you'll see different folders and files depending
on the tools you opted for. A basic front end project might look something like the image below
if you're using Sublime.

SCREENSHOT: Showing top level directories, "build", "prototype" and "deployment"

As you can see, on the top level there are three directories: "build", "prototype" and "deployment".
We use "prototype" for any early prototypes of the project so that they're in the same repo as the
project. The "deployment" directory is used for our deployment script, part of our CI process.
You can ignore both folders if you like - or delete them.

The "build" folder is where your project files live:

SCREENSHOT: Showing the build directory open in an IDE

Basically, you work in the "/build/web" directory and Grunt compiles everything into the "/build/public" directory.

So your webroot is the "/build/public" directory.

Before you start working, especially if you didn't set up the project, run init.sh to make sure that you have everything you need installed on your machine.

```
bash ./init.sh
```

If you don't have what you need, you'll soon know about it.



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
[13]: http://nodejs.org/
[14]: https://npmjs.org/
[15]: http://getcomposer.org/doc/00-intro.md



Monkeybones is created and maintained by:

[![The Monkeys](http://www.themonkeys.com.au/img/monkey_logo.png)](http://www.themonkeys.com.au/)
