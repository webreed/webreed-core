// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.

/** @module webreed/lib/behaviors/applyTemplateToResource */


// Project
import Environment from "../Environment";
import Resource from "../Resource";


/**
 * Applies a template to a specified resource.
 *
 * @param {module:webreed/lib/Environment} env
 *   An environment that represents a webreed project.
 * @param {module:webreed/lib/Resource} resource
 *   The resource that is being generated.
 * @param {string} templateName
 *   Name of the template to apply to the resource.
 *
 * @returns {Observable.<module:webreed/lib/Resource>}
 *   An observable stream of output resources.
 *
 * @throws {Error}
 * - If resource type is not associated with a template engine.
 * - If the resolved template engine is not defined.
 */
export default function applyTemplateToResource(env, resource, templateName) {
  if (!(env instanceof Environment)) {
    throw new TypeError("argument 'env' must be a webreed environment");
  }
  if (!(resource instanceof Resource)) {
    throw new TypeError("argument 'resource' must be a `Resource`");
  }
  if (typeof templateName !== "string") {
    throw new TypeError("argument 'templateName' must be a string");
  }
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
