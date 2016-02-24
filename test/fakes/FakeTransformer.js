// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.


// Packages
import Rx from "rxjs";


export default class FakeTransformer {

  constructor(value, pageCount) {
    this.value = value;
    this.pageCount = pageCount || 1;
    this.hasMultipleOutputs = this.pageCount !== 1;
  }

  transform(resource, context) {
    this.lastTransformArguments = Array.from(arguments);
    return Rx.Observable.range(1, this.pageCount)
      .map(page => resource.clone({
        page: this.hasMultipleOutputs ? page : resource.page,
        body: resource.body + "," + this.value
      }));
  }

}
