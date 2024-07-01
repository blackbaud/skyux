import { Pipe, PipeTransform, inject } from '@angular/core';
import { SKY_HELP_GLOBAL_OPTIONS } from '@skyux/core';

/**
 * @internal
 */
@Pipe({
  name: 'skyHelpInlineAriaHaspopup',
  standalone: true,
})
export class SkyHelpInlineAriaHaspopupPipe implements PipeTransform {
  readonly #helpGlobalOptions = inject(SKY_HELP_GLOBAL_OPTIONS, {
    optional: true,
  });

  public transform(helpKey: string | undefined): string | undefined {
    if (helpKey) {
      return this.#helpGlobalOptions?.ariaHaspopup;
    }

    return undefined;
  }
}
