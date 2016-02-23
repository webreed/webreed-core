// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.


// Packages
import given from "mocha-testdata";
import should from "should";

// Project
import Environment from "../../src/Environment";
import build from "../../src/behaviors/build";


describe("behaviors/build", function () {

  beforeEach(function () {
    this.env = new Environment();
  });


  it("is a function", function () {
    build
      .should.be.a.Function();
  });

  it("throws error when argument 'env' is not a webreed environment", function () {
    (() => build(null))
      .should.throw("argument 'env' must be a webreed environment");
  });

  it("returns a promise", function () {
    build(this.env)
      .should.be.a.Promise();
  });

  it("fulfills its promise", function () {
    return build(this.env)
      .should.be.fulfilled();
  });

});
