// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.


// Packages
import given from "mocha-testdata";
import should from "should";

// Project
import Environment from "../src/Environment";


describe("Environment", function () {

  beforeEach(function () {
    this.env = new Environment();
  });


  it("is named 'Environment'", function () {
    Environment.name
      .should.be.eql("Environment");
  });


  describe("#constructor()", function () {

    it("is a function", function () {
      Environment.prototype.constructor
        .should.be.a.Function();
    });

  });


  describe("#get behaviors(): object", function () {

    it("is an object", function () {
      this.env.behaviors
        .should.be.an.Object();
    });

    it("is read-only", function () {
      (() => this.env.behaviors = 42)
        .should.throw();
    });

    it("inherits default behaviors", function () {
      delete this.env.behaviors.buildOutput;
      this.env.behaviors.buildOutput
        .should.be.a.Function();
    });

  });


  describe("#build(): Promise", function () {

    it("is a function", function () {
      this.env.build
        .should.be.a.Function();
    });

    it("returns a promise", function () {
      this.env.build()
        .should.be.a.Promise();
    });

    it("assumes override 'buildOutput' behavior", function () {
      let invokedOverride = false;

      this.env.behaviors.buildOutput = function () {
        invokedOverride = true;
        return Promise.resolve();
      };

      return this.env.build()
        .then(() => {
          invokedOverride.should.be.true();
        });
    });

  });

});
