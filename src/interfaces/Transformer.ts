// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.


import {Observable} from "rxjs";

import Resource from "../Resource";


/**
 * Interface for a mechanism that transforms a given resource.
 */
interface Transformer {

  /**
   * Transforms a given resource.
   *
   * This method does not mutate the input resource when modifications occur; instead
   * it creates and returns a new [[Resource]].
   *
   * @param resource
   *   The input resource.
   * @param context
   *   An object with properties providing some context for the operation.
   *
   * @returns
   *   An observable stream of zero-or-more output resources. The transformer may
   *   decide to yield the input resource untouched in this stream.
   */
  transform(resource: Resource, context: Object): Observable<Resource>;

}


export default Transformer;
