// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.

/** @module webreed/lib/behaviors/processSourceContentFiles */


// Project
import Environment from "../Environment";


/**
 * Process source content files and save generated outputs.
 *
 * @param {module:webreed/lib/Environment} env
 *   An environment that represents a webreed project.
 *
 * @returns {Promise}
 *   A promise to complete the process source content files operation.
 */
export default function processSourceContentFiles(env) {
  console.assert(env instanceof Environment,
      "argument 'env' must be a webreed environment");

  return env.invoke("getSourceContentRelativePaths")
    .reduce(
        (promise, contentRelativePath) => {
          return promise.then( () => processSourceContent(env, contentRelativePath) );
        },
        Promise.resolve()
      )
    .toPromise();
}


function processSourceContent(env, contentRelativePath) {
  return env.invoke("loadSourceContent", contentRelativePath)
    .then(sourceResource => {
      let resourceType = env.resourceTypes.lookup(sourceResource.__sourceType);
      let generatedResourceStream = env.invoke("generateResource", sourceResource, resourceType);
      return generatedResourceStream
        .reduce(
          (promise, outputResource) => {
            let outputRelativePath = env.getOutputRelativePathForResource(
                outputResource._path, outputResource._extension, outputResource._page
              );
            let outputFilePath = env.resolvePath("output", outputRelativePath);

            return promise.then(
              () => env.invoke("saveResourceFile", outputFilePath, outputResource)
            );
          },
          Promise.resolve()
        )
        .toPromise();
    });
}
