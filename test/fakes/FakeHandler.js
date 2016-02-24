// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.


// Packages
import Rx from "rxjs";


export default class FakeHandler {

  decode(sourceResource, context) {
    this.lastDecodeArguments = Array.from(arguments);

    let pageCount = context.handler.options.pageCount || 1;
    let hasMultipleOutputs = pageCount !== 1;

    return Rx.Observable.range(1, pageCount)
      .map(page => sourceResource.clone({
        page: hasMultipleOutputs ? page : sourceResource.page,
        body: `decoded[${sourceResource.body}]`
      }));
  }

  encode(resource, context) {
    this.lastEncodeArguments = Array.from(arguments);

    let pageCount = context.handler.options.pageCount || 1;
    let hasMultipleOutputs = pageCount !== 1;

    return Rx.Observable.range(1, pageCount)
      .map(page => resource.clone({
        page: hasMultipleOutputs ? page : resource.page,
        body: `encoded[${resource.body}]`
      }));
  }

}
