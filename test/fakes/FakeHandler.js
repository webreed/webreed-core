// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.

"use strict";


class FakeHandler {

  decode(encodedData, context) {
    this.lastDecodeArguments = Array.from(arguments);
    return Promise.resolve(
      `decoded[${encodedData}]`
    );
  }

  encode(data, context) {
    this.lastEncodeArguments = Array.from(arguments);
    return Promise.resolve(
      `encoded[${data}]`
    );
  }

}


exports.FakeHandler = FakeHandler;
