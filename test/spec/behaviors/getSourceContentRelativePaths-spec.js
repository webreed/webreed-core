// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.

"use strict";


const path = require("path");

const given = require("mocha-testdata");
const should = require("should");
const Observable = require("rxjs").Observable;

const Environment = require("../../../lib/Environment").Environment;
const getSourceContentRelativePaths = require("../../../lib/behaviors/getSourceContentRelativePaths").getSourceContentRelativePaths;


describe("behaviors/getSourceContentRelativePaths", function () {

  beforeEach(function () {
    this.env = new Environment();
    this.env.projectRootPath = path.resolve(__dirname, "../../fixtures/project-with-excluded-content");
  });


  it("is a function", function () {
    getSourceContentRelativePaths
      .should.be.a.Function();
  });

  it("is named 'getSourceContentRelativePaths'", function () {
    getSourceContentRelativePaths.name
      .should.be.eql("getSourceContentRelativePaths");
  });


  it("returns an observable", function () {
    getSourceContentRelativePaths(this.env)
      .should.be.instanceOf(Observable);
  });

  it("resolves with the expected source content paths", function () {
    return getSourceContentRelativePaths(this.env)
      .toArray().toPromise()
      .then(results =>
        new Set(results).should.be.eql(new Set([
          "blog/cat.png",
          "blog/index.md",
          "about.md",
          "dog.png"
        ]))
      );
  });

  it("resolves with the expected source config paths", function () {
    return getSourceContentRelativePaths(this.env, "config")
      .toArray().toPromise()
      .then(results =>
        new Set(results).should.be.eql(new Set([
          "site.yaml",
          "authors/admin.json",
          "authors/kruncher.yaml"
        ]))
      );
  });

});
