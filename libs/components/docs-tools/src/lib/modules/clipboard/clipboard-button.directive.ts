import { Directive, inject, input } from '@angular/core';

import { SkyDocsClipboardService } from './clipboard.service';

/**
 * @internal
 */
@Directive({
  host: {
    '(click)': 'onClick()',
  },
  selector: '[skyDocsClipboardButton]',
})
export class SkyDocsClipboardButtonDirective {
  readonly #clipboardSvc = inject(SkyDocsClipboardService);

  public readonly clipboardTarget = input.required<HTMLElement>();
  public readonly copySuccessMessage = input.required<string>();

  protected onClick(): void {
    const el = this.clipboardTarget();

    if (el) {
      this.#clipboardSvc.copyTextContent(el, this.copySuccessMessage());
    }
  }
}
