// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.


import {Observable} from "rxjs";

import {TemplateOutput} from "../../lib/plugin/TemplateEngine";


export class FakeTemplateEngine {

  clearTemplateCache() {
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
