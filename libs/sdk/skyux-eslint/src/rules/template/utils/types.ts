/**
 * Information about a deprecated property.
 */
export interface DeprecatedProperty {
  deprecationReason?: string;
  name: string;
}

/**
 * Information about a deprecated directive.
 */
export interface DeprecatedDirective {
  deprecationReason?: string;
  isDeprecated: boolean;
  properties?: DeprecatedProperty[];
  selector: string;
}

/**
 * Information about deprecated template features (directives and components).
 */
export interface TemplateFeatureDeprecations {
  components: DeprecatedDirective[];
  directives: DeprecatedDirective[];
}

/**
 * Information about a legacy icon replacement
 */
export interface LegacyIconReplacement {
  newName: string;
  variant?: 'solid' | 'line';
}
