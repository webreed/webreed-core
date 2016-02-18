// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.

/** @module webreed/lib/util/isAliasReference */


/**
 * Tests whether a value represents an alias reference.
 *
 * @param {any} value
 *   Some value of any type.
 *
 * @returns {boolean}
 *   A value of `true` if argument `value` is a string of the form "alias-of({target})".
 */
export default function isAliasReference(value) {
  return /^alias-of\(([^\(\)]+)\)$/.test(value);
}
