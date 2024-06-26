import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
  inject,
} from '@angular/core';
import {
  SKY_HELP_GLOBAL_OPTIONS,
  SkyHelpService,
  SkyIdModule,
  SkyIdService,
} from '@skyux/core';
import { SkyIconModule } from '@skyux/icon';
import { SkyPopoverModule } from '@skyux/popovers';
import { SkyThemeModule } from '@skyux/theme';

import { SkyHelpInlineResourcesModule } from '../shared/sky-help-inline-resources.module';

/**
 * Inserts a help button beside an element, such as a field, to display contextual information about the element.
 * @internal
 */
@Component({
  selector: 'sky-help-inline',
  standalone: true,
  templateUrl: './help-inline.component.html',
  styleUrls: ['./help-inline.component.scss'],
  imports: [
    CommonModule,
    SkyHelpInlineResourcesModule,
    SkyIconModule,
    SkyIdModule,
    SkyPopoverModule,
    SkyThemeModule,
  ],
})
export class SkyHelpInlineComponent {
  readonly #idSvc = inject(SkyIdService);

  protected readonly globalOptions = inject(SKY_HELP_GLOBAL_OPTIONS, {
    optional: true,
  });

  protected readonly helpSvc = inject(SkyHelpService, { optional: true });
  protected popoverId: string | undefined;
  protected popoverTemplate: TemplateRef<unknown> | undefined;
  protected isPopoverOpened: boolean | undefined;

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
   * The label of the component help inline is attached to.
   */
  @Input()
  public labelText: string | undefined;

  /**
   * The content of the popover. When specified, clicking the help inline button opens a popover with this content and optional title.
   */
  @Input()
  public get popoverContent(): string | TemplateRef<unknown> | undefined {
    return this.#_popoverContent;
  }

  public set popoverContent(value: string | TemplateRef<unknown> | undefined) {
    this.#_popoverContent = value;
    if (value) {
      this.popoverId = this.#idSvc.generateId();
      this.isPopoverOpened = false;
    }
    this.popoverTemplate = value instanceof TemplateRef ? value : undefined;
  }

  /**
   * The title of the help popover. This property only applies when `popoverContent` is
   * also specified.
   */
  @Input()
  public popoverTitle: string | undefined;

  /**
   * A unique key that identifies the global help content to display when the button is clicked.
   */
  @Input()
  public helpKey: string | undefined;

  #_popoverContent: string | TemplateRef<unknown> | undefined;

  /**
   * Fires when the user clicks the help inline button.
   */
  @Output()
  public actionClick = new EventEmitter<void>();

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
