// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.

/** @module webreed/lib/Resource */


// System
import path from "path";
import url from "url";

// Packages
import _ from "lodash";

// Project
import Environment from "./Environment";


/**
 * An immutable object that represents a source, intermediary or output resource.
 */
export default class Resource {

  /**
   * @param {module:webreed/lib/Environment} env
   *   The webreed environment that the resource is to be associated with.
   * @param {object} props
   *   Property values that define the resource.
   * @param {module:Webreed/lib/Resource} cloneFromResource
   *   A resource to clone properties from.
   */
  constructor(env, props = null, cloneFromResource = null) {
    if (props === undefined || props === null) {
      props = { };
    }

    if (!(env instanceof Environment)) {
      throw new TypeError("argument 'env' must be a webreed environment");
    }
    if (typeof props !== "object") {
      throw new TypeError("argument 'props' must be an object");
    }
    if (cloneFromResource !== null && !(cloneFromResource instanceof Resource)) {
      throw new TypeError("argument 'cloneFromResource' must be a `Resource`");
    }

    if (cloneFromResource !== null) {
      props = _.chain(cloneFromResource)
        .cloneDeep()
        .assign(props)
        .value();
    }

    _.assign(this, _.omit(props, _.isUndefined));

    if (typeof this._baseUrl !== "string") {
      this._baseUrl = "/";
    }
    if (typeof this._extension !== "string") {
      this._extension = "";
    }

    // Override any value that is assigned from props or the source resource.
    // This property is not enumerable.
    Object.defineProperty(this, "__env", { value: env });

    if (typeof this._path === "string") {
      let outputRelativePath = this.__env.getOutputRelativePathForResource(this._path, this._extension, this._page);

      this._name = path.basename(this._path);
      this._url = this.__env.getUrlForResource(outputRelativePath, this._baseUrl);
      this._segments = url.parse(this._url).path.substr(1).split("/");
    }

    Object.freeze(this);
  }

  /**
   * Creates a new copy of the resource and can optionally can override the values of
   * properties (or remove the properties entirely) when `overrides` are provided.
   *
   * @param {object} overrides
   *   Optional override values. Unwanted properties can be removed by supplying a value
   *   of `undefined` for each of the unwanted properties.
   * @param {module:webreed/lib/Environment} overrideEnv
   *   When specified overrides the webreed environment that the cloned resource is to
   *   be associated with.
   *
   * @returns {module:webreed/lib/Resource}
   *   A new instance.
   */
  clone(overrides = null, overrideEnv = null) {
    if (overrides !== null && typeof overrides !== "object") {
      throw new TypeError("argument 'overrides' must be an object");
    }
    if (overrideEnv !== null && !(overrideEnv instanceof Environment)) {
      throw new TypeError("argument 'overrideEnv' must be a webreed environment");
    }

    return new Resource(overrideEnv || this.__env, overrides, this);
  }

  /**
   * The webreed environment that the resource is associated with.
   *
   * @member {module:webreed/lib/Environment} __env
   * @readonly
   * @private
   */

  /**
   * Base URL of the resource.
   *
   * @member {string} _baseUrl
   * @readonly
   */

  /**
   * Path of the resource in the output directory.
   *
   * @member {string} _path
   * @readonly
   */

  /**
   * File extension of the resource.
   *
   * @member {string} _extension
   * @readonly
   */

  /**
   * Path identifying which page the resource represents of a paginated resource.
   *
   * @member {string} _page
   * @readonly
   */

  /**
   * Name of the resource.
   *
   * This is a computed property which cannot be directly overridden.
   *
   * @member {string} _name
   * @readonly
   */

  /**
   * URL of the resource is automatically determined from other properties of the
   * resource by resolving `_path + _extension` from `_baseUrl`.
   *
   * This is a computed property which cannot be directly overridden.
   *
   * @member {string} _url
   * @readonly
   */

  /**
   * An array of zero-or-more segments from the URL.
   *
   * This is a computed property which cannot be directly overridden.
   *
   * @member {string[]} _segments
   * @readonly
   */

}
