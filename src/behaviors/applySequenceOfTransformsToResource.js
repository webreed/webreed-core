// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.

/** @module webreed/lib/behaviors/applySequenceOfTransformsToResource */


// Packages
import Rx from "rxjs";

// Project
import Environment from "../Environment";
import Resource from "../Resource";


/**
 * Applies a sequence of transformations to a given resource.
 *
 * @param {module:webreed/lib/Environment} env
 *   An environment that represents a webreed project.
 * @param {module:webreed/lib/Resource} resource
 *   The resource that is to be transformed.
 * @param {module:webreed/lib/PluginContext[]} [transformers = null]
 *   An array of zero-or-more transformers that will be applied to the input resource.
 *
 * @returns {Observable.<module:webreed/lib/Resource>}
 *   An observable stream of transformed resources.
 */
export default function applySequenceOfTransformsToResource(env, resource, transformers) {
  console.assert(env instanceof Environment,
      "argument 'env' must be a webreed environment");
  console.assert(resource instanceof Resource,
      "argument 'resource' must be a `Resource`");
  console.assert(transformers === undefined || transformers === null || Array.isArray(transformers),
      "argument 'transformers' must be `null` or an array");

  let reducer = (stream, transformer) => {
    let resolvedTransformerName = env.transformers.resolve(transformer.name);
    if (resolvedTransformerName === undefined) {
      throw new Error(`Transformer '${transformer.name}' is not defined.`);
    }

    let transformerPlugin = env.transformers.get(resolvedTransformerName);

    return stream.flatMap(resource => transformerPlugin.transform(resource, {
      transformer: {
        name: resolvedTransformerName,
        options: transformer.options
      }
    }));
  };

  return (transformers || [ ])
    .reduce(reducer, Rx.Observable.of(resource));
}
