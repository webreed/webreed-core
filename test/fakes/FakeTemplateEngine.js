// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.

"use strict";


const Observable = require("rxjs").Observable;

const TemplateOutput = require("../../lib/plugin/TemplateEngine").TemplateOutput;


class FakeTemplateEngine {

  clearTemplateCache() {
    return Promise.resolve();
  }

  renderTemplateString(template, templateParams, context) {
    this.lastRenderTemplateStringArguments = Array.from(arguments);

    let output = new TemplateOutput();
    output.body = `Template Output: [[${template}]]`;

    return Observable.of(output);
  }

  renderTemplate(templateName, templateParams, context) {
    this.lastRenderTemplateArguments = Array.from(arguments);

    let output = new TemplateOutput();
    output.body = `Template Output: [[${templateName}]]`;

    return Observable.of(output);
  }

}


exports.FakeTemplateEngine = FakeTemplateEngine;
