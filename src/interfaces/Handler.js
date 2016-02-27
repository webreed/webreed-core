// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.

/** @module webreed/lib/interfaces/Handler */

/**
 * Interface for a plugin that can encode and/or decode data.
 *
 * @interface module:webreed/lib/interfaces/Handler
 */

  /**
   * Decodes the given encoded data so that templates, transforms and/or generators can
   * interact with it.
   *
   * @method module:webreed/lib/interfaces/Handler#decode
   *
   * @param {any} encodedData
   *   The input data that is to be decoded.
   * @param {object} context
   *   An object with properties providing some context for the operation.
   *
   * @returns {Promise.<any>}
   *   A promise to fulfill with the decoded data.
   */

  /**
   * Encodes data so that it can be persisted.
   *
   * @method module:webreed/lib/interfaces/Handler#encode
   *
   * @param {any} data
   *   Input data that is to be encoded.
   * @param {object} context
   *   An object with properties providing some context for the operation.
   *
   * @returns {Promise.<any>}
   *   A promise to fulfill with the encoded data.
   */
