import { booleanAttribute, Component, input, output } from '@angular/core';
import { SkyIconModule } from '@skyux/icon';
import { SkyButtonStyle } from './button-style';
import { SkyButtonType } from './button-type';

@Component({
  selector: 'sky-button',
  templateUrl: './button.html',
  imports: [SkyIconModule],
})
export class SkyButton {
  public readonly buttonStyle = input<SkyButtonStyle>('default');

  public readonly buttonType = input<SkyButtonType>('button');

  public readonly block = input(false, {
    transform: booleanAttribute,
  });

  public readonly disabled = input(false, {
    transform: booleanAttribute,
  });

  public readonly iconLogo = input(false, {
    transform: booleanAttribute,
  });

  public readonly iconName = input('');

  public readonly labelHidden = input(false, {
    transform: booleanAttribute,
  });

  public readonly labelText = input.required<string>();

  public readonly buttonClick = output<MouseEvent>();
}
