// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.

/** @module webreed/lib/behaviors/decodeResource */


// Packages
import Rx from "rxjs";

// Project
import Environment from "../Environment";
import Resource from "../Resource";
import ResourceType from "../ResourceType";


/**
 * Decodes a source resource of a specified type.
 *
 * @param {module:webreed/lib/Environment} env
 *   An environment that represents a webreed project.
 * @param {module:webreed/lib/Resource} sourceResource
 *   The source resource that is being decoded.
 * @param {module:webreed/lib/ResourceType} resourceType
 *   Represents the type of resource that is being processed.
 *
 * @returns {Observable.<module:webreed/lib/Resource>}
 *   An observable stream of output resources.
 */
export default function decodeResource(env, sourceResource, resourceType) {
  console.assert(env instanceof Environment,
      "argument 'env' must be a webreed environment");
  console.assert(sourceResource instanceof Resource,
      "argument 'sourceResource' must be a `Resource`");
  console.assert(resourceType instanceof ResourceType,
      "argument 'resourceType' must be a `ResourceType`");

  if (resourceType.handler !== null) {
    let resolvedHandlerName = env.handlers.noisyResolve(resourceType.handler.name);
    let handlerPlugin = env.handlers.get(resolvedHandlerName);

    return handlerPlugin.decode(sourceResource, {
      handler: {
        name: resolvedHandlerName,
        options: resourceType.handler.options
      },
      resourceType: resourceType
    });
  }
  else {
    return Rx.Observable.of(sourceResource);
  }
}
