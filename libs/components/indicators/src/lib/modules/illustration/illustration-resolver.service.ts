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
}
