// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.


// Packages
import Rx from "rxjs";


export default class FakeErrorGenerator {

  generate(resource, resourceType) {
    return new Rx.Observable(observer => {
      observer.error(new Error("generate failed!"));
    });
  }

}
