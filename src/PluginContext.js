// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.

/** @module webreed/lib/PluginContext */


/**
 * Identifies a named plugin with optional options.
 */
export default class PluginContext {

  /**
   * @param {string} name
   *   Name of the plugin.
   * @param {object} [options = null]
   *   Options for context of the plugin.
   */
  constructor(name, options) {
    console.assert(typeof name === "string" && name !== "",
        "argument 'name' must be a non-empty string");
    console.assert(options === undefined || options === null || typeof options === "object",
        "argument 'options' must be `undefined`, `null` or an object");

    this.name = name;
    this.options = options;
  }


  /**
   * Name of the plugin.
   *
   * @member {string}
   */
  get name() {
    return this._name;
  }
  set name(value) {
    console.assert(typeof value === "string" && value !== "",
        "argument 'value' must be a non-empty string");

    this._name = value;
  }

  /**
   * Options for context of the plugin.
   *
   * Assumes an empty object when a value of `undefined` or `null` is assigned.
   *
   * @member {object}
   */
  get options() {
    return this._options;
  }
  set options(value) {
    console.assert(value === undefined || value === null || typeof value === "object",
        "argument 'value' must be `undefined`, `null` or an object");

    this._options = value || { };
  }

}
