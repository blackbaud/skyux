export interface DeprecatedProperty {
  name: string;
  deprecationReason?: string;
}

export interface DeprecatedDirective {
  deprecationReason?: string;
  isDeprecated: boolean;
  properties?: DeprecatedProperty[];
  selector: string;
}

/**
 * Information about deprecated template features (directives, components, and pipes).
 */
export interface TemplateFeatureDeprecations {
  components: DeprecatedDirective[];
  directives: DeprecatedDirective[];
}
