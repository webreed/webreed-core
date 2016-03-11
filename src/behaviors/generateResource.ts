// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.


import {Observable} from "rxjs";

import {Environment} from "../Environment";
import {ResourceType} from "../ResourceType";
import {Resource} from "../Resource";


export function generateResource(env: Environment, resource: Resource, resourceType: ResourceType): Observable<Resource> {
  let resolvedGenerator = env.behaviors.resolveGenerator(resource, resourceType);

  return resolvedGenerator.generator.generate(resource, {
    generator: {
      name: resolvedGenerator.name,
      options: resolvedGenerator.options
    },
    resourceType: resourceType
  });
}
