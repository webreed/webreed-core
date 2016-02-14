// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.

export function isEnvironment(value) {
  return value !== null
      && typeof value === "object"
      && value.constructor.name === "Environment";
}
