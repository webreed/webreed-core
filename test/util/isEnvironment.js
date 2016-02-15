// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.


// Packages
import given from "mocha-testdata";
import should from "should";

// Project
import Environment from "../../src/Environment";
import isEnvironment from "../../src/util/isEnvironment";


describe("util/isEnvironment", function () {

  it("is a function", function () {
    return isEnvironment
      .should.be.a.Function();
  });

  given( undefined, null, 42, "foo" ).
  it("returns false when argument 'value' is not a webreed environment", function (value) {
    isEnvironment(value)
      .should.be.false();
  });

  it("returns true when argument 'value' is a webreed environment", function () {
    isEnvironment(new Environment())
      .should.be.true();
  });

});
