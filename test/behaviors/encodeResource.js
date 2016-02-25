// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.


// Packages
import given from "mocha-testdata";
import should from "should";

// Project
import Environment from "../../src/Environment";
import PluginContext from "../../src/PluginContext";
import Resource from "../../src/Resource";
import ResourceType from "../../src/ResourceType";
import encodeResource from "../../src/behaviors/encodeResource";

// Test
import FakeErrorHandler from "../fakes/FakeErrorHandler";
import FakeHandler from "../fakes/FakeHandler";


describe("behaviors/encodeResource", function () {

  beforeEach(function () {
    this.env = new Environment();
    this.env.handlers.set("fake", new FakeHandler());
    this.env.handlers.set("alwaysFails", new FakeErrorHandler());
  });


  it("is a function", function () {
    encodeResource
      .should.be.a.Function();
  });

  it("is named 'encodeResource'", function () {
    encodeResource.name
      .should.be.eql("encodeResource");
  });


  it("throws error when argument 'env' is not a webreed environment", function () {
    let resource = this.env.createResource();
    let resourceType = new ResourceType();

    (() => encodeResource(null, resource, resourceType))
      .should.throw("argument 'env' must be a webreed environment");
  });

  given( undefined, null, 42, "" ).
  it("throws error when argument 'resource' is not a `Resource`", function (resource) {
    let resourceType = new ResourceType();

    (() => encodeResource(this.env, resource, resourceType))
      .should.throw("argument 'resource' must be a `Resource`");
  });

  given( undefined, null, 42, "" ).
  it("throws error when argument 'resourceType' is not a `ResourceType`", function (resourceType) {
    let resource = this.env.createResource();

    (() => encodeResource(this.env, resource, resourceType))
      .should.throw("argument 'resourceType' must be a `ResourceType`");
  });


  it("throws error when resource type references an unknown handler", function () {
    let resource = this.env.createResource();
    let resourceType = new ResourceType();
    resourceType.handler = new PluginContext("handler-that-is-not-defined");

    (() => encodeResource(this.env, resource, resourceType))
      .should.throw("Content handler 'handler-that-is-not-defined' is not defined.");
  });


  it("returns a promise", function () {
    let resource = this.env.createResource();
    let resourceType = new ResourceType();

    encodeResource(this.env, resource, resourceType)
      .should.be.a.Promise();
  });

  it("produces an output `Resource`", function () {
    let resource = this.env.createResource();
    let resourceType = new ResourceType();

    return encodeResource(this.env, resource, resourceType)
      .should.eventually.be.instanceOf(Resource);
  });

  it("rejects with error from content handler", function () {
    let resource = this.env.createResource();
    let resourceType = new ResourceType();
    resourceType.handler = new PluginContext("alwaysFails");

    return encodeResource(this.env, resource, resourceType)
      .should.be.rejectedWith("encode failed!");
  });


  it("provides correct arguments to the content handler's 'encode' function", function () {
    let fakeHandler = this.env.handlers.get("fake");

    let resource = this.env.createResource({ inputProperty: 42 });
    let resourceType = new ResourceType();
    resourceType.handler = new PluginContext("fake", { foo: 123 });

    return encodeResource(this.env, resource, resourceType)
      .then(() => {
        fakeHandler.lastEncodeArguments[0].inputProperty
          .should.be.eql(42);

        fakeHandler.lastEncodeArguments[1].handler
          .should.have.properties({
            name: "fake",
            options: { foo: 123 }
          });
        fakeHandler.lastEncodeArguments[1].resourceType
          .should.be.exactly(resourceType);
      });
  });

  it("produces the encoded `Resource`", function () {
    let resource = this.env.createResource({ body: "boo!" });
    let resourceType = new ResourceType();
    resourceType.handler = new PluginContext("fake");

    return encodeResource(this.env, resource, resourceType)
      .should.eventually.have.property("body", "encoded[boo!]");
  });

});
