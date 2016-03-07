// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.


import path from "path";

import Rx from "rxjs";
import given from "mocha-testdata";
import should from "should";

import Environment from "../../lib/Environment";
import getSourceContentRelativePaths from "../../lib/behaviors/getSourceContentRelativePaths";


describe("behaviors/getSourceContentRelativePaths", function () {

  beforeEach(function () {
    this.env = new Environment();
    this.env.projectRootPath = path.join(path.dirname(__dirname), "fixtures/project-with-excluded-content");
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
      .should.be.instanceOf(Rx.Observable);
  });

  it("resolves with the expected source content paths", function () {
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
