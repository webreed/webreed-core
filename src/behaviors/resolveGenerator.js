// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.

/** @module webreed/lib/behaviors/resolveGenerator */


// Project
import Environment from "../Environment";
import Resource from "../Resource";
import ResourceType from "../ResourceType";


/**
 * Resolves the generator for the given context.
 *
 * @param {module:webreed/lib/Environment} env
 *   An environment that represents a webreed project.
 * @param {module:webreed/lib/Resource} [resource = null]
 *   The resource that will be processed with the generator that is being resolved.
 * @param {module:webreed/lib/ResourceType} [resourceType = null]
 *   The type of resource that will be processed with the generator that is being resolved.
 *
 * @returns {object}
 *   An object with the following properties:
 *   - **name** (string) - Name of the generator.
 *   - **generator** (object) - Generator instance.
 *   - **options** (object) - Generator plugin instance options.
 *
 * @throws {Error}
 * - If the resolved generator is not defined.
 */
export default function resolveGenerator(env, resource, resourceType) {
  if (!(env instanceof Environment)) {
    throw new TypeError("argument 'env' must be a webreed environment");
  }
  if (resource !== undefined && resource !== null && !(resource instanceof Resource)) {
    throw new TypeError("argument 'resource' must be a `Resource`");
  }
  if (resourceType !== undefined && resourceType !== null && !(resourceType instanceof ResourceType)) {
    throw new TypeError("argument 'resourceType' must be a `ResourceType`");
  }

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

  let resolvedGeneratorName = env.generators.noisyResolve(generatorName);

  return {
    name: resolvedGeneratorName,
    generator: env.generators.get(resolvedGeneratorName),
    options: generatorOptions
  };
}
