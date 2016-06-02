// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.

"use strict";


const path = require("path");

const given = require("mocha-testdata");
const should = require("should");

const Environment = require("../../../lib/Environment").Environment;
const ResourceType = require("../../../lib/ResourceType").ResourceType;
const Resource = require("../../../lib/Resource").Resource;
const loadResourceFile = require("../../../lib/behaviors/loadResourceFile").loadResourceFile;

const FakeErrorMode = require("../../fakes/FakeErrorMode").FakeErrorMode;
const FakeMode = require("../../fakes/FakeMode").FakeMode;


function getFixturePath(relativePath) {
  return path.resolve(__dirname, "../fixtures/resource-files", relativePath);
}


describe("behaviors/loadResourceFile", function () {

  beforeEach(function () {
    this.env = new Environment();
    this.env.modes.set("fake", new FakeMode());
    this.env.modes.set("alwaysFails", new FakeErrorMode());

    let modeAugmentsWithOutputExtension = new FakeMode();
    modeAugmentsWithOutputExtension.outputExtension = ".ext";
    this.env.modes.set("augmentsWithOutputExtension", modeAugmentsWithOutputExtension);

    let defaultResourceType = new ResourceType();
    defaultResourceType.mode = "fake";
    this.env.resourceTypes.set("*", defaultResourceType);

    let markdownResourceType = new ResourceType();
    markdownResourceType.mode = "fake";
    markdownResourceType.targetExtension = ".html";
    this.env.resourceTypes.set(".md", markdownResourceType);

    let alwaysFailsResourceType = new ResourceType();
    alwaysFailsResourceType.mode = "alwaysFails";
    this.env.resourceTypes.set(".always-fails", alwaysFailsResourceType);

    let resourceTypeAugmentsWithOutputExtension = new ResourceType();
    resourceTypeAugmentsWithOutputExtension.mode = "augmentsWithOutputExtension";
    this.env.resourceTypes.set(".has-custom-output-extension", resourceTypeAugmentsWithOutputExtension);
  });


  it("is a function", function () {
    loadResourceFile
      .should.be.a.Function();
  });

  it("is named 'loadResourceFile'", function () {
    loadResourceFile.name
      .should.be.eql("loadResourceFile");
  });


  it("rejects with error when argument 'filePath' is an empty string", function () {
    let filePath = "";
    return loadResourceFile(this.env, filePath)
      .should.be.rejectedWith("argument 'filePath' must be a non-empty string");
  });


  it("rejects with error when loading resource with an unknown mode (via argument 'filePath')", function () {
    let filePath = getFixturePath("index.foo");

    let fakeResourceType = new ResourceType();
    fakeResourceType.mode = "unknown";
    this.env.resourceTypes.set(".foo", fakeResourceType);

    return loadResourceFile(this.env, filePath)
      .should.be.rejectedWith("Resource mode 'unknown' is not defined.");
  });

  it("rejects with error when loading resource with an unknown mode (via argument 'resourceTypeExtension')", function () {
    let filePath = getFixturePath("index.html");
    let resourceTypeExtension = ".foo";

    let fakeResourceType = new ResourceType();
    fakeResourceType.mode = "unknown";
    this.env.resourceTypes.set(resourceTypeExtension, fakeResourceType);

    return loadResourceFile(this.env, filePath, resourceTypeExtension)
      .should.be.rejectedWith("Resource mode 'unknown' is not defined.");
  });


  it("returns a promise", function () {
    let filePath = getFixturePath("index.html");
    loadResourceFile(this.env, filePath)
      .should.be.a.Promise();
  });

  it("resolves with a `Resource`", function () {
    let filePath = getFixturePath("index.html");
    return loadResourceFile(this.env, filePath)
      .should.eventually.be.instanceOf(Resource);
  });

  it("rejects with error from mode", function () {
    let filePath = getFixturePath("index.always-fails");
    return loadResourceFile(this.env, filePath)
      .should.be.rejectedWith("readFile failed!");
  });


  it("provides correct arguments to the associated mode's 'readFile' function", function () {
    let defaultResourceType = this.env.resourceTypes.get("*");
    let fakeMode = this.env.modes.get("fake");

    let filePath = getFixturePath("index.html");

    return loadResourceFile(this.env, filePath)
      .then(() => {
        fakeMode.lastReadFileArguments[0]
          .should.be.eql(filePath);
        fakeMode.lastReadFileArguments[1]
          .should.be.exactly(defaultResourceType);
      });
  });

  it("returns data that was read by the associated mode's 'readFile' function", function () {
    let filePath = getFixturePath("index.html");
    return loadResourceFile(this.env, filePath)
      .then(data => {
        data.body
          .should.be.eql("Fake body!");
      });
  });

  it("reverts to 'text' mode when resource type does not specify a mode", function () {
    let fakeTextMode = new FakeMode();
    this.env.modes.set("text", fakeTextMode);
    this.env.resourceTypes.set(".bar", new ResourceType());

    let filePath = getFixturePath("index.bar");
    return loadResourceFile(this.env, filePath)
      .then(() => {
        fakeTextMode.lastReadFileArguments[0]
          .should.be.eql(filePath);
      });
  });

  it("adds metadata to the resulting resource", function () {
    let fakeResourceType = new ResourceType();
    fakeResourceType.mode = "fake";

    this.env.resourceTypes
      .set(".foo", fakeResourceType)
      .set(".bar", "alias-of(.foo)");

    let filePath = getFixturePath("index.bar");
    return loadResourceFile(this.env, filePath)
      .should.eventually.have.properties({
        __sourceExtensionChain: ".bar",
        __sourceFilePath: filePath,
        __sourceType: ".foo",
        __mode: "fake"
      });
  });

  given( "index.md", "index.html.md" ).
  it("takes target extension from `ResourceType#targetExtension`", function (contentRelativePath) {
    let filePath = getFixturePath(contentRelativePath);
    return loadResourceFile(this.env, filePath)
      .should.eventually.have.properties({
        __sourceExtensionChain: ".html.md",
        __sourceFilePath: filePath,
        __sourceType: ".md",
        _extension: ".html"
      });
  });

  it("uses output extension from the source content file", function () {
    let filePath = getFixturePath("foo.has-custom-output-extension");
    return loadResourceFile(this.env, filePath)
      .should.eventually.have.properties({
        __sourceExtensionChain: ".has-custom-output-extension",
        __sourceFilePath: filePath,
        __sourceType: ".has-custom-output-extension",
        _extension: ".ext"
      });
  });

  it("adds properties to result from argument 'baseProperties'", function () {
    let filePath = getFixturePath("index.bar");
    let baseProperties = { a: 1, b: 2, c: "hey!" };

    return loadResourceFile(this.env, filePath, null, baseProperties)
      .should.eventually.have.properties(baseProperties);
  });

  it("properties from source resource override those from argument 'baseProperties'", function () {
    let filePath = getFixturePath("index.bar");
    let baseProperties = { body: 123 };

    return loadResourceFile(this.env, filePath, null, baseProperties)
      .should.eventually.have.property("body", "Fake body!");
  });

});
