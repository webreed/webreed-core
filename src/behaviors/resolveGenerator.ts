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


/**
 * Resolves the generator for the given context.
 *
 * @param env
 *   An environment that represents a webreed project.
 * @param resource
 *   The resource that will be processed with the generator that is being resolved.
 * @param resourceType
 *   The type of resource that will be processed with the generator that is being resolved.
 *
 * @returns
 *   The resolved generator.
 *
 * @throws {Error}
 * - If the resolved generator is not defined.
 */
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
