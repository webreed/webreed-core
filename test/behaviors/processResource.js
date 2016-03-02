// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.


// Packages
import Rx from "rxjs";
import given from "mocha-testdata";
import should from "should";

// Project
import Environment from "../../src/Environment";
import PluginContext from "../../src/PluginContext";
import Resource from "../../src/Resource";
import ResourceType from "../../src/ResourceType";
import processResource from "../../src/behaviors/processResource";

// Test
import FakeErrorTransformer from "../fakes/FakeErrorTransformer";


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


  given( undefined, null, 42, "" ).
  it("throws error when argument 'env' is not a webreed environment", function (env) {
    let resource = this.env.createResource();
    let resourceType = new ResourceType();

    (() => processResource(env, resource, resourceType))
      .should.throw("argument 'env' must be a webreed environment");
  });

  given( undefined, null, 42, "" ).
  it("throws error when argument 'resource' is not a `Resource`", function (resource) {
    let resourceType = new ResourceType();

    (() => processResource(this.env, resource, resourceType))
      .should.throw("argument 'resource' must be a `Resource`");
  });

  given( undefined, null, 42, "" ).
  it("throws error when argument 'resourceType' is not a `ResourceType`", function (resourceType) {
    let resource = this.env.createResource();

    (() => processResource(this.env, resource, resourceType))
      .should.throw("argument 'resourceType' must be a `ResourceType`");
  });


  it("returns an observable stream", function () {
    let resource = this.env.createResource();
    let resourceType = new ResourceType();

    processResource(this.env, resource, resourceType)
      .should.be.instanceOf(Rx.Observable);
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
