// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.

/** @module webreed/lib/behaviors/copyFilesToOutput */


// Packages
import fs from "fs-promise";

// Project
import Environment from "../Environment";


/**
 * Copies files from 'files' directory into 'output' directory.
 *
 * @param {module:webreed/lib/Environment} env
 *   An environment that represents a webreed project.
 *
 * @returns {Promise}
 *   A promise to complete the copy files operation.
 */
export default function copyFilesToOutput(env) {
  if (!(env instanceof Environment)) {
    throw new TypeError("argument 'env' must be a webreed environment");
  }

  let filesPath = env.resolvePath("files");
  let outputPath = env.resolvePath("output");

  return fs.access(filesPath, fs.R_OK)
    .then(
      () => {
        return fs.copy(filesPath, outputPath, {
          clobber: false,
          preserveTimestamps: true
        });
      },
      err => {
        //console.log("No source files to copy.");
      }
    );
}
