// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.

"use strict";


const path = require("path");

const given = require("mocha-testdata");
const should = require("should");

const normalizePathSeparators = require("../../../lib/util/normalizePathSeparators").normalizePathSeparators;


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
