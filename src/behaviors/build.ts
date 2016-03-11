// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.


import {Environment} from "../Environment";


export function build(env: Environment): Promise<void> {
  return Promise.resolve()
    .then(() => console.log("Processing content files..."))
    .then(() => env.behaviors.processSourceContentFiles())
    .then(() => console.log("Copying output files..."))
    .then(() => env.behaviors.copyFilesToOutput())
    .then(() => console.log("Completed."));
}
