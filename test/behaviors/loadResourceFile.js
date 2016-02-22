// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.


// System
import path from "path";

// Packages
import given from "mocha-testdata";
import should from "should";

// Project
import Environment from "../../src/Environment";
import Resource from "../../src/Resource";
import ResourceType from "../../src/ResourceType";
import loadResourceFile from "../../src/behaviors/loadResourceFile";

// Test
import FakeErrorMode from "../fakes/FakeErrorMode";
import FakeMode from "../fakes/FakeMode";


function getFixturePath(relativePath) {
  return path.join(path.resolve("../fixtures/resource-files"), relativePath);
}


describe("behaviors/loadResourceFile", function () {

  beforeEach(function () {
    this.env = new Environment();
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
    loadResourceFile
      .should.be.a.Function();
  });


  it("throws error when argument 'env' is not an object", function () {
    let filePath = getFixturePath("index.html");
    (() => loadResourceFile(null, filePath))
      .should.throw("argument 'env' must be a webreed environment");
  });

  given( undefined, null, 42, "" ).
  it("throws error when argument 'filePath' is not a string", function (filePath) {
    (() => loadResourceFile(this.env, filePath))
      .should.throw("argument 'filePath' must be a non-empty string");
  });

  it("throws error when argument 'resourceTypeExtension' is not a string", function () {
    let filePath = getFixturePath("index.html");
    let resourceTypeExtension = 42;
    (() => loadResourceFile(this.env, filePath, resourceTypeExtension))
      .should.throw("argument 'resourceTypeExtension' must be `null` or a string");
  });

  it("throws error when argument 'baseProperties' is not an object", function () {
    let filePath = getFixturePath("index.html");
    let baseProperties = 42;
    (() => loadResourceFile(this.env, filePath, null, baseProperties))
      .should.throw("argument 'baseProperties' must be `null` or an object");
  });


  it("throws error when loading resource with an unknown mode (via argument 'filePath')", function () {
    let filePath = getFixturePath("index.foo");

    let fakeResourceType = new ResourceType();
    fakeResourceType.mode = "unknown";
    this.env.resourceTypes.set(".foo", fakeResourceType);

    (() => loadResourceFile(this.env, filePath))
      .should.throw("Resource mode 'unknown' is not defined.");
  });

  it("throws error when loading resource with an unknown mode (via argument 'resourceTypeExtension')", function () {
    let filePath = getFixturePath("index.html");
    let resourceTypeExtension = ".foo";

    let fakeResourceType = new ResourceType();
    fakeResourceType.mode = "unknown";
    this.env.resourceTypes.set(resourceTypeExtension, fakeResourceType);

    (() => loadResourceFile(this.env, filePath, resourceTypeExtension))
      .should.throw("Resource mode 'unknown' is not defined.");
  });


  it("returns a promise", function () {
    let filePath = getFixturePath("index.html");
    loadResourceFile(this.env, filePath)
      .should.be.a.Promise();
  });

  it("fulfills with a `Resource`", function () {
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
