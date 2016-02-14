// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.

import { isEnvironment } from "../util";

export default function buildOutput(env) {
  console.assert(isEnvironment(env),
      "argument 'env' must be a webreed environment");

  return Promise.resolve();
}
