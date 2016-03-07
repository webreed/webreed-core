// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.


// System
import path from "path";

// Packages
import given from "mocha-testdata";
import should from "should";

// Project
import normalizePathSeparators from "../../lib/util/normalizePathSeparators";


describe("util/normalizePathSeparators", function () {

  it("is a function", function () {
    return normalizePathSeparators
      .should.be.a.Function();
  });

  given(
    [ "", "" ],
    [ "abc", "abc" ],
    [ "abc/def", "abc/def" ],
    [ "abc/def/ghi", "abc/def/ghi" ],
    [ path.join("abc", "def"), "abc/def" ],
    [ path.join("abc", "def", "ghi"), "abc/def/ghi" ],
    [ path.join("abc/def", "ghi"), "abc/def/ghi" ]
  ).
  it("returns the expected normalized path", function (path, expectedResult) {
    normalizePathSeparators(path)
      .should.be.eql(expectedResult);
  });

});
