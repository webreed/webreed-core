// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.


import given from "mocha-testdata";
import should from "should";

import {isAliasReference} from "../../../lib/util/isAliasReference";


describe("util/isAliasReference", function () {

  it("is a function", function () {
    return isAliasReference
      .should.be.a.Function();
  });

  given( "alias-of()", "alias-of(hello)", "alias-of(hello-world)", "alias-of(super/special.test)" ).
  it("returns `true` when argument 'value' is an alias reference", function (value) {
    isAliasReference(value)
      .should.be.true();
  });

  given( null, 42, "hello", "alias-of", "alias-of(foo" ).
  it("returns `false` when argument 'value' is not an alias reference", function (value) {
    isAliasReference(value)
      .should.be.false();
  });

});
