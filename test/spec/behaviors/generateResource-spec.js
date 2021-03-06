// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.

"use strict";


const given = require("mocha-testdata");
const should = require("should");
const Observable = require("rxjs").Observable;

const Environment = require("../../../lib/Environment").Environment;
const PluginContext = require("../../../lib/PluginContext").PluginContext;
const ResourceType = require("../../../lib/ResourceType").ResourceType;
const generateResource = require("../../../lib/behaviors/generateResource").generateResource;

const FakeErrorGenerator = require("../../fakes/FakeErrorGenerator").FakeErrorGenerator;
const FakeGenerator = require("../../fakes/FakeGenerator").FakeGenerator;


describe("behaviors/generateResource", function () {

  beforeEach(function () {
    this.env = new Environment();
    this.env.generators.set("standard", new FakeGenerator());
    this.env.generators.set("always-fails", new FakeErrorGenerator());
  });


  it("is a function", function () {
    generateResource
      .should.be.a.Function();
  });

  it("is named 'generateResource'", function () {
    generateResource.name
      .should.be.eql("generateResource");
  });


  it("throws error when resource references an unknown generator", function () {
    let resource = this.env.createResource({ _generator: "generator-that-does-not-exist" });
    let resourceType = new ResourceType();

    (() => generateResource(this.env, resource, resourceType))
      .should.throw("Generator 'generator-that-does-not-exist' is not defined.");
  });

  it("throws error when resource type references an unknown generator", function () {
    let resource = this.env.createResource();
    let resourceType = new ResourceType();
    resourceType.generator = new PluginContext("generator-that-does-not-exist");

    (() => generateResource(this.env, resource, resourceType))
      .should.throw("Generator 'generator-that-does-not-exist' is not defined.");
  });


  it("returns an observable stream", function () {
    let resource = this.env.createResource();
    let resourceType = new ResourceType();

    generateResource(this.env, resource, resourceType)
      .should.be.instanceOf(Observable);
  });

  it("resolves with an output `Resource`", function () {
    let resource = this.env.createResource();
    let resourceType = new ResourceType();

    return generateResource(this.env, resource, resourceType)
      .reduce((a, outputResource) => a || outputResource.wentThroughFakeGenerator, false)
      .toPromise()
      .should.eventually.be.true();
  });

  it("rejects with error from generator", function () {
    let resource = this.env.createResource({ _generator: "always-fails" });
    let resourceType = new ResourceType();

    return generateResource(this.env, resource, resourceType)
      .toPromise()
      .should.be.rejectedWith("generate failed!");
  });


  it("provides correct arguments to the generator's 'generate' function", function () {
    let fakeGenerator = this.env.generators.get("standard");
    let instanceOptions = { key: "value" };

    let resource = this.env.createResource({ inputProperty: 42 });
    let resourceType = new ResourceType();
    resourceType.generator = new PluginContext("standard", instanceOptions);

    return generateResource(this.env, resource, resourceType)
      .toPromise()
      .then(() => {
        fakeGenerator.lastGenerateArguments[0].inputProperty
          .should.be.eql(42);

        fakeGenerator.lastGenerateArguments[1].generator
          .should.have.properties({
            name: "standard",
            options: instanceOptions
          });
        fakeGenerator.lastGenerateArguments[1].resourceType
          .should.be.exactly(resourceType);
      });
  });

});
