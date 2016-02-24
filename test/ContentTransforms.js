// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.


// Packages
import given from "mocha-testdata";
import should from "should";

// Project
import ContentTransforms from "../src/ContentTransforms";
import PluginContext from "../src/PluginContext";


describe("ContentTransforms", function () {

  beforeEach(function () {
    this.contentTransforms = new ContentTransforms();
  });


  describe("#constructor()", function () {

    it("is a function", function () {
      ContentTransforms.prototype.constructor
        .should.be.a.Function();
    });

  });


  describe("#process", function () {

    it("is empty by default", function () {
      this.contentTransforms.process
        .should.be.eql([ ]);
    });

  });

  describe("#process=", function () {

    given( undefined, null, 42 ).
    it("throws error when argument 'value' is not iterable", function (value) {
      (() => this.contentTransforms.process = value)
        .should.throw("argument 'value' must be iterable");
    });

    it("throws error when argument 'value' is not an iterable of `PluginContext`", function () {
      (() => this.contentTransforms.process = [ 42 ])
        .should.throw("argument 'value' must be an iterable of zero-or-more `PluginContext` values");
    });

    given(
      [  [ ]                                                     ],
      [  [ new PluginContext("foo") ]                            ],
      [  [ new PluginContext("foo"), new PluginContext("bar") ]  ]
    ).
    it("takes on assigned value", function (value) {
      this.contentTransforms.process = value;
      this.contentTransforms.process
        .should.be.eql(value);
    });

  });

  describe("#conversions", function () {

    it("is empty by default", function () {
      this.contentTransforms.conversions
        .should.be.eql({ });
    });

  });

  describe("#conversions=", function () {

    given( undefined, null, 42, "", [ ] ).
    it("throws error when argument 'value' is not an object", function (value) {
      (() => this.contentTransforms.conversions = value)
        .should.throw("argument 'value' must be an object");
    });

    given(
      { ".html": undefined },
      { ".html": null },
      { ".html": 42 }
    ).
    it("throws error when argument 'value' has a property value that is not iterable", function (value) {
      (() => this.contentTransforms.conversions = value)
        .should.throw("argument 'value[\".html\"]' must be iterable");
    });

    it("throws error when argument 'value' has a property value that is not an iterable of `PluginContext`", function () {
      (() => this.contentTransforms.conversions = { ".html": [ 42 ] })
        .should.throw("argument 'value[\".html\"]' must be an iterable of zero-or-more `PluginContext` values");
    });

    given(
      { },
      { ".html": [ ] },
      { ".html": [ new PluginContext("foo") ] },
      { ".html": [ new PluginContext("foo"), new PluginContext("bar") ] }
    ).
    it("takes on assigned value", function (value) {
      this.contentTransforms.conversions = value;
      this.contentTransforms.conversions
        .should.be.eql(value);
    });

  });

  describe("#postprocess", function () {

    it("is empty by default", function () {
      this.contentTransforms.postprocess
        .should.be.eql([ ]);
    });

  });

  describe("#postprocess=", function () {

    given( undefined, null, 42 ).
    it("throws error when argument 'value' is not iterable", function (value) {
      (() => this.contentTransforms.postprocess = value)
        .should.throw("argument 'value' must be iterable");
    });

    it("throws error when argument 'value' is not an iterable of `PluginContext`", function () {
      (() => this.contentTransforms.postprocess = [ 42 ])
        .should.throw("argument 'value' must be an iterable of zero-or-more `PluginContext` values");
    });

    given(
      [  [ ]                                                     ],
      [  [ new PluginContext("foo") ]                            ],
      [  [ new PluginContext("foo"), new PluginContext("bar") ]  ]
    ).
    it("takes on assigned value", function (value) {
      this.contentTransforms.postprocess = value;
      this.contentTransforms.postprocess
        .should.be.eql(value);
    });

  });

});
