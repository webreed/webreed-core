// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.

/** @module webreed/lib/util/trimTrailingSlash */


/**
 * Trims a trailing forward-slash character from the given value.
 *
 * @param {string} value
 *   The value that is to be trimmed.
 *
 * @returns {string}
 *   The trimmed value. Always returns a value of "/" when the input value is "/".
 */
export default function trimTrailingSlash(value) {
  console.assert(typeof value === "string",
      "argument 'value' must be a string");

  if (value.length > 1 && value.endsWith("/")) {
    value = value.substr(0, value.length - 1);

    // Still ends with a trailing slash?!
    if (value.endsWith("/")) {
      throw new Error("argument 'value' has multiple trailing slashes!");
    }
  }

  return value;
}
