// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.


// Packages
import Rx from "rxjs";


export default class FakeTemplateEngine {

  clearTemplateCache() {
  }

  renderTemplateString(template, templateParams, context) {
    this.lastRenderTemplateStringArguments = Array.from(arguments);
    return Rx.Observable.of({
      wentThroughFakeTemplateEngine: true
    });
  }

  renderTemplate(templateName, templateParams, context) {
    this.lastRenderTemplateArguments = Array.from(arguments);
    return Rx.Observable.of({
      wentThroughFakeTemplateEngine: true
    });
  }

}
