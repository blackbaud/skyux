/* istanbul ignore next */
/**
 * An abstract class for injecting the ability to retrieve an asset file's URL at runtime.
 * The implementing class will be generated during build time.
 */
export abstract class SkyAppAssetsService {
  public abstract getUrl(path: string): string;
}
