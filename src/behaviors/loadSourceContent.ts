// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.


import {basename, dirname, join} from "path";

const _ = require("lodash");

import {Environment} from "../Environment";
import {Resource} from "../Resource";
import {getExtensionChainFromPath} from "../util/getExtensionChainFromPath";
import {normalizePathSeparators} from "../util/normalizePathSeparators";


/**
 * Loads a content resource file.
 *
 * Note: This method does not cache resources.
 *
 * @param env
 *   An environment that represents a webreed project.
 * @param contentRelativePath
 *   Path to the content file (relative to the "content" directory), which must be non-empty.
 * @param resourceTypeExtension
 *   When specified allows caller to specify the type of the resource; otherwise the
 *   resource type is resolved using file extension from argument 'filePath'.
 * @param baseProperties
 *   Base properties for the resource which can be overridden by properties found in the
 *   source resource's frontmatter.
 *
 * @returns
 *   A promise to return a [[Resource]] representing the resource
 *   and its frontmatter; or to throw an error.
 *
 * @throws {Error}
 * - If attempting to load resource with an unknown mode.
 */
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

  return <Promise<Resource>> env.invoke("loadResourceFile", contentFilePath, resourceTypeExtension, baseProperties);
}
