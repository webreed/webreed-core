// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.

"use strict";


const Observable = require("rxjs").Observable;


class FakeErrorTemplateEngine {

  clearTemplateCache() {
    return Promise.reject(new Error("clearTemplateCache failed!"));
  }

  renderTemplateString(template, templateParams, context) {
    return new Observable(observer => {
      observer.error(new Error("renderTemplateString failed!"));
    });
  }

  renderTemplate(templateName, templateParams, context) {
    return new Observable(observer => {
      observer.error(new Error("renderTemplate failed!"));
    });
  }

}


exports.FakeErrorTemplateEngine = FakeErrorTemplateEngine;
