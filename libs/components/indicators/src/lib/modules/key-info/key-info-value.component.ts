import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  inject,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { SkyMutationObserverService } from '@skyux/core';

import { Observable } from 'rxjs';

/**
 * Specifies a value to display in larger, bold text.
 * @required
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.sky-font-display-3]': 'shouldApplyDefaultFontClass()',
  },
  selector: 'sky-key-info-value',
  styles: `
    :host {
      display: inline-block;
    }
  `,
  template: '<ng-content />',
})
export class SkyKeyInfoValueComponent {
  readonly #elementRef = inject(ElementRef) as ElementRef<HTMLElement>;
  readonly #mutationObserverSvc = inject(SkyMutationObserverService);

  readonly #classChanges = toSignal(
    new Observable<string[]>((subscriber) => {
      const el = this.#elementRef.nativeElement;

      const observer = this.#mutationObserverSvc.create(() => {
        subscriber.next(Array.from(el.classList));
      });

      observer.observe(el, {
        attributes: true,
        attributeFilter: ['class'],
      });

      subscriber.next(Array.from(el.classList));

      return (): void => {
        observer.disconnect();
      };
    }),
  );

  protected shouldApplyDefaultFontClass = computed(() => {
    const classes = this.#classChanges();
    const hasUserDefinedFontDisplayClass = classes?.some(
      (className) =>
        className.startsWith('sky-font-display-') &&
        className !== 'sky-font-display-3',
    );

    return !hasUserDefinedFontDisplayClass;
  });
}
