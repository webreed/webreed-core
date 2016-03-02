// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.

/** @module webreed/lib/behaviors/loadResourceFile */


// System
import path from "path";

// Packages
import _ from "lodash";

// Project
import Environment from "../Environment";
import getExtensionChainFromPath from "../util/getExtensionChainFromPath";
import getTargetExtensionFromPath from "../util/getTargetExtensionFromPath";


/**
 * Loads a resource file.
 *
 * Note: This method does not cache resources.
 *
 * @param {module:webreed/lib/Environment} env
 *   An environment that represents a webreed project.
 * @param {string} filePath
 *   Absolute path to the input resource file, which must be non-empty.
 * @param {string} [resourceTypeExtension = null]
 *   When specified allows caller to specify the type of the resource; otherwise the
 *   resource type is resolved using file extension from argument 'filePath'.
 * @param {object} [baseProperties = null]
 *   Base properties for the resource which can be overridden by properties found in the
 *   source resource's frontmatter.
 *
 * @returns {Promise}
 *   A promise to return a {@link module:webreed/lib/Resource} representing the resource
 *   and its frontmatter; or to throw an error.
 *
 * @throws {Error}
 * - If attempting to load resource with an unknown mode.
 */
export default function loadResourceFile(env, filePath, resourceTypeExtension, baseProperties) {
  if (resourceTypeExtension === undefined || resourceTypeExtension === null) {
    resourceTypeExtension = path.extname(filePath);
  }
  if (baseProperties === undefined) {
    baseProperties = null;
  }

  console.assert(env instanceof Environment,
      "argument 'env' must be a webreed environment");
  console.assert(typeof filePath === "string" && filePath !== "",
      "argument 'filePath' must be a non-empty string");
  console.assert(typeof resourceTypeExtension === "string",
      "argument 'resourceTypeExtension' must be `null` or a string");
  console.assert(typeof baseProperties === "object",
      "argument 'baseProperties' must be `null` or an object");

  let sourceExtensionChain = getExtensionChainFromPath(filePath);
  let targetExtension = getTargetExtensionFromPath(filePath);

  // Resolve an implied target extension.
  let targetResourceType = env.resourceTypes.lookupQuiet(targetExtension);
  if (targetResourceType && typeof targetResourceType.defaultTargetExtension === "string") {
    // Update extension in base properties.
    targetExtension = targetResourceType.defaultTargetExtension;

    // Make sure that `__sourceExtensionChain` includes an implied `defaultTargetExtension`.
    if (!sourceExtensionChain.startsWith(targetResourceType.defaultTargetExtension)) {
      sourceExtensionChain = targetResourceType.defaultTargetExtension + sourceExtensionChain;
    }
  }

  // Resolve the resource type here rather than using `env.resourceTypes.lookup`
  // below so that the resolved resource type extension can be included in the
  // meta data of the loaded resource.
  resourceTypeExtension = env.resourceTypes.resolve(resourceTypeExtension);

  let resourceType = env.resourceTypes.get(resourceTypeExtension);
  let resolvedMode = env.invoke("resolveResourceMode", null, resourceType);

  return resolvedMode.mode.readFile(filePath, resourceType)
    .then(data => {
      if (baseProperties !== null) {
        let resourceOverridesBaseProperties = (objectValue, sourceValue) =>
            objectValue === undefined ? sourceValue : objectValue;
        _.assign(data, baseProperties, resourceOverridesBaseProperties);
      }
      data.__sourceExtensionChain = sourceExtensionChain;
      data.__sourceFilePath = filePath;
      data.__sourceType = resourceTypeExtension;
      data.__mode = resolvedMode.name;
      data._extension = targetExtension;
      return env.createResource(data);
    });
}
