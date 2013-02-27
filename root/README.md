![The Monkeys](http://www.themonkeys.com.au/img/monkey_logo.png)

Your Project Title Here
=======================

Your project summary here

Documentation
-------------

Link to your project's Monkeys wiki page here.

Requirements
------------
See [Setting up a Developer Machine][1] in the Monkeys wiki for the basic prerequisites you'll need to work on this
project; then follow the instructions in [Joining a project][2].

In particular, if you didn't have the grunt hook enabled on your machine then you'll need to run init.sh manually:

    cd build/
    ./bin/init.sh

[1]: https://wiki.monkeylabs.com.au/doku.php?id=howtos:development_procedures:setting_up_a_developer_machine
[2]: https://wiki.monkeylabs.com.au/doku.php?id=howtos:development_procedures:joining_a_project

Building
--------
In development, run the following command to have the grunt watcher build your sass and js as you work:

    grunt dev

Prior to checkin, run a full grunt build to ensure the linter is happy with your code and all tests pass:

    grunt

Building a Release
------------------
The deployment server should run the following to build the js and css prior to deploying to staging or prod:

    cd build/
    ./bin/init.sh

