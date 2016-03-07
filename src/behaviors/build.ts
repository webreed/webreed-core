// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.


import {Environment} from "../Environment";


/**
 * Builds output for a given webreed environment.
 *
 * @param env
 *   An environment that represents a webreed project.
 *
 * @returns
 *   A promise to complete the build.
 */
export function build(env: Environment): Promise<void> {
  return Promise.resolve()
    .then(() => console.log("Processing content files..."))
    .then(() => env.invoke("processSourceContentFiles"))
    .then(() => console.log("Copying output files..."))
    .then(() => env.invoke("copyFilesToOutput"))
    .then(() => console.log("Completed."));
}
