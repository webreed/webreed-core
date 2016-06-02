// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.

"use strict";


const path = require("path");

const given = require("mocha-testdata");
const should = require("should");

const Environment = require("../../lib/Environment").Environment;
const ProjectConfig = require("../../lib/ProjectConfig").ProjectConfig;
const ResourceType = require("../../lib/ResourceType").ResourceType;


describe("ProjectConfig", function () {

  beforeEach(function () {
    this.env = new Environment();
    this.env.projectRootPath = path.resolve(__dirname, "../fixtures/project-with-config");

    let fakeYamlResourceType = new ResourceType();
    this.env.resourceTypes.set(".yaml", fakeYamlResourceType);

    this.env.behaviors.set("loadResourceFile", (env) => {
      return Promise.resolve(env.createResource());
    });
    this.env.behaviors.set("decodeResource", (env, resource) => {
      return {
        "title": "Example Site!",
        "authors": [
          {
            "name": "admin",
            "title": "Administrator"
          }
        ]
      };
    });

    this.projectConfig = new ProjectConfig();
  });


  it("is named 'ProjectConfig'", function () {
    ProjectConfig.name
      .should.be.eql("ProjectConfig");
  });


  describe("#constructor()", function () {

    it("is a function", function () {
      ProjectConfig.prototype.constructor
        .should.be.a.Function();
    });

  });

  describe("#get(path, [defaultValue])", function () {

    it("is a function", function () {
      this.projectConfig.get
        .should.be.a.Function();
    });

    it("throws error when invoked whilst configuration is being loaded", function () {
      this.projectConfig.load(this.env);
      (() => this.projectConfig.get("foo"))
        .should.throw("Cannot access configuration until it has been loaded.");
    });

    given( "abc.def()", "abc.def;require('fs')", "abc.def/ghi", "abc.def=42" ).
    it("throws error when argument 'path' contains invalid characters", function (invalidPath) {
      (() => this.projectConfig.get(invalidPath))
        .should.throw(`Config path '${invalidPath}' contains one or more invalid characters.`);
    });

    given( "does-not-exist", "does/not.exist" ).
    it("returns the provided default value when configuration is otherwise undefined", function (path) {
      this.projectConfig.get(path, 42)
        .should.be.eql(42);
    });

    given([
      [ "site.title", "Example Site!" ],
      [ "site.authors", [ { "name": "admin", "title": "Administrator" } ] ],
      [ "site.authors[0]", { "name": "admin", "title": "Administrator" } ],
      [ "site.authors[0].name", "admin" ],
      [ "site.authors[0].title", "Administrator" ],
      [ "abc/def.title", "Example Site!" ]
    ]).
    it("returns expected value from configuration", function (path, expectedValue) {
      return this.projectConfig.load(this.env)
        .then(() => {
          this.projectConfig.get(path)
            .should.be.eql(expectedValue);
        });
    });

  });

  describe("#load(env)", function () {

    it("is a function", function () {
      this.projectConfig.load
        .should.be.a.Function();
    });

    it("returns a promise", function () {
      let result = this.projectConfig.load(this.env);
      result
        .should.be.a.Promise();
      return result;
    });

  });

});
