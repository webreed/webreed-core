// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.


import path from "path";

import given from "mocha-testdata";
import should from "should";

import {Environment} from "../../lib/Environment";
import {ResourceType} from "../../lib/ResourceType";
import {build} from "../../lib/behaviors/build";

import {FakeGenerator} from "../fakes/FakeGenerator";
import {FakeMode} from "../fakes/FakeMode";


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

    this.env.behaviors.set("processSourceContentFiles", function (env) {
      invokedProcessSourceContentFiles = true;
      env.behaviors.invokeDefault("processSourceContentFiles");
    });

    return build(this.env)
      .then(() => {
        invokedProcessSourceContentFiles
          .should.be.true();
      });
  });

  it("invokes behavior 'copyFilesToOutput'", function () {
    let invokedCopyFilesToOutput = false;

    this.env.behaviors.set("copyFilesToOutput", function (env) {
      invokedCopyFilesToOutput = true;
      env.behaviors.invokeDefault("copyFilesToOutput");
    });

    return build(this.env)
      .then(() => {
        invokedCopyFilesToOutput
          .should.be.true();
      });
  });

});
