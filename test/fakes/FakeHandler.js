// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.


export default class FakeHandler {

  decode(sourceResource, context) {
    this.lastDecodeArguments = Array.from(arguments);
    return Promise.resolve(sourceResource.clone({
        body: `decoded[${sourceResource.body}]`
      }));
  }

  encode(resource, context) {
    this.lastEncodeArguments = Array.from(arguments);
    return Promise.resolve(resource.clone({
        body: `encoded[${resource.body}]`
      }));
  }

}
