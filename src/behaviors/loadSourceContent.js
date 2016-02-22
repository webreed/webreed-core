// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.

/** @module webreed/lib/behaviors/loadSourceContent */


// System
import path from "path";

// Packges
import _ from "lodash";

// Project
import getExtensionChainFromPath from "../util/getExtensionChainFromPath";
import isEnvironment from "../util/isEnvironment";
import normalizePathSeparators from "../util/normalizePathSeparators";


/**
 * Loads a content resource file.
 *
 * Note: This method does not cache resources.
 *
 * @param {module:webreed/lib/Environment} env
 *   An environment that represents a webreed project.
 * @param {string} contentRelativePath
 *   Path to the content file (relative to the "content" directory), which must be non-empty.
 * @param {string} [resourceTypeExtension = null]
 *   When specified allows caller to specify the type of the resource; otherwise the
 *   resource type is resolved using file extension from argument 'filePath'.
 * @param {object} [baseProperties = null]
 *   Base properties for the resource which can be overridden by properties found in the
 *   source resource's frontmatter.
 *
 * @returns {Promise}
 *   A promise to return a {@link module:webreed/lib/Resource} representing the resource
 *   and its frontmatter; or to throw an error.
 *
 * @throws {Error}
 * - If attempting to load resource with an unknown mode.
 */
export default function loadSourceContent(env, contentRelativePath, resourceTypeExtension, baseProperties) {
  if (baseProperties === undefined) {
    baseProperties = null;
  }

  console.assert(isEnvironment(env),
      "argument 'env' must be a webreed environment");
  console.assert(typeof contentRelativePath === "string" && contentRelativePath !== "",
      "argument 'contentRelativePath' must be a non-empty string");
  console.assert(typeof baseProperties === "object",
      "argument 'baseProperties' must be `null` or an object");

  let contentFilePath = env.resolvePath("content", contentRelativePath);
  let sourceExtensionChain = getExtensionChainFromPath(contentRelativePath);
  let contentBaseName = path.basename(contentRelativePath, sourceExtensionChain);

  let sourceContentProperties = {
    _baseUrl: env.baseUrl,
    _path: normalizePathSeparators(
        path.join(path.dirname(contentRelativePath), contentBaseName)
      )
  };

  baseProperties = _.assign({ }, sourceContentProperties, baseProperties)

  return env.invoke("loadResourceFile", contentFilePath, resourceTypeExtension, baseProperties);
}
