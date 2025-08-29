import { Injectable } from '@angular/core';

/**
 * Resolves information about spot illustrations.
 */
@Injectable()
export abstract class SkyIllustrationResolverService {
  /**
   * Resolves a URL for the specified illustration name to render in an `img`.
   */
  public abstract resolveUrl(name: string): Promise<string>;

  /**
   * Resolves the `href` of the SVG element to reference in `use`.
   * If both an `href` and a URL are resolved, the SVG with `href` will be rendered.
   */
  public abstract resolveHref(name: string): Promise<string>;
}
