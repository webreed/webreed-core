// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.


import Rx from "rxjs";
import given from "mocha-testdata";
import should from "should";

import Environment from "../../lib/Environment";
import PluginContext from "../../lib/PluginContext";
import ResourceType from "../../lib/ResourceType";
import applyExtensionChainToResource from "../../lib/behaviors/applyExtensionChainToResource";

import FakeErrorTransformer from "../fakes/FakeErrorTransformer";
import FakeTransformer from "../fakes/FakeTransformer";


describe("behaviors/applyExtensionChainToResource", function () {

  beforeEach(function () {
    this.env = new Environment();
    this.env.resourceTypes.set("*", new ResourceType());
  });


  it("is a function", function () {
    applyExtensionChainToResource
      .should.be.a.Function();
  });

  it("is named 'applyExtensionChainToResource'", function () {
    applyExtensionChainToResource.name
      .should.be.eql("applyExtensionChainToResource");
  });


  it("returns an observable stream", function () {
    let resource = this.env.createResource();
    let extensionChain = "";

    applyExtensionChainToResource(this.env, resource, extensionChain)
      .should.be.instanceOf(Rx.Observable);
  });


  it("rejects with error when 'process' transformer is not defined", function () {
    let resource = this.env.createResource({ body: "greetings" });
    let extensionChain = ".html.nunjucks";

    let nunjucksResourceType = new ResourceType();
    nunjucksResourceType.process = [ new PluginContext("transformer-that-is-not-defined") ];
    this.env.resourceTypes.set(".nunjucks", nunjucksResourceType);

    return applyExtensionChainToResource(this.env, resource, extensionChain)
      .toPromise()
      .should.be.rejectedWith("Transformer 'transformer-that-is-not-defined' is not defined.");
  });

  it("rejects with error when 'conversion' transformer is not defined", function () {
    let resource = this.env.createResource({ body: "greetings" });
    let extensionChain = ".html.nunjucks";

    let nunjucksResourceType = new ResourceType();
    nunjucksResourceType.conversions[".html"] = [ new PluginContext("transformer-that-is-not-defined") ];
    this.env.resourceTypes.set(".nunjucks", nunjucksResourceType);

    return applyExtensionChainToResource(this.env, resource, extensionChain)
      .toPromise()
      .should.be.rejectedWith("Transformer 'transformer-that-is-not-defined' is not defined.");
  });

  it("rejects with error from 'process' transformer plugin", function () {
    let resource = this.env.createResource({ body: "greetings" });
    let extensionChain = ".html.nunjucks";

    this.env.transformers
      .set("nunjucks", new FakeTransformer(null, 1, "p.nunjucks<{body}>"))
      .set("alwaysFails", new FakeErrorTransformer());

    let nunjucksResourceType = new ResourceType();
    nunjucksResourceType.process = [ new PluginContext("nunjucks") ];
    this.env.resourceTypes.set(".nunjucks", nunjucksResourceType);

    let htmlResourceType = new ResourceType();
    htmlResourceType.process = [ new PluginContext("alwaysFails") ];
    this.env.resourceTypes.set(".html", htmlResourceType);

    return applyExtensionChainToResource(this.env, resource, extensionChain)
      .toPromise()
      .should.be.rejectedWith("transform failed!");
  });

  it("rejects with error from 'conversion' transformer plugin", function () {
    let resource = this.env.createResource({ body: "greetings" });
    let extensionChain = ".html.nunjucks";

    this.env.transformers
      .set("alwaysFails", new FakeErrorTransformer());

    let nunjucksResourceType = new ResourceType();
    nunjucksResourceType.conversions[".html"] = [ new PluginContext("alwaysFails") ];
    this.env.resourceTypes.set(".nunjucks", nunjucksResourceType);

    return applyExtensionChainToResource(this.env, resource, extensionChain)
      .toPromise()
      .should.be.rejectedWith("transform failed!");
  });


  it("applies transformations in the expected order", function () {
    let resource = this.env.createResource({ body: "greetings" });
    let extensionChain = ".html.md.nunjucks";

    this.env.transformers
      .set("nunjucks", new FakeTransformer(null, 1, "p.nunjucks<{body}>"))
      .set("html", new FakeTransformer(null, 1, "p.html<{body}>"))
      .set("md", new FakeTransformer(null, 1, "p.md<{body}>"))
      .set("foo", new FakeTransformer(null, 1, "p.$<{body}>"))
      .set("nunjucks-to-md", new FakeTransformer(null, 1, "{body}_to_.md"))
      .set("md-to-html", new FakeTransformer(null, 1, "{body}_to_.html"))
      .set("html-to-foo", new FakeTransformer(null, 1, "{body}_to_$"));

    let nunjucksResourceType = new ResourceType();
    nunjucksResourceType.process = [ new PluginContext("nunjucks") ];
    nunjucksResourceType.conversions[".md"] = [ new PluginContext("nunjucks-to-md") ];
    this.env.resourceTypes.set(".nunjucks", nunjucksResourceType);

    let mdResourceType = new ResourceType();
    mdResourceType.process = [ new PluginContext("md") ];
    mdResourceType.conversions[".html"] = [ new PluginContext("md-to-html") ];
    this.env.resourceTypes.set(".md", mdResourceType);

    let htmlResourceType = new ResourceType();
    htmlResourceType.process = [ new PluginContext("html") ];
    htmlResourceType.conversions["$"] = [ new PluginContext("html-to-foo") ];
    this.env.resourceTypes.set(".html", htmlResourceType);

    let fooResourceType = new ResourceType();
    fooResourceType.process = [ new PluginContext("foo") ];
    this.env.resourceTypes.set("$", fooResourceType);

    return applyExtensionChainToResource(this.env, resource, extensionChain)
      .toArray()
      .toPromise()
      .then(outputResources => {
        outputResources.length
          .should.be.eql(1);
        outputResources[0].body
          .should.be.eql("p.$<p.html<p.md<p.nunjucks<greetings>_to_.md>_to_.html>_to_$>");
      });
  });

});
