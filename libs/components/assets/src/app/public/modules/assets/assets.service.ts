import {
  Injectable
} from '@angular/core';

/**
 * An abstract class for injecting the ability to retrieve an asset file's URL at runtime.
 * The implementing class will be generated during build time.
 */
/* istanbul ignore next */
@Injectable()
export abstract class SkyAppAssetsService {
  public abstract getUrl(path: string): string;
}
