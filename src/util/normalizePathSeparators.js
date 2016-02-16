// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.

/** @module webreed/lib/util/normalizePathSeparators */


// System
import path from "path";

// Packages
import escapeStringRegexp from "escape-string-regexp";


// Indicates whether slash characters need to be normalized for the active platform.
const NEEDS_TO_NORMALIZE_SEP = path.sep !== "/";
const OS_SEP_PATTERN = new RegExp(escapeStringRegexp(path.sep) + "+", "g");


/**
 * Normalizes separators for a given path.
 *
 * This function is useful when processing content on the Windows operating system since
 * it favors back-slashes over forward-slashes. Fortunately the Windows operating system
 * actually supports both forward and back slash characters.
 *
 * Advantages of normalized paths:
 * - Consistency when comparing paths.
 * - Paths can be used to generate URIs.
 *
 * @param {string} path
 *   The relative or absolute path that is to be normalized.
 *
 * @returns {string}
 *   The normalized relative or absolute path.
 */
export default function normalizePathSeparators(path) {
  if (NEEDS_TO_NORMALIZE_SEP) {
    path = path.replace(OS_SEP_PATTERN, "/");
  }
  return path;
}
