// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.

/** @module webreed/lib/interfaces/Generator */

/**
 * Interface for a mechanism that generates output resources from a given source resource.
 *
 * @interface module:webreed/lib/interfaces/Generator
 */

  /**
   * Generates output resource(s) from a given source resource.
   *
   * This method does not mutate the input resource when modifications occur; instead
   * it creates and returns a new {@link module:webreed/lib/Resource}.
   *
   * @method module:webreed/lib/interfaces/Generator#generate
   *
   * @param {module:webreed/lib/Resource} sourceResource
   *   The source resource.
   * @param {object} context
   *   An object with properties providing some context for the operation.
   *
   * @returns {Observable.<module:webreed/lib/Resource>}
   *   An observable stream of zero-or-more output resources. The generator may decide
   *   to yield the source resource untouched in this stream.
   */
