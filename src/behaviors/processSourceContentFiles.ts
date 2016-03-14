// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.


import * as path from "path";

const fs = require("fs-promise");
import {Observable} from "rxjs";

import {Environment} from "../Environment";
import {ResourceType} from "../ResourceType";
import {Resource} from "../Resource";


export function processSourceContentFiles(env: Environment): Promise<void> {
  let sourceContentRelativePaths = env.behaviors.getSourceContentRelativePaths();
  return sourceContentRelativePaths
    .concatMap<void>(contentRelativePath => Observable.fromPromise(processSourceContent(env, contentRelativePath)))
    .toPromise();
}


async function processSourceContent(env: Environment, contentRelativePath: string): Promise<void> {
  let sourceResource = await env.behaviors.loadSourceContent(contentRelativePath);

  let resourceType = <ResourceType> env.resourceTypes.lookup(sourceResource.__sourceType);
  let generatedResourceStream = env.behaviors.generateResource(sourceResource, resourceType);

  let reducer = (promise: Promise<void>, outputResource: Resource) => {
    let outputRelativePath = env.getOutputRelativePathForResource(
        outputResource._path, outputResource._extension, outputResource._page
      );
    return saveOutputResource(env, outputRelativePath, outputResource);
  };

  return generatedResourceStream
    .reduce(reducer, Promise.resolve())
    .toPromise();
}

async function saveOutputResource(env: Environment, outputRelativePath: string, resource: Resource): Promise<void> {
  let outputFilePath = env.resolvePath("output", outputRelativePath);
  await fs.mkdirp(path.dirname(outputFilePath));
  await env.behaviors.saveResourceFile(outputFilePath, resource);
}
