// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.

"use strict";


const path = require("path");

const given = require("mocha-testdata");
const should = require("should");

const Environment = require("../../../lib/Environment").Environment;
const ResourceType = require("../../../lib/ResourceType").ResourceType;
const Resource = require("../../../lib/Resource").Resource;
const loadSourceContent = require("../../../lib/behaviors/loadSourceContent").loadSourceContent;

const FakeErrorMode = require("../../fakes/FakeErrorMode").FakeErrorMode;
const FakeMode = require("../../fakes/FakeMode").FakeMode;


describe("behaviors/loadSourceContent", function () {

  beforeEach(function () {
    this.env = new Environment();
    this.env.projectRootPath = path.resolve(__dirname, "../../fixtures/project-with-content");
    this.env.baseUrl = "http://example.com";
    this.env.modes.set("fake", new FakeMode());
    this.env.modes.set("alwaysFails", new FakeErrorMode());

    let defaultResourceType = new ResourceType();
    defaultResourceType.mode = "fake";
    this.env.resourceTypes.set("*", defaultResourceType);

    let alwaysFailsResourceType = new ResourceType();
    alwaysFailsResourceType.mode = "alwaysFails";
    this.env.resourceTypes.set(".always-fails", alwaysFailsResourceType);
  });


  it("is a function", function () {
    loadSourceContent
      .should.be.a.Function();
  });

  it("is named 'loadSourceContent'", function () {
    loadSourceContent.name
      .should.be.eql("loadSourceContent");
  });


  it("resolves with a `Resource`", function () {
    return loadSourceContent(this.env, "index.html")
      .should.eventually.be.instanceOf(Resource);
  });

  it("rejects with error from mode", function () {
    return loadSourceContent(this.env, "index.always-fails")
      .should.be.rejectedWith("readFile failed!");
  });


  it("throws error when argument 'contentRelativePath' is an empty string", function () {
    let contentRelativePath = "";
    (() => loadSourceContent(this.env, contentRelativePath))
      .should.throw("argument 'contentRelativePath' must be a non-empty string");
  });


  it("loads content file from content directory", function () {
    let loadedFilePath;

    // By verifying that the 'loadResourceFile' behavior is used we also infer that all of
    // the unit tests of 'loadResourceFile' are also valid for 'loadSourceContent'.
    this.env.behaviors.set("loadResourceFile", function (env, filePath) {
      loadedFilePath = filePath;
      return env.behaviors.invokeDefault("loadResourceFile", filePath);
    });

    return loadSourceContent(this.env, "index.html")
      .then(() => {
        loadedFilePath
          .should.be.eql(this.env.resolvePath("content", "index.html"));
      });
  });

  it("returns data that was read by the associated mode's 'readFile' function", function () {
    return loadSourceContent(this.env, "index.html")
      .then(data => {
        data.body
          .should.be.eql("Fake body!");
      });
  });

  it("adds metadata to the resulting resource", function () {
    return loadSourceContent(this.env, "blog/about.html")
      .should.eventually.have.properties({
        _baseUrl: "http://example.com",
        _path: "blog/about"
      });
  });

  it("adds properties to result from argument 'baseProperties'", function () {
    let baseProperties = { a: 1, b: 2, c: "hey!" };
    return loadSourceContent(this.env, "index.bar", null, baseProperties)
      .should.eventually.have.properties(baseProperties);
  });

  it("argument 'baseProperties' can override '_baseUrl' and '_path' in the resulting resource", function () {
    let baseProperties = { _baseUrl: "http://example.org/test", "_path": "about/bob" };
    return loadSourceContent(this.env, "index.bar", null, baseProperties)
      .should.eventually.have.properties(baseProperties);
  });

});
