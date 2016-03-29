// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.


import * as path from "path";

import rimraf = require("rimraf");

import {Environment} from "../Environment";


export function clean(env: Environment): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    let outputPath = env.resolvePath("output");
    rimraf(path.join(outputPath, "*"), err => {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
}
