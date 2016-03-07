// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.


// Packages
import {Observable} from "rxjs";

// Project
import Environment from "../Environment";
import Resource from "../Resource";
import ResourceType from "../ResourceType";


/**
 * Applies a given extension chain to a resource in order from right to left.
 *
 * For instance, given an extension chain of 'about.md.nunjucks' the input resource will
 * be transformed in the following order:
 *
 * 1. Apply any conversion transformations .nunjucks > .md
 * 2. Apply any .md process transformations
 * 3. Apply any conversion transformations .md > .html
 * 4. Apply any .html process transformations
 * 5. Apply any conversion transformations from .html > $
 * 6. Apply any $ process transformations
 *
 * @param env
 *   An environment that represents a webreed project.
 * @param resource
 *   The resource that is to be transformed.
 * @param extensionChain
 *   A sequence of zero or more file extensions.
 *
 * @returns
 *   An observable stream of output resources.
 */
export default function applyExtensionChainToResource(env: Environment, resource: Resource, extensionChain: string): Observable<Resource> {
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
          env.invoke("applySequenceOfTransformsToResource", outputResource, conversionTransformers)
        );
      }
    }

    // Prepare for next iteration.
    fromResourceType = toResourceType;

    // Apply process transformations for the current resource type.
    return outputStream.flatMap(outputResource =>
      env.invoke("processResource", outputResource, toResourceType)
    );
  };

  return extensions.reduce(reducer, Observable.of(resource));
}
