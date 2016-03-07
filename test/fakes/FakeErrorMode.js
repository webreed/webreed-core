// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.


export class FakeErrorMode {

  readFile(path, resourceType) {
    return Promise.reject(new Error("readFile failed!"));
  }

  writeFile(path, resource, resourceType) {
    return Promise.reject(new Error("writeFile failed!"));
  }

}
