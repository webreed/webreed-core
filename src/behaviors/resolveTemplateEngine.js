// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.

/** @module webreed/lib/behaviors/resolveTemplateEngine */


// System
import path from "path";

// Project
import Environment from "../Environment";


/**
 * Resolves the template engine for the given template name.
 *
 * @param {module:webreed/lib/Environment} env
 *   An environment that represents a webreed project.
 * @param {string} templateName
 *   Name of the template relative to the templates directory.
 *
 * @returns {object}
 *   An object with the following properties:
 *   - **name** (string) - Name of the template engine.
 *   - **templateEngine** (object) - Template engine instance.
 *   - **options** (object) - Template engine plugin instance options.
 *
 * @throws {Error}
 * - If resource type is not associated with a template engine.
 * - If the resolved template engine is not defined.
 */
export default function resolveTemplateEngine(env, templateName) {
  if (!(env instanceof Environment)) {
    throw new TypeError("argument 'env' must be a webreed environment");
  }
  if (typeof templateName !== "string") {
    throw new TypeError("argument 'templateName' must be a string");
  }
  if (templateName === "") {
    throw new Error("argument 'templateName' must be a non-empty string");
  }

  let templateExtension = path.extname(templateName);
  let resolvedTemplateExtension = env.resourceTypes.resolve(templateExtension);
  let templateResourceType = env.resourceTypes.get(resolvedTemplateExtension);

  let templateEngineInstance = templateResourceType.templateEngine;
  if (templateEngineInstance === null) {
    throw new Error(`Resource type '${resolvedTemplateExtension}' does not specify a template engine.`);
  }

  let templateEngineName = templateEngineInstance.name;
  let resolvedTemplateEngineName = env.templateEngines.noisyResolve(templateEngineName);

  return {
    name: resolvedTemplateEngineName,
    options: templateEngineInstance.options,
    templateEngine: env.templateEngines.get(resolvedTemplateEngineName)
  };
}
