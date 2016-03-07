// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.


// Packages
import {Observable} from "rxjs";

// Project
import Environment from "../Environment";
import Resource from "../Resource";
import ResourceType from "../ResourceType";


/**
 * Processes a resource of a specified type.
 *
 * @param env
 *   An environment that represents a webreed project.
 * @param resource
 *   The resource that is being generated.
 * @param resourceType
 *   Represents the type of resource that is being processed.
 *
 * @returns
 *   An observable stream of output resources.
 */
export default function processResource(env: Environment, resource: Resource, resourceType: ResourceType): Observable<Resource> {
  return env.invoke("applySequenceOfTransformsToResource", resource, resourceType.process);
}
