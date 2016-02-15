// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.


// Packages
import given from "mocha-testdata";
import should from "should";

// Project
import Environment from "../../src/Environment";
import buildOutput from "../../src/behaviors/buildOutput";


describe("behaviors/buildOutput", function () {

  beforeEach(function () {
    this.env = new Environment();
  });

  it("is a function", function () {
    buildOutput
      .should.be.a.Function();
  });

  it("throws error when argument 'env' is not an object", function () {
    (() => buildOutput(null))
      .should.throw("argument 'env' must be a webreed environment");
  });

  it("returns a promise", function () {
    buildOutput(this.env)
      .should.be.a.Promise();
  });

  it("fulfills its promise", function () {
    return buildOutput(this.env)
      .should.be.fulfilled();
  });

});
