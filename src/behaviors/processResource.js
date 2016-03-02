// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.

/** @module webreed/lib/behaviors/processResource */


// Project
import Environment from "../Environment";
import Resource from "../Resource";
import ResourceType from "../ResourceType";


/**
 * Processes a resource of a specified type.
 *
 * @param {module:webreed/lib/Environment} env
 *   An environment that represents a webreed project.
 * @param {module:webreed/lib/Resource} resource
 *   The resource that is being generated.
 * @param {module:webreed/lib/ResourceType} resourceType
 *   Represents the type of resource that is being processed.
 *
 * @returns {Observable.<module:webreed/lib/Resource>}
 *   An observable stream of output resources.
 */
export default function processResource(env, resource, resourceType) {
  console.assert(env instanceof Environment,
      "argument 'env' must be a webreed environment");
  console.assert(resource instanceof Resource,
      "argument 'resource' must be a `Resource`");
  console.assert(resourceType instanceof ResourceType,
      "argument 'resourceType' must be a `ResourceType`");

  return env.invoke("applySequenceOfTransformsToResource", resource, resourceType.process);
}