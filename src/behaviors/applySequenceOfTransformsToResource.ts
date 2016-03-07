// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.


import {Observable} from "rxjs";

import {Environment} from "../Environment";
import {PluginContext} from "../PluginContext";
import {Resource} from "../Resource";
import {Transformer} from "../plugin/Transformer";


/**
 * Applies a sequence of transformations to a given resource.
 *
 * @param env
 *   An environment that represents a webreed project.
 * @param resource
 *   The resource that is to be transformed.
 * @param transformers
 *   An array of zero-or-more transformers that will be applied to the input resource.
 *
 * @returns
 *   An observable stream of transformed resources.
 */
export function applySequenceOfTransformsToResource(env: Environment, resource: Resource, transformers: PluginContext[] = null): Observable<Resource> {
  if (transformers === null) {
    transformers = [ ];
  }

  let reducer = (stream: Observable<Resource>, pluginContext: PluginContext) => {
    let resolvedTransformerName = env.transformers.noisyResolve(pluginContext.name);
    let transformer = <Transformer> env.transformers.get(resolvedTransformerName);

    return stream.flatMap(resource => transformer.transform(resource, {
      transformer: {
        name: resolvedTransformerName,
        options: pluginContext.options
      }
    }));
  };

  return transformers.reduce(reducer, Observable.of(resource));
}
