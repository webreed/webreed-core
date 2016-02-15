// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.

/** @module webreed/lib/Environment */


// Project
import * as defaultBehaviors from "./behaviors/defaults";


/**
 * Represents the environment of a webreed project.
 */
export default class Environment {

  constructor() {
    // Copy default behavior mappings into environment so that they can be selectively
    // overridden by the consumer of this API.
    Object.defineProperty(this, "behaviors", {
      value: Object.create(Object.assign({ }, defaultBehaviors))
    });
  }

  /**
   * Builds output of the webreed project that is described by this environment.
   *
   * @returns {Promise}
   *   A promise to complete the build.
   */
  build() {
    return this.behaviors.buildOutput(this);
  }

}
