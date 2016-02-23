// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.

/** @module webreed/lib/Environment */


// System
import path from "path";
import url from "url";

// Packages
import moment from "moment";

// Project
import * as defaultBehaviors from "./behaviors/defaults";
import AliasMap from "./AliasMap";
import Resource from "./Resource";
import normalizePathSeparators from "./util/normalizePathSeparators";
import trimTrailingSlash from "./util/trimTrailingSlash";


// Symbols to simulate private fields
const behaviorsField = Symbol();

const projectRootPathField = Symbol();
const namedPathsField = Symbol();

const baseUrlField = Symbol();
const hiddenUrlExtensionsField = Symbol();
const hiddenUrlFileNamesField = Symbol();

const timeStartedField = Symbol();

const defaultGeneratorNameField = Symbol();
const resourceTypesField = Symbol();
const generatorsField = Symbol();
const handlersField = Symbol();
const modesField = Symbol();
const templateEnginesField = Symbol();
const transformersField = Symbol();


const defaultBaseUrlValue = "/";
const defaultProjectRootPathValue = "";

const resolveResourceTypeFallback = (aliasMap, key) => "*";


/**
 * Represents the environment of a webreed project.
 */
export default class Environment {

  constructor() {
    let inheritedBehaviors = Object.assign({ }, defaultBehaviors);

    this[behaviorsField] = Object.create(inheritedBehaviors);

    this[projectRootPathField] = defaultProjectRootPathValue;
    this[namedPathsField] = { };

    this[baseUrlField] = defaultBaseUrlValue;
    this[hiddenUrlExtensionsField] = new Set();
    this[hiddenUrlFileNamesField] = new Set();

    //!TODO: Make the value of the `timeStartedField` immutable when moment.js resolves:
    //   TypeError: Can't add property _isValid, object is not extensible
    //    at valid__isValid (...\node_modules\moment\moment.js:93:24)
    //this[timeStartedField] = Object.freeze(moment());
    this[timeStartedField] = moment();

    this[defaultGeneratorNameField] = "standard";
    this[resourceTypesField] = new AliasMap(null, null, resolveResourceTypeFallback);
    this[generatorsField] = new AliasMap();
    this[handlersField] = new AliasMap();
    this[modesField] = new AliasMap();
    this[templateEnginesField] = new AliasMap();
    this[transformersField] = new AliasMap();
  }


  /**
   * Base URL of the project which is assumed by default when generating output
   * relative URLs. This should be the URL representing the root-most level of the
   * generated output; for instance, "http://www.example.com/".
   *
   * A value of "/" is useful in situations where you want to be able to easily move
   * the generated output to different locations or servers.
   *
   * @member {string}
   * @default "/"
   */
  get baseUrl() {
    return this[baseUrlField];
  }
  set baseUrl(value) {
    console.assert(typeof value === "string",
        "argument 'value' must be a string");

    this[baseUrlField] = value;
  }

  /**
   * Map of behaviors that can be used within the context of the environment.
   *
   * The default behaviors can be overridden:
   *
   *     env.behaviors.build = function customBuild(env) {
   *       // Do stuff before the default behavior...
   *
   *       // You can apply the default behavior.
   *       env.behaviors.prototype.build.apply(arguments);
   *
   *       // Do stuff after the default behavior...
   *     };
   *
   * The default behavior can be restored by deleting the custom behavior:
   *
   *     delete env.behaviors.build;
   *
   * @member {object.<string, function>} behaviors
   * @readonly
   */
  get behaviors() {
    return this[behaviorsField];
  }

  /**
   * Name of the default generator.
   *
   * @member {string}
   */
  get defaultGeneratorName() {
    return this[defaultGeneratorNameField];
  }
  set defaultGeneratorName(value) {
    console.assert(typeof value === "string" && value !== "",
        "argument 'value' must be a non-empty string");

    this[defaultGeneratorNameField] = value;
  }

  /**
   * Map of resource types.
   *
   * @member {module:webreed/lib/AliasMap.<string, module:webreed/lib/ResourceType>}
   * @readonly
   */
  get resourceTypes() {
    return this[resourceTypesField];
  }

  /**
   * Map of content generators.
   *
   * @member {module:webreed/lib/AliasMap.<string, module:webreed/lib/interfaces/Generator>}
   * @readonly
   */
  get generators() {
    return this[generatorsField];
  }

  /**
   * Map of content handlers.
   *
   * @member {module:webreed/lib/AliasMap.<string, module:webreed/lib/interfaces/Handler>}
   * @readonly
   */
  get handlers() {
    return this[handlersField];
  }

  /**
   * Set of file extensions that should be hidden in generated URLs.
   *
   * @member {Set.<string>}
   * @readonly
   */
  get hiddenUrlExtensions() {
    return this[hiddenUrlExtensionsField];
  }

  /**
   * Set of file names that should be hidden in generated URLs.
   *
   * @member {Set.<string>}
   * @readonly
   */
  get hiddenUrlFileNames() {
    return this[hiddenUrlFileNamesField];
  }

  /**
   * Map of file modes.
   *
   * @member {module:webreed/lib/AliasMap.<string, module:webreed/lib/interfaces/Mode>}
   * @readonly
   */
  get modes() {
    return this[modesField];
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
   * Map of template engines.
   *
   * @member {module:webreed/lib/AliasMap.<string, module:webreed/lib/interfaces/TemplateEngine>}
   * @readonly
   */
  get templateEngines() {
    return this[templateEnginesField];
  }

  /**
   * The time that the webreed environment was created.
   *
   * @member {module:moment}
   * @readonly
   */
  get timeStarted() {
    return this[timeStartedField];
  }

  /**
   * Map of content transformers.
   *
   * @member {module:webreed/lib/AliasMap.<string, module:webreed/lib/interfaces/Transformer>}
   * @readonly
   */
  get transformers() {
    return this[transformersField];
  }


  /**
   * Builds output of the webreed project that is described by the environment.
   *
   * @returns {Promise}
   *   A promise to complete the build.
   */
  build() {
    return this.invoke("build");
  }

  /**
   * Creates an object representing a source or intermediate resource.
   *
   * @param {object} [props = null]
   *   Properties that describe the resource.
   *
   * @returns {module:webreed/lib/Resource}
   */
  createResource(props) {
    return new Resource(this, props);
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
   * Gets the URL of a resource from a given output relative path.
   *
   * @param {string} outputRelativePath
   *   Output relative path of content including file name and extension.
   * @param {string} [baseUrl]
   *   Base URL that `path` should be resolved from; defaults to the project base URL.
   *
   * @returns {string}
   *   The URL associated with the specified output path.
   */
  getUrlForResource(outputRelativePath, baseUrl) {
    baseUrl = baseUrl || this.baseUrl;

    console.assert(typeof outputRelativePath === "string",
        "argument 'outputRelativePath' must be a string");
    console.assert(typeof baseUrl === "string",
        "argument 'baseUrl' must be a string");

    outputRelativePath = outputRelativePath || "";

    let fileName = path.basename(outputRelativePath);
    if (this.hiddenUrlFileNames.has(fileName)) {
      // Remove file name from output relative path.
      outputRelativePath = outputRelativePath.substr(0, outputRelativePath.length - fileName.length);
    }
    else {
      // It is commonplace to hide ".html" from URLs since they can be automatically
      // resolved with the likes of a ".htaccess" file.
      let extension = path.extname(outputRelativePath);
      if (extension && this.hiddenUrlExtensions.has(extension)) {
        // Remove extension from output relative path.
        outputRelativePath = outputRelativePath.substr(0, outputRelativePath.length - extension.length);
      }
    }

    return url.resolve(baseUrl, outputRelativePath);
  }

  /**
   * Invokes behavior from the {@link module:webreed/lib/Environment}.
   *
   * @param {string} behaviorName
   *   Name of the behavior.
   * @param {...any} behaviorArguments
   *   Zero-or-more arguments that will be provided to the behavior.
   *
   * @returns {any}
   *   Result returned by the the behavior.
   *
   * @throws {Error}
   * - If requested behavior is not defined.
   */
  invoke(behaviorName, ...behaviorArguments) {
    console.assert(typeof behaviorName === "string" && behaviorName !== "",
        "argument 'behaviorName' must be a non-empty string");

    let behavior = this.behaviors[behaviorName];
    if (!behavior) {
      throw new Error(`Behavior '${behaviorName}' is not defined.`);
    }

    return behavior(this, ...behaviorArguments);
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
