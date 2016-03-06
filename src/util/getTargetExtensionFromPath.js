// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.

/** @module webreed/lib/util/getTargetExtensionFromPath */


// System
import path from "path";

const basename = path.basename;


/**
 * Gets the target file extension from a specified content path.
 *
 * @param {string} path
 *   Path of a content file.
 *
 * @returns {string|null}
   *   The target file extension when present; otherwise, a value of `null` if the
   *   content path does not contain any file extensions.
 */
export default function getTargetExtensionFromPath(path) {
  if (typeof path !== "string") {
    throw new TypeError("argument 'path' must be a string");
  }

  let baseName = basename(path);
  let result = baseName.match(/\.[^\.]+/);
  return result !== null ? result[0] : null;
}
