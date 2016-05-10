// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.


import given from "mocha-testdata";
import should from "should";

import {Environment} from "../../../lib/Environment";
import {PluginContext} from "../../../lib/PluginContext";
import {ResourceType} from "../../../lib/ResourceType";
import {resolveTemplateEngine} from "../../../lib/behaviors/resolveTemplateEngine";

import {FakeTemplateEngine} from "../../fakes/FakeTemplateEngine";


describe("behaviors/resolveTemplateEngine", function () {

  beforeEach(function () {
    this.env = new Environment();
    this.env.templateEngines.set("nunjucks", new FakeTemplateEngine());

    let nunjucksResourceType = new ResourceType();
    nunjucksResourceType.templateEngine = new PluginContext("nunjucks", { instanceProperty: 123 });
    this.env.resourceTypes.set(".nunjucks", nunjucksResourceType);

    this.env.resourceTypes.set(".non-template", new ResourceType());

    let brokenResourceType = new ResourceType();
    brokenResourceType.templateEngine = new PluginContext("undefined-template-engine");
    this.env.resourceTypes.set(".broken", brokenResourceType);
  });


  it("is a function", function () {
    resolveTemplateEngine
      .should.be.a.Function();
  });

  it("is named 'resolveTemplateEngine'", function () {
    resolveTemplateEngine.name
      .should.be.eql("resolveTemplateEngine");
  });


  it("throws error when argument 'templateName' is an empty string", function () {
    let templateName = "";
    (() => resolveTemplateEngine(this.env, templateName))
      .should.throw("argument 'templateName' must be a non-empty string");
  });


  it("throws error when resource type is not associated with a template engine", function () {
    let templateName = "test.non-template";
    (() => resolveTemplateEngine(this.env, templateName))
      .should.throw("Resource type '.non-template' does not specify a template engine.");
  });

  it("throws error when template engine is not defined", function () {
    let templateName = "test.broken";
    (() => resolveTemplateEngine(this.env, templateName))
      .should.throw(`Template engine 'undefined-template-engine' is not defined.`)
  });


  it("returns the template engine that is associated with the resource type", function () {
    let fakeTemplateEngine = this.env.templateEngines.get("nunjucks");

    let templateName = "test.nunjucks";
    let resolvedTemplateEngine = resolveTemplateEngine(this.env, templateName);

    resolvedTemplateEngine.name
      .should.be.eql("nunjucks");
    resolvedTemplateEngine.options
      .should.be.eql({ instanceProperty: 123 });
    resolvedTemplateEngine.templateEngine
      .should.be.exactly(fakeTemplateEngine);
  });


  it("resolves template engine via alias reference", function () {
    this.env.templateEngines.set("fake-alias", "alias-of(nunjucks)");

    let fakeResourceType = new ResourceType();
    fakeResourceType.templateEngine = new PluginContext("fake-alias");
    this.env.resourceTypes.set(".fake", fakeResourceType);

    let templateName = "test.fake";
    resolveTemplateEngine(this.env, templateName)
      .should.have.property("name", "nunjucks");
  });

});
