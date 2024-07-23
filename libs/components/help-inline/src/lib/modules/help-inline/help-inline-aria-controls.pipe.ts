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
    widgetReadyState: boolean,
  ): string | undefined {
    if (helpKey && !widgetReadyState) {
      return;
    }

    if (helpKey && this.#helpGlobalOptions) {
      return this.#helpGlobalOptions.ariaControls;
    }

    return popoverId || ariaControls;
  }
}
