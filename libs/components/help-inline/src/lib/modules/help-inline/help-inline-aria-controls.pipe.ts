import { Pipe, PipeTransform, inject } from '@angular/core';
import { SKY_HELP_GLOBAL_OPTIONS } from '@skyux/core';

/**
 * @internal
 */
@Pipe({
  name: 'skyHelpInlineAriaControls',
  standalone: true,
})
export class SkyHelpInlineAriaControlsPipe implements PipeTransform {
  readonly #helpGlobalOptions = inject(SKY_HELP_GLOBAL_OPTIONS, {
    optional: true,
  });

  public transform(
    ariaControls: string | undefined,
    popoverId: string | undefined,
    helpKey: string | undefined,
    widgetReadyState: boolean | null,
  ): string | undefined {
    if (helpKey) {
      if (!widgetReadyState) {
        return;
      }

      if (this.#helpGlobalOptions) {
        return this.#helpGlobalOptions.ariaControls;
      }
    }

    return popoverId || ariaControls;
  }
}
