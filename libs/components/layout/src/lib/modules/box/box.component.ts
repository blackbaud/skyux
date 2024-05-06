import {
  Component,
  ContentChild,
  ElementRef,
  Input,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { SkyIdService } from '@skyux/core';

import { SkyBoxControlsComponent } from './box-controls.component';
import { SKY_BOX_HEADER_ID } from './box-header-id-token';
import { SkyBoxHeaderComponent } from './box-header.component';

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
})
export class SkyBoxComponent {
  /**
   * The ARIA label for the box. This sets the box's `aria-label` attribute to provide a text equivalent for screen readers
   * [to support accessibility](https://developer.blackbaud.com/skyux/learn/accessibility).
   * If the box includes a visible label, use `ariaLabelledBy` instead.
   * For more information about the `aria-label` attribute, see the [WAI-ARIA definition](https://www.w3.org/TR/wai-aria/#aria-label).
   */
  @Input()
  public ariaLabel: string | undefined;

  /**
   * The HTML element ID of the element that labels
   * the box. This sets the box's `aria-labelledby` attribute to provide a text equivalent for screen readers
   * [to support accessibility](https://developer.blackbaud.com/skyux/learn/accessibility).
   * If the box does not include a visible label, use `ariaLabel` instead.
   * For more information about the `aria-labelledby` attribute, see the [WAI-ARIA definition](https://www.w3.org/TR/wai-aria/#aria-labelledby).
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
      value.boxHasHeader(!!this.#boxHeaderRef);
    }
  }

  #boxControls: SkyBoxControlsComponent | undefined;
  #boxHeaderRef: ElementRef | undefined;
}
