// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.

/** @module webreed/lib/behaviors/encodeResource */


// Project
import Environment from "../Environment";
import Resource from "../Resource";
import ResourceType from "../ResourceType";


/**
 * Encodes a resource of a specified type.
 *
 * @param {module:webreed/lib/Environment} env
 *   An environment that represents a webreed project.
 * @param {module:webreed/lib/Resource} resource
 *   The resource that is being generated.
 * @param {module:webreed/lib/ResourceType} resourceType
 *   Represents the type of resource that is being encoded.
 *
 * @returns {Promise.<module:webreed/lib/Resource>}
 *   A promise to fulfill with the encoded resource.
 */
export default function encodeResource(env, resource, resourceType) {
  console.assert(env instanceof Environment,
      "argument 'env' must be a webreed environment");
  console.assert(resource instanceof Resource,
      "argument 'resource' must be a `Resource`");
  console.assert(resourceType instanceof ResourceType,
      "argument 'resourceType' must be a `ResourceType`");

  if (resourceType.handler !== null) {
    let resolvedHandlerName = env.handlers.noisyResolve(resourceType.handler.name);
    let handlerPlugin = env.handlers.get(resolvedHandlerName);

    return handlerPlugin.encode(resource, {
      handler: {
        name: resolvedHandlerName,
        options: resourceType.handler.options
      },
      resourceType: resourceType
    });
  }
  else {
    return Promise.resolve(resource);
  }
}
