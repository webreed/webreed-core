// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.

/** @module webreed/lib/AliasMap */


// Packages
import _ from "lodash";
import formatUnicorn from "format-unicorn/safe";

// Project
import getTargetFromAliasReference from "./util/getTargetFromAliasReference";
import isAliasReference from "./util/isAliasReference";


// Symbols to simulate private fields
const optionsField = Symbol();
const mapField = Symbol();

// Exported to facilitate with unit testing.
export const __innerMapField = mapField;


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
    console.assert(iterable === undefined || iterable === null || typeof iterable[Symbol.iterator] === "function",
        "argument 'iterable' must be an iterable object");
    console.assert(options === undefined || typeof options === "object",
        "argument 'options' must be an object");

    options = _.defaultsDeep({ }, options, defaultOptions);
    options.ignoreCase = !!options.ignoreCase;

    this[optionsField] = Object.freeze(options);
    this[mapField] = new Map();

    this[Symbol.iterator] = this[mapField][Symbol.iterator];

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
    return this[optionsField].ignoreCase;
  }

  /**
   * The number of entries in the collection.
   *
   * @member {number}
   * @readonly
   */
  get size() {
    return this[mapField].size;
  }


  /**
   * Clears all entries from the collection.
   */
  clear() {
    this[mapField].clear();
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
    return this[mapField].delete(key);
  }

  /**
   * Gets an object that iterates the collection's key/value pairs.
   *
   * @returns {Iterator}
   */
  entries() {
    return this[mapField].entries();
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
    console.assert(typeof callback === "function",
        "argument 'callback' must be a function");

    this[mapField].forEach((value, key) =>
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
    return this[mapField].get(key);
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
    return this[mapField].has(key);
  }

  /**
   * Gets an object that iterates the collection's keys.
   *
   * @returns {Iterator}
   */
  keys() {
    return this[mapField].keys();
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
    return this[mapField].get(resolvedKey);
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
      return this[mapField].get(resolvedKey);
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
      let errorMessage = formatUnicorn(this[optionsField].strings.invalidKey, { key: key });
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

    let value = this[mapField].get(key);
    if (value === undefined) {
      key = this[optionsField].fallbackResolve(this, key);
      if (key !== undefined) {
        value = this[mapField].get(key);
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
    this[mapField].set(key, value);
    return this;
  }

  /**
   * Gets an object that iterates the collection's values.
   *
   * @returns {Iterator}
   */
  values() {
    return this[mapField].values();
  }

}


function sanitizeKey(aliasMap, key) {
  console.assert(typeof key === "string" && key !== "",
      "argument 'key' must be a non-empty string");

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
