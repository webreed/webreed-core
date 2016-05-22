// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.


import {Observable} from "rxjs";


/**
 * Rendered template output.
 */
export class TemplateOutput {

  /**
   * Indicates whether the template output is paginated.
   */
  public get isPaginated(): boolean {
    return typeof this.page === "string";
  }

  /**
   * Slug representing page of paginated output.
   */
  public page: string = undefined;

  /**
   * Body of output.
   */
  public body: string = "";

}


/**
 * Interface for a template engine.
 */
export interface TemplateEngine {

  /**
   * Clears any cache associated with rendering of templates so that the cache can be
   * reconstructed from fresh when templates are next rendered.
   *
   * @returns
   *   A promise to complete the operation.
   */
  clearTemplateCache(): Promise<void>;

  /**
   * Renders the template supplied by argument 'template'.
   *
   * @param templateName
   *   Name of the template file relative to the 'templates' directory.
   * @param templateProperties
   *   Properties to pass to the template.
   * @param context
   *   An object with properties providing some context for the operation.
   *
   * @returns
   *   An observable stream of zero-or-more outputs.
   */
  renderTemplate(templateName: string, templateProperties: any, context: any): Observable<TemplateOutput>;

  /**
   * Renders the named template.
   *
   * @param template
   *   Template in source form.
   * @param templateProperties
   *   Properties to pass to the template.
   * @param context
   *   An object with properties providing some context for the operation.
   *
   * @returns
   *   An observable stream of zero-or-more outputs.
   */
  renderTemplateString(template: string, templateProperties: any, context: any): Observable<TemplateOutput>;

}
