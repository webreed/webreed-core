// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.


import * as path from "path";
import * as url from "url";
const join = path.join;

import * as defaultBehaviors from "./behaviors/defaults";
import AliasMap from "./AliasMap";
import Generator from "./interfaces/Generator";
import Handler from "./interfaces/Handler";
import Mode from "./interfaces/Mode";
import Resource from "./Resource";
import ResourceType from "./ResourceType";
import TemplateEngine from "./interfaces/TemplateEngine";
import Transformer from "./interfaces/Transformer";
import normalizePathSeparators from "./util/normalizePathSeparators";
import trimTrailingSlash from "./util/trimTrailingSlash";


const DEFAULT_BASE_URL = "/";
const DEFAULT_PROJECT_ROOT_PATH = "";


export type BehaviorFunctionMap = {
  [behaviorName: string]: Function
};


/**
 * Represents the environment of a webreed project.
 */
export default class Environment {

  private _behaviors: BehaviorFunctionMap;

  private _projectRootPath = DEFAULT_PROJECT_ROOT_PATH;
  private _namedPaths = { };

  private _baseUrl = DEFAULT_BASE_URL;
  private _hiddenUrlExtensions = new Set<string>();
  private _hiddenUrlFileNames = new Set<string>();

  private _defaultGeneratorName = "standard";
  private _defaultModeName = "text";

  private _resourceTypes: AliasMap<ResourceType>;

  private _generators: AliasMap<Generator>;
  private _handlers: AliasMap<Handler>;
  private _modes: AliasMap<Mode>;
  private _templateEngines: AliasMap<TemplateEngine>;
  private _transformers: AliasMap<Transformer>;


  constructor() {
    let inheritedBehaviors = Object.assign({ }, defaultBehaviors);
    this._behaviors = Object.create(inheritedBehaviors);

    this._resourceTypes = new AliasMap<ResourceType>(null, {
      fallbackResolve: (aliasMap, key) => "*",
      strings: { invalidKey: "Resource type '{key}' is not defined. Consider specifying a fallback using the key '*'." }
    });

    this._generators = new AliasMap<Generator>(null, {
        strings: { invalidKey: "Generator '{key}' is not defined." }
      });
    this._handlers = new AliasMap<Handler>(null, {
        strings: { invalidKey: "Content handler '{key}' is not defined." }
      });
    this._modes = new AliasMap<Mode>(null, {
        strings: { invalidKey: "Resource mode '{key}' is not defined." }
      });
    this._templateEngines = new AliasMap<TemplateEngine>(null, {
        strings: { invalidKey: "Template engine '{key}' is not defined." }
      });
    this._transformers = new AliasMap<Transformer>(null, {
        strings: { invalidKey: "Transformer '{key}' is not defined." }
      });
  }


  /**
   * Base URL of the project which is assumed by default when generating output
   * relative URLs. This should be the URL representing the root-most level of the
   * generated output; for instance, "http://www.example.com/".
   *
   * A value of "/" is useful in situations where you want to be able to easily move
   * the generated output to different locations or servers.
   */
  get baseUrl(): string {
    return this._baseUrl;
  }
  set baseUrl(value: string) {
    this._baseUrl = value;
  }

  /**
   * Map of behaviors that can be used within the context of the environment.
   *
   * The default behaviors can be overridden:
   *
   *     env.behaviors.build = function customBuild(env) {
   *       // Do stuff before the default behavior...
   *
   *       // You can then apply the default behavior.
   *       return env.behaviors.__proto__.build.apply(null, arguments)
   *         .then(() => {
   *           // Do stuff after the default behavior...
   *         });
   *     };
   *
   * The default behavior can be restored by deleting the custom behavior:
   *
   *     delete env.behaviors.build;
   */
  get behaviors(): BehaviorFunctionMap {
    return this._behaviors;
  }

  /**
   * Name of the default generator.
   */
  get defaultGeneratorName(): string {
    return this._defaultGeneratorName;
  }
  set defaultGeneratorName(value: string) {
    if (value === "") {
      throw new Error("argument 'value' must be a non-empty string");
    }
    this._defaultGeneratorName = value;
  }

  /**
   * Name of the default resource mode.
   */
  get defaultModeName(): string {
    return this._defaultModeName;
  }
  set defaultModeName(value: string) {
    if (value === "") {
      throw new Error("argument 'value' must be a non-empty string");
    }
    this._defaultModeName = value;
  }

  /**
   * Map of resource types.
   */
  get resourceTypes(): AliasMap<ResourceType> {
    return this._resourceTypes;
  }

  /**
   * Map of content generators.
   */
  get generators(): AliasMap<Generator> {
    return this._generators;
  }

  /**
   * Map of content handlers.
   */
  get handlers(): AliasMap<Handler> {
    return this._handlers;
  }

  /**
   * Set of file extensions that should be hidden in generated URLs.
   */
  get hiddenUrlExtensions(): Set<string> {
    return this._hiddenUrlExtensions;
  }

  /**
   * Set of file names that should be hidden in generated URLs.
   */
  get hiddenUrlFileNames(): Set<string> {
    return this._hiddenUrlFileNames;
  }

  /**
   * Map of file modes.
   */
  get modes(): AliasMap<Mode> {
    return this._modes;
  }

  /**
   * Absolute file path to the project's root directory (no trailing slash).
   *
   * @throws {Error}
   * - If assigning a path that has multiple trailing forward slash characters.
   */
  public get projectRootPath(): string {
    return this._projectRootPath;
  }
  public set projectRootPath(value: string) {
    this._projectRootPath = trimTrailingSlash(value);
  }

  /**
   * Map of template engines.
   */
  public get templateEngines(): AliasMap<TemplateEngine> {
    return this._templateEngines;
  }

  /**
   * Map of content transformers.
   */
  public get transformers(): AliasMap<Transformer> {
    return this._transformers;
  }


  /**
   * Builds output of the webreed project that is described by the environment.
   *
   * @returns
   *   A promise to complete the build.
   */
  public build(): Promise<void> {
    return this.invoke("build");
  }

  /**
   * Creates an object representing a source or intermediate resource.
   *
   * @param props
   *   Properties that describe the resource.
   */
  public createResource(props: Object = null): Resource {
    return new Resource(this, props);
  }

  /**
   * Gets the output relative path for the given resource path, extension and page.
   *
   * @param path
   *   Path of the output resource.
   * @param extension
   *   File extension of the output resource.
   * @param page
   *   Page of the output resource (useful for paginated resources).
   *
   * @returns
   *   The output relative path for the resource.
   */
  public getOutputRelativePathForResource(path: string, extension: string = null, page: string = null): string {
    extension = extension !== null ? extension : "";
    page = page !== null ? page : "";

    if (path === "") {
      throw new Error("argument 'path' must be a non-empty string");
    }

    if (page != "") {
      path = normalizePathSeparators(join(path, page));
    }

    return path + extension;
  }

  /**
   * Gets the URL of a resource from a given output relative path.
   *
   * @param outputRelativePath
   *   Output relative path of content including file name and extension.
   * @param baseUrl
   *   Base URL that `path` should be resolved from; defaults to the project base URL.
   *
   * @returns
   *   The URL associated with the specified output path.
   */
  public getUrlForResource(outputRelativePath: string, baseUrl: string = null): string {
    baseUrl = baseUrl !== null ? baseUrl : this.baseUrl;

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
   * Invokes behavior from the [.Environment}]]
   *
   * @param behaviorName
   *   Name of the behavior.
   * @param behaviorArguments
   *   Zero-or-more arguments that will be provided to the behavior.
   *
   * @returns
   *   Result returned by the the behavior.
   *
   * @throws {Error}
   * - If requested behavior is not defined.
   */
  public invoke(behaviorName: string, ...behaviorArguments: any[]): any {
    if (behaviorName === "") {
      throw new Error("argument 'behaviorName' must be a non-empty string");
    }

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
   * @param name
   *   Name of the path, which must be non-empty.
   * @param relativePath
   *   Path relative to the named path.
   *
   * @returns
   *   The resolved absolute path.
   *
   * @see [[Environment.projectRootPath]]
   * @see [[Environment.setPath]]
   */
  public resolvePath(name: string, relativePath: string = ""): string {
    if (name === "") {
      throw new Error("argument 'name' must be a non-empty string");
    }

    let namedPath = this._namedPaths[name];
    if (namedPath === undefined) {
      namedPath = name;
    }

    let result = path.resolve(this.projectRootPath, namedPath);

    if (relativePath !== "") {
      result = path.resolve(result, relativePath);
    }

    return result;
  }

  /**
   * Sets a named path.
   *
   * @param name
   *   Name of the path, which must be non-empty.
   * @param path
   *   Path which will be resolved from the project's root path.
   *
   * @see [[Environment.projectRootPath]]
   */
  public setPath(name: string, path: string): this {
    if (name === "") {
      throw new Error("argument 'name' must be a non-empty string");
    }
    if (path === "") {
      throw new Error("argument 'path' must be a non-empty string");
    }

    this._namedPaths[name] = path;

    return this;
  }

}
