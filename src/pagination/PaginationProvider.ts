// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.


import {PaginationIterator} from "./PaginationIterator";


/**
 * Provides pagination support.
 */
export interface PaginationProvider {

  /**
   * Paginates the given sequence of entries.
   *
   * @param entriesPerPage
   *   Maximum number of entries to show on any single page.
   * @param entryCount
   *   Total number of entries in the sequence.
   *
   * @returns
   *   An immutable iterator representing the first page of the paginated sequence.
   */
  paginate(entriesPerPage: number, entryCount: number): PaginationIterator;

}
