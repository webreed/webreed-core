// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.


// Packages
import given from "mocha-testdata";
import should from "should";

// Project
import Environment from "../../src/Environment";
import ResourceType from "../../src/ResourceType";
import resolveResourceMode from "../../src/behaviors/resolveResourceMode";


describe("behaviors/resolveResourceMode", function () {

  beforeEach(function () {
    this.env = new Environment();
  });


  it("is a function", function () {
    resolveResourceMode
      .should.be.a.Function();
  });

  it("is named 'resolveResourceMode'", function () {
    resolveResourceMode.name
      .should.be.eql("resolveResourceMode");
  });


  given( undefined, null, 42, "" ).
  it("throws error when argument 'env' is not a webreed environment", function (env) {
    (() => resolveResourceMode(env))
      .should.throw("argument 'env' must be a webreed environment");
  });

  given( 42, "" ).
  it("throws error when argument 'resource' is specified but is not an object", function (resource) {
    (() => resolveResourceMode(this.env, resource))
      .should.throw("argument 'resource' must be a `Resource`");
  });

  given( 42, "" ).
  it("throws error when argument 'resourceType' is specified but is not an object", function (resourceType) {
    (() => resolveResourceMode(this.env, null, resourceType))
      .should.throw("argument 'resourceType' must be a `ResourceType`");
  });


  it("throws error when resource mode (from argument 'resource') is not defined", function () {
    let fakeResource = this.env.createResource({ __mode: "mode-that-is-not-defined" });
    (() => resolveResourceMode(this.env, fakeResource))
      .should.throw(`Resource mode 'mode-that-is-not-defined' is not defined.`)
  });

  it("throws error when resource mode (from argument 'resourceType') is not defined", function () {
    let fakeResourceType = new ResourceType();
    fakeResourceType.mode = "mode-that-is-not-defined";

    (() => resolveResourceMode(this.env, null, fakeResourceType))
      .should.throw(`Resource mode 'mode-that-is-not-defined' is not defined.`)
  });

  it("throws error when default resource mode is not defined", function () {
    (() => resolveResourceMode(this.env))
      .should.throw(`Resource mode 'text' is not defined.`)
  });


  it("returns resolved resource mode (from argument 'resource')", function () {
    let fakeResourceMode = { value: 42 };
    this.env.modes.set("fake", fakeResourceMode);
    let fakeResource = this.env.createResource({ __mode: "fake" });

    resolveResourceMode(this.env, fakeResource)
      .should.be.eql({ name: "fake", mode: fakeResourceMode });
  });

  it("returns resolved resource mode (from argument 'resourceType')", function () {
    let fakeResourceMode = { value: 42 };
    this.env.modes.set("fake", fakeResourceMode);
    let fakeResourceType = new ResourceType();
    fakeResourceType.mode = "fake";

    resolveResourceMode(this.env, null, fakeResourceType)
      .should.be.eql({ name: "fake", mode: fakeResourceMode });
  });

  it("returns resolved default resource mode", function () {
    let fakeResourceMode = { value: 42 };
    this.env.modes.set("abc", fakeResourceMode);
    this.env.defaultModeName = "abc";

    resolveResourceMode(this.env)
      .should.be.eql({ name: "abc", mode: fakeResourceMode });
  });


  it("resolves resource mode via alias reference", function () {
    let fakeResourceMode = { value: 42 };
    this.env.modes.set("fake-1", fakeResourceMode);
    this.env.modes.set("fake-2", "alias-of(fake-1)");
    let fakeResourceType = new ResourceType();
    fakeResourceType.mode = "fake-2";

    resolveResourceMode(this.env, null, fakeResourceType)
      .should.be.eql({ name: "fake-1", mode: fakeResourceMode });
  });

});
