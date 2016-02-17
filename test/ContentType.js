// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.


// Packages
import given from "mocha-testdata";
import should from "should";

// Project
import ContentType from "../src/ContentType";


describe("ContentType", function () {

  it("is named 'ContentType'", function () {
    ContentType.name
      .should.be.eql("ContentType");
  });


  describe("#constructor()", function () {

    it("is a function", function () {
      ContentType.prototype.constructor
        .should.be.a.Function();
    });

  });

});
