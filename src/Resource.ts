// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.


import * as path from "path";
import * as url from "url";

const _ = require("lodash");

import Environment from "./Environment";


/**
 * An immutable object that represents a source, intermediary or output resource.
 */
export default class Resource {

  private __env: Environment;


  /**
   * @param env
   *   The webreed environment that the resource is to be associated with.
   * @param props
   *   Property values that define the resource.
   * @param cloneFromResource
   *   A resource to clone properties from.
   */
  constructor(env: Environment, props: Object = null, cloneFromResource: Resource = null) {
    if (props === undefined || props === null) {
      props = { };
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
      let outputRelativePath = env.getOutputRelativePathForResource(this._path, this._extension, this._page);

      this._name = path.basename(this._path);
      this._url = env.getUrlForResource(outputRelativePath, this._baseUrl);
      this._segments = url.parse(this._url).path.substr(1).split("/");
    }

    Object.freeze(this);
  }


  /**
   * Creates a new copy of the resource and can optionally can override the values of
   * properties (or remove the properties entirely) when `overrides` are provided.
   *
   * @param overrides
   *   Optional override values. Unwanted properties can be removed by supplying a value
   *   of `undefined` for each of the unwanted properties.
   * @param overrideEnv
   *   When specified overrides the webreed environment that the cloned resource is to
   *   be associated with.
   *
   * @returns
   *   A new instance.
   */
  clone(overrides: Object = null, overrideEnv: Environment = null): Resource {
    return new Resource(overrideEnv || this.__env, overrides, this);
  }


  /**
   * Base URL of the resource.
   */
  _baseUrl: string;

  /**
   * Path of the resource in the output directory.
   */
  _path: string;

  /**
   * Encoding of the resource type (for instance, this could be a value of "utf8").
   */
  _encoding: string;

  /**
   * File extension of the resource.
   */
  _extension: string;

  /**
   * Path identifying which page the resource represents of a paginated resource.
   */
  _page: string;

  /**
   * Name of the resource.
   *
   * This is a computed property which cannot be directly overridden.
   */
  _name: string;

  /**
   * URL of the resource is automatically determined from other properties of the
   * resource by resolving `_path + _extension` from `_baseUrl`.
   *
   * This is a computed property which cannot be directly overridden.
   */
  _url: string;

  /**
   * An array of zero-or-more segments from the URL.
   *
   * This is a computed property which cannot be directly overridden.
   */
  _segments: string[];

  /**
   * Body of the resource.
   */
  body: any;

}
