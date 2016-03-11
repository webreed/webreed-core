// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.


import {basename, dirname, join} from "path";

import _ = require("lodash");

import {Environment} from "../Environment";
import {Resource} from "../Resource";
import {getExtensionChainFromPath} from "../util/getExtensionChainFromPath";
import {normalizePathSeparators} from "../util/normalizePathSeparators";


export function loadSourceContent(env: Environment, contentRelativePath: string, resourceTypeExtension: string = null, baseProperties: Object = null): Promise<Resource> {
  if (contentRelativePath === "") {
    throw new Error("argument 'contentRelativePath' must be a non-empty string")
  }

  let contentFilePath = env.resolvePath("content", contentRelativePath);
  let sourceExtensionChain = getExtensionChainFromPath(contentRelativePath);
  let contentBaseName = basename(contentRelativePath, sourceExtensionChain);

  let sourceContentProperties = {
    _baseUrl: env.baseUrl,
    _path: normalizePathSeparators(
        join(dirname(contentRelativePath), contentBaseName)
      )
  };

  baseProperties = _.assign({ }, sourceContentProperties, baseProperties)

  return env.behaviors.loadResourceFile(contentFilePath, resourceTypeExtension, baseProperties);
}
