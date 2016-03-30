// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.


import {Environment} from "../Environment";
import {Handler} from "../plugin/Handler";
import {ResourceType} from "../ResourceType";
import {Resource} from "../Resource";


export function decodeResource(env: Environment, resource: Resource, resourceType: ResourceType): Promise<any> {
  if (resourceType.handler !== null) {
    let resolvedHandlerName = env.handlers.noisyResolveKey(resourceType.handler.name);
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
