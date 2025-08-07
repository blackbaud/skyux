import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
  inject,
  signal,
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { SkyIdModule } from '@skyux/core';
import { SkyLibResourcesService } from '@skyux/i18n';
import { SkyIconModule } from '@skyux/icon';
import { SkyThemeModule } from '@skyux/theme';

import { of, switchMap } from 'rxjs';

import { SkyHelpInlineResourcesModule } from '../shared/sky-help-inline-resources.module';

import { SkyHelpInlineAriaLabelPipe } from './aria-label.pipe';
import { SkyHelpInlineHelpKeyButtonComponent } from './button-help-key.component';
import { SkyHelpInlinePopoverButtonComponent } from './button-popover.component';

/**
 * Inserts a help button beside an element, such as a field, to display contextual information about the element.
 */
@Component({
  selector: 'sky-help-inline',
  templateUrl: './help-inline.component.html',
  styleUrls: [
    './help-inline.default.component.scss',
    './help-inline.modern.component.scss',
  ],
  imports: [
    CommonModule,
    SkyHelpInlineAriaLabelPipe,
    SkyHelpInlineHelpKeyButtonComponent,
    SkyHelpInlinePopoverButtonComponent,
    SkyHelpInlineResourcesModule,
    SkyIconModule,
    SkyIdModule,
    SkyThemeModule,
  ],
})
export class SkyHelpInlineComponent {
  readonly #labelText = signal<string | undefined>(undefined);
  readonly #resourcesSvc = inject(SkyLibResourcesService);

  /**
   * The ID of the element that the help inline button controls.
   * This property [supports accessibility rules for disclosures](https://www.w3.org/TR/wai-aria-practices-1.1/#disclosure).
   * For more information about the `aria-controls` attribute, see the [WAI-ARIA definition](https://www.w3.org/TR/wai-aria/#aria-controls).
   */
  @Input()
  public ariaControls: string | undefined;

  /**
   * Whether an element or popover controlled by the help inline button is expanded. If popoverContent is specified,
   * this value is overridden with popover expanded status.
   */
  @Input()
  public ariaExpanded: boolean | undefined;

  /**
   * The ARIA label for the help inline button. This sets the button's `aria-label` to provide a text equivalent for screen readers.
   * Will be overridden if label text is set.
   * @default "Show help content"
   */
  @Input()
  public ariaLabel: string | undefined;

  /**
   * A unique key that identifies the [global help](https://developer.blackbaud.com/skyux/learn/develop/global-help) content to display when the button is clicked.
   */
  @Input()
  public helpKey: string | undefined;

  /**
   * The ID of the element associated with the help inline button. This is used to set the button's `aria-labelledby`
   * to provides a text equivalent for screen readers. Takes precedence over `ariaLabel` and `labelText` inputs.
   * @internal
   */
  @Input()
  public labelledBy: string | undefined;

  /**
   * The label of the component the help inline button is attached to.
   */
  @Input()
  public set labelText(value: string | undefined) {
    this.#labelText.set(value);
  }

  /**
   * The content of the help popover. When specified, clicking the help inline button opens a popover with this content and optional title.
   */
  @Input()
  public popoverContent: string | TemplateRef<unknown> | undefined;

  /**
   * The title of the help popover. This property only applies when `popoverContent` is
   * also specified.
   */
  @Input()
  public popoverTitle: string | undefined;

  /**
   * Fires when the user clicks the help inline button.
   */
  @Output()
  public actionClick = new EventEmitter<void>();

  protected readonly defaultAriaLabel = toSignal(
    this.#resourcesSvc.getString('skyux_help_inline_button_title'),
  );

  protected readonly labelTextResolved = toSignal(
    toObservable(this.#labelText).pipe(
      switchMap((labelText) => {
        if (labelText) {
          return this.#resourcesSvc.getString(
            'skyux_help_inline_aria_label',
            labelText,
          );
        }

        return of(undefined);
      }),
    ),
  );

  protected onClick(): void {
    this.actionClick.emit();
  }
}
