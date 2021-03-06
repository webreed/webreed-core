// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.

"use strict";


const given = require("mocha-testdata");
const should = require("should");

const AliasMap = require("../../lib/AliasMap").AliasMap;


describe("AliasMap", function () {

  beforeEach(function () {
    this.aliasMap = new AliasMap();
  });


  it("is named 'AliasMap'", function () {
    AliasMap.name
      .should.be.eql("AliasMap");
  });

  it("is iterable", function () {
    this.aliasMap[Symbol.iterator]
      .should.be.exactly(Map.prototype.entries);
  });


  describe("#constructor()", function () {

    it("is a function", function () {
      AliasMap.prototype.constructor
        .should.be.a.Function();
    });

    it("calls #set for each key/value pair yielded by argument 'iterable'", function () {
      let entries = [ ];

      class MockedAliasMap extends AliasMap {
        constructor() { super(...arguments); }
        set(key, value) {
          entries.push([ key, value ]);
        }
      }

      new MockedAliasMap([ [ "", 42 ], [ "A", 2 ], [ "b", 4 ] ]);

      entries
        .should.be.eql([ [ "", 42 ], [ "A", 2 ], [ "b", 4 ] ]);
    });

  });


  describe("#ignoreCase", function () {

    it("is read-only", function () {
      (() => this.aliasMap.ignoreCase = 42)
        .should.throw();
    });

    it("is `false` when argument 'ignoreCase' was not specified in constructor", function () {
      this.aliasMap.ignoreCase
        .should.be.false();
    });

    given( false, true ).
    it("matches value that was specified in constructor", function (ignoreCase) {
      let newAliasMap = new AliasMap(null, { ignoreCase: ignoreCase });
      newAliasMap.ignoreCase
        .should.be.eql(ignoreCase);
    });

  });

  describe("#size", function () {

    it("is read-only", function () {
      (() => this.aliasMap.size = 42)
        .should.throw();
    });

    given(
      [  [                    ]  , 0 ],
      [  [ ["a", 1]           ]  , 1 ],
      [  [ ["a", 1], ["b", 2] ]  , 2 ]
    ).
    it("reflects count of entries in the collection", function (entries, expectedSize) {
      let newAliasMap = new AliasMap(entries);
      newAliasMap.size
        .should.be.eql(expectedSize);
    });

  });



  describe("#clear()", function () {

    it("is a function", function () {
      this.aliasMap.clear
        .should.be.a.Function();
    });

    it("invokes 'clear' on underlying map", function () {
      let invokedClear = false;
      this.aliasMap._map.clear = function () {
        invokedClear = true;
      };

      this.aliasMap.clear();

      invokedClear
        .should.be.true();
    });

  });

  describe("#delete(key)", function () {

    it("is a function", function () {
      this.aliasMap.delete
        .should.be.a.Function();
    });

    given( undefined, null, 42 ).
    it("throws error when argument 'key' is not a string", function (key) {
      (() => this.aliasMap.delete(key))
        .should.throw("argument 'key' must be a string");
    });

    given(
      [ ""  , ""  , false ],
      [ "A" , "A" , false ],
      [ "BB", "BB", false ],
      [ "c" , "c" , false ],
      [ ""  , ""  , true ],
      [ "A" , "a" , true ],
      [ "BB", "bb", true ],
      [ "c" , "c" , true ]
    ).
    it("transforms key to match character casing configuration", function (deleteKey, expectedDeleteKey, ignoreCase) {
      let invokedDeleteWithKey;
      let newAliasMap = new AliasMap(null, { ignoreCase: ignoreCase });
      newAliasMap._map.delete = function (key) { invokedDeleteWithKey = key; };

      newAliasMap.delete(deleteKey);

      invokedDeleteWithKey
        .should.be.eql(expectedDeleteKey);
    });

    it("returns `true` when key was removed", function () {
      this.aliasMap.set("a", 42);
      this.aliasMap.delete("a")
        .should.be.true();
    });

    it("returns `false` when key was not removed", function () {
      this.aliasMap.delete("a")
        .should.be.false();
    });

  });

  describe("#entries()", function () {

    it("is a function", function () {
      this.aliasMap.entries
        .should.be.a.Function();
    });

    it("returns an iterator", function () {
      this.aliasMap.entries()
        .should.be.an.iterator();
    });

    it("returns an iterator that yields key/value pairs representing the AliasMap", function () {
      let newAliasMap = new AliasMap([ [ "", 42 ], [ "A", 2 ], [ "b", 4 ], [ "c", 8 ] ]);
      Array.from(newAliasMap.entries())
        .should.be.eql([ [ "", 42 ], [ "A", 2 ], [ "b", 4 ], [ "c", 8 ] ]);
    });

  });

  describe("#forEach(callback, [thisArg])", function () {

    it("is a function", function () {
      this.aliasMap.forEach
        .should.be.a.Function();
    });

    it("passes key, value and map to callback for each entry", function () {
      let newAliasMap = new AliasMap([ [ "", 42 ], [ "A", 2 ], [ "b", 4 ], [ "c", 8 ] ]);

      let entries = [ ];

      newAliasMap.forEach((value, key, map) => {
        entries.push([ key, value ]);
        map
          .should.be.exactly(newAliasMap);
      });

      entries
        .should.be.eql([ [ "", 42 ], [ "A", 2 ], [ "b", 4 ], [ "c", 8 ] ]);
    });

    it("binds `this` of callback", function () {
      let newAliasMap = new AliasMap([ ["A", 2] ]);
      let customThisArg = { };

      let boundThisArg;
      newAliasMap.forEach(function () { boundThisArg = this; }, customThisArg);

      boundThisArg
        .should.be.exactly(customThisArg);
    });

  });

  describe("#get(key)", function () {

    it("is a function", function () {
      this.aliasMap.get
        .should.be.a.Function();
    });

    given( undefined, null, 42 ).
    it("throws error when argument 'key' is not a string", function (key) {
      (() => this.aliasMap.get(key))
        .should.throw("argument 'key' must be a string");
    });

    given(
      [ ""  , ""  , false ],
      [ "A" , "A" , false ],
      [ "BB", "BB", false ],
      [ "c" , "c" , false ],
      [ ""  , ""  , true ],
      [ "A" , "a" , true ],
      [ "BB", "bb", true ],
      [ "c" , "c" , true ]
    ).
    it("transforms key to match character casing configuration", function (getKey, expectedGetKey, ignoreCase) {
      let invokedGetWithKey;
      let newAliasMap = new AliasMap(null, { ignoreCase: ignoreCase });
      newAliasMap._map.get = function (key) { invokedGetWithKey = key; };

      newAliasMap.get(getKey);

      invokedGetWithKey
        .should.be.eql(expectedGetKey);
    });

    it("returns the value from the underlying map", function () {
      this.aliasMap._map.get = function (key) { return 42; };
      this.aliasMap.get("foo")
        .should.be.eql(42);
    });

  });

  describe("#has(key)", function () {

    it("is a function", function () {
      this.aliasMap.has
        .should.be.a.Function();
    });

    given( undefined, null, 42 ).
    it("throws error when argument 'key' is not a string", function (key) {
      (() => this.aliasMap.has(key))
        .should.throw("argument 'key' must be a string");
    });

    given(
      [ ""  , ""  , false ],
      [ "A" , "A" , false ],
      [ "BB", "BB", false ],
      [ "c" , "c" , false ],
      [ ""  , ""  , true ],
      [ "A" , "a" , true ],
      [ "BB", "bb", true ],
      [ "c" , "c" , true ]
    ).
    it("transforms key to match character casing configuration", function (hasKey, expectedHasKey, ignoreCase) {
      let invokedHasWithKey;
      let newAliasMap = new AliasMap(null, { ignoreCase: ignoreCase });
      newAliasMap._map.has = function (key) { invokedHasWithKey = key; };

      newAliasMap.has(hasKey);

      invokedHasWithKey
        .should.be.eql(expectedHasKey);
    });

    it("returns the value from the underlying map", function () {
      this.aliasMap._map.has = function (key) { return 42; };
      this.aliasMap.has("foo")
        .should.be.eql(42);
    });

  });

  describe("#keys()", function () {

    it("is a function", function () {
      this.aliasMap.keys
        .should.be.a.Function();
    });

    it("returns an iterator", function () {
      this.aliasMap.keys()
        .should.be.an.iterator();
    });

    it("returns an iterator that yields the keys of the AliasMap", function () {
      let newAliasMap = new AliasMap([ [ "A", 2 ], [ "b", 4 ], [ "c", 8 ] ]);
      Array.from(newAliasMap.keys())
        .should.be.eql([ "A", "b", "c" ]);
    });

  });

  describe("#lookup(key)", function () {

    it("is a function", function () {
      this.aliasMap.lookupQuiet
        .should.be.a.Function();
    });

    given( undefined, null, 42 ).
    it("throws error when argument 'key' is not a string", function (key) {
      (() => this.aliasMap.lookup(key))
        .should.throw("argument 'key' must be a string");
    });

    it("throws error when the specified key could not be resolved", function () {
      let newAliasMap = new AliasMap([ [ "A", 42 ], [ "b", "alias-of(A)" ] ]);
      (() => newAliasMap.lookup("z"))
        .should.throw("Key 'z' could not be resolved.");
    });

    it("throws error with customized message when the specified key could not be resolved", function () {
      let newAliasMap = new AliasMap([ [ "A", 42 ], [ "b", "alias-of(A)" ] ], {
        strings: { invalidKey: "The magical key '{key}' could not be resolved." }
      });
      (() => newAliasMap.lookup("z"))
        .should.throw("The magical key 'z' could not be resolved.");
    });

    it("invokes #noisyResolveKey to resolve the specified key", function () {
      let invokedResolveKeyMethod = false;

      let newAliasMap = new AliasMap([ [ "A", 42 ], [ "b", "alias-of(A)" ] ]);
      newAliasMap.noisyResolveKey = function (key) {
        invokedResolveKeyMethod = true;
        return AliasMap.prototype.noisyResolveKey.call(this, key);
      };

      newAliasMap.lookup("b");

      invokedResolveKeyMethod
        .should.be.true();
    });

    it("invokes #get to get the value associated with the specified key", function () {
      let invokedGetMethod = false;

      let newAliasMap = new AliasMap([ [ "A", 42 ], [ "b", "alias-of(A)" ] ]);
      newAliasMap.get = function (key) {
        invokedGetMethod = true;
        return AliasMap.prototype.get.call(this, key);
      };

      newAliasMap.lookup("b");

      invokedGetMethod
        .should.be.true();
    });

  });

  describe("#lookupQuiet(key)", function () {

    it("is a function", function () {
      this.aliasMap.lookupQuiet
        .should.be.a.Function();
    });

    given( undefined, null, 42 ).
    it("throws error when argument 'key' is not a string", function (key) {
      (() => this.aliasMap.lookupQuiet(key))
        .should.throw("argument 'key' must be a string");
    });

    it("returns `undefined` when the specified key could not be resolved", function () {
      let newAliasMap = new AliasMap([ [ "A", 42 ], [ "b", "alias-of(A)" ] ]);
      should.not.exist( newAliasMap.lookupQuiet("z") );
    });

    it("invokes #resolve to resolve the specified key", function () {
      let invokedResolveKeyMethod = false;

      let newAliasMap = new AliasMap([ [ "A", 42 ], [ "b", "alias-of(A)" ] ]);
      newAliasMap.resolveKey = function (key) {
        invokedResolveKeyMethod = true;
        return AliasMap.prototype.resolveKey.call(this, key);
      };

      newAliasMap.lookup("b");

      invokedResolveKeyMethod
        .should.be.true();
    });

    it("invokes #get to get the value associated with the specified key", function () {
      let invokedGetMethod = false;

      let newAliasMap = new AliasMap([ [ "A", 42 ], [ "b", "alias-of(A)" ] ]);
      newAliasMap.get = function (key) {
        invokedGetMethod = true;
        return AliasMap.prototype.get.call(this, key);
      };

      newAliasMap.lookup("b");

      invokedGetMethod
        .should.be.true();
    });

  });

  describe("#noisyResolveKey(key)", function () {

    it("is a function", function () {
      this.aliasMap.noisyResolveKey
        .should.be.a.Function();
    });

    given( undefined, null, 42 ).
    it("throws error when argument 'key' is not a string", function (key) {
      (() => this.aliasMap.noisyResolveKey(key))
        .should.throw("argument 'key' must be a string");
    });

    it("throws error when the specified key could not be resolved", function () {
      let newAliasMap = new AliasMap([ [ "A", 42 ], [ "b", "alias-of(A)" ] ]);
      (() => newAliasMap.noisyResolveKey("z"))
        .should.throw("Key 'z' could not be resolved.");
    });

    it("throws error with customized message when the specified key could not be resolved", function () {
      let newAliasMap = new AliasMap([ [ "A", 42 ], [ "b", "alias-of(A)" ] ], {
        strings: { invalidKey: "The magical key '{key}' could not be resolved." }
      });
      (() => newAliasMap.noisyResolveKey("z"))
        .should.throw("The magical key 'z' could not be resolved.");
    });

    it("invokes #resolve to resolve the specified key", function () {
      let invokedResolveKeyMethod = false;

      let newAliasMap = new AliasMap([ [ "A", 42 ], [ "b", "alias-of(A)" ] ]);
      newAliasMap.resolveKey = function (key) {
        invokedResolveKeyMethod = true;
        return AliasMap.prototype.resolveKey.call(this, key);
      };

      newAliasMap.noisyResolveKey("b");

      invokedResolveKeyMethod
        .should.be.true();
    });

  });

  describe("#resolveKey(key)", function () {

    it("is a function", function () {
      this.aliasMap.resolveKey
        .should.be.a.Function();
    });

    given( undefined, null, 42 ).
    it("throws error when argument 'key' is not a string", function (key) {
      (() => this.aliasMap.resolveKey(key))
        .should.throw("argument 'key' must be a string");
    });

    it("throws error when attempting to resolve a circular reference", function () {
      let newAliasMap = new AliasMap([
        [ "A", "alias-of(c)" ],
        [ "b", "alias-of(A)" ],
        [ "c", "alias-of(b)" ]
      ]);

      (() => newAliasMap.resolveKey("A"))
        .should.throw("Circular alias 'A' was encountered whilst resolving key.");
      (() => newAliasMap.resolveKey("b"))
        .should.throw("Circular alias 'b' was encountered whilst resolving key.");
      (() => newAliasMap.resolveKey("c"))
        .should.throw("Circular alias 'c' was encountered whilst resolving key.");
    });

    it("returns `null` when the specified key could not be resolved", function () {
      let newAliasMap = new AliasMap([ [ "A", 42 ], [ "b", "alias-of(A)" ] ]);
      should( newAliasMap.resolveKey("z") )
        .be.null();
    });

    it("reverts to fallback function when key cannot be resolved", function () {
      let invokedFallbackResolveFunction;
      let newAliasMap = new AliasMap(null, {
        fallbackResolve: function () {
          invokedFallbackResolveFunction = true;
          return null;
        }
      });

      newAliasMap.resolveKey("z");

      invokedFallbackResolveFunction
        .should.be.true();
    });

    it("normalizes casing of key when AliasMap ignores casing of keys", function () {
      let newAliasMap = new AliasMap([ [ "A", 42 ] ], { ignoreCase: true });

      let result1 = newAliasMap.resolveKey("A");
      let result2 = newAliasMap.resolveKey("a");

      result1
        .should.be.eql(result2);
    });

    it("does not normalize casing of key when AliasMap is case-sensitive", function () {
      let newAliasMap = new AliasMap([ [ "A", 42 ] ], { ignoreCase: false });

      let result1 = newAliasMap.resolveKey("A");
      let result2 = newAliasMap.resolveKey("a");

      result1
        .should.not.be.eql(result2);
    });

    it("resolves alias reference", function () {
      let newAliasMap = new AliasMap([
        [ "A", 42 ],
        [ "b", "alias-of(A)" ]
      ]);

      newAliasMap.resolveKey("b")
        .should.be.eql("A");
    });

    it("resolves chained alias reference", function () {
      let newAliasMap = new AliasMap([
        [ "A", 42 ],
        [ "b", "alias-of(A)" ],
        [ "c", "alias-of(b)" ]
      ]);

      newAliasMap.resolveKey("c")
        .should.be.eql("A");
    });

    it("resolves alias reference with empty target key", function () {
      let newAliasMap = new AliasMap([
        [ "", 42 ],
        [ "b", "alias-of()" ]
      ]);

      newAliasMap.resolveKey("b")
        .should.be.eql("");
    });

    it("resolves alias reference with mixed casing AliasMap is not case-sensitive", function () {
      let newAliasMap = new AliasMap([
        [ "A", 42 ],
        [ "b", "alias-of(a)" ]
      ], { ignoreCase: true });

      newAliasMap.resolveKey("B")
        .should.be.eql("a");
    });

    it("resolves chained alias reference with mixed casing AliasMap is not case-sensitive", function () {
      let newAliasMap = new AliasMap([
        [ "A", 42 ],
        [ "b", "alias-of(a)" ],
        [ "C", "alias-of(B)" ]
      ], { ignoreCase: true });

      newAliasMap.resolveKey("C")
        .should.be.eql("a");
    });

  });

  describe("#set(key, value)", function () {

    it("is a function", function () {
      this.aliasMap.set
        .should.be.a.Function();
    });

    given( undefined, null, 42 ).
    it("throws error when argument 'key' is not a string", function (key) {
      (() => this.aliasMap.set(key, 42))
        .should.throw("argument 'key' must be a string");
    });

    it("returns the AliasMap instance so that method calls can be chained", function () {
      this.aliasMap.set("A", 42)
        .should.be.exactly(this.aliasMap);
    });

    given(
      [ ""  , ""  , false ],
      [ "A" , "A" , false ],
      [ "BB", "BB", false ],
      [ "c" , "c" , false ],
      [ ""  , ""  , true ],
      [ "A" , "a" , true ],
      [ "BB", "bb", true ],
      [ "c" , "c" , true ]
    ).
    it("transforms key to match character casing configuration", function (setKey, expectedSetKey, ignoreCase) {
      let invokedSetWithKey;
      let newAliasMap = new AliasMap(null, { ignoreCase: ignoreCase });
      newAliasMap._map.set = function (key) { invokedSetWithKey = key; };

      newAliasMap.set(setKey);

      invokedSetWithKey
        .should.be.eql(expectedSetKey);
    });

    it("passes new value to `set` function of underlying map", function () {
      let invokedSetWithValue;
      this.aliasMap._map.set = function (key, value) { invokedSetWithValue = value; };

      this.aliasMap.set("a", 42);

      invokedSetWithValue
        .should.be.eql(42);
    });

  });

  describe("#values()", function () {

    it("is a function", function () {
      this.aliasMap.values
        .should.be.a.Function();
    });

    it("returns an iterator", function () {
      this.aliasMap.values()
        .should.be.an.iterator();
    });

    it("returns an iterator that yields the values of the AliasMap", function () {
      let newAliasMap = new AliasMap([ [ "", 42 ], [ "A", 2 ], [ "b", 4 ], [ "c", 8 ] ]);
      Array.from(newAliasMap.values())
        .should.be.eql([ 42, 2, 4, 8 ]);
    });

  });

});
