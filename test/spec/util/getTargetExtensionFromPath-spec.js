// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.

"use strict";


const given = require("mocha-testdata");
const should = require("should");

const getTargetExtensionFromPath = require("../../../lib/util/getTargetExtensionFromPath").getTargetExtensionFromPath;


describe("util/getTargetExtensionFromPath", function () {

  it("is a function", function () {
    return getTargetExtensionFromPath
      .should.be.a.Function();
  });

  given( "", "index", "blog/index", "category.2/index" ).
  it("returns a value of null when input path has no extensions", function (path) {
    should( getTargetExtensionFromPath(path) )
      .be.null();
  });

  given(
    [ ".html", ".html" ],
    [ ".nunjucks", ".nunjucks" ],
    [ ".md.nunjucks", ".md" ],
    [ ".html.md.nunjucks", ".html" ],
    [ "index.html", ".html" ],
    [ "index.nunjucks", ".nunjucks" ],
    [ "index.md.nunjucks", ".md" ],
    [ "index.html.md.nunjucks", ".html" ],
    [ "category.2/index.html", ".html" ],
    [ "category.2/index.nunjucks", ".nunjucks" ],
    [ "category.2/index.md.nunjucks", ".md" ],
    [ "category.2/index.html.md.nunjucks", ".html" ]
  ).
  it("returns the expected target file extension", function (path, expectedResult) {
    getTargetExtensionFromPath(path)
      .should.be.eql(expectedResult);
  });

});
