// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.


import {Observable} from "rxjs";

import * as defaultBehaviors from "./behaviors/defaults";
import {Environment} from "./Environment";
import {PluginContext} from "./PluginContext";
import {ResolvedGenerator} from "./behaviors/resolveGenerator";
import {ResolvedResourceMode} from "./behaviors/resolveResourceMode";
import {ResolvedTemplateEngine} from "./behaviors/resolveTemplateEngine";
import {ResourceType} from "./ResourceType";
import {Resource} from "./Resource";


/**
 * Map of named webreed behavior implementations.
 */
export class BehaviorMap {

  private _env: Environment;
  private _map: Object;


  /**
   * @param env
   *   An environment that represents a webreed project.
   */
  constructor(env: Environment) {
    let inheritedBehaviors = Object.assign({ }, defaultBehaviors);

    this._env = env;
    this._map = Object.create(inheritedBehaviors);
  }


  /**
   * Applies a given extension chain to a resource in order from right to left.
   *
   * For instance, given an extension chain of 'about.md.nunjucks' the input resource will
   * be transformed in the following order:
   *
   * 1. Apply any conversion transformations .nunjucks > .md
   * 2. Apply any .md process transformations
   * 3. Apply any conversion transformations .md > .html
   * 4. Apply any .html process transformations
   * 5. Apply any conversion transformations from .html > $
   * 6. Apply any $ process transformations
   *
   * @param resource
   *   The resource that is to be transformed.
   * @param extensionChain
   *   A sequence of zero or more file extensions.
   *
   * @returns
   *   An observable stream of output resources.
   */
  public applyExtensionChainToResource(resource: Resource, extensionChain: string): Observable<Resource> {
    return this._map["applyExtensionChainToResource"](this._env, ...arguments);
  }

  /**
   * Applies a sequence of transformations to a given resource.
   *
   * @param resource
   *   The resource that is to be transformed.
   * @param transformers
   *   An array of zero-or-more transformers that will be applied to the input resource.
   *
   * @returns
   *   An observable stream of transformed resources.
   */
  public applySequenceOfTransformsToResource(resource: Resource, transformers: PluginContext[] = null): Observable<Resource> {
    return this._map["applySequenceOfTransformsToResource"](this._env, ...arguments);
  }

  /**
   * Applies a template to a specified resource.
   *
   * @param resource
   *   The resource that is being generated.
   * @param templateName
   *   Name of the template to apply to the resource.
   *
   * @returns
   *   An observable stream of output resources.
   *
   * @throws {Error}
   * - If resource type is not associated with a template engine.
   * - If the resolved template engine is not defined.
   */
  public applyTemplateToResource(resource: Resource, templateName: string): Observable<Resource> {
    return this._map["applyTemplateToResource"](this._env, ...arguments);
  }

  /**
   * Builds output for a given webreed environment.
   *
   * @returns
   *   A promise to complete the build.
   */
  public build(): Promise<void> {
    return this._map["build"](this._env, ...arguments);
  }

  /**
   * Copies files from 'files' directory into 'output' directory.
   *
   * @returns
   *   A promise to complete the copy files operation.
   */
  public copyFilesToOutput(): Promise<void> {
    return this._map["copyFilesToOutput"](this._env, ...arguments);
  }

  /**
   * Decodes a source resource of a specified type.
   *
   * @param resource
   *   The source resource that is being decoded.
   * @param resourceType
   *   Represents the type of resource that is being processed.
   *
   * @returns
   *   A promise to fulfill with the decoded resource.
   */
  public decodeResource(resource: Resource, resourceType: ResourceType): Promise<Resource> {
    return this._map["decodeResource"](this._env, ...arguments);
  }

  /**
   * Generate output for a given resource.
   *
   * @param resource
   *   The resource that is being generated.
   * @param resourceType
   *   Represents the type of resource that is being generated.
   *
   * @returns
   *   An observable stream of output resources.
   *
   * @throws {Error}
   * - If the environment does not define the associated generator.
   */
  public generateResource(resource: Resource, resourceType: ResourceType): Observable<Resource> {
    return this._map["generateResource"](this._env, ...arguments);
  }

  /**
   * Gets source content paths relative to the content directory.
   *
   * @returns
   *   An observable collection of content relative paths.
   */
  public getSourceContentRelativePaths(): Observable<string> {
    return this._map["getSourceContentRelativePaths"](this._env, ...arguments);
  }

  /**
   * Loads a resource file.
   *
   * Note: This method does not cache resources.
   *
   * @param filePath
   *   Absolute path to the input resource file, which must be non-empty.
   * @param resourceTypeExtension
   *   When specified allows caller to specify the type of the resource; otherwise the
   *   resource type is resolved using file extension from argument 'filePath'.
   * @param baseProperties
   *   Base properties for the resource which can be overridden by properties found in the
   *   source resource's frontmatter.
   *
   * @returns
   *   A promise to return a [[Resource]] representing the resource and its frontmatter; or
   *   to throw an error.
   *
   * @throws {Error}
   * - If attempting to load resource with an unknown mode.
   */
  public loadResourceFile(filePath: string, resourceTypeExtension: string = null, baseProperties: Object = null): Promise<Resource> {
    return this._map["loadResourceFile"](this._env, ...arguments);
  }

  /**
   * Loads a content resource file.
   *
   * Note: This method does not cache resources.
   *
   * @param contentRelativePath
   *   Path to the content file (relative to the "content" directory), which must be non-empty.
   * @param resourceTypeExtension
   *   When specified allows caller to specify the type of the resource; otherwise the
   *   resource type is resolved using file extension from argument 'filePath'.
   * @param baseProperties
   *   Base properties for the resource which can be overridden by properties found in the
   *   source resource's frontmatter.
   *
   * @returns
   *   A promise to return a [[Resource]] representing the resource
   *   and its frontmatter; or to throw an error.
   *
   * @throws {Error}
   * - If attempting to load resource with an unknown mode.
   */
  public loadSourceContent(contentRelativePath: string, resourceTypeExtension: string = null, baseProperties: Object = null): Promise<Resource> {
    return this._map["loadSourceContent"](this._env, ...arguments);
  }

  /**
   * Processes a resource of a specified type.
   *
   * @param resource
   *   The resource that is being generated.
   * @param resourceType
   *   Represents the type of resource that is being processed.
   *
   * @returns
   *   An observable stream of output resources.
   */
  public processResource(resource: Resource, resourceType: ResourceType): Observable<Resource> {
    return this._map["processResource"](this._env, ...arguments);
  }

  /**
   * Process source content files and save generated outputs.
   *
   * @returns
   *   A promise to complete the process source content files operation.
   */
  public processSourceContentFiles(): Promise<void> {
    return this._map["processSourceContentFiles"](this._env, ...arguments);
  }

  /**
   * Resolves the generator for the given context.
   *
   * @param resource
   *   The resource that will be processed with the generator that is being resolved.
   * @param resourceType
   *   The type of resource that will be processed with the generator that is being resolved.
   *
   * @returns
   *   The resolved generator.
   *
   * @throws {Error}
   * - If the resolved generator is not defined.
   */
  public resolveGenerator(resource: Resource = null, resourceType: ResourceType = null): ResolvedGenerator {
    return this._map["resolveGenerator"](this._env, ...arguments);
  }

  /**
   * Resolves the resource mode for the given context.
   *
   * @param resource
   *   The resource that will be processed with the mode that is being resolved.
   * @param resourceType
   *   The type of resource that will be processed with the mode that is being resolved.
   *
   * @returns
   *   The resolved resource mode.
   *
   * @throws {Error}
   * - If the resolved resource mode is not defined.
   */
  public resolveResourceMode(resource: Resource = null, resourceType: ResourceType = null): ResolvedResourceMode {
    return this._map["resolveResourceMode"](this._env, ...arguments);
  }

  /**
   * Resolves the template engine for the given template name.
   *
   * @param templateName
   *   Name of the template relative to the templates directory.
   *
   * @returns
   *   The resolved template engine.
   *
   * @throws {Error}
   * - If resource type is not associated with a template engine.
   * - If the resolved template engine is not defined.
   */
  public resolveTemplateEngine(templateName: string): ResolvedTemplateEngine {
    return this._map["resolveTemplateEngine"](this._env, ...arguments);
  }

  /**
   * Saves a resource file.
   *
   * @param outputFilePath
   *   Absolute path to the output resource file, which must be non-empty.
   * @param resource
   *   The resource that is to be saved.
   * @param resourceTypeExtension
   *   When specified allows the caller to override the type of the resource. Assumes file
   *   extension from `outputFilePath` argument when `resourceTypeExtension` is `null`.
   *
   * @returns
   *   A promise to notify upon completion; or to throw an error.
   *
   * @throws {Error}
   * - If attempting to save resource with an unknown mode.
   */
  public saveResourceFile(outputFilePath: string, resource: Resource, resourceTypeExtension: string = null): Promise<void> {
    return this._map["saveResourceFile"](this._env, ...arguments);
  }


  /**
   * Gets a value indicating whether the specified behavior is defined.
   *
   * @param behaviorName
   *   Name of the behavior.
   *
   * @returns
   *   `true` if the behavior is defined; otherwise, `false`.
   */
  public has(behaviorName: string): boolean {
    return typeof this._map[behaviorName] === "function";
  }

  /**
   * Invokes a custom or default implementation of the specified behavior.
   *
   * @param behaviorName
   *   Name of the behavior.
   * @param args
   *   Zero-or-more arguments.
   *
   * @returns
   *   Result returned by the behavior (if any).
   *
   * @throws {Error}
   * - If the behavior is undefined.
   */
  public invoke(behaviorName: string, ...args: any[]): any {
    let behaviorFn = this._map[behaviorName];
    if (typeof behaviorFn !== "function") {
      throw new Error(`Behavior '${behaviorName}' is undefined.`);
    }
    return behaviorFn(this._env, ...args);
  }

  /**
   * Invokes the default implementation of the specified behavior.
   *
   * @param behaviorName
   *   Name of the behavior.
   * @param args
   *   Zero-or-more arguments.
   *
   * @returns
   *   Result returned by the behavior (if any).
   *
   * @throws {Error}
   * - If the behavior is undefined.
   */
  public invokeDefault(behaviorName: string, ...args: any[]): any {
    let defaults = Object.getPrototypeOf(this._map);
    let behaviorFn = defaults[behaviorName];
    if (typeof behaviorFn !== "function") {
      throw new Error(`Behavior '${behaviorName}' is undefined.`);
    }
    return behaviorFn(this._env, ...args);
  }

  /**
   * Sets a custom implementation of the specified behavior.
   *
   * @param behaviorName
   *   Name of the behavior.
   * @param behaviorFn
   *   Function that implements the behavior; or specify a value of `null` to remove an
   *   existing custom implementation of the specified behavior and restore the default.
   */
  public set(behaviorName: string, behaviorFn?: Function): this {
    if (!!behaviorFn) {
      this._map[behaviorName] = behaviorFn;
    }
    else {
      delete this._map[behaviorName];
    }
    return this;
  }

}
