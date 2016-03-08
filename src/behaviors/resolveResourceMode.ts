// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.


import {Environment} from "../Environment";
import {Mode} from "../plugin/Mode";
import {Resource} from "../Resource";
import {ResourceType} from "../ResourceType";


/**
 * Details of a resolved resource mode.
 */
export type ResolvedResourceMode = {

  /**
   * Name of the resource mode plugin.
   */
  name: string;

  /**
   * The resource mode instance.
   */
  mode: Mode;

};


/**
 * Resolves the resource mode for the given context.
 *
 * @param env
 *   An environment that represents a webreed project.
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
export function resolveResourceMode(env: Environment, resource: Resource = null, resourceType: ResourceType = null): ResolvedResourceMode {
  let modeName: string;

  if (resource !== null && !!resource["__mode"]) {
    modeName = resource["__mode"];
  }
  else if (resourceType !== null) {
    modeName = resourceType.mode;
  }
  else {
    modeName = env.defaultModeName;
  }

  let resolvedModeName = env.modes.noisyResolveKey(modeName);

  return {
    name: resolvedModeName,
    mode: <Mode> env.modes.get(resolvedModeName)
  };
}
