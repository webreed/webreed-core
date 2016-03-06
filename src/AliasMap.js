// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.

/** @module webreed/lib/AliasMap */


// Packages
import _ from "lodash";
import formatUnicorn from "format-unicorn/safe";

// Project
import getTargetFromAliasReference from "./util/getTargetFromAliasReference";
import isAliasReference from "./util/isAliasReference";


const defaultOptions = Object.freeze({
  fallbackResolve: (aliasMap, key) => undefined,
  ignoreCase: false,
  strings: {
    invalidKey: "Key '{key}' could not be resolved."
  }
});


/**
 * A map of key/value pairs with support for alias entries.
 */
export default class AliasMap {

  /**
   * @param {iterable} [iterable]
   *   A collection of key/value pairs. When specified each key-value pair is set using
   *   the method {@link module:webreed/lib/AliasMap#set}.
   *
   * @param {boolean} [options.ignoreCase = false]
   *   Indicates whether character casing of keys is to be ignored.
   * @param {module:webreed/lib/AliasMap~fallbackResolve} [options.fallbackResolve = null]
   *   A function that is invoked when attempting to resolve a key that does not exist.
   * @param {string} [options.strings.invalidKey = "Key '{0}' could not be resolved."]
   *   Customizable strings.
   */
  constructor(iterable, options) {
    if (iterable !== undefined && iterable !== null && typeof iterable[Symbol.iterator] !== "function") {
      throw new TypeError("argument 'iterable' must be an iterable object");
    }
    if (options !== undefined && options !== null && typeof options !== "object") {
      throw new TypeError("argument 'options' must be an object");
    }

    options = _.defaultsDeep({ }, options, defaultOptions);
    options.ignoreCase = !!options.ignoreCase;

    this._options = Object.freeze(options);
    this._map = new Map();

    this[Symbol.iterator] = this._map[Symbol.iterator];

    if (!!iterable) {
      for (let entry of iterable) {
        this.set(entry[0], entry[1]);
      }
    }
  }


  /**
   * Fallback function that is invoked upon attempting to resolve a key that does not
   * exist to select an alternative key.
   *
   * @callback module:webreed/lib/AliasMap~fallbackResolve
   *
   * @param {module:webreed/lib/AliasMap} aliasMap
   *   The alias map object.
   * @param {string} key
   *   The key that is being resolved.
   *
   * @returns {string|undefined}
   *   The fallback key when a fallback is relevant; otherwise, a value of `undefined` to
   *   signal that there is no fallback.
   */


  /**
   * Indicates whether character casing of keys is ignored.
   *
   * @member {boolean}
   * @readonly
   */
  get ignoreCase() {
    return this._options.ignoreCase;
  }

  /**
   * The number of entries in the collection.
   *
   * @member {number}
   * @readonly
   */
  get size() {
    return this._map.size;
  }


  /**
   * Clears all entries from the collection.
   */
  clear() {
    this._map.clear();
  }

  /**
   * Deletes the entry for the specified key.
   *
   * @param {string} key
   *   The key of the entry, which must be non-empty.
   *
   * @returns {boolean}
   *   A value of `true` if an entry is removed; otherwise, a value of `false`.
   */
  delete(key) {
    key = sanitizeKey(this, key);
    return this._map.delete(key);
  }

  /**
   * Gets an object that iterates the collection's key/value pairs.
   *
   * @returns {Iterator}
   */
  entries() {
    return this._map.entries();
  }

  /**
   * Executes the provided callback once for each key/value pair in the collection.
   *
   * @param {function} callback
   *   The callback.
   * @param {object} [thisArg]
   *   Value to use as `this` when executing the callback.
   */
  forEach(callback, thisArg) {
    if (typeof callback !== "function") {
      throw new TypeError("argument 'callback' must be a function");
    }

    this._map.forEach((value, key) =>
      callback.call(thisArg, value, key, this)
    );
  }

  /**
   * Gets the value of the specified key.
   *
   * @param {string} key
   *   Key of the entry, which must be non-empty.
   *
   * @returns {any}
   *
   * @see {@link module:webreed/lib/AliasMap#lookup}
   */
  get(key) {
    key = sanitizeKey(this, key);
    return this._map.get(key);
  }

  /**
   * Gets a value indicating whether an entry exists for the specified key.
   *
   * @param {string} key
   *   Key of the entry, which must be non-empty.
   *
   * @returns {boolean}
   *   A value of `true` if an entry exists for the specified key; otherwise,
   *   a value of `false`.
   *
   * @see {@link module:webreed/lib/AliasMap#lookup}
   */
  has(key) {
    key = sanitizeKey(this, key);
    return this._map.has(key);
  }

  /**
   * Gets an object that iterates the collection's keys.
   *
   * @returns {Iterator}
   */
  keys() {
    return this._map.keys();
  }

  /**
   * Lookup a value by resolving the specified key and then getting the associated value.
   *
   * This method resolves aliases using {@link module:webreed/lib/AliasMap#resolve}
   * and then gets the associated value using {@link module:webreed/lib/AliasMap#get}.
   *
   * @param {string} key
   *   Key or alias key of the entry, which must be non-empty.
   *
   * @returns {any}
   *   The value.
   *
   * @throws {Error}
   * - If no entry was found for `key`.
   * - If alias `key` could not be resolved.
   * - If a circular alias reference was encountered.
   *
   * @see {@link module:webreed/lib/AliasMap#has}
   * @see {@link module:webreed/lib/AliasMap#lookupQuiet}
   */
  lookup(key) {
    let resolvedKey = this.noisyResolve(key);
    return this._map.get(resolvedKey);
  }

  /**
   * Lookup a value by resolving the specified key and then getting the associated value
   * but does not throw an error if the specified key cannot be resolved.
   *
   * This method resolves aliases using {@link module:webreed/lib/AliasMap#resolve}
   * and then gets the associated value using {@link module:webreed/lib/AliasMap#get}.
   *
   * @param {string} key
   *   Key or alias key of the entry, which must be non-empty.
   *
   * @returns {any|undefined}
   *   The value when the specified `key` is resolved; otherwise, `undefined`.
   *
   * @throws {Error}
   * - If a circular alias reference was encountered.
   *
   * @see {@link module:webreed/lib/AliasMap#lookup}
   */
  lookupQuiet(key) {
    let resolvedKey = this.resolve(key);
    if (resolvedKey !== undefined) {
      return this._map.get(resolvedKey);
    }
    else {
      return undefined;
    }
  }

  /**
   * Resolves the specified key of an entry much like the {@link module:webreed/lib/AliasMap#resolve}
   * except throws an error if the key does not exist and cannot otherwise be resolved.
   *
   * - Normalizes casing of the key when `ignoreCase` was specified when constructing
   *   the {@link module:webreed/lib/AliasMap}.
   *
   * - Transparently resolves alias references.
   *
   * - Reverts to a fallback function when `fallbackResolve` was specified when
   *   constructing the {@link module:webreed/lib/AliasMap}.
   *
   * @param {string} key
   *   Key or alias key of the entry, which must be non-empty.
   *
   * @returns {string}
   *   The resolved key of an entry.
   *
   * @throws {Error}
   * - If no entry was found for `key`.
   * - If alias `key` could not be resolved.
   * - If a circular alias reference was encountered.
   */
  noisyResolve(key) {
    let resolvedKey = this.resolve(key);
    if (resolvedKey === undefined) {
      let errorMessage = formatUnicorn(this._options.strings.invalidKey, { key: key });
      throw new Error(errorMessage);
    }
    return resolvedKey;
  }

  /**
   * Resolves the specified key of an entry.
   *
   * - Normalizes casing of the key when `ignoreCase` was specified when constructing
   *   the {@link module:webreed/lib/AliasMap}.
   *
   * - Transparently resolves alias references.
   *
   * - Reverts to a fallback function when `fallbackResolve` was specified when
   *   constructing the {@link module:webreed/lib/AliasMap}.
   *
   * @param {string} key
   *   Key or alias key of the entry, which must be non-empty.
   *
   * @returns {string|undefined}
   *   The resolved key of an entry if resolution was successful; otherwise, `undefined`.
   *
   * @throws {Error}
   * - If a circular alias reference was encountered.
   */
  resolve(key) {
    key = sanitizeKey(this, key);

    let value = this._map.get(key);
    if (value === undefined) {
      key = this._options.fallbackResolve(this, key);
      if (key !== undefined) {
        value = this._map.get(key);
      }
      if (value === undefined) {
        return undefined;
      }
    }

    if (isAliasReference(value)) {
      key = resolveAlias(this, key, value);
    }

    return key;
  }

  /**
   * Sets the value of the specified key.
   *
   * ##### Example - Setting a value
   *
   *     aliasMap.set("foo", 42);
   *
   * ##### Example - Creating an alias of another key
   *
   *     aliasMap.set("bar", "alias-of(foo)");
   *
   * @param {string} key
   *   Key of the entry, which must be non-empty.
   * @param {object} value
   *   Value of the entry.
   *
   * @returns {this}
   *
   * @see {@link module:webreed/lib/AliasMap#get}
   * @see {@link module:webreed/lib/AliasMap#lookup}
   */
  set(key, value) {
    key = sanitizeKey(this, key);
    this._map.set(key, value);
    return this;
  }

  /**
   * Gets an object that iterates the collection's values.
   *
   * @returns {Iterator}
   */
  values() {
    return this._map.values();
  }

}


function sanitizeKey(aliasMap, key) {
  if (typeof key !== "string") {
    throw new TypeError("argument 'key' must be a string");
  }

  return aliasMap.ignoreCase ? key.toLowerCase() : key;
}

/**
 * Resolves the target key of an alias entry.
 *
 * @private
 *
 * @param {string} key
 *   Key or alias key of the entry.
 * @param {string} aliasReference
 *   Alias reference to another entry.
 *
 * @returns {string|undefined}
 *   Resolved key if found; otherwise, undefined.
 *
 * @throws {Error}
 * - If a circular alias reference was encountered.
 */
function resolveAlias(aliasMap, key, aliasReference) {
  let targetKey = getTargetFromAliasReference(aliasReference);

  const tried = new Set();
  tried.add(key);

  while (true) {
    targetKey = sanitizeKey(aliasMap, targetKey);
    if (tried.has(targetKey)) {
      throw new Error(`Circular alias '${key}' was encountered whilst resolving key.`);
    }

    tried.add(targetKey);

    let value = aliasMap.get(targetKey);
    if (value === undefined) {
      return undefined;
    }

    if (isAliasReference(value)) {
      targetKey = getTargetFromAliasReference(value);
    }
    else {
      return targetKey;
    }
  }
}
