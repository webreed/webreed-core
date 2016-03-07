// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.


import {Observable} from "rxjs";


export class FakeTemplateEngine {

  clearTemplateCache() {
  }

  renderTemplateString(template, templateParams, context) {
    this.lastRenderTemplateStringArguments = Array.from(arguments);
    return Observable.of(`Template Output: [[${template}]]`);
  }

  renderTemplate(templateName, templateParams, context) {
    this.lastRenderTemplateArguments = Array.from(arguments);
    return Observable.of(`Template Output: [[${templateName}]]`);
  }

}
