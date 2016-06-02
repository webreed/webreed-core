// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.

"use strict";


const given = require("mocha-testdata");
const should = require("should");
const Observable = require("rxjs").Observable;

const Environment = require("../../../lib/Environment").Environment;
const PluginContext = require("../../../lib/PluginContext").PluginContext;
const ResourceType = require("../../../lib/ResourceType").ResourceType;
const Resource = require("../../../lib/Resource").Resource;
const processResource = require("../../../lib/behaviors/processResource").processResource;

const FakeErrorTransformer = require("../../fakes/FakeErrorTransformer").FakeErrorTransformer;


describe("behaviors/processResource", function () {

  beforeEach(function () {
    this.env = new Environment();
    this.env.transformers.set("transformerAlwaysFails", new FakeErrorTransformer());
  });


  it("is a function", function () {
    processResource
      .should.be.a.Function();
  });

  it("is named 'processResource'", function () {
    processResource.name
      .should.be.eql("processResource");
  });


  it("returns an observable stream", function () {
    let resource = this.env.createResource();
    let resourceType = new ResourceType();

    processResource(this.env, resource, resourceType)
      .should.be.instanceOf(Observable);
  });

  it("resolves with an output `Resource`", function () {
    let resource = this.env.createResource();
    let resourceType = new ResourceType();

    return processResource(this.env, resource, resourceType)
      .reduce((a, outputResource) => outputResource, null)
      .toPromise()
      .should.eventually.be.instanceOf(Resource);
  });

  it("rejects with error from process transformer", function () {
    let resource = this.env.createResource();
    let resourceType = new ResourceType();
    resourceType.process = [ new PluginContext("transformerAlwaysFails") ];

    return processResource(this.env, resource, resourceType)
      .toPromise()
      .should.be.rejectedWith("transform failed!");
  });

});
