import { booleanAttribute, Component, input, output } from '@angular/core';
import {
  SkyButton,
  SkyButtonPermalink,
  SkyButtonStyle,
  SkyButtonType,
} from '@skyux/forms';

@Component({
  template: `<sky-button
    data-sky-id="test-button"
    [block]="block()"
    [buttonStyle]="buttonStyle()"
    [buttonType]="buttonType()"
    [disabled]="disabled()"
    [iconName]="iconName()"
    [labelHidden]="labelHidden()"
    [labelText]="labelText()"
    [logo]="logo()"
    [permalink]="permalink()"
    (buttonClick)="buttonClick.emit($event)"
  />`,
  imports: [SkyButton],
})
export class ButtonTest {
  /**
   * Whether the button is displayed as a block element that fills the horizontal space of its container.
   * @default false
   */
  public readonly block = input(false, {
    transform: booleanAttribute,
  });

  /**
   * The display style of the button.
   * @default "default"
   */
  public readonly buttonStyle = input<SkyButtonStyle>('default');

  /**
   * The type of the underlying HTML button element.
   * @default "button"
   */
  public readonly buttonType = input<SkyButtonType>('button');

  /**
   * Whether the button is disabled.
   * @default false
   */
  public readonly disabled = input(false, {
    transform: booleanAttribute,
  });

  /**
   * The name of the icon to display.
   */
  public readonly iconName = input<string>('');

  /**
   * Whether to hide the button's label. When the label is hidden, `labelText` is used as the button's ARIA label.
   * @default false
   */
  public readonly labelHidden = input(false, {
    transform: booleanAttribute,
  });

  /**
   * The text to display as the button's label.
   * @required
   */
  public readonly labelText = input.required<string>();

  /**
   * Whether the icon is a logo icon.
   * @default false
   */
  public readonly logo = input(false, {
    transform: booleanAttribute,
  });

  /**
   * The link for the button.
   */
  public readonly permalink = input<SkyButtonPermalink>();

  public buttonClick = output<PointerEvent>();
}
