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

  public applyExtensionChainToResource(resource: Resource, extensionChain: string): Observable<Resource> {
    return this._map["applyExtensionChainToResource"](this._env, ...arguments);
  }

  public applySequenceOfTransformsToResource(resource: Resource, transformers: PluginContext[] = null): Observable<Resource> {
    return this._map["applySequenceOfTransformsToResource"](this._env, ...arguments);
  }

  public applyTemplateToResource(resource: Resource, templateName: string): Observable<Resource> {
    return this._map["applyTemplateToResource"](this._env, ...arguments);
  }

  public build(): Promise<void> {
    return this._map["build"](this._env, ...arguments);
  }

  public copyFilesToOutput(): Promise<void> {
    return this._map["copyFilesToOutput"](this._env, ...arguments);
  }

  public decodeResource(resource: Resource, resourceType: ResourceType): Promise<Resource> {
    return this._map["decodeResource"](this._env, ...arguments);
  }

  public generateResource(resource: Resource, resourceType: ResourceType): Observable<Resource> {
    return this._map["generateResource"](this._env, ...arguments);
  }

  public getSourceContentRelativePaths(): Observable<string> {
    return this._map["getSourceContentRelativePaths"](this._env, ...arguments);
  }

  public loadResourceFile(filePath: string, resourceTypeExtension: string = null, baseProperties: Object = null): Promise<Resource> {
    return this._map["loadResourceFile"](this._env, ...arguments);
  }

  public loadSourceContent(contentRelativePath: string, resourceTypeExtension: string = null, baseProperties: Object = null): Promise<Resource> {
    return this._map["loadSourceContent"](this._env, ...arguments);
  }

  public processResource(resource: Resource, resourceType: ResourceType): Observable<Resource> {
    return this._map["processResource"](this._env, ...arguments);
  }

  public processSourceContentFiles(): Promise<void> {
    return this._map["processSourceContentFiles"](this._env, ...arguments);
  }

  public resolveGenerator(resource: Resource = null, resourceType: ResourceType = null): ResolvedGenerator {
    return this._map["resolveGenerator"](this._env, ...arguments);
  }

  public resolveResourceMode(resource: Resource = null, resourceType: ResourceType = null): ResolvedResourceMode {
    return this._map["resolveResourceMode"](this._env, ...arguments);
  }

  public resolveTemplateEngine(templateName: string): ResolvedTemplateEngine {
    return this._map["resolveTemplateEngine"](this._env, ...arguments);
  }

  public saveResourceFile(outputFilePath: string, resource: Resource, resourceTypeExtension: string = null): Promise<void> {
    return this._map["saveResourceFile"](this._env, ...arguments);
  }

  public has(behaviorName: string): boolean {
    return typeof this._map[behaviorName] === "function";
  }

  public invoke(behaviorName: string, ...args: any[]): any {
    let behaviorFn = this._map[behaviorName];
    if (typeof behaviorFn !== "function") {
      throw new Error(`Behavior '${behaviorName}' is undefined.`);
    }
    return behaviorFn(this._env, ...args);
  }

  public invokeDefault(behaviorName: string, ...args: any[]): any {
    let defaults = Object.getPrototypeOf(this._map);
    let behaviorFn = defaults[behaviorName];
    if (typeof behaviorFn !== "function") {
      throw new Error(`Behavior '${behaviorName}' is undefined.`);
    }
    return behaviorFn(this._env, ...args);
  }

  public set(behaviorName: string, behaviorFn: Function): this {
    if (!!behaviorFn) {
      this._map[behaviorName] = behaviorFn;
    }
    else {
      delete this._map[behaviorName];
    }
    return this;
  }

}
