// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.


export default class FakeMode {

  readFile(path, resourceType) {
    this.lastReadFileArguments = Array.from(arguments);
    return Promise.resolve({ body: "Fake body!" });
  }

  writeFile(path, resource, resourceType) {
    this.lastWriteFileArguments = Array.from(arguments);
    return Promise.resolve();
  }

}
