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
   * @param {object} options
   *   Options for context of the plugin.
   */
  constructor(name, options = null) {
    if (typeof name !== "string") {
      throw new TypeError("argument 'name' must be a string");
    }
    if (name === "") {
      throw new Error("argument 'name' must be a non-empty string");
    }
    if (options !== null && typeof options !== "object") {
      throw new TypeError("argument 'options' must be an object");
    }

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
    if (typeof value !== "string") {
      throw new TypeError("argument 'value' must be a string");
    }
    if (value === "") {
      throw new Error("argument 'value' must be a non-empty string");
    }

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
    if (value !== undefined && value !== null && typeof value !== "object") {
      throw new TypeError("argument 'value' must be an object");
    }

    this._options = value || { };
  }

}
