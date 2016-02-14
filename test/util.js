// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.

import given from "mocha-testdata";
import should from "should";

import Environment from "../src/Environment";
import * as util from "../src/util";

describe("util", function () {

  describe("#isEnvironment", function () {

    it("is a function", function () {
      return util.isEnvironment
        .should.be.a.Function();
    })

    given( undefined, null, 42, "foo" ).
    it("returns false when argument 'value' is not a webreed environment", function (value) {
      util.isEnvironment(value)
        .should.be.false();
    })

    it("returns true when argument 'value' is a webreed environment", function () {
      util.isEnvironment(new Environment())
        .should.be.true();
    })

  })

})
