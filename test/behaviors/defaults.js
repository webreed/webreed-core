// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.

import given from "mocha-testdata";
import should from "should";

import * as defaultBehaviors from "../../src/behaviors/defaults";

describe("behaviors/defaults", function () {

  given(
    "buildOutput"
  ).
  it("has expected default behaviors", function (behaviorName) {
    defaultBehaviors[behaviorName]
      .should.be.a.Function();
  })

})
