// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.


import {extname} from "path";

import _ = require("lodash");

import {Environment} from "../Environment";
import {Resource} from "../Resource";
import {getExtensionChainFromPath} from "../util/getExtensionChainFromPath";
import {getTargetExtensionFromPath} from "../util/getTargetExtensionFromPath";


/**
 * Loads a resource file.
 *
 * Note: This method does not cache resources.
 *
 * @param env
 *   An environment that represents a webreed project.
 * @param filePath
 *   Absolute path to the input resource file, which must be non-empty.
 * @param resourceTypeExtension
 *   When specified allows caller to specify the type of the resource; otherwise the
 *   resource type is resolved using file extension from argument 'filePath'.
 * @param baseProperties
 *   Base properties for the resource which can be overridden by properties found in the
 *   source resource's frontmatter.
 *
 * @returns
 *   A promise to return a [[Resource]] representing the resource and its frontmatter; or
 *   to throw an error.
 *
 * @throws {Error}
 * - If attempting to load resource with an unknown mode.
 */
export async function loadResourceFile(env: Environment, filePath: string, resourceTypeExtension: string = null, baseProperties: Object = null): Promise<Resource> {
  if (resourceTypeExtension === null) {
    resourceTypeExtension = extname(filePath);
  }

  if (filePath === "") {
    throw new Error("argument 'filePath' must be a non-empty string")
  }

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

  let data = await resolvedMode.mode.readFile(filePath, resourceType);

  if (baseProperties !== null) {
    let resourceOverridesBaseProperties = (objectValue: any, sourceValue: any) =>
        objectValue === undefined ? sourceValue : objectValue;
    _.assign(data, baseProperties, resourceOverridesBaseProperties);
  }

  data.__sourceExtensionChain = sourceExtensionChain;
  data.__sourceFilePath = filePath;
  data.__sourceType = resourceTypeExtension;
  data.__mode = resolvedMode.name;
  data._extension = targetExtension;

  return env.createResource(data);
}
