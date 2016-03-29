// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.


import glob = require("glob");
import {Observable} from "rxjs";

import {Environment} from "../Environment";


export function getSourceContentRelativePaths(env: Environment, sourceName: string = "content"): Observable<string> {
  let results = glob.sync("**/*", {
    cwd: env.resolvePath(sourceName),
    ignore: [
      "**/_*",    // Exclude files starting with '_'.
      "**/_*/**", // Exclude entire directories starting with '_'.
      "**/*.meta" // Exclude all meta files
    ],
    nodir: true
  });

  return Observable.from<string>(results);
}
