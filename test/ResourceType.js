// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.


// Packages
import given from "mocha-testdata";
import should from "should";

// Project
import PluginContext from "../src/PluginContext";
import ResourceType from "../src/ResourceType";


describe("ResourceType", function () {

  beforeEach(function () {
    this.resourceType = new ResourceType();
  });


  it("is named 'ResourceType'", function () {
    ResourceType.name
      .should.be.eql("ResourceType");
  });


  describe("#constructor()", function () {

    it("is a function", function () {
      ResourceType.prototype.constructor
        .should.be.a.Function();
    });

  });


  describe("#conversions", function () {

    it("is empty by default", function () {
      this.resourceType.conversions
        .should.be.eql({ });
    });

  });

  describe("#conversions=", function () {

    given( undefined, null, 42, "", [ ] ).
    it("throws error when argument 'value' is not an object", function (value) {
      (() => this.resourceType.conversions = value)
        .should.throw("argument 'value' must be an object");
    });

    given(
      { ".html": undefined },
      { ".html": null },
      { ".html": 42 }
    ).
    it("throws error when argument 'value' has a property value that is not iterable", function (value) {
      (() => this.resourceType.conversions = value)
        .should.throw("argument 'value[\".html\"]' must be iterable");
    });

    it("throws error when argument 'value' has a property value that is not an iterable of `PluginContext`", function () {
      (() => this.resourceType.conversions = { ".html": [ 42 ] })
        .should.throw("argument 'value[\".html\"]' must be an iterable of zero-or-more `PluginContext` values");
    });

    given(
      { },
      { ".html": [ ] },
      { ".html": [ new PluginContext("foo") ] },
      { ".html": [ new PluginContext("foo"), new PluginContext("bar") ] }
    ).
    it("takes on assigned value", function (value) {
      this.resourceType.conversions = value;
      this.resourceType.conversions
        .should.be.eql(value);
    });

  });

  describe("#custom", function () {

    it("is read-only", function () {
      (() => this.resourceType.custom = 42)
        .should.throw();
    });

    it("is empty object by default", function () {
      this.resourceType.custom
        .should.be.eql({ });
    });

  });

  describe("#defaultTargetExtension", function () {

    it("is `null` by default", function () {
      should( this.resourceType.defaultTargetExtension )
        .be.null();
    });

  });

  describe("#defaultTargetExtension=", function () {

    given( undefined, 42 ).
    it("throws error when argument 'value' is not a string", function (value) {
      (() => this.resourceType.defaultTargetExtension = value)
        .should.throw("argument 'value' must be a string");
    });

    it("throws error when argument 'value' is an empty string", function () {
      let value = "";
      (() => this.resourceType.defaultTargetExtension = value)
        .should.throw("argument 'value' must be a non-empty string");
    });

    it("throws error when argument 'value' has the value '.'", function () {
      (() => this.resourceType.defaultTargetExtension = ".")
        .should.throw("argument 'value' must not be '.'");
    });

    given( null, ".html" ).
    it("takes on assigned value", function (value) {
      this.resourceType.defaultTargetExtension = value;
      should( this.resourceType.defaultTargetExtension )
        .be.eql(value);
    });

  });

  describe("#generator", function () {

    it("is `null` by default", function () {
      should(this.resourceType.generator)
        .be.null();
    });

  });

  describe("#generator=", function () {

    given( undefined, 42, "", { }, [ ] ).
    it("throws error when argument 'value' is non-null and is not a `PluginContext`", function (value) {
      (() => this.resourceType.generator = value)
        .should.throw("argument 'value' must be `null` or a `PluginContext`");
    });

    it("takes on a value of `null`", function () {
      this.resourceType.generator = null;
      should(this.resourceType.generator)
        .be.null();
    });

    it("takes on the assigned generator", function () {
      let generator = new PluginContext("foo");
      this.resourceType.generator = generator;
      this.resourceType.generator
        .should.be.exactly(generator);
    });

  });

  describe("#handler", function () {

    it("is `null` by default", function () {
      should(this.resourceType.handler)
        .be.null();
    });

  });

  describe("#handler=", function () {

    given( undefined, 42, "", { }, [ ] ).
    it("throws error when argument 'value' is non-null and is not a `PluginContext`", function (value) {
      (() => this.resourceType.handler = value)
        .should.throw("argument 'value' must be `null` or a `PluginContext`");
    });

    it("takes on a value of `null`", function () {
      this.resourceType.handler = null;
      should(this.resourceType.handler)
        .be.null();
    });

    it("takes on the assigned handler", function () {
      let handler = new PluginContext("foo");
      this.resourceType.handler = handler;
      this.resourceType.handler
        .should.be.exactly(handler);
    });

  });

  describe("#mode", function () {

    it("is 'text' by default", function () {
      this.resourceType.mode
        .should.be.eql("text");
    });

  });

  describe("#mode=", function () {

    given( undefined, null, 42, { }, [ ] ).
    it("throws error when argument 'value' is not a string", function (value) {
      (() => this.resourceType.mode = value)
        .should.throw("argument 'value' must be a string");
    });

    it("throws error when argument 'value' is not a non-empty string", function () {
      let value = "";
      (() => this.resourceType.mode = value)
        .should.throw("argument 'value' must be a non-empty string");
    });

    it("takes on the assigned mode", function () {
      this.resourceType.mode = "foo";
      this.resourceType.mode
        .should.be.eql("foo");
    });

  });

  describe("#parseFrontmatter", function () {

    it("is `true` by default", function () {
      this.resourceType.parseFrontmatter
        .should.be.true();
    });

  });

  describe("#parseFrontmatter=", function () {

    given( undefined, 42, "", { }, [ ] ).
    it("throws error when argument 'value' is not boolean", function (value) {
      (() => this.resourceType.parseFrontmatter = value)
        .should.throw("argument 'value' must be a boolean value");
    });

    it("takes on a value of `false`", function () {
      this.resourceType.parseFrontmatter = false;
      this.resourceType.parseFrontmatter
        .should.be.false();
    });

    it("takes on a value of `true`", function () {
      this.resourceType.parseFrontmatter = false;
      this.resourceType.parseFrontmatter = true;
      this.resourceType.parseFrontmatter
        .should.be.true();
    });

  });

  describe("#process", function () {

    it("is empty by default", function () {
      this.resourceType.process
        .should.be.eql([ ]);
    });

  });

  describe("#process=", function () {

    given( undefined, null, 42 ).
    it("throws error when argument 'value' is not iterable", function (value) {
      (() => this.resourceType.process = value)
        .should.throw("argument 'value' must be iterable");
    });

    it("throws error when argument 'value' is not an iterable of `PluginContext`", function () {
      (() => this.resourceType.process = [ 42 ])
        .should.throw("argument 'value' must be an iterable of zero-or-more `PluginContext` values");
    });

    given(
      [  [ ]                                                     ],
      [  [ new PluginContext("foo") ]                            ],
      [  [ new PluginContext("foo"), new PluginContext("bar") ]  ]
    ).
    it("takes on assigned value", function (value) {
      this.resourceType.process = value;
      this.resourceType.process
        .should.be.eql(value);
    });

  });

  describe("#templateEngine", function () {

    it("is `null` by default", function () {
      should(this.resourceType.templateEngine)
        .be.null();
    });

  });

  describe("#templateEngine=", function () {

    given( undefined, 42, "", { }, [ ] ).
    it("throws error when argument 'value' is non-null and is not a `PluginContext`", function (value) {
      (() => this.resourceType.templateEngine = value)
        .should.throw("argument 'value' must be `null` or a `PluginContext`");
    });

    it("takes on a value of `null`", function () {
      this.resourceType.templateEngine = null;
      should(this.resourceType.templateEngine)
        .be.null();
    });

    it("takes on the assigned template engine", function () {
      let templateEngine = new PluginContext("foo");
      this.resourceType.templateEngine = templateEngine;
      this.resourceType.templateEngine
        .should.be.exactly(templateEngine);
    });

  });

});
