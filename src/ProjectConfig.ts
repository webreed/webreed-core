// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.


import * as path from "path";

import deepFreeze = require("deep-freeze");

import {Environment} from './Environment';


/**
 * Provides access to a webreed project configuration.
 */
export class ProjectConfig {

  private _isLoading = false;
  private _data = { };


  /**
   * Gets a value from the project configuration.
   *
   * @param path
   *   Path of the configuration property of the format "config/file.property".
   * @defaultValue
   *   A default value to assume when configuration property is undefined.
   *
   * @returns
   *   The configuration value when defined; otherwise, a value of `undefined`.
   *
   * @throws Error
   * - If project configuration is currently being loaded.
   * - If argument 'path' contains invalid characters.
   */
  public get(path: string, defaultValue?: any): any {
    console.assert(!this._isLoading,
        "Cannot access configuration until it has been loaded.");
    console.assert(/^[^\.]+(\.[^\s;\(\)\\\/'"=+-]+)?$/.test(path),
        `Config path '${path}' contains one or more invalid characters.`)

    let baseName: string = path;
    let dataPath: string = undefined;

    let separatorIndex = path.indexOf(".");
    if (separatorIndex !== -1) {
      baseName = path.substr(0, separatorIndex);
      dataPath = path.substr(separatorIndex + 1);
    }

    let result = this._data[baseName];
    if (dataPath !== undefined) {
      result = resolveDataPath.call(result, dataPath);
    }

    if (result === undefined) {
      result = defaultValue;
    }

    return result;
  }

  /**
   * Loads project configuration for the given webreed environment.
   *
   * @param env
   *   The webreed environment that the resource is to be associated with.
   *
   * @returns
   *   A promise to load the project configuration.
   */
  public async load(env: Environment) {
    this._isLoading = true;

    let promiseToGetConfigRelativePaths = env.behaviors.getSourceContentRelativePaths("config")
      .toArray()
      .toPromise();

    let data = { };

    for (let configRelativePath of await promiseToGetConfigRelativePaths) {
      let fileExtension = path.extname(configRelativePath);
      let resourceType = env.resourceTypes.lookupQuiet(fileExtension);
      if (resourceType !== undefined) {
        let configResoucePath = env.resolvePath("config", configRelativePath);
        let configResource = await env.behaviors.loadResourceFile(configResoucePath);
        let configData = await env.behaviors.decodeResource(configResource, resourceType);

        let configPath = configRelativePath.substr(0, configRelativePath.length - fileExtension.length);
        data[configPath] = configData;
      }
    }

    this._data = deepFreeze(data);
    this._isLoading = false;
  }

}


function resolveDataPath(path: string): any {
  try {
    // `this` is bound at the call site.
    return eval("this." + path);
  }
  catch (err) {
    if (err instanceof TypeError) {
      return undefined;
    }
    else {
      throw err;
    }
  }
}
