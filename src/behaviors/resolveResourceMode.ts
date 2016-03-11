// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.


import {Environment} from "../Environment";
import {Mode} from "../plugin/Mode";
import {ResourceType} from "../ResourceType";
import {Resource} from "../Resource";


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


export function resolveResourceMode(env: Environment, resource: Resource = null, resourceType: ResourceType = null): ResolvedResourceMode {
  let modeName: string;

  if (resource !== null && !!resource.__mode) {
    modeName = resource.__mode;
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
