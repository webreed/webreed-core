// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.


import given from "mocha-testdata";
import should from "should";

import {getTargetFromAliasReference} from "../../../lib/util/getTargetFromAliasReference";


describe("util/getTargetFromAliasReference", function () {

  it("is a function", function () {
    return getTargetFromAliasReference
      .should.be.a.Function();
  });

  given(
    [ "alias-of()", "" ],
    [ "alias-of(hello)", "hello" ],
    [ "alias-of(hello-world)", "hello-world" ],
    [ "alias-of(super/special.test)", "super/special.test" ]
  ).
  it("returns the target from the alias reference", function (value, expectedResult) {
    getTargetFromAliasReference(value)
      .should.be.eql(expectedResult);
  });

  given( null, 42, "hello", "alias-of", "alias-of(foo" ).
  it("returns `null` when argument 'value' is not an alias reference", function (value) {
    let result = getTargetFromAliasReference(value);
    should.not.exist(result);
  });

});