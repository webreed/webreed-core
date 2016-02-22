// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.


// System
import path from "path";

// Packages
import given from "mocha-testdata";
import should from "should";

// Project
import Environment from "../../src/Environment";
import ResourceType from "../../src/ResourceType";
import loadResourceFile from "../../src/behaviors/loadResourceFile";


function getFixturePath(relativePath) {
  return path.join(path.resolve("../fixtures/resource-files"), relativePath);
}


describe("behaviors/loadResourceFile", function () {

  beforeEach(function () {
    this.env = new Environment();
  });


  it("is a function", function () {
    loadResourceFile
      .should.be.a.Function();
  });


  it("throws error when argument 'env' is not an object", function () {
    let inputPath = getFixturePath("index.html");
    (() => loadResourceFile(null, inputPath))
      .should.throw("argument 'env' must be a webreed environment");
  });

  given( undefined, null, 42, "" ).
  it("throws error when argument 'inputPath' is not a string", function (inputPath) {
    (() => loadResourceFile(this.env, inputPath))
      .should.throw("argument 'inputPath' must be a non-empty string");
  });

  it("throws error when argument 'resourceTypeExtension' is not a string", function () {
    let inputPath = getFixturePath("index.html");
    let resourceTypeExtension = 42;
    (() => loadResourceFile(this.env, inputPath, resourceTypeExtension))
      .should.throw("argument 'resourceTypeExtension' must be `null` or a string");
  });

  it("throws error when argument 'baseProperties' is not an object", function () {
    let inputPath = getFixturePath("index.html");
    let baseProperties = 42;
    (() => loadResourceFile(this.env, inputPath, null, 42))
      .should.throw("argument 'baseProperties' must be `null` or an object");
  });


  it("throws error when loading resource with an unknown mode (via argument 'resourceTypeExtension')", function () {
    let inputPath = getFixturePath("index.html");
    let resourceTypeExtension = ".foo";

    let fakeResourceType = new ResourceType();
    fakeResourceType.mode = "unknown";
    this.env.resourceTypes.set(resourceTypeExtension, fakeResourceType);

    (() => loadResourceFile(this.env, inputPath, resourceTypeExtension))
      .should.throw("Resource mode 'unknown' is not defined.");
  });


  it("returns a promise", function () {
    let inputPath = getFixturePath("index.html");
    loadResourceFile(this.env, inputPath)
      .should.be.a.Promise();
  });

});
