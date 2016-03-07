// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.


const fs = require("fs-promise");

import Environment from "../Environment";


/**
 * Copies files from 'files' directory into 'output' directory.
 *
 * @param env
 *   An environment that represents a webreed project.
 *
 * @returns
 *   A promise to complete the copy files operation.
 */
export default async function copyFilesToOutput(env: Environment): Promise<void> {
  let filesPath = env.resolvePath("files");
  let outputPath = env.resolvePath("output");

  try {
    await fs.access(filesPath, fs.R_OK);
    await fs.copy(filesPath, outputPath, {
      clobber: false,
      preserveTimestamps: true
    });
  }
  catch (err) {
    //console.log("No source files to copy.");
  }
}
