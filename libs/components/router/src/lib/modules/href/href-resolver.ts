import { SkyHref } from './types/href';

export interface SkyHrefResolver {
  resolveHref(param: { url: string }): Promise<SkyHref>;
}
