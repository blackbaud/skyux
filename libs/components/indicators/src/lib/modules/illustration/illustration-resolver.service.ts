import { Injectable } from '@angular/core';

/**
 * Resolves information about spot illustrations.
 */
@Injectable()
export abstract class SkyIllustrationResolverService {
  /**
   * Resolves a URL for the specified illustration name.
   */
  public abstract resolveUrl(name: string): Promise<string>;

  /**
   * Resolves the SVG element for the specified illustration name.
   * If both a URL and an SVG element resolve, the SVG element will be used.
   */
  public abstract resolveSvg(name: string): Promise<string>;
}
