// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.


// Packages
import given from "mocha-testdata";
import should from "should";

// Project
import Environment from "../../src/Environment";
import PluginContext from "../../src/PluginContext";
import ResourceType from "../../src/ResourceType";
import resolveGenerator from "../../src/behaviors/resolveGenerator";


describe("behaviors/resolveGenerator", function () {

  beforeEach(function () {
    this.env = new Environment();
  });


  it("is a function", function () {
    resolveGenerator
      .should.be.a.Function();
  });

  it("is named 'resolveGenerator'", function () {
    resolveGenerator.name
      .should.be.eql("resolveGenerator");
  });


  it("throws error when argument 'env' is not a webreed environment", function () {
    (() => resolveGenerator(null))
      .should.throw("argument 'env' must be a webreed environment");
  });

  it("throws error when argument 'resource' is specified but is not an object", function () {
    (() => resolveGenerator(this.env, 42))
      .should.throw("argument 'resource' must be `null` or an object");
  });

  it("throws error when argument 'resourceType' is specified but is not an object", function () {
    (() => resolveGenerator(this.env, null, 42))
      .should.throw("argument 'resourceType' must be `null` or an object");
  });


  it("throws error when generator (from argument 'resource') is not defined", function () {
    let fakeResource = { _generator: "generator-that-is-not-defined" };
    (() => resolveGenerator(this.env, fakeResource))
      .should.throw(`Generator 'generator-that-is-not-defined' is not defined.`)
  });

  it("throws error when generator (from argument 'resourceType') is not defined", function () {
    let fakeResourceType = new ResourceType();
    fakeResourceType.generator = new PluginContext("generator-that-is-not-defined");

    (() => resolveGenerator(this.env, null, fakeResourceType))
      .should.throw(`Generator 'generator-that-is-not-defined' is not defined.`)
  });

  it("throws error when default generator is not defined", function () {
    (() => resolveGenerator(this.env))
      .should.throw(`Generator 'standard' is not defined.`)
  });


  it("returns resolved generator (from argument 'resource')", function () {
    let fakeGenerator = { value: 42 };
    this.env.generators.set("fake", fakeGenerator);
    let fakeResource = { _generator: "fake" };

    resolveGenerator(this.env, fakeResource)
      .should.be.eql({ name: "fake", generator: fakeGenerator, options: { } });
  });

  it("returns resolved generator (from argument 'resourceType')", function () {
    let fakeGenerator = { value: 42 };
    this.env.generators.set("fake", fakeGenerator);
    let fakeResourceType = new ResourceType();
    fakeResourceType.generator = new PluginContext("fake");

    resolveGenerator(this.env, null, fakeResourceType)
      .should.be.eql({ name: "fake", generator: fakeGenerator, options: { } });
  });

  it("returns resolved default generator", function () {
    let fakeGenerator = { value: 42 };
    this.env.generators.set("abc", fakeGenerator);
    this.env.defaultGeneratorName = "abc";

    resolveGenerator(this.env)
      .should.be.eql({ name: "abc", generator: fakeGenerator, options: { } });
  });

  it("returns extra generator context from associated resource type", function () {
    let fakeGenerator = { value: 42 };
    this.env.generators.set("fake", fakeGenerator);
    let fakeResourceType = new ResourceType();
    fakeResourceType.generator = new PluginContext("fake", { foo: "bar" });

    resolveGenerator(this.env, null, fakeResourceType).options
      .should.be.eql({ foo: "bar" });
  });


  it("resolves generator via alias reference", function () {
    let fakeGenerator = { value: 42 };
    this.env.generators.set("fake-1", fakeGenerator);
    this.env.generators.set("fake-2", "alias-of(fake-1)");
    let fakeResourceType = new ResourceType();
    fakeResourceType.generator = new PluginContext("fake-2");

    resolveGenerator(this.env, null, fakeResourceType)
      .should.be.eql({ name: "fake-1", generator: fakeGenerator, options: { } });
  });

});
