// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.

/** @module webreed/lib/Environment */


// System
import path from "path";

// Project
import * as defaultBehaviors from "./behaviors/defaults";
import normalizePathSeparators from "./util/normalizePathSeparators";
import trimTrailingSlash from "./util/trimTrailingSlash";


// Symbols to simulate private fields
const behaviorsField = Symbol();
const namedPathsField = Symbol();
const projectRootPathField = Symbol();


/**
 * Represents the environment of a webreed project.
 */
export default class Environment {

  constructor() {
    // Copy default behavior mappings into environment so that they can be selectively
    // overridden by the consumer of this API.
    this[behaviorsField] = Object.create(Object.assign({ }, defaultBehaviors));

    this[namedPathsField] = { };
    this[projectRootPathField] = "";
  }


  /**
   * Map of behaviors that can be used within the context of the environment.
   *
   * The default behaviors can be overridden:
   *
   * ```
   * env.behaviors.buildOutput = function customBuildOutput(env) {
   *     // Do stuff before the default behavior...
   *
   *     // You can apply the default behavior.
   *     env.behaviors.prototype.buildOutput.apply(arguments);
   *
   *     // Do stuff after the default behavior...
   * };
   * ```
   *
   * The default behavior can be restored by deleting the custom behavior:
   *
   * ```
   * delete env.behaviors.buildOutput;
   * ```
   *
   * @member {object.<string, function>} behaviors
   * @readonly
   */
  get behaviors() {
    return this[behaviorsField];
  }

  /**
   * Absolute file path to the project's root directory (no trailing slash).
   *
   * @member {string}
   *
   * @throws {Error}
   * - If assigning a path that has multiple trailing forward slash characters.
   */
  get projectRootPath() {
    return this[projectRootPathField];
  }
  set projectRootPath(value) {
    console.assert(typeof value === "string",
        "argument 'value' must be a string");

    this[projectRootPathField] = trimTrailingSlash(value);
  }


  /**
   * Builds output of the webreed project that is described by the environment.
   *
   * @returns {Promise}
   *   A promise to complete the build.
   */
  build() {
    return this.behaviors.buildOutput(this);
  }

  /**
   * Gets the output relative path for the given resource path, extension and page.
   *
   * @param {string} path
   *   Path of the output resource.
   * @param {string} [extension]
   *   File extension of the output resource.
   * @param {string} [page]
   *   Page of the output resource (useful for paginated resources).
   *
   * @returns {string}
   *   The output relative path for the resource.
   */
  getOutputRelativePathForResource(_path_, extension, page) {
    extension = extension || "";
    page = page || "";

    console.assert(typeof _path_ === "string" && _path_ !== "",
        "argument 'path' must be a non-empty string");
    console.assert(typeof extension === "string",
        "argument 'extension' must be a string, null or undefined");
    console.assert(typeof page === "string",
        "argument 'page' must be a string, null or undefined");

    if (page != "") {
      _path_ = normalizePathSeparators(path.join(_path_, page));
    }

    return _path_ + extension;
  }

  /**
   * Resolves a named path relative to the project's root path.
   *
   * Assumes a directory with the name provided by argument `name` relative to the
   * project's root path when named path has not been explicitly defined.
   *
   * @param {string} name
   *   Name of the path, which must be non-empty.
   * @param {string} [relativePath]
   *   Path relative to the named path.
   *
   * @returns {string}
   *   The resolved absolute path.
   *
   * @see {@link module:webreed/lib/Environment#projectRootPath}
   * @see {@link module:webreed/lib/Environment#setPath}
   */
  resolvePath(name, relativePath) {
    console.assert(typeof name === "string" && name !== "",
        "argument 'name' must be a non-empty string");
    console.assert(!relativePath || typeof relativePath === "string",
        "argument 'relativePath' must be a string");

    let namedPath = this[namedPathsField][name];
    if (namedPath === undefined) {
      namedPath = name;
    }

    let result = path.resolve(this.projectRootPath, namedPath);

    if (!!relativePath) {
      result = path.resolve(result, relativePath);
    }

    return result;
  }

  /**
   * Sets a named path.
   *
   * @param {string} name
   *   Name of the path, which must be non-empty.
   * @param {string} path
   *   Path which will be resolved from the project's root path.
   *
   * @returns {this}
   *
   * @see {@link module:webreed/lib/Environment#projectRootPath}
   */
  setPath(name, path) {
    console.assert(typeof name === "string" && name !== "",
        "argument 'name' must be a non-empty string");
    console.assert(typeof path === "string",
        "argument 'path' must be a string");

    this[namedPathsField][name] = path;

    return this;
  }

}
