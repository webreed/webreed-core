// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.

"use strict";


const path = require("path");

const given = require("mocha-testdata");
const should = require("should");

const Environment = require("../../../lib/Environment").Environment;
const Resource = require("../../../lib/Resource").Resource;
const ResourcePaginationProvider = require("../../../lib/pagination/ResourcePaginationProvider").ResourcePaginationProvider;


describe("pagination/ResourcePaginationProvider", function () {

  describe("#constructor(env, resource)", function () {

    it("is a function", function () {
      ResourcePaginationProvider.prototype.constructor
        .should.be.a.Function();
    });

  });


  describe("#paginate(entriesPerPage, entryCount)", function () {

    it("produces the expected pagination sequence", function () {
      let env = new Environment();
      env.projectRootPath = path.resolve(__dirname, "../../fixtures/empty-project");

      let resource = env.createResource({
        _baseUrl: "http://example.com",
        _path: "about",
        _extension: ".foo"
      });

      let provider = new ResourcePaginationProvider(env, resource);
      let iterator = provider.paginate(10, 15);

      iterator.entryCount
        .should.be.eql(15);
      iterator.entriesPerPage
        .should.be.eql(10);
      iterator.pageCount
        .should.be.eql(2);

      iterator.numbers
        .should.be.eql([ 1, 2 ]);
      iterator.keys
        .should.be.eql([ "index", "2" ]);

      iterator.currentPageNumber
        .should.be.eql(1);
      iterator.hasPrevPage
        .should.be.false();
      iterator.hasNextPage
        .should.be.true();

      iterator.firstEntryIndex
        .should.be.eql(0);
      iterator.endEntryIndex
        .should.be.eql(10);
      iterator.lastEntryIndex
        .should.be.eql(9);

      iterator.currentPageKey
        .should.be.eql("index");
      iterator.currentPageUrl
        .should.be.eql("http://example.com/about/index.foo");
    });

    it("produces the expected pagination sequence when resource was already paginated", function () {
      let env = new Environment();
      env.projectRootPath = path.resolve(__dirname, "../../fixtures/empty-project");

      let resource = env.createResource({
        _baseUrl: "http://example.com",
        _path: "about",
        _page: "already-paginated",
        _extension: ".foo"
      });

      let provider = new ResourcePaginationProvider(env, resource);
      let iterator = provider.paginate(10, 1);

      iterator.numbers
        .should.be.eql([ 1 ]);
      iterator.keys
        .should.be.eql([ "index" ]);

      iterator.currentPageKey
        .should.be.eql("index");
      iterator.currentPageUrl
        .should.be.eql("http://example.com/about/already-paginated/index.foo");
    });

  });

});
