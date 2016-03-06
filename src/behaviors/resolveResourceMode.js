// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.

/** @module webreed/lib/behaviors/resolveResourceMode */


// Project
import Environment from "../Environment";
import Resource from "../Resource";
import ResourceType from "../ResourceType";


/**
 * Resolves the resource mode for the given context.
 *
 * @param {module:webreed/lib/Environment} env
 *   An environment that represents a webreed project.
 * @param {module:webreed/lib/Resource|object} [resource = null]
 *   The resource that will be processed with the mode that is being resolved.
 * @param {module:webreed/lib/ResourceType|object} [resourceType = null]
 *   The type of resource that will be processed with the mode that is being resolved.
 *
 * @returns {object}
 *   An object with the following properties:
 *   - **name** (string) - Name of the mode.
 *   - **mode** (object) - Resource mode instance.
 *
 * @throws {Error}
 * - If the resolved resource mode is not defined.
 */
export default function resolveResourceMode(env, resource, resourceType) {
  if (!(env instanceof Environment)) {
    throw new TypeError("argument 'env' must be a webreed environment");
  }
  if (resource !== undefined && resource !== null && !(resource instanceof Resource)) {
    throw new TypeError("argument 'resource' must be a `Resource`");
  }
  if (resourceType !== undefined && resourceType !== null && !(resourceType instanceof ResourceType)) {
    throw new TypeError("argument 'resourceType' must be a `ResourceType`");
  }

  let modeName;

  if (!!resource && !!resource.__mode) {
    modeName = resource.__mode;
  }
  else if (!!resourceType) {
    modeName = resourceType.mode;
  }
  else {
    modeName = env.defaultModeName;
  }

  let resolvedModeName = env.modes.noisyResolve(modeName);

  return {
    name: resolvedModeName,
    mode: env.modes.get(resolvedModeName)
  };
}
