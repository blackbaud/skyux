import { Component, Input } from '@angular/core';

import { SkyIconStackItem } from '../icon/icon-stack-item';
import { SkyIndicatorIconUtility } from '../shared/indicator-icon-utility';

import { SkyLabelType } from './label-type';

const LABEL_TYPE_DEFAULT = 'info';

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
  public set labelType(value: SkyLabelType | undefined) {
    this.#_labelType = value;

    if (this.labelType === undefined) {
      this.labelTypeOrDefault = LABEL_TYPE_DEFAULT;
    } else {
      this.labelTypeOrDefault = this.labelType;
    }

    this.updateIcon();
  }

  public get labelType(): SkyLabelType | undefined {
    return this.#_labelType;
  }

  public baseIcon: SkyIconStackItem | undefined;

  public icon: string | undefined;

  public labelTypeOrDefault: SkyLabelType = LABEL_TYPE_DEFAULT;

  public topIcon: SkyIconStackItem | undefined;

  #_labelType: SkyLabelType | undefined;

  private updateIcon(): void {
    const indicatorIcon = SkyIndicatorIconUtility.getIconsForType(
      this.labelTypeOrDefault
    );

    this.icon = indicatorIcon.defaultThemeIcon;
    this.baseIcon = indicatorIcon.modernThemeBaseIcon;
    this.topIcon = indicatorIcon.modernThemeTopIcon;
  }
}
