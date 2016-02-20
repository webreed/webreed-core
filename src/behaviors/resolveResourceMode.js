// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.

/** @module webreed/lib/behaviors/resolveResourceMode */


// Project
import isEnvironment from "../util/isEnvironment";


const finalfallbackModeName = "text";


/**
 * Resolves the resource mode for the given context.
 *
 * @param {module:webreed/lib/Environment} env
 *   An environment that represents a webreed project.
 * @param {module:webreed/lib/Resource|object} [resource = null]
 *   The resource that will be processed with the mode that is being resolved.
 * @param {module:webreed/lib/ResourceType|object} [resourceType = null]
 *   The type of resource that will be processed with the mode that is being resolved.
 * @param {string} [fallbackModeName = null]
 *   Name of the fallback resource mode; must be non-empty.
 *
 * @returns {object}
 *   An object with the following properties:
 *   - **name** (string) - Name of the mode.
 *   - **handlers** (object) - Mode handler methods.
 *
 * @throws {Error}
 * - If the resolved resource mode is not defined.
 */
export default function resolveResourceMode(env, resource, resourceType, fallbackModeName) {
  console.assert(isEnvironment(env),
      "argument 'env' must be a webreed environment");
  console.assert(resource === undefined || typeof resource === "object",
      "argument 'resource' must be `null` or an object");
  console.assert(resourceType === undefined || typeof resourceType === "object",
      "argument 'resourceType' must be `null` or an object");
  console.assert(fallbackModeName === undefined || fallbackModeName === null || (typeof fallbackModeName === "string" && fallbackModeName !== ""),
      "argument 'fallbackModeName' must be `null` or a non-empty string");

  let modeName;

  if (!!resource && !!resource.__mode) {
    modeName = resource.__mode;
  }
  else if (!!resourceType && !!resourceType.mode) {
    modeName = resourceType.mode;
  }
  else {
    modeName = fallbackModeName || finalfallbackModeName;
  }

  let resolvedModeName = env.modes.resolve(modeName);
  if (resolvedModeName === undefined) {
    throw new Error(`Resource mode '${modeName}' is not defined.`);
  }

  return {
    name: resolvedModeName,
    mode: env.modes.get(resolvedModeName)
  };
}
