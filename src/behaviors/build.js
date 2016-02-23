// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.

/** @module webreed/lib/behaviors/buildOutput */


// Project
import Environment from "../Environment";


/**
 * Builds output for a given webreed environment.
 *
 * @param {module:webreed/lib/Environment} env
 *   An environment that represents a webreed project.
 *
 * @returns {Promise}
 *   A promise to complete the build.
 */
export default function buildOutput(env) {
  console.assert(env instanceof Environment,
      "argument 'env' must be a webreed environment");

  return Promise.resolve();
}
