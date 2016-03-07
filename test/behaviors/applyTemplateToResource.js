// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.


// Packages
import Rx from "rxjs";
import given from "mocha-testdata";
import should from "should";

// Project
import Environment from "../../lib/Environment";
import PluginContext from "../../lib/PluginContext";
import ResourceType from "../../lib/ResourceType";
import applyTemplateToResource from "../../lib/behaviors/applyTemplateToResource";

// Test
import FakeErrorTemplateEngine from "../fakes/FakeErrorTemplateEngine";
import FakeTemplateEngine from "../fakes/FakeTemplateEngine";


describe("behaviors/applyTemplateToResource", function () {

  beforeEach(function () {
    this.env = new Environment();
    this.env.templateEngines.set("nunjucks", new FakeTemplateEngine());
    this.env.templateEngines.set("always-fails", new FakeErrorTemplateEngine());

    let nunjucksResourceType = new ResourceType();
    nunjucksResourceType.templateEngine = new PluginContext("nunjucks", { instanceProperty: 42 });
    this.env.resourceTypes.set(".nunjucks", nunjucksResourceType);

    let alwaysFailsResourceType = new ResourceType();
    alwaysFailsResourceType.templateEngine = new PluginContext("always-fails");
    this.env.resourceTypes.set(".always-fails", alwaysFailsResourceType);

    this.env.resourceTypes.set(".non-template", new ResourceType());

    let brokenResourceType = new ResourceType();
    brokenResourceType.templateEngine = new PluginContext("undefined-template-engine");
    this.env.resourceTypes.set(".broken", brokenResourceType);
  });


  it("is a function", function () {
    applyTemplateToResource
      .should.be.a.Function();
  });

  it("is named 'applyTemplateToResource'", function () {
    applyTemplateToResource.name
      .should.be.eql("applyTemplateToResource");
  });


  it("throws error when argument 'templateName' is an empty string", function () {
    let resource = this.env.createResource();
    let templateName = "";

    (() => applyTemplateToResource(this.env, resource, templateName))
      .should.throw("argument 'templateName' must be a non-empty string");
  });


  it("throws error when resource type is not associated with a template engine", function () {
    let resource = this.env.createResource();
    let templateName = "test.non-template";

    (() => applyTemplateToResource(this.env, resource, templateName))
      .should.throw("Resource type '.non-template' does not specify a template engine.");
  });

  it("throws error when template engine is not defined", function () {
    let resource = this.env.createResource();
    let templateName = "test.broken";

    (() => applyTemplateToResource(this.env, resource, templateName))
      .should.throw(`Template engine 'undefined-template-engine' is not defined.`)
  });


  it("returns an observable stream", function () {
    let resource = this.env.createResource();
    let templateName = "test.nunjucks";

    applyTemplateToResource(this.env, resource, templateName)
      .should.be.instanceOf(Rx.Observable);
  });

  it("resolves with an output `Resource`", function () {
    let resource = this.env.createResource();
    let templateName = "test.nunjucks";

    return applyTemplateToResource(this.env, resource, templateName)
      .toPromise()
      .should.eventually.be.eql("Template Output: [[test.nunjucks]]");
  });

  it("rejects with error from template engine", function () {
    let resource = this.env.createResource();
    let templateName = "test.always-fails";

    return applyTemplateToResource(this.env, resource, templateName)
      .toPromise()
      .should.be.rejectedWith("renderTemplate failed!");
  });


  it("provides correct arguments to the template engine's 'renderTemplate' function", function () {
    let fakeTemplateEngine = this.env.templateEngines.get("nunjucks");

    let resource = this.env.createResource({ inputProperty: 42 });
    let templateName = "test.nunjucks";

    return applyTemplateToResource(this.env, resource, templateName)
      .toPromise()
      .then(() => {
        fakeTemplateEngine.lastRenderTemplateArguments[0]
          .should.be.eql("test.nunjucks");

        fakeTemplateEngine.lastRenderTemplateArguments[1].inputProperty
          .should.be.eql(42);

        fakeTemplateEngine.lastRenderTemplateArguments[2].templateEngine
          .should.have.properties({
            name: "nunjucks",
            options: { instanceProperty: 42 }
          });
      });
  });

});
