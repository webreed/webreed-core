// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.


import {Observable} from "rxjs";

import Resource from "../Resource";


/**
 * Interface for a mechanism that generates output resources from a given source resource.
 */
interface Generator {

  /**
   * Generates output resource(s) from a given source resource.
   *
   * This method does not mutate the input resource when modifications occur; instead
   * it creates and returns a new [[Resource]].
   *
   * @param sourceResource
   *   The source resource.
   * @param context
   *   An object with properties providing some context for the operation.
   *
   * @returns
   *   An observable stream of zero-or-more output resources. The generator may decide
   *   to yield the source resource untouched in this stream.
   */
  generate(sourceResource: Resource, context: Object): Observable<Resource>;

}


export default Generator;
