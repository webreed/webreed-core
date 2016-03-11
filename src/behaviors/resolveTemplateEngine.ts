// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.


import {extname} from "path";

import {Environment} from "../Environment";
import {ResourceType} from "../ResourceType";
import {TemplateEngine} from "../plugin/TemplateEngine";


/**
 * Details of a resolved template engine.
 */
export type ResolvedTemplateEngine = {

  /**
   * Name of the template engine plugin.
   */
  name: string;

  /**
   * Template engine plugin instance options.
   */
  options: Object;

  /**
   * The template engine instance.
   */
  templateEngine: TemplateEngine;

};


export function resolveTemplateEngine(env: Environment, templateName: string): ResolvedTemplateEngine {
  if (templateName === "") {
    throw new Error("argument 'templateName' must be a non-empty string");
  }

  let templateExtension = extname(templateName);
  let resolvedTemplateExtension = env.resourceTypes.resolveKey(templateExtension);
  let templateResourceType = <ResourceType> env.resourceTypes.get(resolvedTemplateExtension);

  let templateEngineInstance = templateResourceType.templateEngine;
  if (templateEngineInstance === null) {
    throw new Error(`Resource type '${resolvedTemplateExtension}' does not specify a template engine.`);
  }

  let templateEngineName = templateEngineInstance.name;
  let resolvedTemplateEngineName = env.templateEngines.noisyResolveKey(templateEngineName);

  return {
    name: resolvedTemplateEngineName,
    options: templateEngineInstance.options,
    templateEngine: <TemplateEngine> env.templateEngines.get(resolvedTemplateEngineName)
  };
}
