// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.


// Packages
import Rx from "rxjs";


export default class FakeTemplateEngine {

  clearTemplateCache() {
    return Promise.reject(new Error("clearTemplateCache failed!"));
  }

  renderTemplateString(template, templateParams, context) {
    return new Rx.Observable(observer => {
      observer.error(new Error("renderTemplateString failed!"));
    });
  }

  renderTemplate(templateName, templateParams, context) {
    return new Rx.Observable(observer => {
      observer.error(new Error("renderTemplate failed!"));
    });
  }

}
