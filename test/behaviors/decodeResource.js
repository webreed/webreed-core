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
import decodeResource from "../../src/behaviors/decodeResource";

// Test
import FakeErrorHandler from "../fakes/FakeErrorHandler";
import FakeHandler from "../fakes/FakeHandler";


describe("behaviors/decodeResource", function () {

  beforeEach(function () {
    this.env = new Environment();
    this.env.handlers.set("fake", new FakeHandler());
    this.env.handlers.set("always-fails", new FakeErrorHandler());
  });


  it("is a function", function () {
    decodeResource
      .should.be.a.Function();
  });

  it("is named 'decodeResource'", function () {
    decodeResource.name
      .should.be.eql("decodeResource");
  });


  it("throws error when argument 'env' is not a webreed environment", function () {
    let sourceResource = this.env.createResource();
    let resourceType = new ResourceType();

    (() => decodeResource(null, sourceResource, resourceType))
      .should.throw("argument 'env' must be a webreed environment");
  });

  given( undefined, null, 42, "" ).
  it("throws error when argument 'sourceResource' is not a `Resource`", function (sourceResource) {
    let resourceType = new ResourceType();

    (() => decodeResource(this.env, sourceResource, resourceType))
      .should.throw("argument 'sourceResource' must be a `Resource`");
  });

  given( undefined, null, 42, "" ).
  it("throws error when argument 'resourceType' is not a `ResourceType`", function (resourceType) {
    let sourceResource = this.env.createResource();

    (() => decodeResource(this.env, sourceResource, resourceType))
      .should.throw("argument 'resourceType' must be a `ResourceType`");
  });


  it("throws error when resource type references an unknown handler", function () {
    let sourceResource = this.env.createResource();
    let resourceType = new ResourceType();
    resourceType.handler = new PluginContext("handler-that-is-not-defined");

    (() => decodeResource(this.env, sourceResource, resourceType))
      .should.throw("Content handler 'handler-that-is-not-defined' is not defined.");
  });


  it("returns an observable stream of output resources", function () {
    let sourceResource = this.env.createResource();
    let resourceType = new ResourceType();

    decodeResource(this.env, sourceResource, resourceType)
      .should.be.instanceOf(Rx.Observable);
  });

  it("produces an output `Resource`", function () {
    let sourceResource = this.env.createResource();
    let resourceType = new ResourceType();

    return decodeResource(this.env, sourceResource, resourceType)
      .reduce((a, outputResource) => outputResource, null)
      .toPromise()
      .should.eventually.be.instanceOf(Resource);
  });

  it("rejects with error from content handler", function () {
    let sourceResource = this.env.createResource();
    let resourceType = new ResourceType();
    resourceType.handler = new PluginContext("always-fails");

    return decodeResource(this.env, sourceResource, resourceType)
      .toPromise()
      .should.be.rejectedWith("decode failed!");
  });


  it("provides correct arguments to the content handler's 'decode' function", function () {
    let fakeHandler = this.env.handlers.get("fake");

    let sourceResource = this.env.createResource({ inputProperty: 42 });
    let resourceType = new ResourceType();
    resourceType.handler = new PluginContext("fake", { foo: 123 });

    return decodeResource(this.env, sourceResource, resourceType)
      .toPromise()
      .then(() => {
        fakeHandler.lastDecodeArguments[0].inputProperty
          .should.be.eql(42);

        fakeHandler.lastDecodeArguments[1].handler
          .should.have.properties({
            name: "fake",
            options: { foo: 123 }
          });
        fakeHandler.lastDecodeArguments[1].resourceType
          .should.be.exactly(resourceType);
      });
  });

  it("produces the decoded `Resource`", function () {
    let sourceResource = this.env.createResource({ body: "boo!" });
    let resourceType = new ResourceType();
    resourceType.handler = new PluginContext("fake");

    return decodeResource(this.env, sourceResource, resourceType)
      .reduce((a, outputResource) => outputResource, null)
      .toPromise()
      .should.eventually.have.property("body", "decoded[boo!]");
  });

  it("produces multiple outputs", function () {
    let sourceResource = this.env.createResource({ body: "boo!" });
    let resourceType = new ResourceType();
    resourceType.handler = new PluginContext("fake", { pageCount: 2 });

    return decodeResource(this.env, sourceResource, resourceType)
      .toArray()
      .toPromise()
      .then(results => {
        results.length
          .should.be.eql(2);

        results[0]
          .should.have.properties({
            page: 1,
            body: "decoded[boo!]"
          });
        results[1]
          .should.have.properties({
            page: 2,
            body: "decoded[boo!]"
          });
      });
  });

});