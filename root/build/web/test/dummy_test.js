// # Writting tests
// #### [nodeunite](https://github.com/caolan/nodeunit "Node unit on github")
//
// -    **ok**(value, [message])     
// Tests if value is a true value.
//  
// -    **equal**(actual, expected, [message])  
// Tests shallow, coercive equality with the equal comparison operator ( == ).
//
// -    **notEqual**(actual, expected, [message])  
// Tests shallow, coercive non-equality with the not equal comparison operator ( != ).
//
// -    **deepEqual**(actual, expected, [message])  
// Tests for deep equality. 
//
// -    **notDeepEqual**(actual, expected, [message])  
// Tests for any deep inequality.
//
// -    **strictEqual**(actual, expected, [message])   
// Tests strict equality, as determined by the strict equality operator ( === ) 
//
// -    **notStrictEqual**(actual, expected, [message])    
// Tests strict non-equality, as determined by the strict not equal operator ( !== )    
//
// -    **throws**(block, [error], [message])    
// Expects block to throw an error.  
//
// -    **doesNotThrow**(block, [error], [message])    
// Expects block not to throw an error. 
//
// -    **ifError**(value)  
// Tests if value is not a false value, throws if it is a true value. Useful when testing the first argument, error in callbacks.
//
// -    **expect**(amount)  
// Specify how many assertions are expected to run within a test. Very useful for ensuring that all your callbacks and assertions are run.
//
// -    **done**()  
// Finish the current test function, and move on to the next. ALL tests should call this!
//
// ## Mocking values ##
// #### [nodemock](https://github.com/arunoda/nodemock "Nodemock for mocking unit tests")
// >    *Nodemock* will be used as a library     
//      to aid on mocking for unit tests.
// 
// * * *
/* Sample dummy test */

/*
 * '../js/app/dummy.js'
 *
 * define(function () {
 *   'use strict';
 *
 *   return function () {
 *     return 1;
 *   };
 * });
 *
 */

//

var path = require("path");

// allow to create mocks
var nodemock = require("nodemock");

// window depedencies
var requirejs = require("requirejs");

module.exports = {

    setUp: function( callback ) {
        var self = this;
        // setup initial values before any test, this will be called before each test.
        requirejs.config({
            baseUrl: path.join(__dirname, '../js'),
            nodeRequire: require
        });

        requirejs(['app/dummy'],
            function (dummy) {
                self.dummy = dummy;
                callback();
            }
        );
    },

    tearDown: function( callback ) { 
        // revert any value that was overwritten on test cases that used setup values.
        // this will be called after each test is finished.

        callback();
    },  

    'Dummy test case': function( test ) { 

        // create a mocked function that accepts only '10, [10, 20, 30]' as arguments and returns true
        var mocked = nodemock.mock("mockedvalue").takes(10, [10, 20, 30]).returns(true);

        // number of expected tests to be run
        test.expect(5);

        // should return true
        test.ok(this.dummy() , "Dummy should return true");

        // this will test with the == operator
        test.equal(this.dummy(), true, "This should be true since 1 == true");

        // this will test with the !== operator
        test.notStrictEqual(this.dummy(), true, "This should be false since 1 !== true");

        // this will test with the === operator
        test.strictEqual(this.dummy(), 1, "This should be true since 1 === 1");

        // should return true
        test.ok(mocked.mockedvalue( 10, [10, 20, 30 ] ) , "mocked should return true");

        // this needs to be called after each test case
        test.done();
    }   
};
