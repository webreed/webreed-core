// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.


import Environment from "../Environment";
import Handler from "../plugin/Handler";
import Resource from "../Resource";
import ResourceType from "../ResourceType";


/**
 * Decodes a source resource of a specified type.
 *
 * @param env
 *   An environment that represents a webreed project.
 * @param resource
 *   The source resource that is being decoded.
 * @param resourceType
 *   Represents the type of resource that is being processed.
 *
 * @returns
 *   A promise to fulfill with the decoded resource.
 */
export default function decodeResource(env: Environment, resource: Resource, resourceType: ResourceType): Promise<Resource> {
  if (resourceType.handler !== null) {
    let resolvedHandlerName = env.handlers.noisyResolve(resourceType.handler.name);
    let handlerPlugin = <Handler> env.handlers.get(resolvedHandlerName);

    return handlerPlugin.decode(resource.body, {
      handler: {
        name: resolvedHandlerName,
        options: resourceType.handler.options
      },
      resource: resource,
      resourceType: resourceType
    });
  }
  else {
    return Promise.resolve(resource.body);
  }
}
