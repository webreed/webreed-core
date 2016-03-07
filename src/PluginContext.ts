// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.


/**
 * Identifies a named plugin with optional options.
 */
export default class PluginContext {

  private _name: string;
  private _options: Object;


  /**
   * @param name
   *   Name of the plugin.
   * @param options
   *   Options for context of the plugin.
   */
  constructor(name: string, options: Object = null) {
    if (name === "") {
      throw new Error("argument 'name' must be a non-empty string");
    }

    this.name = name;
    this.options = options;
  }


  /**
   * Name of the plugin.
   */
  get name(): string {
    return this._name;
  }
  set name(value: string) {
    if (value === "") {
      throw new Error("argument 'value' must be a non-empty string");
    }

    this._name = value;
  }

  /**
   * Options for context of the plugin.
   *
   * Assumes an empty object when a value of `null` is assigned.
   */
  get options(): Object {
    return this._options;
  }
  set options(value: Object) {
    this._options = value || { };
  }

}
