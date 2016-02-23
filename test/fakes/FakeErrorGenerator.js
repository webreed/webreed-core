// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.


// Packages
import Rx from "rxjs";


export default class FakeErrorGenerator {

  generate(env, resource, resourceType) {
    return new Rx.Observable(observer => {
      setTimeout(() => observer.error(new Error("generate failed!")), 0);
    });
  }

}
