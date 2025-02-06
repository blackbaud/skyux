import { Directive, computed, inject } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { SkyContentInfoProvider } from '@skyux/core';
import { SkyLibResourcesService } from '@skyux/i18n';

import { of, switchMap } from 'rxjs';

import { SkyDropdownTriggerBaseDirective } from './dropdown-trigger-base.directive';

/**
 * @internal
 */
@Directive({
  selector: '[skyDropdownTrigger]',
  standalone: true,
  host: {
    '[attr.aria-label]': 'ariaLabel()',
    '[attr.aria-labelledby]': 'ariaLabelledby()',
  },
})
export class SkyDropdownTriggerDirective extends SkyDropdownTriggerBaseDirective {
  readonly #resourcesSvc = inject(SkyLibResourcesService);

  readonly #contentInfo = toSignal(
    inject(SkyContentInfoProvider, {
      optional: true,
    })?.getInfo() ?? of(undefined),
  );

  readonly #contextMenuLabel = toSignal(
    toObservable(this.#contentInfo).pipe(
      switchMap((contentInfo) => {
        const contentInfoDescriptor = contentInfo?.descriptor;

        if (contentInfoDescriptor) {
          if (contentInfoDescriptor.type === 'text') {
            return this.#resourcesSvc.getString(
              'skyux_dropdown_context_menu_with_content_descriptor_default_label',
              contentInfoDescriptor.value,
            );
          }

          return of(undefined);
        }

        return this.#resourcesSvc.getString(
          'skyux_dropdown_context_menu_default_label',
        );
      }),
    ),
  );

  protected readonly ariaLabel = computed(() => {
    const label = this.label();

    if (label) {
      return label;
    }

    if (this.buttonType() === 'context-menu') {
      return this.#contextMenuLabel();
    }

    return undefined;
  });

  protected readonly ariaLabelledby = computed(() => {
    return !this.label() &&
      this.buttonType() === 'context-menu' &&
      this.#contentInfo()?.descriptor?.type === 'elementId'
      ? this.screenReaderLabelContextMenuId() +
          ' ' +
          this.#contentInfo()?.descriptor?.value
      : undefined;
  });
}
