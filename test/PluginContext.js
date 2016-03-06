// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.


// Packages
import given from "mocha-testdata";
import should from "should";

// Project
import PluginContext from "../src/PluginContext";


describe("PluginContext", function () {

  beforeEach(function () {
    this.pluginContext = new PluginContext("bar");
  });


  it("is named 'PluginContext'", function () {
    PluginContext.name
      .should.be.eql("PluginContext");
  });


  describe("#constructor(name, [options])", function () {

    it("is a function", function () {
      PluginContext.prototype.constructor
        .should.be.a.Function();
    });

    given( undefined, null, 42 ).
    it("throws error when argument 'name' is not a string", function (name) {
      (() => new PluginContext(name))
        .should.throw("argument 'name' must be a string");
    });

    it("throws error when argument 'name' is an empty string", function () {
      let name = "";
      (() => new PluginContext(name))
        .should.throw("argument 'name' must be a non-empty string");
    });

    given( 42, "" ).
    it("throws error when argument 'options' is not an object", function (options) {
      (() => new PluginContext("foo", options))
        .should.throw("argument 'options' must be an object");
    });

  });


  describe("#name", function () {

    it("is initialized from argument 'name' of constructor", function () {
      this.pluginContext.name
        .should.be.eql("bar");
    });

  });

  describe("#name=", function () {

    given( undefined, null, 42 ).
    it("throws error when argument 'value' is not a string", function (value) {
      (() => this.pluginContext.name = value)
        .should.throw("argument 'value' must be a string");
    });

    it("throws error when argument 'value' is an empty string", function () {
      let value = "";
      (() => this.pluginContext.name = value)
        .should.throw("argument 'value' must be a non-empty string");
    });

    it("takes on the assigned value", function () {
      this.pluginContext.name = "bar";
      this.pluginContext.name
        .should.be.eql("bar");
    });

  });

  describe("#options", function () {

    given( undefined, null ).
    it("is an empty object by default", function (options) {
      let newPluginContext = new PluginContext("foo", options);
      newPluginContext.options
        .should.be.eql({ });
    });

    it("is initialized from argument 'options' of constructor", function () {
      let newPluginContext = new PluginContext("foo", { a: 42 });
      newPluginContext.options
        .should.be.eql({ a: 42 });
    });

  });

  describe("#options=", function () {

    given( 42, "" ).
    it("throws error when argument 'value' is specified but is not an object", function (value) {
      (() => this.pluginContext.options = value)
        .should.throw("argument 'value' must be an object");
    });

    it("takes on the assigned value", function () {
      this.pluginContext.options = { a: 42 };
      this.pluginContext.options
        .should.be.eql({ a: 42 });
    });

    given( undefined, null ).
    it("assumes empty object when argument 'value' is `undefined` or `null`", function (value) {
      this.pluginContext.options = value;
      this.pluginContext.options
        .should.be.eql({ });
    });

  });

});
