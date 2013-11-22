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
//
/* Sample backbone model test */

/*
 * '../app/model/samplemodel.js'
 *
 *
 * define(['backbone'], function(Backbone) {
 *   "use strict";
 *
 *   return Backbone.Model.extend({
 *
 *     defaults: function() {
 *       return {
 *         name: "Dummy",
 *         message: "Hello world from Backbone",
 *         speed: 100,
 *         size: 20,
 *         visible: false
 *       };
 *     },
 *
 *     initialize: function() {
 *       //console.log( this.defaults().name, ' Model created.' );
 *     }
 *
 *   });
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

    setUp: function (callback) {
        // setup initial values before any test, this will be called before each test.
        var self = this;
        // setup initial values before any test, this will be called before each test.
        requirejs.config({
            baseUrl: path.join(__dirname, '../js'),
            nodeRequire: require
        });

        requirejs(['app/model/samplemodel'],
            function (DummyModel) {
                self.DummyModel = DummyModel;
                callback();
            }
        );
    },

    tearDown: function (callback) {
        // revert any value that was overwritten on test cases that used setup values.
        // this will be called after each test is finished.

        callback();
    },

    'Dummy test case': function (test) {

        // number of expected tests to be run
        test.expect(6);

        var fixture = new this.DummyModel({ message: "bom dia" });

        // mock a function
        var fixture2 = nodemock.mock("get").takes("name").returns("Surprise");

        // When model is created with an argument should overwritte defaults
        test.equal(fixture.get("message"), "bom dia", "Model message should be 'bom dia'");

        // this will test with the == operator
        test.equal(fixture.get("visible"), 0, "Visible should be set to false by default");

        // should return true
        fixture.set("visible", true); // updating model value
        test.ok(fixture.get("visible"), "Visible property should be now set to true");

        // this will test with the !== operator
        test.notStrictEqual(fixture.get("name"), "undefined", "Name property should be defined by default");

        // this will test with the === operator
        test.strictEqual(fixture.get("size"), 20, "Default size should be 20");

        // should return 'Surpise'
        test.strictEqual(fixture2.get("name"), "Surprise", "Mocked fixture function get should return 'Surprise'");

        // this needs to be called after each test case
        test.done();
    }
};
