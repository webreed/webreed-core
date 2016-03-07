// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.


// Packages
import {Observable} from "rxjs";

// Project
import Environment from "../Environment";
import Resource from "../Resource";


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
export default function applyTemplateToResource(env: Environment, resource: Resource, templateName: string): Observable<Resource> {
  if (templateName === "") {
    throw new Error("argument 'templateName' must be a non-empty string");
  }

  let resolvedTemplateEngine = env.invoke("resolveTemplateEngine", templateName);

  return resolvedTemplateEngine.templateEngine.renderTemplate(templateName, resource, {
    templateEngine: {
      name: resolvedTemplateEngine.name,
      options: resolvedTemplateEngine.options
    }
  });
}
