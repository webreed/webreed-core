// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.

/** @module webreed/lib/util/getExtensionChainFromPath */


/**
 * Gets the chain of file extensions from a specified content file path.
 *
 * @param {string} path
 *   Path of a content file.
 *
 * @returns {string}
 *   The chain of zero-or-more file extensions; an empty string when argument contains
 *   zero file extensions.
 */
export default function getExtensionChainFromPath(path) {
  if (typeof path !== "string") {
    throw new TypeError("argument 'path' must be a string");
  }

  let result = path.match(/\.[^\\\/]+$/);
  return result !== null ? result[0] : "";
}
