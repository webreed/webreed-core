// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.


// System
import path from "path";

// Packages
import given from "mocha-testdata";
import should from "should";

// Project
import Environment from "../src/Environment";


describe("Environment", function () {

  beforeEach(function () {
    this.env = new Environment();
    this.env.projectRootPath = path.join(__dirname, "fixtures");
  });


  it("is named 'Environment'", function () {
    Environment.name
      .should.be.eql("Environment");
  });


  describe("#constructor()", function () {

    it("is a function", function () {
      Environment.prototype.constructor
        .should.be.a.Function();
    });

  });


  describe("#baseUrl", function () {

    it("has an initial value of '/'", function () {
      let newEnv = new Environment();
      newEnv.baseUrl
        .should.be.eql("/");
    });

  });

  describe("#baseUrl=", function () {

    it("throws error when argument 'value' is not a string", function () {
      (() => this.env.baseUrl = 42)
        .should.throw("argument 'value' must be a string");
    });

    it("updates value of the property", function () {
      this.env.baseUrl = "http://example.com";
      this.env.baseUrl
        .should.be.eql("http://example.com");
    });

  });

  describe("#behaviors", function () {

    it("is an object", function () {
      this.env.behaviors
        .should.be.an.Object();
    });

    it("is read-only", function () {
      (() => this.env.behaviors = 42)
        .should.throw();
    });

    it("inherits default behaviors", function () {
      delete this.env.behaviors.buildOutput;
      this.env.behaviors.buildOutput
        .should.be.a.Function();
    });

  });

  describe("#hiddenUrlExtensions", function () {

    it("is a set", function () {
      this.env.hiddenUrlExtensions.has
        .should.be.a.Function();
      this.env.hiddenUrlExtensions.add
        .should.be.a.Function();
      this.env.hiddenUrlExtensions.delete
        .should.be.a.Function();
    });

    it("is read-only", function () {
      (() => this.env.hiddenUrlExtensions = new Set())
        .should.throw();
    });

  });

  describe("#hiddenUrlFileNames", function () {

    it("is a set", function () {
      this.env.hiddenUrlFileNames.has
        .should.be.a.Function();
      this.env.hiddenUrlFileNames.add
        .should.be.a.Function();
      this.env.hiddenUrlFileNames.delete
        .should.be.a.Function();
    });

    it("is read-only", function () {
      (() => this.env.hiddenUrlFileNames = new Set())
        .should.throw();
    });

  });

  describe("#projectRootPath", function () {

    it("is empty by default", function () {
      let newEnv = new Environment();
      newEnv.projectRootPath
        .should.be.eql("");
    });

  });

  describe("#projectRootPath=", function () {

    it("throws error when argument 'value' is not a string", function () {
      (() => this.env.projectRootPath = 42)
        .should.throw("argument 'value' must be a string");
    });

    it("updates value of the property", function () {
      this.env.projectRootPath = "/abc";
      this.env.projectRootPath
        .should.be.eql("/abc");
    });

    it("trims trailing slash from assigned value", function () {
      this.env.projectRootPath = "/abc/";
      this.env.projectRootPath
        .should.be.eql("/abc");
    });

  });


  describe("#build()", function () {

    it("is a function", function () {
      this.env.build
        .should.be.a.Function();
    });

    it("returns a promise", function () {
      this.env.build()
        .should.be.a.Promise();
    });

    it("assumes override 'buildOutput' behavior", function () {
      let invokedOverride = false;

      this.env.behaviors.buildOutput = function () {
        invokedOverride = true;
        return Promise.resolve();
      };

      return this.env.build()
        .then(() => {
          invokedOverride.should.be.true();
        });
    });

  });

  describe("#getOutputRelativePathForResource(path, [extension], [page])", function () {

    it("is a function", function () {
      this.env.getOutputRelativePathForResource
        .should.be.a.Function();
    });

    given( 42, "" ).
    it("throws error if argument 'path' is not a non-empty string", function (path) {
      (() => this.env.getOutputRelativePathForResource(path))
        .should.throw("argument 'path' must be a non-empty string");
    });

    it("throws error if argument 'extension' is defined and non-null but is not a string", function () {
      (() => this.env.getOutputRelativePathForResource("abc", 42))
        .should.throw("argument 'extension' must be a string, null or undefined");
    });

    it("throws error if argument 'page' is defined and non-null but is not a string", function () {
      (() => this.env.getOutputRelativePathForResource("abc", null, 42))
        .should.throw("argument 'page' must be a string, null or undefined");
    });

    given(
      [ "blog", null, null, "blog" ],
      [ "blog/index", ".html", null, "blog/index.html" ],
      [ "blog/index", ".html", "2", "blog/index/2.html" ],
      [ "blog/index", null, "2", "blog/index/2" ],
      [ "blog/index", ".def", "2", "blog/index/2.def" ]
    ).
    it("returns the expected output relative path", function (path, extension, page, expectedResult) {
      this.env.getOutputRelativePathForResource(path, extension, page)
        .should.be.eql(expectedResult);
    });

  });

  describe("#getUrlForResource(outputRelativePath, [baseUrl])", function () {

    it("is a function", function () {
      this.env.getUrlForResource
        .should.be.a.Function();
    });

    it("throws error when argument 'outputRelativePath' is not a string", function () {
      (() => this.env.getUrlForResource(42))
        .should.throw("argument 'outputRelativePath' must be a string");
    });

    it("throws error when argument 'baseUrl' is defined but is not a string", function () {
      (() => this.env.getUrlForResource("", 42))
        .should.throw("argument 'baseUrl' must be a string");
    });

    given(
      [ "", null, "/" ],
      [ "blog", null, "/blog" ],
      [ "blog", "http://example.com", "http://example.com/blog" ],
      [ "blog/index.html", null, "/blog/index.html" ],
      [ "blog/index.html", "http://example.com", "http://example.com/blog/index.html" ],
      [ "blog/feed.rss", null, "/blog/feed.rss" ],
      [ "blog/feed.rss", "http://example.com", "http://example.com/blog/feed.rss" ]
    ).
    it("returns the expected URL", function (outputRelativePath, baseUrl, expectedResult) {
      this.env.getUrlForResource(outputRelativePath, baseUrl)
        .should.be.eql(expectedResult);
    });

    given(
      [ "blog/index.html", null, "/blog/index" ],
      [ "blog/index.html", "http://example.com", "http://example.com/blog/index" ],
      [ "blog/default.html", null, "/blog/default" ],
      [ "blog/default.html", "http://example.com", "http://example.com/blog/default" ]
    ).
    it("returns the expected URL taking hidden extensions into account", function (outputRelativePath, baseUrl, expectedResult) {
      this.env.hiddenUrlExtensions.add(".html");

      this.env.getUrlForResource(outputRelativePath, baseUrl)
        .should.be.eql(expectedResult);
    });

    given(
      [ "blog/index.html", null, "/blog/" ],
      [ "blog/index.html", "http://example.com", "http://example.com/blog/" ],
      [ "blog/default.html", null, "/blog/default.html" ],
      [ "blog/default.html", "http://example.com", "http://example.com/blog/default.html" ]
    ).
    it("returns the expected URL taking hidden file names into account", function (outputRelativePath, baseUrl, expectedResult) {
      this.env.hiddenUrlFileNames.add("index.html");

      this.env.getUrlForResource(outputRelativePath, baseUrl)
        .should.be.eql(expectedResult);
    });

  });

  describe("#resolvePath(name, [relativePath])", function () {

    it("is a function", function () {
      this.env.resolvePath
        .should.be.a.Function();
    });

    given( 42, "" ).
    it("throws error when argument 'name' is not a non-empty string", function (name) {
      (() => this.env.resolvePath(name))
        .should.throw("argument 'name' must be a non-empty string");
    });

    it("throws error when argument 'relativePath' is not a string", function () {
      (() => this.env.resolvePath("content", 42))
        .should.throw("argument 'relativePath' must be a string");
    });

    it("resolves path of a named sub-directory within project", function () {
      this.env.resolvePath("def")
        .should.be.eql(path.resolve(__dirname, "fixtures/def"));
    });

    it("resolves path from a named sub-directory within project", function () {
      this.env.resolvePath("def", "ghi/jkl")
        .should.be.eql(path.resolve(__dirname, "fixtures/def/ghi/jkl"));
    });

    it("trims trailing slash from argument 'relativePath'", function () {
      this.env.resolvePath("def", "ghi/jkl/")
        .should.be.eql(path.resolve(__dirname, "fixtures/def/ghi/jkl"));
    });

  });

  describe("#setPath(name, path)", function () {

    it("is a function", function () {
      this.env.setPath
        .should.be.a.Function();
    });

    given( 42, "" ).
    it("throws error if argument 'name' is not a non-empty string", function (name) {
      (() => this.env.setPath(name, ""))
        .should.throw("argument 'name' must be a non-empty string");
    });

    it("throws error if argument 'path' is not a string", function () {
      (() => this.env.setPath("abc", 42))
        .should.throw("argument 'path' must be a string");
    });

    it("overrides a named path", function () {
      this.env.setPath("content", "new-content/2015");
      this.env.resolvePath("content")
        .should.be.eql(path.resolve(__dirname, "fixtures/new-content/2015"));
    });

    it("trims trailing slash from argument 'path'", function () {
      this.env.setPath("content", "new-content/2015/");
      this.env.resolvePath("content")
        .should.be.eql(path.resolve(__dirname, "fixtures/new-content/2015"));
    });

    it("returns self allowing for chained calls", function () {
      this.env.setPath("content", "new-content/2015")
        .should.be.exactly(this.env);
    });

  });

});
