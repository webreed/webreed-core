// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.


import given from "mocha-testdata";
import should from "should";
import {Observable} from "rxjs";

import {Environment} from "../../lib/Environment";
import {PluginContext} from "../../lib/PluginContext";
import {ResourceType} from "../../lib/ResourceType";
import {Resource} from "../../lib/Resource";
import {processResource} from "../../lib/behaviors/processResource";

import {FakeErrorTransformer} from "../fakes/FakeErrorTransformer";


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
