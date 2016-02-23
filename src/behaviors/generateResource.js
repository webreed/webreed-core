// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.

/** @module webreed/lib/behaviors/generateResource */


// Project
import Environment from "../Environment";
import Resource from "../Resource";
import ResourceType from "../ResourceType";


/**
 * Generate output for a given resource.
 *
 * @param {module:webreed/lib/Environment} env
 *   An environment that represents a webreed project.
 * @param {module:webreed/lib/Resource} resource
 *   The resource that is being generated.
 * @param {module:webreed/lib/ResourceType} resourceType
 *   Represents the type of resource that is being read.
 *
 * @returns {Observable.<module:webreed/lib/Resource>}
 *   An observable stream of output resources.
 *
 * @throws {Error}
 * - If the environment does not define the associated generator.
 */
export default function generateResource(env, resource, resourceType) {
  console.assert(env instanceof Environment,
      "argument 'env' must be a webreed environment");
  console.assert(resource instanceof Resource,
      "argument 'resource' must be a `Resource`");
  console.assert(resourceType instanceof ResourceType,
      "argument 'resourceType' must be a `ResourceType`");

  let resolvedGenerator = env.invoke("resolveGenerator", resource, resourceType);

  return resolvedGenerator.generator.generate(env, resource, {
    generator: { name: resolvedGenerator.name, options: resolvedGenerator.options },
    resourceType: resourceType
  });
}
