// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.


// Packages
import given from "mocha-testdata";
import should from "should";

// Project
import * as defaultBehaviors from "../../src/behaviors/defaults";


describe("behaviors/defaults", function () {

  given(
    "build",
    "generateResource",
    "getSourceContentRelativePaths",
    "loadResourceFile",
    "loadSourceContent",
    "resolveGenerator",
    "resolveResourceMode",
    "resolveTemplateEngine",
    "saveResourceFile"
  ).
  it("has expected default behaviors", function (behaviorName) {
    defaultBehaviors[behaviorName]
      .should.be.a.Function();
  })

})
