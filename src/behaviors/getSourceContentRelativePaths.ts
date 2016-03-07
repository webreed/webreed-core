// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.


// Packages
import {Observable} from "rxjs";
import * as glob from "glob";

// Project
import Environment from "../Environment";


/**
 * Gets source content paths relative to the content directory.
 *
 * @param env
 *   An environment that represents a webreed project.
 *
 * @returns
 *   An observable collection of content relative paths.
 */
export default function getSourceContentRelativePaths(env: Environment): Observable<string> {
  let results = glob.sync("**/*", {
    cwd: env.resolvePath("content"),
    ignore: [
      "**/_*",    // Exclude files starting with '_'.
      "**/_*/**", // Exclude entire directories starting with '_'.
      "**/*.meta" // Exclude all meta files
    ],
    nodir: true
  });

  return Observable.fromArray(results);
}
