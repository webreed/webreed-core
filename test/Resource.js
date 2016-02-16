// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.


// Packages
import given from "mocha-testdata";
import should from "should";

// Project
import Environment from "../src/Environment";
import Resource from "../src/Resource";


describe("Resource", function () {

  beforeEach(function () {
    this.env = new Environment();
  });


  describe("#constructor(env, [props])", function () {

    it("is a function", function () {
      Resource.prototype.constructor
        .should.be.a.Function();
    });

    it("throws error when argument 'env' is not specified", function () {
      (() => new Resource())
        .should.throw("argument 'env' must be a webreed environment");
    });

    it("throws error when argument 'props' is defined but is not an object", function () {
      (() => new Resource(this.env, 42))
        .should.throw("argument 'props' must be an object");
    });

    it("creates a new resource when argument 'props' is not specified", function () {
      new Resource(this.env);
    });

    it("has a default _baseUrl of '/'", function () {
      let resource = new Resource(this.env);
      resource._baseUrl
        .should.be.eql("/");
    });

    it("copies _baseUrl from argument 'props'", function () {
      let resource = new Resource(this.env, { _baseUrl: "/abc" });
      resource._baseUrl
        .should.be.eql("/abc");
    });

    it("has a default _extension of ''", function () {
      let resource = new Resource(this.env);
      resource._extension
        .should.be.eql("");
    });

    it("copies _extension from argument 'props'", function () {
      let resource = new Resource(this.env, { _extension: ".abc" });
      resource._extension
        .should.be.eql(".abc");
    });

    it("copies _page from argument 'props'", function () {
      let resource = new Resource(this.env, { _page: "2" });
      resource._page
        .should.be.eql("2");
    });

    it("leaves _path undefined when does not exists in argument 'props'", function () {
      let resource = new Resource(this.env);
      should.not.exist(resource._path);
    });

    it("copies _path from argument 'props'", function () {
      let resource = new Resource(this.env, { _path: "a/b/c" });
      resource._path
        .should.be.eql("a/b/c");
    });

    it("leaves _name undefined when _path is undefined", function () {
      let resource = new Resource(this.env);
      should.not.exist(resource._name);
    });

    it("sets _name from base name of _path when _path is defined", function () {
      let resource = new Resource(this.env, { _path: "a/b/c" });
      resource._name
        .should.be.eql("c");
    });

    it("leaves _url undefined when _path is undefined", function () {
      let resource = new Resource(this.env);
      should.not.exist(resource._url);
    });

    it("sets _url when _path is defined", function () {
      let resource = new Resource(this.env, {
        _baseUrl: "http://example.com",
        _path: "a/b/c",
        _page: "2",
        _extension: ".html"
      });
      resource._url
        .should.be.eql("http://example.com/a/b/c/2.html");
    });

    it("leaves _segments undefined when _path is undefined", function () {
      let resource = new Resource(this.env);
      should.not.exist(resource._segments);
    });

    it("sets _segments from _url when _path is defined", function () {
      let resource = new Resource(this.env, {
        _baseUrl: "http://example.com",
        _path: "a/b/c",
        _page: "2",
        _extension: ".html"
      });
      resource._segments
        .should.be.eql([ "a", "b", "c", "2.html" ]);
    });

    it("copies custom properties from argument 'props'", function () {
      let resource = new Resource(this.env, { title: "Test Title" });
      resource.title
        .should.be.eql("Test Title");
    });

    it("is immutable once constructed", function () {
      let resource = new Resource(this.env, { title: "Test Title" });
      (() => resource.title = "Something Else!")
        .should.throw();
    });

  });


  describe("#clone([overrides], [overrideEnv])", function () {

    it("is a function", function () {
      Resource.prototype.clone
        .should.be.a.Function();
    });

    it("throws error when argument 'overrides' is defined but is not an object", function () {
      let resource = new Resource(this.env);
      (() => resource.clone(42))
        .should.throw("argument 'overrides' must be an object");
    });

    it("throws error when argument 'overrideEnv' is defined but is not a webreed environment", function () {
      let resource = new Resource(this.env);
      (() => resource.clone(null, 42))
        .should.throw("argument 'overrideEnv' must be a webreed environment");
    });

    it("creates a new resource", function () {
      let resource = new Resource(this.env);
      resource.clone()
        .should.not.be.exactly(resource);
    });

    it("creates a new resource and copies properties from original resource", function () {
      let resource = new Resource(this.env);
      resource.clone()
        .should.be.eql(resource);
    });

    it("creates a new resource and overrides a property as specified by argument 'overrides'", function () {
      let resource = new Resource(this.env, { title: "Some Title" });
      let clonedResource = resource.clone({ title: "New Title" });
      clonedResource.title
        .should.be.eql("New Title");
    });

    it("creates a new resource and adds a property as specified by argument 'overrides'", function () {
      let resource = new Resource(this.env, { title: "Some Title" });
      let clonedResource = resource.clone({ author: "Sir Krunchelot" });
      clonedResource.author
        .should.be.eql("Sir Krunchelot");
    });

    it("creates a new resource and removes a property as specified by argument 'overrides'", function () {
      let resource = new Resource(this.env, { title: "Some Title" });
      let clonedResource = resource.clone({ title: undefined });
      should.not.exist(clonedResource.title);
    });

    it("creates a new resource associated with the same environment as original resource", function () {
      let resource = new Resource(this.env);

      let clonedResource = resource.clone();

      clonedResource.__env
        .should.be.exactly(resource.__env);
    });

    it("creates a new resource and overrides the associated environment with argument 'overrideEnv'", function () {
      let resource = new Resource(this.env);
      let newEnv = new Environment();

      let clonedResource = resource.clone(null, newEnv);

      clonedResource.__env
        .should.be.exactly(newEnv);
    });

  });

});
