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
   * @default 'info'
   */
  @Input()
  public set labelType(value: SkyLabelType | undefined) {
    this.labelTypeOrDefault = value === undefined ? LABEL_TYPE_DEFAULT : value;

    this.#updateIcon();
  }

  public baseIcon: SkyIconStackItem | undefined;

  public icon: string | undefined;

  public labelTypeOrDefault: SkyLabelType = LABEL_TYPE_DEFAULT;

  public topIcon: SkyIconStackItem | undefined;

  constructor() {
    this.#updateIcon();
  }

  #updateIcon(): void {
    const indicatorIcon = SkyIndicatorIconUtility.getIconsForType(
      this.labelTypeOrDefault
    );

    this.icon = indicatorIcon.defaultThemeIcon;
    this.baseIcon = indicatorIcon.modernThemeBaseIcon;
    this.topIcon = indicatorIcon.modernThemeTopIcon;
  }
}
