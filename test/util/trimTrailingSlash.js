// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.


import given from "mocha-testdata";
import should from "should";

import {trimTrailingSlash} from "../../lib/util/trimTrailingSlash";


describe("util/trimTrailingSlash", function () {

  it("is a function", function () {
    return trimTrailingSlash
      .should.be.a.Function();
  });

  given( "foo//", "foo//bar//" ).
  it("throws error when value has many trailing slashes", function (value) {
    (() => trimTrailingSlash(value))
      .should.throw("argument 'value' has multiple trailing slashes!");
  });

  given(
    [ "f", "f" ],
    [ "f/", "f" ],
    [ "foo/bar", "foo/bar" ],
    [ "foo/bar/", "foo/bar" ]
  ).
  it("trims trailing slash from value when present", function (value, expectedResult) {
    trimTrailingSlash(value)
      .should.be.eql(expectedResult);
  });

  it("does not trim trailing slash from an input of '/'", function () {
    trimTrailingSlash("/")
      .should.be.eql("/");
  });

});
