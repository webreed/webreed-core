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
 *   Absolute path to the output resource file, which must be non-empty.
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

  if (!(env instanceof Environment)) {
    throw new TypeError("argument 'env' must be a webreed environment");
  }
  if (typeof outputFilePath !== "string") {
    throw new TypeError("argument 'outputFilePath' must be a string");
  }
  if (outputFilePath === "") {
    throw new Error("argument 'outputFilePath' must be a non-empty string");
  }
  if (!(resource instanceof Resource)) {
    throw new TypeError("argument 'resource' must be a `Resource`");
  }
  if (typeof resourceTypeExtension !== "string") {
    throw new TypeError("argument 'resourceTypeExtension' must be a string");
  }

  let resourceType = env.resourceTypes.lookup(resourceTypeExtension);
  let resolvedMode = env.invoke("resolveResourceMode", resource, resourceType);

  return resolvedMode.mode.writeFile(outputFilePath, resource, resourceType);
}
