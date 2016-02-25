// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.

/** @module webreed/lib/interfaces/Handler */

/**
 * Interface for a mechanism that can encode and decode a resource.
 *
 * @interface module:webreed/lib/interfaces/Handler
 */

  /**
   * Decodes a source resource allowing templates and transforms to interact with the data.
   *
   * This method does not mutate the input resource when modifications occur; instead
   * it creates and returns a new {@link module:webreed/lib/Resource}.
   *
   * @method module:webreed/lib/interfaces/Handler#decode
   *
   * @param {module:webreed/lib/Resource} sourceResource
   *   The source resource.
   * @param {object} context
   *   An object with properties providing some context for the operation.
   *
   * @returns {Promise.<module:webreed/lib/Resource>}
   *   A promise to fulfill with the decoded resource.
   */

  /**
   * Encodes a resource so that it can be written to output.
   *
   * This method does not mutate the input resource when modifications occur; instead
   * it creates and returns a new {@link module:webreed/lib/Resource}.
   *
   * @method module:webreed/lib/interfaces/Handler#encode
   *
   * @param {module:webreed/lib/Resource} resource
   *   The resource.
   * @param {object} context
   *   An object with properties providing some context for the operation.
   *
   * @returns {Promise.<module:webreed/lib/Resource>}
   *   A promise to fulfill with the encoded resource.
   */
