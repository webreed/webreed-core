// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.


export default class FakeErrorGenerator {

  decode(sourceResource, context) {
    return Promise.reject(new Error("decode failed!"));
  }

  encode(resource, context) {
    return Promise.reject(new Error("encode failed!"));
  }

}
