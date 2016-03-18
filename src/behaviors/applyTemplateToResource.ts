// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.


import {Observable} from "rxjs";

import {Environment} from "../Environment";
import {Resource} from "../Resource";


export function applyTemplateToResource(env: Environment, resource: Resource, templateName: string): Observable<Resource> {
  if (templateName === "") {
    throw new Error("argument 'templateName' must be a non-empty string");
  }

  let resolvedTemplateEngine = env.behaviors.resolveTemplateEngine(templateName);

  let templateOutputStream = resolvedTemplateEngine.templateEngine.renderTemplate(templateName, resource, {
    templateEngine: {
      name: resolvedTemplateEngine.name,
      options: resolvedTemplateEngine.options
    }
  });

  return templateOutputStream.map(output => {
    let overrides = {
      body: output.body
    };

    if (output.page !== undefined) {
      // Add page key to output resource.
      overrides["_page"] = output.page;

      // If resource was already paginated then the pagination need to be... paginated.
      if (resource._page !== undefined) {
        overrides["_path"] = resource._path + "/" + resource._page;
      }
    }

    return resource.clone(overrides);
  });
}
