import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
  inject,
} from '@angular/core';
import { SkyHelpService, SkyIdModule, SkyIdService } from '@skyux/core';
import { SkyIconModule } from '@skyux/icon';
import { SkyPopoverModule } from '@skyux/popovers';
import { SkyThemeModule } from '@skyux/theme';

import { SkyHelpInlineResourcesModule } from '../shared/sky-help-inline-resources.module';

import { SkyHelpInlineAriaControlsPipe } from './help-inline-aria-controls.pipe';
import { SkyHelpInlineAriaExpandedPipe } from './help-inline-aria-expanded.pipe';
import { SkyHelpInlineAriaHaspopupPipe } from './help-inline-aria-haspopup.pipe';

/**
 * Inserts a help button beside an element, such as a field, to display contextual information about the element.
 */
@Component({
  selector: 'sky-help-inline',
  standalone: true,
  templateUrl: './help-inline.component.html',
  styleUrls: [
    './help-inline.default.component.scss',
    './help-inline.modern.component.scss',
  ],
  imports: [
    CommonModule,
    SkyHelpInlineAriaControlsPipe,
    SkyHelpInlineAriaExpandedPipe,
    SkyHelpInlineAriaHaspopupPipe,
    SkyHelpInlineResourcesModule,
    SkyIconModule,
    SkyIdModule,
    SkyPopoverModule,
    SkyThemeModule,
  ],
})
export class SkyHelpInlineComponent {
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
  public labelText: string | undefined;

  /**
   * The content of the help popover. When specified, clicking the help inline button opens a popover with this content and optional title.
   */
  @Input()
  public set popoverContent(value: string | TemplateRef<unknown> | undefined) {
    this.#_popoverContent = value;

    if (value) {
      this.popoverId = this.#idSvc.generateId();
      this.isPopoverOpened = false;
    }

    this.popoverTemplate = value instanceof TemplateRef ? value : undefined;
  }

  public get popoverContent(): string | TemplateRef<unknown> | undefined {
    return this.#_popoverContent;
  }

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

  protected isPopoverOpened: boolean | undefined;
  protected popoverId: string | undefined;
  protected popoverTemplate: TemplateRef<unknown> | undefined;

  protected readonly helpSvc = inject(SkyHelpService, { optional: true });

  #_popoverContent: string | TemplateRef<unknown> | undefined;

  readonly #idSvc = inject(SkyIdService);

  protected onClick(): void {
    this.actionClick.emit();

    if (this.helpKey) {
      this.helpSvc?.openHelp({
        helpKey: this.helpKey,
      });
    }
  }

  protected popoverOpened(flag: boolean): void {
    this.isPopoverOpened = flag;
  }
}
