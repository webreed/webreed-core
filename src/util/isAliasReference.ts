// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.


/**
 * Tests whether a value represents an alias reference.
 *
 * @param value
 *   Some value of any type.
 *
 * @returns
 *   A value of `true` if argument `value` is a string of the form "alias-of({target})".
 */
export default function isAliasReference(value: any): boolean {
  return /^alias-of\(([^\(\)]*)\)$/.test(value);
}
