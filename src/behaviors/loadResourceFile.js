// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.

/** @module webreed/lib/behaviors/loadResourceFile */


// System
import path from "path";

// Project
import isEnvironment from "../util/isEnvironment";


/**
 * Loads a resource file.
 *
 * Note: This method does not cache resources.
 *
 * @param {module:webreed/lib/Environment} env
 *   An environment that represents a webreed project.
 * @param {string} inputPath
 *   Path to the input resource file, which must be non-empty.
 * @param {string} [resourceTypeExtension = null]
 *   When specified allows caller to specify the type of the resource; otherwise the
 *   resource type is resolved using file extension from argument 'inputPath'.
 * @param {object} [baseProperties = null]
 *   Base properties for the resource which can be overridden by properties found in the
 *   source resources frontmatter.
 *
 * @returns {Promise}
 *   A promise to return a {@link module:webreed/lib/Resource} representing the
 *   resource and its frontmatter; or to throw an error.
 *
 * @throws {Error}
 * - If attempting to load resource with an unknown mode.
 */
export default function loadResourceFile(env, inputPath, resourceTypeExtension, baseProperties) {
  if (resourceTypeExtension === undefined || resourceTypeExtension === null) {
    resourceTypeExtension = path.extname(inputPath);
  }
  if (baseProperties === undefined) {
    baseProperties = null;
  }

  console.assert(isEnvironment(env),
      "argument 'env' must be a webreed environment");
  console.assert(typeof inputPath === "string" && inputPath !== "",
      "argument 'inputPath' must be a non-empty string");
  console.assert(typeof resourceTypeExtension === "string",
      "argument 'resourceTypeExtension' must be `null` or a string");
  console.assert(typeof baseProperties === "object",
      "argument 'baseProperties' must be `null` or an object");

  // Resolve the resource type here rather than using `this.resourceTypes.lookup`
  // below so that the resolved resource type extension can be included in the
  // meta data of the loaded resource.
  resourceTypeExtension = env.resourceTypes.resolve(resourceTypeExtension);

  let resourceType = env.resourceTypes.get(resourceTypeExtension);
  let resolvedMode = env.behaviors.resolveResourceMode(env, null, resourceType);

  return Promise.resolve();
}
