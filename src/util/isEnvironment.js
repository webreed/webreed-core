// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.

/** @module webreed/lib/util/isEnvironment */

/**
 * Determines whether a given value is a webreed environment.
 *
 * @param {any} value
 *   The value that is to be tested.
 *
 * @returns {boolean}
 *   A value of `true` when the value of argument 'value' is a webreed environment;
 *   otherwise, a value of `false`.
 */
export default function isEnvironment(value) {
  return value !== null
      && typeof value === "object"
      && value.constructor.name === "Environment";
}
