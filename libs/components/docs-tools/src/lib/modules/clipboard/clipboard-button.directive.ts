import { Directive, inject, input } from '@angular/core';

import { SkyClipboardService } from './clipboard.service';

/**
 * @internal
 */
@Directive({
  host: {
    '(click)': 'onClick()',
  },
  selector: '[skyClipboardButton]',
})
export class SkyClipboardButtonDirective {
  readonly #clipboardSvc = inject(SkyClipboardService);

  public readonly clipboardTarget = input.required<HTMLElement>();
  public readonly copySuccessMessage = input.required<string>();

  protected onClick(): void {
    const el = this.clipboardTarget();

    if (el) {
      this.#clipboardSvc.copyTextContent(el, this.copySuccessMessage());
    }
  }
}
