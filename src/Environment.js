// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.

/** @module webreed/lib/Environment */


// Project
import * as defaultBehaviors from "./behaviors/defaults";


// Symbols to simulate private fields
const behaviorsProperty = Symbol();


/**
 * Represents the environment of a webreed project.
 */
export default class Environment {

  constructor() {
    // Copy default behavior mappings into environment so that they can be selectively
    // overridden by the consumer of this API.
    this[behaviorsProperty] = Object.create(Object.assign({ }, defaultBehaviors));
  }


  /**
   * Map of behaviors that can be used within the context of the environment.
   *
   * The default behaviors can be overridden:
   *
   * ```
   * env.behaviors.buildOutput = function customBuildOutput(env) {
   *     // Do stuff before the default behavior...
   *
   *     // You can apply the default behavior.
   *     env.behaviors.prototype.buildOutput.apply(arguments);
   *
   *     // Do stuff after the default behavior...
   * };
   * ```
   *
   * The default behavior can be restored by deleting the custom behavior:
   *
   * ```
   * delete env.behaviors.buildOutput;
   * ```
   *
   * @member {object.<string, function>} behaviors
   * @readonly
   */
  get behaviors() {
    return this[behaviorsProperty];
  }


  /**
   * Builds output of the webreed project that is described by the environment.
   *
   * @returns {Promise}
   *   A promise to complete the build.
   */
  build() {
    return this.behaviors.buildOutput(this);
  }

}
