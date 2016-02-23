// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.

/** @module webreed/lib/behaviors/resolveGenerator */


// Project
import Environment from "../Environment";


/**
 * Resolves the generator for the given context.
 *
 * @param {module:webreed/lib/Environment} env
 *   An environment that represents a webreed project.
 * @param {module:webreed/lib/Resource|object} [resource = null]
 *   The resource that will be processed with the generator that is being resolved.
 * @param {module:webreed/lib/ResourceType|object} [resourceType = null]
 *   The type of resource that will be processed with the generator that is being resolved.
 *
 * @returns {object}
 *   An object with the following properties:
 *   - **name** (string) - Name of the generator.
 *   - **generator** (object) - Generator instance.
 *
 * @throws {Error}
 * - If the resolved generator is not defined.
 */
export default function resolveGenerator(env, resource, resourceType) {
  console.assert(env instanceof Environment,
      "argument 'env' must be a webreed environment");
  console.assert(resource === undefined || typeof resource === "object",
      "argument 'resource' must be `null` or an object");
  console.assert(resourceType === undefined || typeof resourceType === "object",
      "argument 'resourceType' must be `null` or an object");

  let generatorName;
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

  let resolvedGeneratorName = env.generators.resolve(generatorName);
  if (resolvedGeneratorName === undefined) {
    throw new Error(`Generator '${generatorName}' is not defined.`);
  }

  return {
    name: resolvedGeneratorName,
    generator: env.generators.get(resolvedGeneratorName),
    options: generatorOptions
  };
}
