// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.


import given from "mocha-testdata";
import should from "should";

import {BehaviorMap} from "../lib/BehaviorMap";
import {Environment} from "../lib/Environment";


describe("BehaviorMap", function () {

  beforeEach(function () {
    this.env = new Environment();
    this.behaviorMap = new BehaviorMap(this.env);
  });


  it("is named 'BehaviorMap'", function () {
    BehaviorMap.name
      .should.be.eql("BehaviorMap");
  });


  describe("#constructor(env)", function () {

    it("is a function", function () {
      BehaviorMap.prototype.constructor
        .should.be.a.Function();
    });

  });


  describeBehavior("applyExtensionChainToResource", [ "resource", "extensionChain" ]);
  describeBehavior("applySequenceOfTransformsToResource", [ "resource", "transformers" ]);
  describeBehavior("applyTemplateToResource", [ "resource", "templateName" ]);
  describeBehavior("build", [ ]);
  describeBehavior("clean", [ ]);
  describeBehavior("copyFilesToOutput", [ ]);
  describeBehavior("decodeResource", [ "resource", "resourceType" ]);
  describeBehavior("generateResource", [ "resource", "resourceType" ]);
  describeBehavior("getSourceContentRelativePaths", [ "sourceName" ]);
  describeBehavior("loadResourceFile", [ "filePath", "resourceTypeExtension", "baseProperties" ]);
  describeBehavior("loadSourceContent", [ "contentRelativePath", "resourceTypeExtension", "baseProperties" ]);
  describeBehavior("processResource", [ "resource", "resourceType" ]);
  describeBehavior("processSourceContentFiles", [ ]);
  describeBehavior("resolveGenerator", [ "resource", "resourceType" ]);
  describeBehavior("resolveResourceMode", [ "resource", "resourceType" ]);
  describeBehavior("resolveTemplateEngine", [ "templateName" ]);
  describeBehavior("saveResourceFile", [ "outputFilePath", "resource", "resourceTypeExtension" ]);


  describe("#has(behaviorName)", function () {

    it("is a function", function () {
      this.behaviorMap.has
        .should.be.a.Function();
    });

    it("returns `false` when behavior is undefined", function () {
      this.behaviorMap.has("behavior-that-does-not-exist")
        .should.be.a.false();
    });

    it("returns `true` when behavior is defined (by default)", function () {
      this.behaviorMap.has("build")
        .should.be.a.true();
    });

    it("returns `true` when behavior is defined (custom)", function () {
      this.behaviorMap.set("custom-defined-behavior", function (env) { });
      this.behaviorMap.has("custom-defined-behavior")
        .should.be.a.true();
    });

  });

  describe("#invoke(behaviorName, [args])", function () {

    it("is a function", function () {
      this.behaviorMap.invoke
        .should.be.a.Function();
    });

    it("throws error when behavior is undefined", function () {
      (() => this.behaviorMap.invoke("behavior-that-does-not-exist"))
        .should.throw("Behavior 'behavior-that-does-not-exist' is undefined.");
    });

  });

  describe("#invokeDefault(behaviorName, [args])", function () {

    it("is a function", function () {
      this.behaviorMap.invokeDefault
        .should.be.a.Function();
    });

    it("throws error when behavior is undefined", function () {
      (() => this.behaviorMap.invokeDefault("behavior-that-does-not-exist"))
        .should.throw("Behavior 'behavior-that-does-not-exist' is undefined.");
    });

  });

  describe("#set(behaviorName, behaviorFn)", function () {

    it("is a function", function () {
      this.behaviorMap.set
        .should.be.a.Function();
    });

    it("returns self allowing for chained calls", function () {
      this.behaviorMap.set("abc", function (env) { })
        .should.be.exactly(this.behaviorMap);
    });

    it("defines a custom behavior", function () {
      this.behaviorMap.set("abc", function (env, abc) {
        return Promise.resolve(abc);
      });

      return this.behaviorMap.invoke("abc", 42)
        .should.eventually.be.eql(42);
    });

    it("overrides a default behavior", function () {
      this.behaviorMap.set("build", function (env) {
        return Promise.resolve(42);
      });

      return this.behaviorMap.build()
        .should.eventually.be.eql(42);
    });

  });


  function describeBehavior(behaviorName, parameterNames) {
    describe(`#${behaviorName}(${parameterNames.join(", ")})`, function () {

      it("is a function", function () {
        this.behaviorMap[behaviorName]
          .should.be.a.Function();
      });

      it("is defined by default", function () {
        this.behaviorMap.has(behaviorName)
          .should.be.true();
      });

      it("supplies parameters to implementation of behavior (via normal call)", function () {
        let suppliedEnv, suppliedArgs;

        this.behaviorMap.set(behaviorName, function (env, ...args) {
          suppliedEnv = env;
          suppliedArgs = Array.from(args);
          return Promise.resolve(42);
        });

        return this.behaviorMap[behaviorName](...parameterNames)
          .then(value => {
            suppliedEnv.should.be.exactly(this.env);
            suppliedArgs.should.be.eql(parameterNames);
            value.should.be.eql(42);
          });
      });

      it("supplies parameters to implementation of behavior (via invoke)", function () {
        let suppliedEnv, suppliedArgs;

        this.behaviorMap.set(behaviorName, function (env, ...args) {
          suppliedEnv = env;
          suppliedArgs = Array.from(args);
          return Promise.resolve(42);
        });

        return this.behaviorMap.invoke(behaviorName, ...parameterNames)
          .then(value => {
            suppliedEnv.should.be.exactly(this.env);
            suppliedArgs.should.be.eql(parameterNames);
            value.should.be.eql(42);
          });
      });

    });
  }

});
