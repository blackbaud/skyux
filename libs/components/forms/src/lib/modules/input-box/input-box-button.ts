import { booleanAttribute, Component, input, output } from '@angular/core';
import { SkyIconModule } from '@skyux/icon';
import { SkyInputBoxButtonStyle } from './input-box-button-style';

/**
 * Specifies a button to display next to the input in an input box.
 * @preview
 */
@Component({
  selector: 'sky-input-box-button',
  templateUrl: './input-box-button.html',
  styleUrl: './input-box-button.scss',
  imports: [SkyIconModule],
  host: {
    // Styling for these classes is provided by the input box component.
    class: 'sky-input-group-btn',
    '[class.sky-input-box-btn-inset]': 'buttonStyle() === "inset"',
  },
})
export class SkyInputBoxButton {
  /**
   * The display style of the button.
   * @default "default"
   */
  public readonly buttonStyle = input<SkyInputBoxButtonStyle>('default');

  /**
   * Whether the button is disabled.
   * @default false
   */
  public readonly disabled = input(false, {
    transform: booleanAttribute,
  });

  /**
   * The name of the icon to display.
   * @required
   */
  public readonly iconName = input.required<string>();

  /**
   * The text to use as the button's ARIA label.
   * @required
   */
  public readonly labelText = input.required<string>();

  /**
   * The position in the input box to display the button.
   */
  public readonly position = input<'left' | 'right'>('right');

  /**
   * Fires when the button is clicked.
   */
  public readonly buttonClick = output<PointerEvent>();
}
