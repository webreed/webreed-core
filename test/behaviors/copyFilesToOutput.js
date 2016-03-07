// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.


import path from "path";

import given from "mocha-testdata";
import glob from "glob";
import rimraf from "rimraf";
import should from "should";

import {Environment} from "../../lib/Environment";
import {copyFilesToOutput} from "../../lib/behaviors/copyFilesToOutput";
import {normalizePathSeparators} from "../../lib/util/normalizePathSeparators";


function getFixturePath(relativePath) {
  return path.resolve(__dirname, "../fixtures/project-with-files", relativePath);
}


describe("behaviors/copyFilesToOutput", function () {

  beforeEach(function () {
    this.env = new Environment();
    this.env.projectRootPath = getFixturePath("");
    this.env.setPath("output", "testOutput");
  });

  afterEach(function (done) {
    // Clean output directory again.
    let outputPath = getFixturePath("testOutput");
    if (outputPath.endsWith("testOutput")) {
      rimraf(outputPath, { disableGlob: true }, done);
    }
    else {
      done(new Error(`Refusing to clean output directory '${outputPath}'.`));
    }
  });


  it("is a function", function () {
    copyFilesToOutput
      .should.be.a.Function();
  });

  it("is named 'copyFilesToOutput'", function () {
    copyFilesToOutput.name
      .should.be.eql("copyFilesToOutput");
  });


  it("returns a promise", function () {
    let result = copyFilesToOutput(this.env);
    result
      .should.be.instanceOf(Promise);

    // It is important to wait until the behavior resolves before advancing to the next
    // unit test since a race condition will otherwise occur causing other tests to
    // intermittently fail.
    return result;
  });

  it("copies contents of the 'files' directory to the 'output' directory", function () {
    return copyFilesToOutput(this.env)
      .then(() => {
        glob.sync("**/*", { cwd: this.env.resolvePath("output") })
          .map(normalizePathSeparators)
          .sort()
          .should.be.eql([
            "test-directory",
            "test-directory/nested-test.txt",
            "test.txt"
          ]);
      });
  });

  it("does not fail when 'files' directory does not exist", function () {
    this.env.setPath("files", "path-does-not-exist");

    return copyFilesToOutput(this.env)
      .then(() => {
        glob.sync("**/*", { cwd: this.env.resolvePath("output") })
          .should.be.eql([ ]);
      });
  });

});
