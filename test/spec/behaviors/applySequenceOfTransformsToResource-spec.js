// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.

"use strict";


const given = require("mocha-testdata");
const should = require("should");
const Observable = require("rxjs").Observable;

const Environment = require("../../../lib/Environment").Environment;
const PluginContext = require("../../../lib/PluginContext").PluginContext;
const ResourceType = require("../../../lib/ResourceType").ResourceType;
const applySequenceOfTransformsToResource = require("../../../lib/behaviors/applySequenceOfTransformsToResource").applySequenceOfTransformsToResource;

const FakeTransformer = require("../../fakes/FakeTransformer").FakeTransformer;
const FakeErrorTransformer = require("../../fakes/FakeErrorTransformer").FakeErrorTransformer;


describe("behaviors/applySequenceOfTransformsToResource", function () {

  beforeEach(function () {
    this.env = new Environment();

    this.env.transformers.set("fake-1", new FakeTransformer("a"));
    this.env.transformers.set("fake-2", new FakeTransformer("b"));
    this.env.transformers.set("fake-3", new FakeTransformer("c"));

    this.env.transformers.set("fake-two-pages", new FakeTransformer("two-pages", 2));

    this.env.transformers.set("always-fails", new FakeErrorTransformer());
  });


  it("is a function", function () {
    applySequenceOfTransformsToResource
      .should.be.a.Function();
  });

  it("is named 'applySequenceOfTransformsToResource'", function () {
    applySequenceOfTransformsToResource.name
      .should.be.eql("applySequenceOfTransformsToResource");
  });


  it("throws error when transformer is not defined", function () {
    let resource = this.env.createResource();
    let resourceType = new ResourceType();
    let transformers = [ new PluginContext("transformer-that-is-not-defined") ];

    (() => applySequenceOfTransformsToResource(this.env, resource, resourceType, transformers))
      .should.throw("Transformer 'transformer-that-is-not-defined' is not defined.");
  });


  it("returns an observable stream", function () {
    let resource = this.env.createResource();
    let resourceType = new ResourceType();
    let transformers = [ ];

    applySequenceOfTransformsToResource(this.env, resource, resourceType, transformers)
      .should.be.instanceOf(Observable);
  });

  it("resolves with an output `Resource`", function () {
    let resource = this.env.createResource({ foo: 42 });
    let resourceType = new ResourceType();
    let transformers = [ ];

    return applySequenceOfTransformsToResource(this.env, resource, resourceType, transformers)
      .toPromise()
      .should.eventually.have.property("foo", 42);
  });

  it("rejects with error from transformer plugin", function () {
    let resource = this.env.createResource();
    let resourceType = new ResourceType();
    let transformers = [ new PluginContext("always-fails") ];

    return applySequenceOfTransformsToResource(this.env, resource, resourceType, transformers)
      .toPromise()
      .should.be.rejectedWith("transform failed!");
  });


  it("provides correct arguments to the transformers' 'transform' function", function () {
    let fakeTransformer = this.env.transformers.get("fake-1");

    let resource = this.env.createResource({ inputProperty: 42 });
    let resourceType = new ResourceType();
    let transformers = [ new PluginContext("fake-1", { instanceProperty: 42 }) ];

    return applySequenceOfTransformsToResource(this.env, resource, resourceType, transformers)
      .toPromise()
      .then(() => {
        fakeTransformer.lastTransformArguments[0].inputProperty
          .should.be.eql(42);

        fakeTransformer.lastTransformArguments[1].resourceType
          .should.be.exactly(resourceType);
        fakeTransformer.lastTransformArguments[1].transformer
          .should.have.properties({
            name: "fake-1",
            options: { instanceProperty: 42 }
          });
      });
  });

  it("applies transformations in the correct order", function () {
    let resource = this.env.createResource({ body: "start" });
    let resourceType = new ResourceType();
    let transformers = [
      new PluginContext("fake-1"),
      new PluginContext("fake-2"),
      new PluginContext("fake-3")
    ];

    return applySequenceOfTransformsToResource(this.env, resource, resourceType, transformers)
      .toPromise()
      .should.eventually.have.property("body", "start,a,b,c");
  });

  it("resolves with multiple outputs", function () {
    let resource = this.env.createResource({ body: "start" });
    let resourceType = new ResourceType();
    let transformers = [
      new PluginContext("fake-two-pages"),
      new PluginContext("fake-1"),
      new PluginContext("fake-2")
    ];

    return applySequenceOfTransformsToResource(this.env, resource, resourceType, transformers)
      .toArray()
      .toPromise()
      .then(results => {
        results.length
          .should.be.eql(2);

        results[0]
          .should.have.properties({
            page: 1,
            body: "start,two-pages,a,b"
          });
        results[1]
          .should.have.properties({
            page: 2,
            body: "start,two-pages,a,b"
          });
      });
  });

});
