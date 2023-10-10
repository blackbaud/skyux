import { UrlModalResult } from './text-editor-url-modal-result';

/**
 * @internal
 */
export class SkyUrlModalContext {
  public urlResult: UrlModalResult | undefined;
  public openLinksInNewWindowOnly: boolean | undefined;
}
