// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.


import {Observable} from "rxjs";

import {Environment} from "../Environment";
import {ResourceType} from "../ResourceType";
import {Resource} from "../Resource";


export function processResource(env: Environment, resource: Resource, resourceType: ResourceType): Observable<Resource> {
  return env.behaviors.applySequenceOfTransformsToResource(resource, resourceType.process);
}
