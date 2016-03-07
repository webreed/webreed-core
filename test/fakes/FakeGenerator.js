// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.


import {Observable} from "rxjs";


export class FakeGenerator {

  generate(resource, resourceType) {
    this.lastGenerateArguments = Array.from(arguments);
    return Observable.of(resource.clone({
      wentThroughFakeGenerator: true
    }));
  }

}
