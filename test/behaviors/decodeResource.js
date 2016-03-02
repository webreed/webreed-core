// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.


// Packages
import given from "mocha-testdata";
import should from "should";

// Project
import Environment from "../../src/Environment";
import PluginContext from "../../src/PluginContext";
import ResourceType from "../../src/ResourceType";
import decodeResource from "../../src/behaviors/decodeResource";

// Test
import FakeErrorHandler from "../fakes/FakeErrorHandler";
import FakeHandler from "../fakes/FakeHandler";


describe("behaviors/decodeResource", function () {

  beforeEach(function () {
    this.env = new Environment();
    this.env.handlers.set("fake", new FakeHandler());
    this.env.handlers.set("alwaysFails", new FakeErrorHandler());
  });


  it("is a function", function () {
    decodeResource
      .should.be.a.Function();
  });

  it("is named 'decodeResource'", function () {
    decodeResource.name
      .should.be.eql("decodeResource");
  });


  given( undefined, null, 42, "" ).
  it("throws error when argument 'env' is not a webreed environment", function (env) {
    let resource = this.env.createResource();
    let resourceType = new ResourceType();

    (() => decodeResource(env, resource, resourceType))
      .should.throw("argument 'env' must be a webreed environment");
  });

  given( undefined, null, 42, "" ).
  it("throws error when argument 'resource' is not a `Resource`", function (resource) {
    let resourceType = new ResourceType();

    (() => decodeResource(this.env, resource, resourceType))
      .should.throw("argument 'resource' must be a `Resource`");
  });

  given( undefined, null, 42, "" ).
  it("throws error when argument 'resourceType' is not a `ResourceType`", function (resourceType) {
    let resource = this.env.createResource();

    (() => decodeResource(this.env, resource, resourceType))
      .should.throw("argument 'resourceType' must be a `ResourceType`");
  });


  it("throws error when resource type references an unknown handler", function () {
    let resource = this.env.createResource();
    let resourceType = new ResourceType();
    resourceType.handler = new PluginContext("handler-that-is-not-defined");

    (() => decodeResource(this.env, resource, resourceType))
      .should.throw("Content handler 'handler-that-is-not-defined' is not defined.");
  });


  it("returns a promise", function () {
    let resource = this.env.createResource();
    let resourceType = new ResourceType();

    decodeResource(this.env, resource, resourceType)
      .should.be.a.Promise();
  });

  it("resolves with body of input resource when no content handler is defined", function () {
    let resource = this.env.createResource({ body: "Foo!" });
    let resourceType = new ResourceType();

    return decodeResource(this.env, resource, resourceType)
      .should.eventually.be.eql("Foo!");
  });

  it("rejects with error from content handler", function () {
    let resource = this.env.createResource();
    let resourceType = new ResourceType();
    resourceType.handler = new PluginContext("alwaysFails");

    return decodeResource(this.env, resource, resourceType)
      .should.be.rejectedWith("decode failed!");
  });


  it("provides correct arguments to the content handler's 'decode' function", function () {
    let fakeHandler = this.env.handlers.get("fake");

    let resource = this.env.createResource({ body: "Foo!", inputProperty: 42 });
    let resourceType = new ResourceType();
    resourceType.handler = new PluginContext("fake", { foo: 123 });

    return decodeResource(this.env, resource, resourceType)
      .then(() => {
        fakeHandler.lastDecodeArguments[0]
          .should.be.eql("Foo!");

        fakeHandler.lastDecodeArguments[1].handler
          .should.have.properties({
            name: "fake",
            options: { foo: 123 }
          });
        fakeHandler.lastDecodeArguments[1].resource
          .should.be.exactly(resource);
        fakeHandler.lastDecodeArguments[1].resourceType
          .should.be.exactly(resourceType);
      });
  });

  it("resolves with the decoded data", function () {
    let resource = this.env.createResource({ body: "boo!" });
    let resourceType = new ResourceType();
    resourceType.handler = new PluginContext("fake");

    return decodeResource(this.env, resource, resourceType)
      .should.eventually.be.eql("decoded[boo!]");
  });

});
