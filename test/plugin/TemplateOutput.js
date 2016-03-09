// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.


import given from "mocha-testdata";
import should from "should";

import {TemplateOutput} from "../../lib/plugin/TemplateEngine";


describe("TemplateOutput", function () {

  beforeEach(function () {
    this.templateOutput = new TemplateOutput();
  });


  it("is named 'TemplateOutput'", function () {
    TemplateOutput.name
      .should.be.eql("TemplateOutput");
  });


  describe("#constructor()", function () {

    it("is a function", function () {
      TemplateOutput.prototype.constructor
        .should.be.a.Function();
    });

  });


  describe("#isPaginated", function () {

    it("is `false` by default", function () {
      this.templateOutput.isPaginated
        .should.be.false();
    });

    given( undefined, null ).
    it("is `false` when #page is not defined", function (value) {
      this.templateOutput.page = value;
      this.templateOutput.isPaginated
        .should.be.false();
    });

    given( 42, "index" ).
    it("is `true` when #page is defined", function (value) {
      this.templateOutput.page = value;
      this.templateOutput.isPaginated
        .should.be.true();
    });

  });

  describe("#page", function () {

    it("is undefined by default", function () {
      should( this.templateOutput.page )
        .be.undefined();
    });

  });

  describe("#page=", function () {

    it("takes on assigned value", function () {
      this.templateOutput.page = 42;
      this.templateOutput.page
        .should.be.eql(42);
    });

  });

  describe("#body", function () {

    it("is an empty string by default", function () {
      this.templateOutput.body
        .should.be.eql("");
    });

  });

  describe("#body=", function () {

    it("takes on assigned value", function () {
      this.templateOutput.body = "abc";
      this.templateOutput.body
        .should.be.eql("abc");
    });

  });

});
