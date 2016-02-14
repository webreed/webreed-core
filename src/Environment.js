// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.

import * as defaultBehaviors from "./behaviors/defaults";

export default class Environment {

  constructor() {
    // Copy default behavior mappings into environment so that they can be selectively
    // overridden by the consumer of this API.
    Object.defineProperty(this, "behaviors", {
      value: Object.create(Object.assign({ }, defaultBehaviors))
    });
  }

  build() {
    return this.behaviors.buildOutput(this);
  }

}
