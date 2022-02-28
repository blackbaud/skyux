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

  public baseIcon: SkyIconStackItem;

  public icon: string;

  public topIcon: SkyIconStackItem;

  private _labelType: SkyLabelType;

  private updateIcon(): void {
    const indicatorIcon = SkyIndicatorIconUtility.getIconsForType(
      this.labelType
    );

    this.icon = indicatorIcon.defaultThemeIcon;
    this.baseIcon = indicatorIcon.modernThemeBaseIcon;
    this.topIcon = indicatorIcon.modernThemeTopIcon;
  }
}
