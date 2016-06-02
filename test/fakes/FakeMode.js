// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.

"use strict";


class FakeMode {

  readFile(path, resourceType) {
    this.lastReadFileArguments = Array.from(arguments);
    return Promise.resolve({
      _extension: this.outputExtension,
      body: "Fake body!"
    });
  }

  writeFile(path, resource, resourceType) {
    this.lastWriteFileArguments = Array.from(arguments);
    return Promise.resolve();
  }

}


exports.FakeMode = FakeMode;
