// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.


import {Observable} from "rxjs";

import {Environment} from "../Environment";
import {ResourceType} from "../ResourceType";
import {Resource} from "../Resource";


export function applyExtensionChainToResource(env: Environment, resource: Resource, extensionChain: string): Observable<Resource> {
  // Compose ordered list of extensions in chain.
  let extensions = (extensionChain.match(/\.[^\.]+/g) || [""]).reverse();
  // Add special end-terminator target.
  extensions.push("$");

  let fromResourceType: ResourceType = null;
  let reducer = (outputStream: Observable<Resource>, toResourceTypeExtension: string) => {
    let toResourceType = env.resourceTypes.lookup(toResourceTypeExtension);

    // Apply conversion transformations (from -> to) resource type.
    if (fromResourceType !== null) {
      let conversionTransformers = fromResourceType.conversions[toResourceTypeExtension];
      if (!!conversionTransformers) {
        outputStream = outputStream.flatMap(outputResource =>
          env.behaviors.applySequenceOfTransformsToResource(outputResource, conversionTransformers)
        );
      }
    }

    // Prepare for next iteration.
    fromResourceType = toResourceType;

    // Apply process transformations for the current resource type.
    return outputStream.flatMap(outputResource =>
      env.behaviors.processResource(outputResource, toResourceType)
    );
  };

  return extensions.reduce(reducer, Observable.of(resource));
}
