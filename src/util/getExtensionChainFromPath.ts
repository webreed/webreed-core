// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.


/**
 * Gets the chain of file extensions from a specified content file path.
 *
 * @param path
 *   Path of a content file.
 *
 * @returns
 *   The chain of zero-or-more file extensions; an empty string when argument contains
 *   zero file extensions.
 */
export function getExtensionChainFromPath(path: string): string {
  let result = path.match(/\.[^\\\/]+$/);
  return result !== null ? result[0] : "";
}
