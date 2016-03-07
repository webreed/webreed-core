// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.


import path from "path";

import given from "mocha-testdata";
import should from "should";

import {Environment} from "../../lib/Environment";
import {ResourceType} from "../../lib/ResourceType";
import {saveResourceFile} from "../../lib/behaviors/saveResourceFile";

import {FakeErrorMode} from "../fakes/FakeErrorMode";
import {FakeMode} from "../fakes/FakeMode";


function getOutputPath(relativePath) {
  return path.join(path.resolve("../output"), relativePath);
}


describe("behaviors/saveResourceFile", function () {

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
    saveResourceFile
      .should.be.a.Function();
  });

  it("is named 'saveResourceFile'", function () {
    saveResourceFile.name
      .should.be.eql("saveResourceFile");
  });


  it("throws error when argument 'outputFilePath' is an empty string", function () {
    let outputFilePath = "";
    let resource = this.env.createResource();
    (() => saveResourceFile(this.env, outputFilePath, resource))
      .should.throw("argument 'outputFilePath' must be a non-empty string");
  });


  it("throws error when saving resource with an unknown mode (via argument 'filePath')", function () {
    let outputFilePath = getOutputPath("index.foo");
    let resource = this.env.createResource();

    let fakeResourceType = new ResourceType();
    fakeResourceType.mode = "unknown";
    this.env.resourceTypes.set(".foo", fakeResourceType);

    (() => saveResourceFile(this.env, outputFilePath, resource))
      .should.throw("Resource mode 'unknown' is not defined.");
  });

  it("throws error when loading resource with an unknown mode (via argument 'resourceTypeExtension')", function () {
    let outputFilePath = getOutputPath("index.foo");
    let resource = this.env.createResource();
    let resourceTypeExtension = ".foo";

    let fakeResourceType = new ResourceType();
    fakeResourceType.mode = "unknown";
    this.env.resourceTypes.set(resourceTypeExtension, fakeResourceType);

    (() => saveResourceFile(this.env, outputFilePath, resource, resourceTypeExtension))
      .should.throw("Resource mode 'unknown' is not defined.");
  });


  it("returns a promise", function () {
    let outputFilePath = getOutputPath("index.html");
    let resource = this.env.createResource();

    saveResourceFile(this.env, outputFilePath, resource)
      .should.be.a.Promise();
  });

  it("rejects with error from mode", function () {
    let outputFilePath = getOutputPath("index.always-fails");
    let resource = this.env.createResource();

    saveResourceFile(this.env, outputFilePath, resource)
      .should.be.rejectedWith("readFile failed!");
  });


  it("provides correct arguments to the associated mode's 'saveFile' function", function () {
    let defaultResourceType = this.env.resourceTypes.get("*");
    let fakeMode = this.env.modes.get("fake");

    let outputFilePath = getOutputPath("index.html");
    let resource = this.env.createResource();

    return saveResourceFile(this.env, outputFilePath, resource)
      .then(() => {
        fakeMode.lastWriteFileArguments[0]
          .should.be.eql(outputFilePath);
        fakeMode.lastWriteFileArguments[1]
          .should.be.exactly(resource);
        fakeMode.lastWriteFileArguments[2]
          .should.be.exactly(defaultResourceType);
      });
  });

  it("reverts to 'text' mode when resource type does not specify a mode", function () {
    let fakeTextMode = new FakeMode();
    this.env.modes.set("text", fakeTextMode);
    this.env.resourceTypes.set(".bar", new ResourceType());

    let outputFilePath = getOutputPath("index.bar");
    let resource = this.env.createResource();

    return saveResourceFile(this.env, outputFilePath, resource)
      .then(() => {
        fakeTextMode.lastWriteFileArguments[0]
          .should.be.eql(outputFilePath);
      });
  });

});
