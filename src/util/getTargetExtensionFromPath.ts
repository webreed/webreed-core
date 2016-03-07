// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.


import {basename} from "path";


/**
 * Gets the target file extension from a specified content path.
 *
 * @param path
 *   Path of a content file.
 *
 * @returns
   *   The target file extension when present; otherwise, a value of `null` if the
   *   content path does not contain any file extensions.
 */
export default function getTargetExtensionFromPath(path: string): string {
  let baseName = basename(path);
  let result = baseName.match(/\.[^\.]+/);
  return result !== null ? result[0] : null;
}
