// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.


import {Observable} from "rxjs";


export class FakeErrorGenerator {

  generate(resource, resourceType) {
    return new Observable(observer => {
      observer.error(new Error("generate failed!"));
    });
  }

}
