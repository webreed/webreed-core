// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.


import path from "path";

import fs from "fs-promise";
import given from "mocha-testdata";
import should from "should";

import {Environment} from "../../lib/Environment";
import {clean} from "../../lib/behaviors/clean";


function getFixturePath(relativePath) {
  return path.resolve(__dirname, "../fixtures/empty-project", relativePath);
}


describe("behaviors/clean", function () {

  beforeEach(function () {
    this.env = new Environment();
    this.env.projectRootPath = getFixturePath("");
  });


  it("is a function", function () {
    clean
      .should.be.a.Function();
  });

  it("is named 'clean'", function () {
    clean.name
      .should.be.eql("clean");
  });


  it("returns a promise", function () {
    let result = clean(this.env)
    result
      .should.be.a.Promise();

    // It is important to wait until the behavior resolves before advancing to the next
    // unit test since a race condition will otherwise occur causing other tests to
    // intermittently fail.
    return result;
  });

  it("fulfills its promise", function () {
    return clean(this.env)
      .should.be.fulfilled();
  });

  it("should remove all files from output directory", function () {
    fs.ensureFileSync(this.env.resolvePath("output", "a.txt"), "");
    fs.ensureFileSync(this.env.resolvePath("output", "b.txt"), "");
    fs.ensureFileSync(this.env.resolvePath("output", "c/d.txt"), "");

    return clean(this.env)
      .then(() => {
        let listing = fs.readdirSync(this.env.resolvePath("output"));
        listing.length
          .should.be.eql(0);
      });
  });

});
