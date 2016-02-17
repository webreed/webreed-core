// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.

/** @module webreed/lib/interfaces/Transformer */

/**
 * Interface for a mechanism that transforms a given resource.
 *
 * @interface module:webreed/lib/interfaces/Transformer
 */

  /**
   * Transforms a given resource.
   *
   * This method does not mutate the input resource when modifications occur; instead
   * it creates and returns a new {@link module:webreed/lib/Resource}.
   *
   * @method module:webreed/lib/interfaces/Transformer#transform
   *
   * @param {module:webreed/lib/Resource} resource
   *   The input resource.
   * @param {object} context
   *   An object with properties providing some context for the operation.
   *
   * @returns {Observable.<module:webreed/lib/Resource>}
   *   An observable stream of zero-or-more output resources. The transformer may
   *   decide to yield the input resource untouched in this stream.
   */
