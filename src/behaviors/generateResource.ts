// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.


import {Observable} from "rxjs";

import Environment from "../Environment";
import Resource from "../Resource";
import ResourceType from "../ResourceType";


/**
 * Generate output for a given resource.
 *
 * @param env
 *   An environment that represents a webreed project.
 * @param resource
 *   The resource that is being generated.
 * @param resourceType
 *   Represents the type of resource that is being generated.
 *
 * @returns
 *   An observable stream of output resources.
 *
 * @throws {Error}
 * - If the environment does not define the associated generator.
 */
export default function generateResource(env: Environment, resource: Resource, resourceType: ResourceType): Observable<Resource> {
  let resolvedGenerator = env.invoke("resolveGenerator", resource, resourceType);

  return resolvedGenerator.generator.generate(resource, {
    generator: {
      name: resolvedGenerator.name,
      options: resolvedGenerator.options
    },
    resourceType: resourceType
  });
}
