#!/bin/bash

# list executable commands separated by space
commandependencies=( php mysql npm grunt mocha docco testem compass )


# show success message
function msgsuccess() {
    echo "$(tput setaf 2)success..$(tput sgr0)";
}

# show fail message and stop execution
function msgfail() {
    echo -e >&2 "$(tput setaf 1)fail..$(tput sgr0)"; exit 1;
}

# check executable is on env path
function checkcommand() {
    command -v $1 >/dev/null 2>&1 || { msgfail; }
}

# check for project dependencies
function checkdependencies() {
    for i in "${commandependencies[@]}"
    do
        echo "Checking for executable $i..."
        checkcommand $i
        msgsuccess
    done
}

# Setup building process
function build() {
    : building commands
}


# commands to restore default state
function revertbuild() {
    : cleaning commands
}

case "$1" in
    build|"")
        echo "Building.." 
        checkdependencies
        build
    ;;
    rebuild)
        echo "Cleaning.." 
        revertbuild
        build
    ;;
    check)
        echo "Checking for dependencies.."
        checkdependencies
    ;;
esac
