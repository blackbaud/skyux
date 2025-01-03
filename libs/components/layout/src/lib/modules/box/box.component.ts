import {
  Component,
  ContentChild,
  ElementRef,
  Input,
  TemplateRef,
  ViewEncapsulation,
  booleanAttribute,
  inject,
  numberAttribute,
} from '@angular/core';
import { SkyIdService } from '@skyux/core';

import { SkyBoxControlsComponent } from './box-controls.component';
import { SKY_BOX_HEADER_ID } from './box-header-id-token';
import { SkyBoxHeaderComponent } from './box-header.component';
import { SkyBoxHeadingLevel } from './box-heading-level';
import { SkyBoxHeadingStyle } from './box-heading-style';

function numberAttribute2(value: unknown): number {
  return numberAttribute(value, 2);
}

/**
 * Provides a common look-and-feel for box content with options to display a common box header, specify body content, and display common box controls.
 */
@Component({
  selector: 'sky-box',
  templateUrl: './box.component.html',
  styleUrls: ['./box.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: SKY_BOX_HEADER_ID,
      useFactory(): string {
        const idService = inject(SkyIdService);
        return idService.generateId();
      },
    },
  ],
  standalone: false,
})
export class SkyBoxComponent {
  /**
   * The text to display as the box's heading.
   */
  @Input()
  public set headingText(value: string | undefined) {
    this.#_headingText = value;

    if (this.#boxControls) {
      this.#boxControls.boxHasHeader(!!value);
    }
  }

  public get headingText(): string | undefined {
    return this.#_headingText;
  }

  /**
   * Indicates whether to hide the `headingText`.
   */
  @Input({ transform: booleanAttribute })
  public headingHidden = false;

  /**
   * The semantic heading level in the document structure. The default is 2.
   * @default 2
   */
  @Input({ transform: numberAttribute2 })
  public headingLevel: SkyBoxHeadingLevel = 2;

  /**
   * The heading [font style](https://developer.blackbaud.com/skyux/design/styles/typography#headings).
   * @default 2
   */
  @Input({ transform: numberAttribute2 })
  public set headingStyle(value: SkyBoxHeadingStyle) {
    this.headingClass = `sky-font-heading-${value}`;
  }

  /**
   * The content of the help popover. When specified along with `headingText`, a [help inline](https://developer.blackbaud.com/skyux/components/help-inline)
   * button is added to the box heading. The help inline button displays a [popover](https://developer.blackbaud.com/skyux/components/popover)
   * when clicked using the specified content and optional title. This property only applies when `headingText` is also specified.
   */
  @Input()
  public helpPopoverContent: string | TemplateRef<unknown> | undefined;

  /**
   * The title of the help popover. This property only applies when `helpPopoverContent` is
   * also specified.
   */
  @Input()
  public helpPopoverTitle: string | undefined;

  /**
   * A help key that identifies the global help content to display. When specified along with `headingText`, a [help inline](https://developer.blackbaud.com/skyux/components/help-inline)
   * button is placed beside the box heading. Clicking the button invokes [global help](https://developer.blackbaud.com/skyux/learn/develop/global-help)
   * as configured by the application. This property only applies when `headingText` is also specified.
   */
  @Input()
  public helpKey: string | undefined;

  /**
   * The ARIA label for the box. This sets the box's `aria-label` attribute to provide a text equivalent for screen readers
   * [to support accessibility](https://developer.blackbaud.com/skyux/learn/accessibility).
   * If the box includes a visible label, use `ariaLabelledBy` instead.
   * For more information about the `aria-label` attribute, see the [WAI-ARIA definition](https://www.w3.org/TR/wai-aria/#aria-label).
   * @deprecated Use `headingText` instead.
   */
  @Input()
  public ariaLabel: string | undefined;

  /**
   * The HTML element ID of the element that labels
   * the box. This sets the box's `aria-labelledby` attribute to provide a text equivalent for screen readers
   * [to support accessibility](https://developer.blackbaud.com/skyux/learn/accessibility).
   * If the box does not include a visible label, use `ariaLabel` instead.
   * For more information about the `aria-labelledby` attribute, see the [WAI-ARIA definition](https://www.w3.org/TR/wai-aria/#aria-labelledby).
   * @deprecated Use `headingText` instead.
   */
  @Input()
  public ariaLabelledBy: string | undefined;

  /**
   * The ARIA role for the box
   * [to support accessibility](https://developer.blackbaud.com/skyux/learn/accessibility)
   * by indicating what the box contains. For information about
   * how an ARIA role indicates what an item represents on a web page,
   * see the [WAI-ARIA roles model](https://www.w3.org/WAI/PF/aria/#roles).
   */
  @Input()
  public ariaRole: string | undefined;

  @ContentChild(SkyBoxHeaderComponent, { read: ElementRef })
  public set boxHeaderRef(value: ElementRef | undefined) {
    this.#boxHeaderRef = value;
    if (this.#boxControls) {
      this.#boxControls.boxHasHeader(!!value);
    }
  }

  @ContentChild(SkyBoxControlsComponent)
  public set boxControls(value: SkyBoxControlsComponent | undefined) {
    this.#boxControls = value;

    if (value) {
      value.boxHasHeader(!!this.headingText || !!this.#boxHeaderRef);
    }
  }

  public headerId = inject(SKY_BOX_HEADER_ID);

  protected headingClass = 'sky-font-heading-2';

  #_headingText: string | undefined;

  #boxControls: SkyBoxControlsComponent | undefined;
  #boxHeaderRef: ElementRef | undefined;
}
