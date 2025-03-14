/**
 * @internal
 * Defines properties of SKY UX theme branding.
 */
export class SkyThemeBrand {
  public get hostClass(): string {
    return this.#hostClass || `sky-theme-brand-${this.name}`;
  }

  private set hostClass(value: string | undefined) {
    this.#hostClass = value;
  }

  #hostClass: string | undefined;
  /**
   * Creates a new theme brand.
   * @param name The name of the theme brand.
   * @param hostClass The class on the host element which child components should reference when
   * adjusting for a specified theme brand. This defaults to `sky-theme-brand-<name>
   */
  constructor(
    public readonly name: string,
    hostClass?: string,
  ) {
    this.hostClass = hostClass;
  }
}
