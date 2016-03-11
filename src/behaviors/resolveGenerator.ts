// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.


import {Environment} from "../Environment";
import {Generator} from "../plugin/Generator";
import {ResourceType} from "../ResourceType";
import {Resource} from "../Resource";


/**
 * Details of a resolved generator.
 */
export type ResolvedGenerator = {

  /**
   * Name of the generator plugin.
   */
  name: string;

  /**
   * Generator plugin instance options.
   */
  options: Object;

  /**
   * The generator instance.
   */
  generator: Generator;

};


export function resolveGenerator(env: Environment, resource: Resource = null, resourceType: ResourceType = null): ResolvedGenerator {
  let generatorName: string;
  let generatorOptions = { };

  if (!!resource && !!resource._generator) {
    generatorName = resource._generator;
  }
  else if (!!resourceType && !!resourceType.generator) {
    generatorName = resourceType.generator.name;
    generatorOptions = resourceType.generator.options;
  }
  else {
    generatorName = env.defaultGeneratorName;
  }

  let resolvedGeneratorName = env.generators.noisyResolveKey(generatorName);

  return {
    name: resolvedGeneratorName,
    options: generatorOptions,
    generator: <Generator> env.generators.get(resolvedGeneratorName)
  };
}
