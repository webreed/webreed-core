// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.

/** @module webreed/lib/util/getTargetFromAliasReference */


/**
 * Gets target from a given alias reference.
 *
 * @param {any} value
 *   Some value of any type.
 *
 * @returns {string|undefined}
 *   A string that identifies the target of the alias reference when argument `value` is
 *   an alias reference; otherwise, a value of `null`.
 */
export default function getTargetFromAliasReference(value) {
  if (typeof value === "string") {
    let match = value.match(/^alias-of\(([^\(\)]*)\)$/);
    if (match !== null) {
      return match[1];
    }
  }
  return null;
}
