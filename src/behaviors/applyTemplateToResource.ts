// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.


import {Observable} from "rxjs";

import {Environment} from "../Environment";
import {ResolvedTemplateEngine} from "./resolveTemplateEngine";
import {Resource} from "../Resource";


/**
 * Applies a template to a specified resource.
 *
 * @param env
 *   An environment that represents a webreed project.
 * @param resource
 *   The resource that is being generated.
 * @param templateName
 *   Name of the template to apply to the resource.
 *
 * @returns
 *   An observable stream of output resources.
 *
 * @throws {Error}
 * - If resource type is not associated with a template engine.
 * - If the resolved template engine is not defined.
 */
export function applyTemplateToResource(env: Environment, resource: Resource, templateName: string): Observable<Resource> {
  if (templateName === "") {
    throw new Error("argument 'templateName' must be a non-empty string");
  }

  let resolvedTemplateEngine = <ResolvedTemplateEngine> env.invoke("resolveTemplateEngine", templateName);

  let templateOutputStream = resolvedTemplateEngine.templateEngine.renderTemplate(templateName, resource, {
    templateEngine: {
      name: resolvedTemplateEngine.name,
      options: resolvedTemplateEngine.options
    }
  });

  return templateOutputStream.map(output => resource.clone({
    _page: output.page,
    body: output.body
  }));
}
