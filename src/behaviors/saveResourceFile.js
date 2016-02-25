// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.

/** @module webreed/lib/behaviors/saveResourceFile */


// System
import path from "path";

// Project
import Environment from "../Environment";
import Resource from "../Resource";


/**
 * Saves a resource file.
 *
 * @param {string} outputFilePath
 *   Path to the output resource file, which must be non-empty.
 * @param {module:webreed/lib/Resource} resource
 *   The resource that is to be saved.
 * @param {string} [resourceTypeExtension = null]
 *   When specified allows the caller to override the type of the resource. Assumes
 *   file extension from `outputFilePath` argument when `resourceTypeExtension` is
 *   `undefined` or `null`.
 *
 * @returns {Promise}
 *   A promise to notify upon completion; or to throw an error.
 *
 * @throws {Error}
 * - If attempting to save resource with an unknown mode.
 */
export default function saveResourceFile(env, outputFilePath, resource, resourceTypeExtension) {
  if (resourceTypeExtension === undefined || resourceTypeExtension === null) {
    resourceTypeExtension = path.extname(outputFilePath);
  }

  console.assert(env instanceof Environment,
      "argument 'env' must be a webreed environment");
  console.assert(typeof outputFilePath === "string" && outputFilePath !== "",
      "argument 'outputFilePath' must be a non-empty string");
  console.assert(resource instanceof Resource,
      "argument 'resource' must be a `Resource`");
  console.assert(typeof resourceTypeExtension === "string",
      "argument 'resourceTypeExtension' must be `null` or a string");

  let resourceType = env.resourceTypes.lookup(resourceTypeExtension);
  let resolvedMode = env.invoke("resolveResourceMode", resource, resourceType);

  return resolvedMode.mode.writeFile(outputFilePath, resource, resourceType);
}
