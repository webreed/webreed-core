// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.


import {Environment} from "../Environment";
import {PaginationIterator} from "./PaginationIterator";
import {Resource} from "../Resource";
import {PaginationProvider} from "./PaginationProvider";
import {paginate} from "./paginate";


/**
 * Standard resource pagination provider implementation.
 */
export class ResourcePaginationProvider implements PaginationProvider {


  private _env: Environment;

  private _baseUrl: string;
  private _path: string;
  private _extension: string;


  constructor(env: Environment, resource: Resource) {
    this._env = env;

    this._baseUrl = resource._baseUrl;
    this._path = resource._path;
    this._extension = resource._extension;

    // If resource was already paginated then the pagination need to be... paginated.
    if (resource._page !== undefined) {
      this._path += "/" + resource._page;
    }
  }


  public paginate(entriesPerPage: number, entryCount: number): PaginationIterator {
    return paginate(entriesPerPage, entryCount, pageNumber => {
      let pageKey = pageNumber == 1 ? "index" : pageNumber.toString();
      let outputRelativePath = this._env.getOutputRelativePathForResource(this._path, this._extension, pageKey);
      let pageUrl = this._env.getUrlForResource(outputRelativePath, this._baseUrl);
      return [ pageKey, pageUrl ];
    });
  }

}
