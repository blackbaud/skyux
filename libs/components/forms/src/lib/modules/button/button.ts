import { NgTemplateOutlet } from '@angular/common';
import {
  booleanAttribute,
  Component,
  computed,
  inject,
  input,
  output,
} from '@angular/core';
import { SkyIdService } from '@skyux/core';
import { SkyIconModule } from '@skyux/icon';
import { SkyAppLinkModule, SkyHrefModule } from '@skyux/router';
import { SkyButtonPermalink } from './button-permalink';
import { SkyButtonStyle } from './button-style';
import { SkyButtonType } from './button-type';

/**
 * Buttons provide interactive elements for users to trigger actions in the system.
 * @preview
 */
@Component({
  selector: 'sky-button',
  templateUrl: './button.html',
  styleUrl: './button.scss',
  imports: [SkyIconModule, NgTemplateOutlet, SkyAppLinkModule, SkyHrefModule],
})
export class SkyButton {
  /**
   * The accessible label for the button. Only specify this when the accessible label differs from
   * the text specified for `labelText`. To specify an accessible label when no text is visible,
   * use `labelText`, and set `labelHidden` to `true`.
   */
  public readonly ariaLabel = input<string>();

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
  public readonly iconName = input<string>();

  /**
   * Whether to hide the button's label. When the label is hidden, `labelText` is used as the
   * button's accessible label unless `ariaLabel` is also specified.
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

  /**
   * Fires when the button is clicked.
   */
  public readonly buttonClick = output<PointerEvent>();

  protected readonly hiddenLabelId = inject(SkyIdService).generateId();

  protected readonly ariaLabelledBy = computed(() =>
    this.labelHidden() && !this.ariaLabel() ? this.hiddenLabelId : undefined,
  );

  protected readonly buttonClass = computed(() => {
    let buttonClass = `sky-btn sky-btn-${this.buttonStyle()}`;

    if (this.block()) {
      buttonClass += ' sky-btn-block';
    }

    return buttonClass;
  });
}
