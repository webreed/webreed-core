// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.

/** @module webreed/lib/interfaces/TemplateEngine */

/**
 * Interface for a template engine.
 *
 * @interface module:webreed/lib/interfaces/TemplateEngine
 */

  /**
   * Clears any cache associated with rendering of templates so that the cache can be
   * reconstructed from fresh when templates are next rendered.
   *
   * @method module:webreed/lib/interfaces/TemplateEngine#clearTemplateCache
   */

  /**
   * Renders the template supplied by argument 'template'.
   *
   * @method module:webreed/lib/interfaces/TemplateEngine#renderTemplateString
   *
   * @param {string} template
   *   Template in source form.
   * @param {object} templateParams
   *   Bag of parameters to pass to the template.
   *
   * @returns {Observable.<module:webreed/lib/Resource>}
   *   An observable stream of zero-or-more output resources.
   */

  /**
   * Renders the named template.
   *
   * @method module:webreed/lib/interfaces/TemplateEngine#renderTemplate
   *
   * @param {string} templateName
   *   Name of the template file relative to the 'templates' directory.
   * @param {object} templateParams
   *   Bag of parameters to pass to the template.
   *
   * @returns {Observable.<module:webreed/lib/Resource>}
   *   An observable stream of zero-or-more output resources.
   */
