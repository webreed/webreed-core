// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.

/** @module webreed/lib/ContentTransforms */


// Project
import PluginContext from "./PluginContext";


// Symbols to simulate private fields
const processField = Symbol();
const conversionsField = Symbol();


/**
 * Identifies transform plugins that are used at various stages of content transformation.
 */
export default class ContentTransforms {

  constructor() {
    this.process = [ ];
    this.conversions = { };
  }


  /**
   * An array of zero-or-more transforms that are applied in order to a resource **before**
   * any conversion transformations are applied.
   *
   * @member {?module:webreed/lib/PluginContext[]}
   */
  get process() {
    return this[processField];
  }
  set process(value) {
    this[processField] = sanitizePluginContextArrayArgument("value", value);
  }

  /**
   * Map of conversion transformations from the current resource type to another.
   *
   * @member {object.<string, ?module:webreed/lib/PluginContext[]>}
   */
  get conversions() {
    return this[conversionsField];
  }
  set conversions(value) {
    console.assert(value !== null && typeof value === "object",
       "argument 'value' must be an object");

    this[conversionsField] = sanitizePluginContextLookupArgument("value", value);
  }

}


function sanitizePluginContextArrayArgument(argumentName, value) {
  console.assert(!!value && typeof value[Symbol.iterator] === "function",
      `argument '${argumentName}' must be iterable`);

  value = Array.from(value);

  console.assert(value.reduce((a, v) => a && v instanceof PluginContext, true),
      `argument '${argumentName}' must be an iterable of zero-or-more \`PluginContext\` values`);

  return value;
}

function sanitizePluginContextLookupArgument(argumentName, value) {
  let result = { };
  for (let key of Object.keys(value)) {
    result[key] = sanitizePluginContextArrayArgument(`${argumentName}["${key}"]`, value[key]);
  }
  return result;
}
