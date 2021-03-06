// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.

"use strict";


const path = require("path");

const given = require("mocha-testdata");
const should = require("should");

const AliasMap = require("../../lib/AliasMap").AliasMap;
const BehaviorMap = require("../../lib/BehaviorMap").BehaviorMap;
const Environment = require("../../lib/Environment").Environment;
const ProjectConfig = require("../../lib/ProjectConfig").ProjectConfig;
const ResourceType = require("../../lib/ResourceType").ResourceType;
const Resource = require("../../lib/Resource").Resource;


describe("Environment", function () {

  beforeEach(function () {
    this.env = new Environment();
    this.env.projectRootPath = path.resolve(__dirname, "../fixtures/empty-project");
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

    it("updates value of the property", function () {
      this.env.baseUrl = "http://example.com";
      this.env.baseUrl
        .should.be.eql("http://example.com");
    });

  });

  describe("#behaviors", function () {

    it("is a `BehaviorMap`", function () {
      this.env.behaviors
        .should.be.instanceOf(BehaviorMap);
    });

    it("is read-only", function () {
      (() => this.env.behaviors = 42)
        .should.throw();
    });

  });

  describe("#config", function () {

    it("is a `ProjectConfig", function () {
      this.env.config
        .should.be.instanceOf(ProjectConfig);
    });

    it("is read-only", function () {
      (() => this.env.config = 42)
        .should.throw();
    });

  });

  describe("#defaultGeneratorName", function () {

    it("is 'standard' by default", function () {
      this.env.defaultGeneratorName
        .should.be.eql("standard");
    });

  });

  describe("#defaultGeneratorName=", function () {

    it("throws error if argument 'value' is an empty string", function () {
      let value = "";
      (() => this.env.defaultGeneratorName = value)
        .should.throw("argument 'value' must be a non-empty string");
    });

    it("updates value of the property", function () {
      this.env.defaultGeneratorName = "foo";
      this.env.defaultGeneratorName
        .should.be.eql("foo");
    });

  });

  describe("#defaultModeName", function () {

    it("is 'text' by default", function () {
      this.env.defaultModeName
        .should.be.eql("text");
    });

  });

  describe("#defaultModeName=", function () {

    it("throws error if argument 'value' is an empty string", function () {
      let value = "";
      (() => this.env.defaultModeName = value)
        .should.throw("argument 'value' must be a non-empty string");
    });

    it("updates value of the property", function () {
      this.env.defaultModeName = "foo";
      this.env.defaultModeName
        .should.be.eql("foo");
    });

  });

  describe("#resourceTypes", function () {

    it("is an `AliasMap`", function () {
      this.env.resourceTypes
        .should.be.instanceOf(AliasMap);
    });

    it("is read-only", function () {
      (() => this.env.resourceTypes = 42)
        .should.throw();
    });

    it("falls back to the default resource type '*'", function () {
      this.env.resourceTypes.set("*", new ResourceType());
      this.env.resourceTypes.resolveKey("key-that-does-not-exist")
        .should.be.eql("*");
    });

  });

  describe("#generators", function () {

    it("is an `AliasMap`", function () {
      this.env.generators
        .should.be.instanceOf(AliasMap);
    });

    it("is read-only", function () {
      (() => this.env.generators = 42)
        .should.throw();
    });

  });

  describe("#handlers", function () {

    it("is an `AliasMap`", function () {
      this.env.handlers
        .should.be.instanceOf(AliasMap);
    });

    it("is read-only", function () {
      (() => this.env.handlers = 42)
        .should.throw();
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

  describe("#modes", function () {

    it("is an `AliasMap`", function () {
      this.env.modes
        .should.be.instanceOf(AliasMap);
    });

    it("is read-only", function () {
      (() => this.env.modes = 42)
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

  describe("#templateEngines", function () {

    it("is an `AliasMap`", function () {
      this.env.templateEngines
        .should.be.instanceOf(AliasMap);
    });

    it("is read-only", function () {
      (() => this.env.templateEngines = 42)
        .should.throw();
    });

  });

  describe("#transformers", function () {

    it("is an `AliasMap`", function () {
      this.env.transformers
        .should.be.instanceOf(AliasMap);
    });

    it("is read-only", function () {
      (() => this.env.transformers = 42)
        .should.throw();
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

    it("assumes override 'build' behavior", function () {
      let invokedOverride = false;

      this.env.behaviors.set("build", function () {
        invokedOverride = true;
        return Promise.resolve();
      });

      return this.env.build()
        .then(() => {
          invokedOverride.should.be.true();
        });
    });

  });

  describe("#clean()", function () {

    it("is a function", function () {
      this.env.clean
        .should.be.a.Function();
    });

    it("returns a promise", function () {
      this.env.clean()
        .should.be.a.Promise();
    });

    it("assumes override 'clean' behavior", function () {
      let invokedOverride = false;

      this.env.behaviors.set("clean", function () {
        invokedOverride = true;
        return Promise.resolve();
      });

      return this.env.clean()
        .then(() => {
          invokedOverride.should.be.true();
        });
    });

  });

  describe("#createResource", function () {

    it("is a function", function () {
      this.env.createResource
        .should.be.a.Function();
    });

    it("returns a Resource", function () {
      this.env.createResource()
        .should.be.instanceOf(Resource);
    });

    it("returns a new Resource instance each time", function () {
      this.env.createResource()
        .should.not.be.exactly(this.env.createResource());
    });

    it("passes properties to constructor of new resource", function () {
      let props = { type: "greeting", message: "Hello, world!" };
      this.env.createResource(props)
        .should.have.properties(props);
    });

  });

  describe("#getOutputRelativePathForResource(path, [extension], [page])", function () {

    it("is a function", function () {
      this.env.getOutputRelativePathForResource
        .should.be.a.Function();
    });

    it("throws error if argument 'path' is an empty string", function () {
      let path = "";
      (() => this.env.getOutputRelativePathForResource(path))
        .should.throw("argument 'path' must be a non-empty string");
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

    it("throws error when argument 'name' is an empty string", function () {
      let name = "";
      (() => this.env.resolvePath(name))
        .should.throw("argument 'name' must be a non-empty string");
    });

    it("resolves path of a named sub-directory within project", function () {
      this.env.resolvePath("def")
        .should.be.eql(path.resolve(__dirname, "../fixtures/empty-project/def"));
    });

    it("resolves path from a named sub-directory within project", function () {
      this.env.resolvePath("def", "ghi/jkl")
        .should.be.eql(path.resolve(__dirname, "../fixtures/empty-project/def/ghi/jkl"));
    });

    it("trims trailing slash from argument 'relativePath'", function () {
      this.env.resolvePath("def", "ghi/jkl/")
        .should.be.eql(path.resolve(__dirname, "../fixtures/empty-project/def/ghi/jkl"));
    });

  });

  describe("#setPath(name, path)", function () {

    it("is a function", function () {
      this.env.setPath
        .should.be.a.Function();
    });

    it("throws error when argument 'name' is an empty string", function () {
      (() => this.env.setPath("", "abc"))
        .should.throw("argument 'name' must be a non-empty string");
    });

    it("throws error when argument 'path' is an empty string", function () {
      (() => this.env.setPath("content", ""))
        .should.throw("argument 'path' must be a non-empty string");
    });

    given(
      "/",
      ".",
      "/abc/def/../ghi/../..",
      process.env.HOME,
      path.join(process.env.HOME, "Documents"),
      path.join(process.env.HOME, "My Documents")
    ).
    it("throws error when resolved output path is potentially dangerous", function (dangerousOutputPath) {
      this.env.projectRootPath = "/";
      (() => this.env.setPath("output", dangerousOutputPath))
        .should.throw("Refusing to set output path that is potentially very dangerous.");
    });

    it("overrides a named path", function () {
      this.env.setPath("content", "new-content/2015");
      this.env.resolvePath("content")
        .should.be.eql(path.resolve(__dirname, "../fixtures/empty-project/new-content/2015"));
    });

    it("trims trailing slash from argument 'path'", function () {
      this.env.setPath("content", "new-content/2015/");
      this.env.resolvePath("content")
        .should.be.eql(path.resolve(__dirname, "../fixtures/empty-project/new-content/2015"));
    });

    it("returns self allowing for chained calls", function () {
      this.env.setPath("content", "new-content/2015")
        .should.be.exactly(this.env);
    });

  });

  describe("#use(pluginSetupFunction, [options])", function () {

    it("is a function", function () {
      this.env.use
        .should.be.a.Function();
    });

    given([
      [ undefined, { } ],
      [ null, { } ],
      [ { a: 42 }, { a: 42 } ]
    ]).
    it("invokes plugin setup function with expected arguments", function (options, expectedOptions) {
      let suppliedEnv, suppliedOptions;
      let fakeSetupFunction = function (env, options) {
        suppliedEnv = env;
        suppliedOptions = options;
      };

      this.env.use(fakeSetupFunction, options);

      suppliedEnv
        .should.be.exactly(this.env);
      suppliedOptions
        .should.be.an.Object();
      suppliedOptions
        .should.have.properties(expectedOptions);
    });

    it("returns self allowing for chained function calls", function () {
      let fakeSetupFunction = function (env, options) { };
      this.env.use(fakeSetupFunction)
        .should.be.exactly(this.env);
    });

  });

});
