import {
  Directive,
  ElementRef,
  OnDestroy,
  computed,
  inject,
  signal,
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { SkyContentInfoProvider } from '@skyux/core';
import { SkyLibResourcesService } from '@skyux/i18n';

import { Subject, of, switchMap } from 'rxjs';

import { SkyDropdownButtonType } from './types/dropdown-button-type';

/**
 * @internal
 */
@Directive({
  selector: '[skyDropdownTrigger]',
  standalone: true,
  host: {
    '[attr.aria-expanded]': 'isOpen()',
    '[attr.aria-controls]': 'isOpen() ? menuId() : null',
    '[attr.aria-label]': 'ariaLabel()',
    '[attr.aria-labelledby]': 'ariaLabelledby()',
    '[attr.aria-haspopup]': 'menuAriaRole()',
    '[attr.title]': 'title()',
    '[attr.disabled]': 'disabled() || undefined',
    '(click)': 'triggerClick.next($event)',
    '(keydown)': 'triggerKeyDown.next($event)',
    '(mouseenter)': 'triggerMouseEnter.next($event)',
    '(mouseleave)': 'triggerMouseLeave.next($event)',
  },
})
export class SkyDropdownTriggerDirective implements OnDestroy {
  readonly #resourcesSvc = inject(SkyLibResourcesService);

  public readonly nativeElement = inject(ElementRef).nativeElement;

  // Set by the dropdown component.
  public readonly isOpen = signal<boolean | undefined>(undefined);
  public readonly menuId = signal<string | null | undefined>(undefined);
  public readonly menuAriaRole = signal<string | undefined>(undefined);
  public readonly label = signal<string | undefined>(undefined);
  public readonly buttonType = signal<SkyDropdownButtonType | undefined>(
    undefined,
  );
  public readonly screenReaderLabelContextMenuId = signal<string | undefined>(
    undefined,
  );
  public readonly title = signal<string | undefined>(undefined);
  public readonly disabled = signal<boolean | undefined>(undefined);

  public readonly triggerClick = new Subject<MouseEvent>();
  public readonly triggerKeyDown = new Subject<KeyboardEvent>();
  public readonly triggerMouseEnter = new Subject<MouseEvent>();
  public readonly triggerMouseLeave = new Subject<MouseEvent>();

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

  public ngOnDestroy(): void {
    this.triggerClick.complete();
    this.triggerKeyDown.complete();
    this.triggerMouseEnter.complete();
    this.triggerMouseLeave.complete();
  }
}
