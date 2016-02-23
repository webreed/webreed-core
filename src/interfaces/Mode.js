// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.

/** @module webreed/lib/interfaces/Mode */

/**
 * Interface for a mode that reads and writes resource files.
 *
 * @interface module:webreed/lib/interfaces/Mode
 */

  /**
   * Reads resource data from a file.
   *
   * @method module:webreed/lib/interfaces/Mode#readFile
   *
   * @param {string} path
   *   Path to the resource file.
   * @param {module:webreed/lib/ResourceType} resourceType
   *   Represents the type of resource that is being read.
   *
   * @returns {Promise.<object>}
   *   A promise to return an `object` representing the data and its frontmatter.
   */

  /**
   * Writes resource to a file.
   *
   * @method module:webreed/lib/interfaces/Mode#writeFile
   *
   * @param {string} path
   *   Path to the output file.
   * @param {module:webreed/lib/Resource|object} resource
   *   The resource that is to be written.
   * @param {module:webreed/lib/ResourceType} resourceType
   *   Represents the type of resource that is being written.
   *
   * @returns {Promise}
   *   A promise to notify upon completion; or to throw an error.
   */
