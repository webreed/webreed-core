// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.


// Packages
import given from "mocha-testdata";
import should from "should";

// Project
import ContentType from "../src/ContentType";
import PluginContext from "../src/PluginContext";


describe("ContentType", function () {

  beforeEach(function () {
    this.contentType = new ContentType();
  });


  it("is named 'ContentType'", function () {
    ContentType.name
      .should.be.eql("ContentType");
  });


  describe("#constructor()", function () {

    it("is a function", function () {
      ContentType.prototype.constructor
        .should.be.a.Function();
    });

  });


  describe("#custom", function () {

    it("is read-only", function () {
      (() => this.contentType.custom = 42)
        .should.throw();
    });

    it("is empty object by default", function () {
      this.contentType.custom
        .should.be.eql({ });
    });

  });

  describe("#defaultTargetExtension", function () {

    it("is `null` by default", function () {
      should( this.contentType.defaultTargetExtension )
        .be.null();
    });

  });

  describe("#defaultTargetExtension=", function () {

    given( undefined, 42, "" ).
    it("throws error when argument 'value' is a not `null` and is not a non-empty string", function (value) {
      (() => this.contentType.defaultTargetExtension = value)
        .should.throw("argument 'value' must be `null` or a non-empty string");
    });

    it("throws error when argument 'value' has the value '.'", function () {
      (() => this.contentType.defaultTargetExtension = ".")
        .should.throw("argument 'value' must not be '.'");
    });

    given( null, ".html" ).
    it("takes on assigned value", function (value) {
      this.contentType.defaultTargetExtension = value;
      should( this.contentType.defaultTargetExtension )
        .be.eql(value);
    });

  });

  describe("#generator", function () {

    it("is `null` by default", function () {
      should(this.contentType.generator)
        .be.null();
    });

  });

  describe("#generator=", function () {

    given( undefined, 42, "", { }, [ ] ).
    it("throws error when argument 'value' is non-null and is not a `PluginContext`", function (value) {
      (() => this.contentType.generator = value)
        .should.throw("argument 'value' must be `null` or a `PluginContext`");
    });

    it("takes on a value of `null`", function () {
      this.contentType.generator = null;
      should(this.contentType.generator)
        .be.null();
    });

    it("takes on the assigned generator", function () {
      let generator = new PluginContext("foo");
      this.contentType.generator = generator;
      this.contentType.generator
        .should.be.exactly(generator);
    });

  });

  describe("#handler", function () {

    it("is `null` by default", function () {
      should(this.contentType.handler)
        .be.null();
    });

  });

  describe("#handler=", function () {

    given( undefined, 42, "", { }, [ ] ).
    it("throws error when argument 'value' is non-null and is not a `PluginContext`", function (value) {
      (() => this.contentType.handler = value)
        .should.throw("argument 'value' must be `null` or a `PluginContext`");
    });

    it("takes on a value of `null`", function () {
      this.contentType.handler = null;
      should(this.contentType.handler)
        .be.null();
    });

    it("takes on the assigned handler", function () {
      let handler = new PluginContext("foo");
      this.contentType.handler = handler;
      this.contentType.handler
        .should.be.exactly(handler);
    });

  });

  describe("#mode=", function () {

    given( undefined, 42, "", { }, [ ] ).
    it("throws error when argument 'value' is non-null and is not a `PluginContext`", function (value) {
      (() => this.contentType.mode = value)
        .should.throw("argument 'value' must be `null` or a `PluginContext`");
    });

    it("takes on a value of `null`", function () {
      this.contentType.mode = null;
      should(this.contentType.mode)
        .be.null();
    });

    it("takes on the assigned mode", function () {
      let mode = new PluginContext("foo");
      this.contentType.mode = mode;
      this.contentType.mode
        .should.be.exactly(mode);
    });

  });

  describe("#parseFrontmatter", function () {

    it("is `true` by default", function () {
      this.contentType.parseFrontmatter
        .should.be.true();
    });

  });

  describe("#parseFrontmatter=", function () {

    given( undefined, 42, "", { }, [ ] ).
    it("throws error when argument 'value' is not boolean", function (value) {
      (() => this.contentType.parseFrontmatter = value)
        .should.throw("argument 'value' must be `true` or `false`");
    });

    it("takes on a value of `false`", function () {
      this.contentType.parseFrontmatter = false;
      this.contentType.parseFrontmatter
        .should.be.false();
    });

    it("takes on a value of `true`", function () {
      this.contentType.parseFrontmatter = false;
      this.contentType.parseFrontmatter = true;
      this.contentType.parseFrontmatter
        .should.be.true();
    });

  });

  describe("#templateEngine", function () {

    it("is `null` by default", function () {
      should(this.contentType.templateEngine)
        .be.null();
    });

  });

  describe("#templateEngine=", function () {

    given( undefined, 42, "", { }, [ ] ).
    it("throws error when argument 'value' is non-null and is not a `PluginContext`", function (value) {
      (() => this.contentType.templateEngine = value)
        .should.throw("argument 'value' must be `null` or a `PluginContext`");
    });

    it("takes on a value of `null`", function () {
      this.contentType.templateEngine = null;
      should(this.contentType.templateEngine)
        .be.null();
    });

    it("takes on the assigned template engine", function () {
      let templateEngine = new PluginContext("foo");
      this.contentType.templateEngine = templateEngine;
      this.contentType.templateEngine
        .should.be.exactly(templateEngine);
    });

  });

  describe("#transforms", function () {

    it("is read-only", function () {
      (() => this.contentType.transforms = 42)
        .should.throw();
    });

    it("is empty by default", function () {
      this.contentType.transforms
        .should.have.properties({ preprocess: [ ], conversions: { }, postprocess: [ ] });
    });

    describe(".preprocess=", function () {

      given( undefined, null, 42 ).
      it("throws error when argument 'value' is not iterable", function (value) {
        (() => this.contentType.transforms.preprocess = value)
          .should.throw("argument 'value' must be iterable");
      });

      it("throws error when argument 'value' is not an iterable of `PluginContext`", function () {
        (() => this.contentType.transforms.preprocess = [ 42 ])
          .should.throw("argument 'value' must be an iterable of zero-or-more `PluginContext` values");
      });

      given(
        [  [ ]                                                     ],
        [  [ new PluginContext("foo") ]                            ],
        [  [ new PluginContext("foo"), new PluginContext("bar") ]  ]
      ).
      it("takes on assigned value", function (value) {
        this.contentType.transforms.preprocess = value;
        this.contentType.transforms.preprocess
          .should.be.eql(value);
      });

    });

    describe(".conversions=", function () {

      given( undefined, null, 42, "", [ ] ).
      it("throws error when argument 'value' is not an object", function (value) {
        (() => this.contentType.transforms.conversions = value)
          .should.throw("argument 'value' must be an object");
      });

      given(
        { ".html": undefined },
        { ".html": null },
        { ".html": 42 }
      ).
      it("throws error when argument 'value' has a property value that is not iterable", function (value) {
        (() => this.contentType.transforms.conversions = value)
          .should.throw("argument 'value[\".html\"]' must be iterable");
      });

      it("throws error when argument 'value' has a property value that is not an iterable of `PluginContext`", function () {
        (() => this.contentType.transforms.conversions = { ".html": [ 42 ] })
          .should.throw("argument 'value[\".html\"]' must be an iterable of zero-or-more `PluginContext` values");
      });

      given(
        { },
        { ".html": [ ] },
        { ".html": [ new PluginContext("foo") ] },
        { ".html": [ new PluginContext("foo"), new PluginContext("bar") ] }
      ).
      it("takes on assigned value", function (value) {
        this.contentType.transforms.conversions = value;
        this.contentType.transforms.conversions
          .should.be.eql(value);
      });

    });

    describe(".postprocess=", function () {

      given( undefined, null, 42 ).
      it("throws error when argument 'value' is not iterable", function (value) {
        (() => this.contentType.transforms.postprocess = value)
          .should.throw("argument 'value' must be iterable");
      });

      it("throws error when argument 'value' is not an iterable of `PluginContext`", function () {
        (() => this.contentType.transforms.postprocess = [ 42 ])
          .should.throw("argument 'value' must be an iterable of zero-or-more `PluginContext` values");
      });

      given(
        [  [ ]                                                     ],
        [  [ new PluginContext("foo") ]                            ],
        [  [ new PluginContext("foo"), new PluginContext("bar") ]  ]
      ).
      it("takes on assigned value", function (value) {
        this.contentType.transforms.postprocess = value;
        this.contentType.transforms.postprocess
          .should.be.eql(value);
      });

    });

  });

});
