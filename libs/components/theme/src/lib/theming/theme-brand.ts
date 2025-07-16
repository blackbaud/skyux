import { SkyThemeBrandData } from './theme-serialization-types';

/**
 * @internal
 * Defines properties of SKY UX theme branding.
 */
export class SkyThemeBrand {
  public get hostClass(): string {
    return this.#hostClass || this.#buildDefaultHostClassName();
  }

  private set hostClass(value: string | undefined) {
    this.#hostClass = value;
  }

  #hostClass: string | undefined;
  /**
   * Creates a new theme brand.
   * @param name The name of the theme brand.
   * @param version The version of the theme brand.
   * @param hostClass The class on the host element which child components should reference when
   * adjusting for a specified theme brand. This defaults to `sky-theme-brand-<name>`
   * @param styleUrl The URL of the stylesheet to load for this brand
   * @param sriHash The subresource integrity hash for the stylesheet
   */
  constructor(
    public readonly name: string,
    public readonly version: string,
    hostClass?: string,
    public readonly styleUrl?: string,
    public readonly sriHash?: string,
  ) {
    this.hostClass = hostClass;

    if (!/^(\d+|\d+\.\d+\.\d+)(?:-(?:alpha|beta|rc)\.\d+)*$/.test(version)) {
      throw new Error(
        `Invalid version format "${version}" for theme brand "${name}".`,
      );
    }
  }

  /**
   * @internal
   * Serializes the theme brand to a JSON-compatible object.
   */
  public serialize(): SkyThemeBrandData {
    const result: SkyThemeBrandData = {
      name: this.name,
      version: this.version,
    };

    // Only include hostClass if it's different from the default
    const defaultHostClass = this.#buildDefaultHostClassName();

    if (this.hostClass !== defaultHostClass) {
      result.hostClass = this.hostClass;
    }

    // Include styleUrl and sriHash if they are provided
    if (this.styleUrl) {
      result.styleUrl = this.styleUrl;
    }

    if (this.sriHash) {
      result.sriHash = this.sriHash;
    }

    return result;
  }

  /**
   * @internal
   * Deserializes a JSON object to a SkyThemeBrand instance.
   */
  public static deserialize(data: SkyThemeBrandData): SkyThemeBrand {
    return new SkyThemeBrand(
      data.name,
      data.version,
      data.hostClass,
      data.styleUrl,
      data.sriHash,
    );
  }

  #buildDefaultHostClassName(): string {
    return `sky-theme-brand-${this.name}`;
  }
}
