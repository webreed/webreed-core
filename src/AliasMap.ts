// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.


// Packages
const _ = require("lodash");
const formatUnicorn = require("format-unicorn/safe");

// Project
import getTargetFromAliasReference from "./util/getTargetFromAliasReference";
import isAliasReference from "./util/isAliasReference";


/**
 * Fallback function that is invoked upon attempting to resolve a key that does not
 * exist to select an alternative key.
 *
 * @param aliasMap
 *   The alias map object.
 * @param key
 *   The key that is being resolved.
 *
 * @returns
 *   The fallback key when a fallback is relevant; otherwise, a value of `undefined` to
 *   signal that there is no fallback.
 */
export interface FallbackResolveFunction<V> {
  (map: AliasMap<V>, key: string): string
}

/**
 * Callback that is executed for each entry of the [[AliasMap]].
 */
export interface ForEachCallback<V> {
  (value: [string, V | string], key: string, map: AliasMap<V>): void
}


/**
 * Options for constructing an [[AliasMap]].
 */
export type AliasMapOptions<V> = {

  /**
   * A function that is invoked when attempting to resolve a key that does not exist.
   *
   * Defaults to `null`.
   */
  fallbackResolve?: FallbackResolveFunction<V>;

  /**
   * Indicates whether character casing of keys is to be ignored.
   *
   * Defaults to `false`.
   */
  ignoreCase?: boolean;

  /**
   * Custom strings.
   */
  strings?: {
    /**
     * String that is used for invalid key error messages.
     *
     * Defaults to `"Key '{0}' could not be resolved."`.
     */
    invalidKey?: string;
  }

};


/**
 * A map of key/value pairs with support for alias entries.
 */
export default class AliasMap<V> {

  private _options: AliasMapOptions<V>;
  private _map: Map<string, V | string>;

  /**
   * @param iterable
   *   A collection of key/value pairs. When specified each key-value pair is set using
   *   the method [[AliasMap.set]].
   *
   * @param options
   *   Options for constructing the `AliasMap`.
   */
  constructor(iterable: Iterable<[string, V | string]> = null, options: AliasMapOptions<V> = null) {
    let defaultOptions: AliasMapOptions<V> = {
      fallbackResolve: (map, key) => undefined,
      ignoreCase: false,
      strings: {
        invalidKey: "Key '{key}' could not be resolved."
      }
    };

    options = _.defaultsDeep({ }, options, defaultOptions);
    options.ignoreCase = !!options.ignoreCase;

    this._options = Object.freeze(options);
    this._map = new Map<string, V | string>();

    this[Symbol.iterator] = this._map[Symbol.iterator];

    if (!!iterable) {
      for (let entry of iterable) {
        this.set(entry[0], entry[1]);
      }
    }
  }


  /**
   * Indicates whether character casing of keys is ignored.
   */
  get ignoreCase(): boolean {
    return this._options.ignoreCase;
  }

  /**
   * The number of entries in the collection.
   */
  get size(): number {
    return this._map.size;
  }


  /**
   * Clears all entries from the collection.
   */
  clear(): void {
    this._map.clear();
  }

  /**
   * Deletes the entry for the specified key.
   *
   * @param key
   *   The key of the entry, which must be non-empty.
   *
   * @returns
   *   A value of `true` if an entry is removed; otherwise, a value of `false`.
   */
  delete(key: string): boolean {
    key = this._sanitizeKey(key);
    return this._map.delete(key);
  }

  /**
   * Gets an object that iterates the collection's key/value pairs.
   */
  entries(): Iterator<[string, V | string]> {
    return this._map.entries();
  }

  /**
   * Executes the provided callback once for each key/value pair in the collection.
   *
   * @param callback
   *   The callback.
   * @param thisArg
   *   Value to use as `this` when executing the callback.
   */
  forEach(callback: ForEachCallback<V>, thisArg?: any): void {
    this._map.forEach((value, key) =>
      callback.call(thisArg, value, key, this)
    );
  }

  /**
   * Gets the value of the specified key.
   *
   * @param key
   *   Key of the entry, which must be non-empty.
   *
   * @see [[AliasMap.lookup]]
   */
  get(key: string): V | string {
    key = this._sanitizeKey(key);
    return this._map.get(key);
  }

  /**
   * Gets a value indicating whether an entry exists for the specified key.
   *
   * @param key
   *   Key of the entry, which must be non-empty.
   *
   * @returns
   *   `true` if an entry exists for the specified key; otherwise, `false`.
   *
   * @see [[AliasMap.lookup]]
   */
  has(key: string): boolean {
    key = this._sanitizeKey(key);
    return this._map.has(key);
  }

  /**
   * Gets an object that iterates the collection's keys.
   */
  keys(): Iterator<string> {
    return this._map.keys();
  }

  /**
   * Lookup a value by resolving the specified key and then getting the associated value.
   *
   * This method resolves aliases using [[AliasMap.resolve]] and then gets the associated
   * value using [[AliasMap.get]].
   *
   * @param key
   *   Key or alias key of the entry, which must be non-empty.
   *
   * @returns
   *   The value.
   *
   * @throws {Error}
   * - If no entry was found for `key`.
   * - If alias `key` could not be resolved.
   * - If a circular alias reference was encountered.
   *
   * @see [[AliasMap.has]]
   * @see [[AliasMap.lookupQuiet]]
   */
  lookup(key: string): V {
    let resolvedKey = this.noisyResolve(key);
    return <V>this._map.get(resolvedKey);
  }

  /**
   * Lookup a value by resolving the specified key and then getting the associated value
   * but does not throw an error if the specified key cannot be resolved.
   *
   * This method resolves aliases using [[AliasMap.resolve]] and then gets the associated
   * value using [[AliasMap.get]].
   *
   * @param key
   *   Key or alias key of the entry, which must be non-empty.
   *
   * @returns
   *   The value when the specified `key` is resolved; otherwise, `undefined`.
   *
   * @throws {Error}
   * - If a circular alias reference was encountered.
   *
   * @see [[AliasMap.lookup]]
   */
  lookupQuiet(key: string): V {
    let resolvedKey = this.resolve(key);
    if (resolvedKey !== undefined) {
      return <V>this._map.get(resolvedKey);
    }
    else {
      return undefined;
    }
  }

  /**
   * Resolves the specified key of an entry much like the [[AliasMap.resolve]] except
   * throws an error if the key does not exist and cannot otherwise be resolved.
   *
   * - Normalizes casing of the key when `ignoreCase` was specified when constructing
   *   the [[AliasMap]].
   *
   * - Transparently resolves alias references.
   *
   * - Reverts to a fallback function when `fallbackResolve` was specified when
   *   constructing the [[AliasMap]].
   *
   * @param key
   *   Key or alias key of the entry, which must be non-empty.
   *
   * @returns
   *   The resolved key of an entry.
   *
   * @throws {Error}
   * - If no entry was found for `key`.
   * - If alias `key` could not be resolved.
   * - If a circular alias reference was encountered.
   */
  noisyResolve(key: string): string {
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
   *   the [[AliasMap]].
   *
   * - Transparently resolves alias references.
   *
   * - Reverts to a fallback function when `fallbackResolve` was specified when
   *   constructing the [[AliasMap]].
   *
   * @param key
   *   Key or alias key of the entry, which must be non-empty.
   *
   * @returns
   *   The resolved key of an entry if resolution was successful; otherwise, `undefined`.
   *
   * @throws {Error}
   * - If a circular alias reference was encountered.
   */
  resolve(key: string): string {
    key = this._sanitizeKey(key);

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

    if (typeof value === "string" && isAliasReference(value)) {
      key = this._resolveAlias(key, value);
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
   * @param key
   *   Key of the entry, which must be non-empty.
   * @param value
   *   Value of the entry.
   *
   * @see [[AliasMap.get]]
   * @see [[AliasMap.lookup]]
   */
  set(key: string, value: V | string): this {
    key = this._sanitizeKey(key);
    this._map.set(key, value);
    return this;
  }

  /**
   * Gets an object that iterates the collection's values.
   */
  values(): Iterator<V | string> {
    return this._map.values();
  }


  private _sanitizeKey(key: string): string {
    if (typeof key !== "string") {
      throw new TypeError("argument 'key' must be a string");
    }
    return this.ignoreCase ? key.toLowerCase() : key;
  }

  /**
   * Resolves the target key of an alias entry.
   *
   * @param key
   *   Key or alias key of the entry.
   * @param aliasReference
   *   Alias reference to another entry.
   *
   * @returns
   *   Resolved key if found; otherwise, undefined.
   *
   * @throws {Error}
   * - If a circular alias reference was encountered.
   */
  private _resolveAlias(key: string, aliasReference: string): string {
    let targetKey = getTargetFromAliasReference(aliasReference);

    const tried = new Set<string>();
    tried.add(key);

    while (true) {
      targetKey = this._sanitizeKey(targetKey);
      if (tried.has(targetKey)) {
        throw new Error(`Circular alias '${key}' was encountered whilst resolving key.`);
      }

      tried.add(targetKey);

      let value = this.get(targetKey);
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

}
