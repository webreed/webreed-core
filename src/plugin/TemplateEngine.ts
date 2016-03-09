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
    let type = typeof this.page;
    return type === "string" || type === "number";
  }

  /**
   * Slug representing page of paginated output.
   */
  public page: number | string = undefined;

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
   */
  clearTemplateCache(): void;

  /**
   * Renders the template supplied by argument 'template'.
   *
   * @param template
   *   Template in source form.
   * @param templateParams
   *   Bag of parameters to pass to the template.
   * @param context
   *   An object with properties providing some context for the operation.
   *
   * @returns
   *   An observable stream of zero-or-more outputs.
   */
  renderTemplate(template: string, templateParams: Object, context: Object): Observable<TemplateOutput>;

  /**
   * Renders the named template.
   *
   * @param templateName
   *   Name of the template file relative to the 'templates' directory.
   * @param templateParams
   *   Bag of parameters to pass to the template.
   * @param context
   *   An object with properties providing some context for the operation.
   *
   * @returns
   *   An observable stream of zero-or-more outputs.
   */
  renderTemplateString(templateName: string, templateParams: Object, context: Object): Observable<TemplateOutput>;

}
