// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.


import {extname} from "path";

import _ = require("lodash");

import {Environment} from "../Environment";
import {ResourceType} from "../ResourceType";
import {Resource} from "../Resource";
import {getExtensionChainFromPath} from "../util/getExtensionChainFromPath";
import {getTargetExtensionFromPath} from "../util/getTargetExtensionFromPath";


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
  resourceTypeExtension = env.resourceTypes.resolveKey(resourceTypeExtension);

  let resourceType = <ResourceType> env.resourceTypes.get(resourceTypeExtension);
  let resolvedMode = env.behaviors.resolveResourceMode(null, resourceType);

  let data = await resolvedMode.mode.readFile(filePath, resourceType);

  if (baseProperties !== null) {
    let resourceOverridesBaseProperties = (objectValue: any, sourceValue: any) =>
        objectValue === undefined ? sourceValue : objectValue;
    _.assign(data, baseProperties, resourceOverridesBaseProperties);
  }

  data["__sourceExtensionChain"] = sourceExtensionChain;
  data["__sourceFilePath"] = filePath;
  data["__sourceType"] = resourceTypeExtension;
  data["__mode"] = resolvedMode.name;
  data["_extension"] = targetExtension;

  return env.createResource(data);
}
