// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.


/**
 * Interface for a plugin that can encode and/or decode data.
 */
export interface Handler {

  /**
   * Decodes the given encoded data so that templates, transforms and/or generators can
   * interact with it.
   *
   * @param encodedData
   *   The input data that is to be decoded.
   * @param context
   *   An object with properties providing some context for the operation.
   *
   * @returns
   *   A promise to fulfill with the decoded data.
   */
  decode(encodedData: any, context: Object): Promise<any>;

  /**
   * Encodes data so that it can be persisted.
   *
   * @param data
   *   Input data that is to be encoded.
   * @param context
   *   An object with properties providing some context for the operation.
   *
   * @returns
   *   A promise to fulfill with the encoded data.
   */
  encode(data: any, context: Object): Promise<any>;

}
