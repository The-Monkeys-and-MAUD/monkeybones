#!/bin/bash

# script directory
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# list executable commands separated by space
commandependencies=( php mysql npm grunt docco compass )

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
    
    # install npm modules
    echo "Installing npm dependencies.."
    npm install

    # run grunt default task
    echo "Running grunt default task.."
    grunt 

    # generate documentation
    echo "Generating documentation.."
    grunt docco
}


# commands to restore default state
function revertbuild() {
    : cleaning commands

    echo "Removing npm dependencies.."
    rm -rf ${DIR}/../node_modules
}

case "$1" in
    build|"")
        echo "Building.." 
        checkdependencies
        build
        echo "done"
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
