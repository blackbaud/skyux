interface DeprecatedProperty {
  name: string;
  reason?: string;
}

export interface DeprecatedDirective {
  deprecated: boolean;
  reason?: string;
  properties?: DeprecatedProperty[];
}

export interface Deprecations {
  components: Record<string, DeprecatedDirective>;
  directives: Record<string, DeprecatedDirective>;
}
