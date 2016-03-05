// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.

/** @module webreed/lib/ResourceType */


// Project
import PluginContext from "./PluginContext";


/**
 * Defines a type of content and the various transformations that should be performed.
 */
export default class ResourceType {

  constructor() {
    this._conversions = { };
    this._custom = { };
    this._defaultTargetExtension = null;
    this._generator = null;
    this._handler = null;
    this._mode = "text";
    this._parseFrontmatter = true;
    this._process = [ ];
    this._templateEngine = null;
  }


  /**
   * Map of conversion transformations from the current resource type to another.
   *
   * @member {object.<string, ?module:webreed/lib/PluginContext[]>}
   */
  get conversions() {
    return this._conversions;
  }
  set conversions(value) {
    console.assert(value !== null && typeof value === "object",
       "argument 'value' must be an object");

    this._conversions = sanitizePluginContextLookupArgument("value", value);
  }

  /**
   * Holds custom key/value pairs.
   *
   * @member {object}
   * @readonly
   */
  get custom() {
    return this._custom;
  }

  /**
   * The default target extension to assume for output content when the resource type
   * represents the final sequence of an extension chain.
   *
   * For instance, a ".nunjucks" resource type could have a default target extension of
   * ".html" meaning that a source content file with the name "info.nunjucks" would
   * produce an output file with the name "info.html". Although this would have no effect
   * on a source content file with the name "info.json.nunjucks".
   *
   * @member {string}
   *
   * @throws {Error}
   * - If argument `value` is not null and is not a string.
   * - If argument `value` is an empty string.
   * - If argument `value` is a value of ".".
   */
  get defaultTargetExtension() {
    return this._defaultTargetExtension;
  }
  set defaultTargetExtension(value) {
    console.assert(value === null || (typeof value === "string" && value !== ""),
      "argument 'value' must be `null` or a non-empty string");
    console.assert(value !== ".",
      "argument 'value' must not be '.'");

    this._defaultTargetExtension = value;
  }

  /**
   * Plugin context identifying the generator plugin.
   *
   * Additional properties or overrides can be passed to the plugin via the options
   * supplied by the plugin context whenever the plugin is used for this resource type.
   *
   * @member {?module:webreed/lib/PluginContext}
   */
  get generator() {
    return this._generator;
  }
  set generator(value) {
    console.assert(value === null || value instanceof PluginContext,
      "argument 'value' must be `null` or a `PluginContext`");

    this._generator = value;
  }

  /**
   * Plugin context identifying the content handler plugin.
   *
   * Additional properties or overrides can be passed to the plugin via the options
   * supplied by the plugin context whenever the plugin is used for this resource type.
   *
   * @member {?module:webreed/lib/PluginContext}
   */
  get handler() {
    return this._handler;
  }
  set handler(value) {
    console.assert(value === null || value instanceof PluginContext,
      "argument 'value' must be `null` or a `PluginContext`");

    this._handler = value;
  }

  /**
   * Name of the file mode.
   *
   * @member {string}
   * @default "text"
   */
  get mode() {
    return this._mode;
  }
  set mode(value) {
    console.assert(typeof value === "string" && value !== "",
      "argument 'value' must be a non-empty string");

    this._mode = value;
  }

  /**
   * Indicates whether the file mode should attempt to parse frontmatter when reading the
   * source content file. This property is not necessarily applicable to all file modes.
   *
   * @member {boolean}
   */
  get parseFrontmatter() {
    return this._parseFrontmatter;
  }
  set parseFrontmatter(value) {
    console.assert(value === true || value === false,
       "argument 'value' must be `true` or `false`");

    this._parseFrontmatter = value;
  }

  /**
   * An array of zero-or-more transforms that are applied in order to a resource **before**
   * any conversion transformations are applied.
   *
   * @member {?module:webreed/lib/PluginContext[]}
   */
  get process() {
    return this._process;
  }
  set process(value) {
    this._process = sanitizePluginContextArrayArgument("value", value);
  }

  /**
   * Plugin context identifying the template engine plugin.
   *
   * Additional properties or overrides can be passed to the plugin via the options
   * supplied by the plugin context whenever the plugin is used for this resource type.
   *
   * @member {?module:webreed/lib/PluginContext}
   */
  get templateEngine() {
    return this._templateEngine;
  }
  set templateEngine(value) {
    console.assert(value === null || value instanceof PluginContext,
      "argument 'value' must be `null` or a `PluginContext`");

    this._templateEngine = value;
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
