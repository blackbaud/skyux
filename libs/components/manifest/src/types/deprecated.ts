export interface SkyManifestDeprecatedDirective {
  deprecationReason?: string;
  isDeprecated: boolean;
  properties?: {
    name: string;
    deprecationReason?: string;
  }[];
  selector: string;
}

export interface SkyManifestDeprecatedPipe {
  deprecationReason?: string;
  templateBindingName: string;
}

/**
 * Information about deprecated template features (directives, components, and pipes).
 */
export interface SkyManifestTemplateFeatureDeprecations {
  components: SkyManifestDeprecatedDirective[];
  directives: SkyManifestDeprecatedDirective[];
  pipes: SkyManifestDeprecatedPipe[];
}
