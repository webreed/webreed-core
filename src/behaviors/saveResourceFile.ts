// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.


import {extname} from "path";

import {Environment} from "../Environment";
import {Resource} from "../Resource";


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
