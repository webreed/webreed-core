// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.


// Packages
import Rx from "rxjs";


export default class FakeTemplateEngine {

  clearTemplateCache() {
  }

  renderTemplateString(template, templateParams, context) {
    return new Rx.Observable(observer => {
      setTimeout(() => observer.error(new Error("renderTemplateString failed!")), 0);
    });
  }

  renderTemplate(templateName, templateParams, context) {
    return new Rx.Observable(observer => {
      setTimeout(() => observer.error(new Error("renderTemplate failed!")), 0);
    });
  }

}
