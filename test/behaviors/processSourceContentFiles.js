// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.


import path from "path";

import given from "mocha-testdata";
import should from "should";

import Environment from "../../lib/Environment";
import PluginContext from "../../lib/PluginContext";
import ResourceType from "../../lib/ResourceType";
import processSourceContentFiles from "../../lib/behaviors/processSourceContentFiles";

import FakeGenerator from "../fakes/FakeGenerator";
import FakeMode from "../fakes/FakeMode";
import FakeTransformer from "../fakes/FakeTransformer";


function getFixturePath(relativePath) {
  return path.resolve(__dirname, "../fixtures/project-without-files", relativePath);
}


describe("behaviors/processSourceContentFiles", function () {

  beforeEach(function () {
    this.env = new Environment();
    this.env.projectRootPath = getFixturePath("");
    this.env.modes.set("text", new FakeMode());
    this.env.generators.set("standard", new FakeGenerator());

    let defaultResourceType = new ResourceType();
    this.env.resourceTypes.set("*", defaultResourceType);

    let markdownResourceType = new ResourceType();
    markdownResourceType.defaultTargetExtension = ".html";
    this.env.resourceTypes.set(".md", markdownResourceType);

    let nunjucksResourceType = new ResourceType();
    nunjucksResourceType.defaultTargetExtension = ".json";
    this.env.resourceTypes.set(".nunjucks", nunjucksResourceType);
  });


  it("is a function", function () {
    processSourceContentFiles
      .should.be.a.Function();
  });

  it("is named 'processSourceContentFiles'", function () {
    processSourceContentFiles.name
      .should.be.eql("processSourceContentFiles");
  });


  it("returns a promise", function () {
    let result = processSourceContentFiles(this.env)
    result
      .should.be.a.Promise();

    // It is important to wait until the behavior resolves before advancing to the next
    // unit test since a race condition will otherwise occur causing other tests to
    // intermittently fail.
    return result;
  });


  it("fulfills its promise", function () {
    return processSourceContentFiles(this.env)
      .should.be.fulfilled();
  });

  it("rejects with error", function () {
    this.env.behaviors.saveResourceFile = function (env, outputFilePath, outputResource) {
      return Promise.reject(new Error("Failed to save generated resource!"));
    };

    return this.env.build()
      .should.be.rejectedWith("Failed to save generated resource!");
  });


  it("produces expected output files", function () {
    let outputFilePaths = [ ];
    let outputResourceBodies = [ ];

    this.env.behaviors.saveResourceFile = function (env, outputFilePath, outputResource) {
      outputFilePaths.push(outputFilePath);
      outputResourceBodies.push(outputResource.body);
      return Promise.resolve();
    };

    return this.env.build()
      .then(() => {
        outputFilePaths.sort()
          .should.be.eql([
            getFixturePath("output/abc.json"),
            getFixturePath("output/index.html"),
          ]);

        outputResourceBodies
          .should.be.eql([
            "Fake body!",
            "Fake body!",
          ]);
      });
  });

});
