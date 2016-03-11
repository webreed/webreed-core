// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.


import {Observable} from "rxjs";

import {Environment} from "../Environment";
import {ResourceType} from "../ResourceType";
import {Resource} from "../Resource";


/**
 * Process source content files and save generated outputs.
 *
 * @param env
 *   An environment that represents a webreed project.
 *
 * @returns
 *   A promise to complete the process source content files operation.
 */
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
    let outputFilePath = env.resolvePath("output", outputRelativePath);

    return promise.then(
      () => env.behaviors.saveResourceFile(outputFilePath, outputResource)
    );
  };

  return generatedResourceStream
    .reduce(reducer, Promise.resolve())
    .toPromise();
}
