// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.


// System
import path from "path";

// Packages
import Rx from "rxjs";
import given from "mocha-testdata";
import should from "should";

// Project
import Environment from "../../src/Environment";
import getSourceContentRelativePaths from "../../src/behaviors/getSourceContentRelativePaths";


describe("behaviors/getSourceContentRelativePaths", function () {

  beforeEach(function () {
    this.env = new Environment();
    this.env.projectRootPath = path.join(path.dirname(__dirname), "fixtures/project-with-excluded-files");
  });


  it("is a function", function () {
    getSourceContentRelativePaths
      .should.be.a.Function();
  });

  it("is named 'getSourceContentRelativePaths'", function () {
    getSourceContentRelativePaths.name
      .should.be.eql("getSourceContentRelativePaths");
  });


  it("throws error when argument 'env' is not a webreed environment", function () {
    (() => getSourceContentRelativePaths(null))
      .should.throw("argument 'env' must be a webreed environment");
  });

  it("returns an observable", function () {
    getSourceContentRelativePaths(this.env)
      .should.be.instanceOf(Rx.Observable);
  });

  it("returns an observable with the expected source content paths", function () {
    return getSourceContentRelativePaths(this.env)
      .toArray()
      .toPromise()
      .then(results => new Set(results)
        .should.be.eql(new Set([
          "blog/cat.png",
          "blog/index.md",
          "about.md",
          "dog.png"
        ]))
      );
  });

});
