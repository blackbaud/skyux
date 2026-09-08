import {
  booleanAttribute,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { SkyIconModule } from '@skyux/icon';
import { SkyButtonStyle } from './button-style';
import { SkyButtonType } from './button-type';

/**
 * Buttons provide interactive elements for users to trigger actions in the system.
 */
@Component({
  selector: 'sky-button',
  templateUrl: './button.html',
  imports: [SkyIconModule],
})
export class SkyButton {
  /**
   * Whether the button is displayed as a block element that fills the horizontal space of its container.
   */
  public readonly block = input(false, {
    transform: booleanAttribute,
  });

  /**
   * The display style of the button.
   */
  public readonly buttonStyle = input<SkyButtonStyle>('default');

  /**
   * The type of the underlying HTML button element.
   */
  public readonly buttonType = input<SkyButtonType>('button');

  /**
   * Whether the button is disabled.
   */
  public readonly disabled = input(false, {
    transform: booleanAttribute,
  });

  /**
   * Whether the icon is a logo icon.
   */
  public readonly iconLogo = input(false, {
    transform: booleanAttribute,
  });

  /**
   * The name of the icon to display.
   */
  public readonly iconName = input<string>('');

  /**
   * Whether to hide the button's label. When the label is hidden, `labelText` is used as the button's ARIA label.
   */
  public readonly labelHidden = input(false, {
    transform: booleanAttribute,
  });

  /**
   * The text to display as the button's label.
   */
  public readonly labelText = input.required<string>();

  /**
   * Fires when the button is clicked.
   */
  public readonly buttonClick = output<PointerEvent>();

  protected readonly buttonClass = computed(() => {
    let buttonStyle: string = this.buttonStyle();

    if (buttonStyle === 'icon-borderless-on-prominent') {
      buttonStyle = 'icon-borderless-on_prominent';
    }

    let buttonClass = `sky-btn sky-btn-${buttonStyle}`;

    if (this.block()) {
      buttonClass += ' sky-btn-block';
    }

    return buttonClass;
  });
}
