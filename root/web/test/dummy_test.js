//
//  Writting tests - nodeunite ( https://github.com/caolan/nodeunit )
//
//  ok(value, [message]) - Tests if value is a true value.
//  equal(actual, expected, [message]) - Tests shallow, coercive equality with the equal comparison operator ( == ).
//  notEqual(actual, expected, [message]) - Tests shallow, coercive non-equality with the not equal comparison operator ( != ).
//  deepEqual(actual, expected, [message]) - Tests for deep equality.
//  notDeepEqual(actual, expected, [message]) - Tests for any deep inequality.
//  strictEqual(actual, expected, [message]) - Tests strict equality, as determined by the strict equality operator ( === )
//  notStrictEqual(actual, expected, [message]) - Tests strict non-equality, as determined by the strict not equal operator ( !== )
//  throws(block, [error], [message]) - Expects block to throw an error.
//  doesNotThrow(block, [error], [message]) - Expects block not to throw an error.
//  ifError(value) - Tests if value is not a false value, throws if it is a true value. Useful when testing the first argument, error in callbacks.
//
//  expect(amount) - Specify how many assertions are expected to run within a test. Very useful for ensuring that all your callbacks and assertions are run.
//  done() - Finish the current test function, and move on to the next. ALL tests should call this!
//
var dummy = require('../js/app/dummy.js');
module.exports = {

    setUp: function( callback ) {   
        // setup initial values before any test, this will be called before each test.
        this._module = dummy.app.dummy; 

        callback();
    },

    tearDown: function( callback ) {
        // revert any value that was overwritten on test cases that used setup values.
        // this will be called after each test is finished.


        callback();
    },

    'Dummy test case': function( test ) {
        
        // number of expected tests to be run
        test.expect(4);

        // should return true
        test.ok(this._module.dummy() , "Dummy should return true");

        // this will test with the == operator
        test.equal(this._module.dummy(), true, "This should be true since 1 == true");

        // this will test with the !== operator
        test.notStrictEqual(this._module.dummy(), true, "This should be false since 1 !== true");

        // this will test with the === operator
        test.strictEqual(this._module.dummy(), 1, "This should be true since 1 === 1");

        test.done();
    }
};
