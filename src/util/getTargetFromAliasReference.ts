// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.


/**
 * Gets target from a given alias reference.
 *
 * @param value
 *   Some value of any type.
 *
 * @returns
 *   A string that identifies the target of the alias reference when argument `value` is
 *   an alias reference; otherwise, a value of `null`.
 */
export function getTargetFromAliasReference(value: any): string {
  if (typeof value === "string") {
    let match = value.match(/^alias-of\(([^\(\)]*)\)$/);
    if (match !== null) {
      return match[1];
    }
  }
  return null;
}
