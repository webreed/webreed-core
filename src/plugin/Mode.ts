// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.


import {Resource} from "../Resource";
import {ResourceType} from "../ResourceType";


/**
 * Interface for a mode that reads and writes resource files.
 */
export interface Mode {

  /**
   * Reads resource data from a file.
   *
   * @param path
   *   Path to the resource file.
   * @param resourceType
   *   Represents the type of resource that is being read.
   *
   * @returns
   *   A promise to return an `object` representing the data and its frontmatter.
   */
  readFile(path: string, resourceType: ResourceType): Promise<Object>;

  /**
   * Writes resource to a file.
   *
   * @param path
   *   Path to the output file.
   * @param resource
   *   The resource that is to be written.
   * @param resourceType
   *   Represents the type of resource that is being written.
   *
   * @returns
   *   A promise to notify upon completion; or to throw an error.
   */
  writeFile(path: string, resource: Resource, resourceType: ResourceType): Promise<void>;

}
