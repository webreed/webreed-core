// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.

"use strict";


const given = require("mocha-testdata");
const should = require("should");

const getExtensionChainFromPath = require("../../../lib/util/getExtensionChainFromPath").getExtensionChainFromPath;


describe("util/getExtensionChainFromPath", function () {

  it("is a function", function () {
    return getExtensionChainFromPath
      .should.be.a.Function();
  });

  given( "", "index", "blog/index", "category.2/index" ).
  it("returns an empty string when input path has no extensions", function (path) {
    getExtensionChainFromPath(path)
      .should.be.eql("");
  });

  given(
    [ ".html", ".html" ],
    [ ".nunjucks", ".nunjucks" ],
    [ ".md.nunjucks", ".md.nunjucks" ],
    [ ".html.md.nunjucks", ".html.md.nunjucks" ],
    [ "index.html", ".html" ],
    [ "index.nunjucks", ".nunjucks" ],
    [ "index.md.nunjucks", ".md.nunjucks" ],
    [ "index.html.md.nunjucks", ".html.md.nunjucks" ],
    [ "category.2/index.html", ".html" ],
    [ "category.2/index.nunjucks", ".nunjucks" ],
    [ "category.2/index.md.nunjucks", ".md.nunjucks" ],
    [ "category.2/index.html.md.nunjucks", ".html.md.nunjucks" ]
  ).
  it("returns the expected chain of file extensions", function (path, expectedResult) {
    getExtensionChainFromPath(path)
      .should.be.eql(expectedResult);
  });

});
