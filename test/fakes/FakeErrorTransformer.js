// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.

"use strict";


const Observable = require("rxjs").Observable;


class FakeErrorTransformer {

  transform(resource, context) {
    return new Observable(observer =>
      observer.error(new Error("transform failed!"))
    );
  }

}


exports.FakeErrorTransformer = FakeErrorTransformer;
