// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.


import Rx from "rxjs";


export default class FakeGenerator {

  generate(resource, resourceType) {
    this.lastGenerateArguments = Array.from(arguments);
    return Rx.Observable.of(resource.clone({
      wentThroughFakeGenerator: true
    }));
  }

}
