import { Component, Input } from '@angular/core';

import { SkyIconStackItem } from '../icon/icon-stack-item';
import { SkyIndicatorIconUtility } from '../shared/indicator-icon-utility';

import { SkyLabelType } from './label-type';

@Component({
  selector: 'sky-label',
  templateUrl: './label.component.html',
  styleUrls: ['./label.component.scss'],
})
export class SkyLabelComponent {
  /**
   * The type of label to display.
   * @required
   */
  @Input()
  public set labelType(value: SkyLabelType) {
    this._labelType = value;
    this.updateIcon();
  }

  public get labelType(): SkyLabelType {
    return this._labelType || 'info';
  }

  // The next three properties are set in the constructor. However, due to the function - the build doesn't see them as being set.
  // We set a definite assignment assersion here on the properties here because of this.
  public baseIcon!: SkyIconStackItem;

  public icon!: string;

  public topIcon!: SkyIconStackItem;

  private _labelType: SkyLabelType = 'info';

  constructor() {
    this.updateIcon();
  }

  private updateIcon(): void {
    const indicatorIcon = SkyIndicatorIconUtility.getIconsForType(
      this.labelType
    );

    this.icon = indicatorIcon.defaultThemeIcon;
    this.baseIcon = indicatorIcon.modernThemeBaseIcon;
    this.topIcon = indicatorIcon.modernThemeTopIcon;
  }
}
