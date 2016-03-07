// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.


/**
 * Trims a trailing forward-slash character from the given value.
 *
 * @param value
 *   The value that is to be trimmed.
 *
 * @returns
 *   The trimmed value. Always returns a value of "/" when the input value is "/".
 */
export default function trimTrailingSlash(value: string): string {
  if (value.length > 1 && value.endsWith("/")) {
    value = value.substr(0, value.length - 1);

    // Still ends with a trailing slash?!
    if (value.endsWith("/")) {
      throw new Error("argument 'value' has multiple trailing slashes!");
    }
  }

  return value;
}
