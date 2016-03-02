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
import build from "../../src/behaviors/build";

// Test
import FakeGenerator from "../fakes/FakeGenerator";
import FakeMode from "../fakes/FakeMode";


function getFixturePath(relativePath) {
  return path.resolve(__dirname, "../fixtures/project-without-files", relativePath);
}


describe("behaviors/build", function () {

  beforeEach(function () {
    this.env = new Environment();
    this.env.projectRootPath = getFixturePath("");
    this.env.modes.set("fake", new FakeMode());
    this.env.generators.set("standard", new FakeGenerator());

    let defaultResourceType = new ResourceType();
    defaultResourceType.mode = "fake";
    this.env.resourceTypes.set("*", defaultResourceType);
  });


  it("is a function", function () {
    build
      .should.be.a.Function();
  });

  it("is named 'build'", function () {
    build.name
      .should.be.eql("build");
  });


  it("throws error when argument 'env' is not a webreed environment", function () {
    (() => build(null))
      .should.throw("argument 'env' must be a webreed environment");
  });

  it("returns a promise", function () {
    let result = build(this.env)
    result
      .should.be.a.Promise();

    // It is important to wait until the behavior resolves before advancing to the next
    // unit test since a race condition will otherwise occur causing other tests to
    // intermittently fail.
    return result;
  });

  it("fulfills its promise", function () {
    return build(this.env)
      .should.be.fulfilled();
  });


  it("invokes behavior 'processSourceContentFiles'", function () {
    let invokedProcessSourceContentFiles = false;

    this.env.behaviors.processSourceContentFiles = function (env) {
      invokedProcessSourceContentFiles = true;
      env.behaviors.__proto__.processSourceContentFiles.apply(null, arguments);
    };

    return build(this.env)
      .then(() => {
        invokedProcessSourceContentFiles
          .should.be.true();
      });
  });

  it("invokes behavior 'copyFilesToOutput'", function () {
    let invokedCopyFilesToOutput = false;

    this.env.behaviors.copyFilesToOutput = function (env) {
      invokedCopyFilesToOutput = true;
      env.behaviors.__proto__.copyFilesToOutput.apply(null, arguments);
    };

    return build(this.env)
      .then(() => {
        invokedCopyFilesToOutput
          .should.be.true();
      });
  });

});
