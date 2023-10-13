import { SkyTextEditorLinkWindowOptionsType } from '../types/link-window-options-type';
import { UrlModalResult } from './text-editor-url-modal-result';

/**
 * @internal
 */
export class SkyUrlModalContext {
  public urlResult: UrlModalResult | undefined;
  public linkWindowOptions: SkyTextEditorLinkWindowOptionsType[] | undefined;
}
