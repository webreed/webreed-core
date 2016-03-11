// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.


import {extname} from "path";

import {Environment} from "../Environment";
import {Resource} from "../Resource";


/**
 * Saves a resource file.
 *
 * @param outputFilePath
 *   Absolute path to the output resource file, which must be non-empty.
 * @param resource
 *   The resource that is to be saved.
 * @param resourceTypeExtension
 *   When specified allows the caller to override the type of the resource. Assumes file
 *   extension from `outputFilePath` argument when `resourceTypeExtension` is `null`.
 *
 * @returns
 *   A promise to notify upon completion; or to throw an error.
 *
 * @throws {Error}
 * - If attempting to save resource with an unknown mode.
 */
export function saveResourceFile(env: Environment, outputFilePath: string, resource: Resource, resourceTypeExtension: string = null): Promise<void> {
  if (resourceTypeExtension === null) {
    resourceTypeExtension = extname(outputFilePath);
  }

  if (outputFilePath === "") {
    throw new Error("argument 'outputFilePath' must be a non-empty string");
  }

  let resourceType = env.resourceTypes.lookup(resourceTypeExtension);
  let resolvedMode = env.behaviors.resolveResourceMode(resource, resourceType);

  return resolvedMode.mode.writeFile(outputFilePath, resource, resourceType);
}
