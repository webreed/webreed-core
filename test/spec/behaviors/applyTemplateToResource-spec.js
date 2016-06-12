// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.

"use strict";


const given = require("mocha-testdata");
const should = require("should");
const Observable = require("rxjs").Observable;

const Environment = require("../../../lib/Environment").Environment;
const PluginContext = require("../../../lib/PluginContext").PluginContext;
const ResourceType = require("../../../lib/ResourceType").ResourceType;
const applyTemplateToResource = require("../../../lib/behaviors/applyTemplateToResource").applyTemplateToResource;

const FakeErrorTemplateEngine = require("../../fakes/FakeErrorTemplateEngine").FakeErrorTemplateEngine;
const FakePaginatedTemplateEngine = require("../../fakes/FakePaginatedTemplateEngine").FakePaginatedTemplateEngine;
const FakeTemplateEngine = require("../../fakes/FakeTemplateEngine").FakeTemplateEngine;


describe("behaviors/applyTemplateToResource", function () {

  beforeEach(function () {
    this.env = new Environment();
    this.env.templateEngines.set("nunjucks", new FakeTemplateEngine());
    this.env.templateEngines.set("always-fails", new FakeErrorTemplateEngine());
    this.env.templateEngines.set("paginated", new FakePaginatedTemplateEngine());

    let nunjucksResourceType = new ResourceType();
    nunjucksResourceType.templateEngine = new PluginContext("nunjucks", { instanceProperty: 42 });
    this.env.resourceTypes.set(".nunjucks", nunjucksResourceType);

    let alwaysFailsResourceType = new ResourceType();
    alwaysFailsResourceType.templateEngine = new PluginContext("always-fails");
    this.env.resourceTypes.set(".always-fails", alwaysFailsResourceType);

    let paginatedResourceType = new ResourceType();
    paginatedResourceType.templateEngine = new PluginContext("paginated");
    this.env.resourceTypes.set(".paginated", paginatedResourceType);

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
      .should.be.instanceOf(Observable);
  });

  it("resolves with an output `Resource`", function () {
    let resource = this.env.createResource();
    let templateName = "test.nunjucks";

    return applyTemplateToResource(this.env, resource, templateName)
      .toPromise()
      .should.eventually.have.properties({
        body: "Template Output: [[test.nunjucks]]"
      });
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

    let resource = this.env.createResource({
      _baseUrl: "http://example.com",
      _path: "test",
      _extension: ".html",
      inputProperty: 42
    });

    let templateName = "test.nunjucks";
    let templateProperties = { extraTemplateProperty: 72 };

    return applyTemplateToResource(this.env, resource, templateName, templateProperties)
      .toPromise()
      .then(() => {
        fakeTemplateEngine.lastRenderTemplateArguments[0]
          .should.be.eql("test.nunjucks");

        fakeTemplateEngine.lastRenderTemplateArguments[1].content.inputProperty
          .should.be.eql(42);
        fakeTemplateEngine.lastRenderTemplateArguments[1].extraTemplateProperty
          .should.be.eql(72);

        fakeTemplateEngine.lastRenderTemplateArguments[2].templateEngine
          .should.have.properties({
            name: "nunjucks",
            options: { instanceProperty: 42 }
          });
        fakeTemplateEngine.lastRenderTemplateArguments[2].url
          .should.be.eql("http://example.com/test.html");
      });
  });

  it("provides pagination provider to template engine when resource can be paginated", function () {
    let fakeTemplateEngine = this.env.templateEngines.get("nunjucks");

    let resource = this.env.createResource({ _path: "test" });
    let templateName = "test.nunjucks";

    return applyTemplateToResource(this.env, resource, templateName)
      .toPromise()
      .then(() => {
        fakeTemplateEngine.lastRenderTemplateArguments[2].paginationProvider.paginate
          .should.be.a.Function();
      });
  });

  it("does not provide pagination provider to template engine when resource cannot be paginated", function () {
    let fakeTemplateEngine = this.env.templateEngines.get("nunjucks");

    let resource = this.env.createResource();
    let templateName = "test.nunjucks";

    return applyTemplateToResource(this.env, resource, templateName)
      .toPromise()
      .then(() => {
        should( fakeTemplateEngine.lastRenderTemplateArguments[2].paginationProvider )
          .be.undefined();
      });
  });

  it("augments resource with page key when paginated", function () {
    let resource = this.env.createResource({ _path: "blog" });
    let templateName = "test.paginated";

    return applyTemplateToResource(this.env, resource, templateName)
      .toPromise()
      .then(outputResource => {
        outputResource._path
          .should.be.eql("blog");
        outputResource._page
          .should.be.eql("index");
      });
  });

  it("updates resource path and page key when paginating an already paginated resource", function () {
    let resource = this.env.createResource({ _path: "blog", _page: "key" });
    let templateName = "test.paginated";

    return applyTemplateToResource(this.env, resource, templateName)
      .toPromise()
      .then(outputResource => {
        outputResource._path
          .should.be.eql("blog/key");
        outputResource._page
          .should.be.eql("index");
      });
  });

});
