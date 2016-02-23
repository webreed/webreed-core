// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.

/** @module webreed/lib/behaviors/getSourceContentRelativePaths */


// Packages
import Rx from "rxjs";
import glob from "glob";

// Project
import Environment from "../Environment";


/**
 * Gets source content paths relative to the content directory.
 *
 * @param {module:webreed/lib/Environment} env
 *   An environment that represents a webreed project.
 *
 * @returns {Observable.<string>}
 *   An observable collection of content relative paths.
 */
export default function getSourceContentRelativePaths(env) {
  console.assert(env instanceof Environment,
      "argument 'env' must be a webreed environment");

  let results = glob.sync("**/*", {
    cwd: env.resolvePath("content"),
    ignore: [
      "**/_*",    // Exclude files starting with '_'.
      "**/_*/**", // Exclude entire directories starting with '_'.
      "**/*.meta" // Exclude all meta files
    ],
    nodir: true
  });

  return Rx.Observable.from(results);
}
