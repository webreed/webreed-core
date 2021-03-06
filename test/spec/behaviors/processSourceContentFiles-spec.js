// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.

"use strict";


const path = require("path");

const given = require("mocha-testdata");
const should = require("should");

const Environment = require("../../../lib/Environment").Environment;
const PluginContext = require("../../../lib/PluginContext").PluginContext;
const ResourceType = require("../../../lib/ResourceType").ResourceType;
const processSourceContentFiles = require("../../../lib/behaviors/processSourceContentFiles").processSourceContentFiles;

const FakeGenerator = require("../../fakes/FakeGenerator").FakeGenerator;
const FakeMode = require("../../fakes/FakeMode").FakeMode;
const FakeTransformer = require("../../fakes/FakeTransformer").FakeTransformer;


function getFixturePath(relativePath) {
  return path.resolve(__dirname, "../../fixtures/project-without-files", relativePath);
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
    markdownResourceType.targetExtension = ".html";
    this.env.resourceTypes.set(".md", markdownResourceType);

    let nunjucksResourceType = new ResourceType();
    nunjucksResourceType.targetExtension = ".json";
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
    this.env.behaviors.set("saveResourceFile", function (env, outputFilePath, outputResource) {
      return Promise.reject(new Error("Failed to save generated resource!"));
    });

    return this.env.build()
      .should.be.rejectedWith("Failed to save generated resource!");
  });


  it("produces expected output files", function () {
    let outputFilePaths = [ ];
    let outputResourceBodies = [ ];

    this.env.behaviors.set("saveResourceFile", function (env, outputFilePath, outputResource) {
      outputFilePaths.push(outputFilePath);
      outputResourceBodies.push(outputResource.body);
      return Promise.resolve();
    });

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
