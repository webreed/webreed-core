// Copyright (c) Rotorz Limited. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root.


import {PluginContext} from "./PluginContext";


export type TransformationPluginMap = {
  [key: string]: PluginContext[]
};

export type CustomResourceTypeOptions = {
  [key: string]: string
};


/**
 * Defines a type of content and the various transformations that should be performed.
 */
export class ResourceType {

  private _conversions: TransformationPluginMap = { };
  private _custom: CustomResourceTypeOptions = { };
  private _defaultTargetExtension: string = null;
  private _encoding: string = null;
  private _generator: PluginContext = null;
  private _handler: PluginContext = null;
  private _mode: string = "text";
  private _parseFrontmatter: boolean = true;
  private _process: PluginContext[] = [ ];
  private _templateEngine: PluginContext = null;


  /**
   * Map of conversion transformations from the current resource type to another.
   */
  public get conversions(): TransformationPluginMap {
    return this._conversions;
  }
  public set conversions(value: TransformationPluginMap) {
    this._conversions = { };
    for (let key of Object.keys(value)) {
      this._conversions[key] = Array.from(value[key]);
    }
  }

  /**
   * Holds custom key/value pairs.
   */
  public get custom(): CustomResourceTypeOptions {
    return this._custom;
  }

  /**
   * The default target extension to assume for output content when the resource type
   * represents the final sequence of an extension chain.
   *
   * For instance, a ".nunjucks" resource type could have a default target extension of
   * ".html" meaning that a source content file with the name "info.nunjucks" would
   * produce an output file with the name "info.html". Although this would have no effect
   * on a source content file with the name "info.json.nunjucks".
   *
   * @throws {Error}
   * - If argument `value` is not null and is not a string.
   * - If argument `value` is an empty string.
   * - If argument `value` is a value of ".".
   */
  public get defaultTargetExtension(): string {
    return this._defaultTargetExtension;
  }
  public set defaultTargetExtension(value: string) {
    if (value !== null) {
      if (value === "") {
        throw new Error("argument 'value' must be a non-empty string");
      }
      if (value === ".") {
        throw new Error("argument 'value' must not be '.'");
      }
    }

    this._defaultTargetExtension = value;
  }

  /**
   * Encoding of the resource's body.
   */
  public get encoding(): string {
    return this._encoding;
  }
  public set encoding(value: string) {
    this._encoding = value;
  }

  /**
   * Plugin context identifying the generator plugin.
   *
   * Additional properties or overrides can be passed to the plugin via the options
   * supplied by the plugin context whenever the plugin is used for this resource type.
   *
   * A value of `null` when no generator plugin is specified.
   */
  public get generator(): PluginContext {
    return this._generator;
  }
  public set generator(value: PluginContext) {
    this._generator = value;
  }

  /**
   * Plugin context identifying the content handler plugin.
   *
   * Additional properties or overrides can be passed to the plugin via the options
   * supplied by the plugin context whenever the plugin is used for this resource type.
   *
   * A value of `null` when no handler plugin is specified.
   */
  public get handler(): PluginContext {
    return this._handler;
  }
  public set handler(value: PluginContext) {
    this._handler = value;
  }

  /**
   * Name of the file mode.
   */
  public get mode(): string {
    return this._mode;
  }
  public set mode(value: string) {
    if (value === "") {
      throw new Error("argument 'value' must be a non-empty string");
    }
    this._mode = value;
  }

  /**
   * Indicates whether the file mode should attempt to parse frontmatter when reading the
   * source content file. This property is not necessarily applicable to all file modes.
   */
  public get parseFrontmatter(): boolean {
    return this._parseFrontmatter;
  }
  public set parseFrontmatter(value: boolean) {
    this._parseFrontmatter = value;
  }

  /**
   * An array of zero-or-more transforms that are applied in order to a resource **before**
   * any conversion transformations are applied.
   */
  public get process(): PluginContext[] {
    return this._process;
  }
  public set process(value: PluginContext[]) {
    this._process = Array.from(value);
  }

  /**
   * Plugin context identifying the template engine plugin.
   *
   * Additional properties or overrides can be passed to the plugin via the options
   * supplied by the plugin context whenever the plugin is used for this resource type.
   *
   * A value of `null` when no template engine plugin is specified.
   */
  public get templateEngine(): PluginContext {
    return this._templateEngine;
  }
  public set templateEngine(value: PluginContext) {
    this._templateEngine = value;
  }

}
