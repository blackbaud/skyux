import {
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import { SkyLibResourcesService } from '@skyux/i18n';

import { Subscription } from 'rxjs/internal/Subscription';

import { SkyIconStackItem } from '../icon/icon-stack-item';
import { SkyIndicatorDescriptionType } from '../shared/indicator-description-type';
import { SkyIndicatorIconUtility } from '../shared/indicator-icon-utility';

import { SkyLabelType } from './label-type';

const LABEL_TYPE_DEFAULT = 'info';

@Component({
  selector: 'sky-label',
  templateUrl: './label.component.html',
  styleUrls: ['./label.component.scss'],
})
export class SkyLabelComponent implements OnDestroy, OnInit {
  /**
   * The type of label to display.
   * @default 'info'
   */
  @Input()
  public set labelType(value: SkyLabelType | undefined) {
    this.labelTypeOrDefault = value === undefined ? LABEL_TYPE_DEFAULT : value;

    this.#updateIcon();
  }

  /**
   * The predefined text to be read by screen readers for users who cannot see the indicator icon.
   * This property is optional but will be required in future versions of SKY UX.
   */
  @Input()
  public set descriptionType(value: SkyIndicatorDescriptionType | undefined) {
    this.#_descriptionType = value;
    this.#updateDescriptionComputed();
  }

  /**
   * The text to be read by screen readers for users who cannot see
   * the indicator icon when `descriptionType` is `custom`.
   */
  @Input()
  public set customDescription(value: string | undefined) {
    this.#_customDescription = value;
    this.#updateDescriptionComputed();
  }

  public baseIcon: SkyIconStackItem | undefined;

  public descriptionComputed: string | undefined;

  public icon: string | undefined;

  public labelTypeOrDefault: SkyLabelType = LABEL_TYPE_DEFAULT;

  public topIcon: SkyIconStackItem | undefined;

  #_descriptionType: SkyIndicatorDescriptionType | undefined;

  #_customDescription: string | undefined;

  #descriptionTypeResourceSubscription: Subscription | undefined;

  #changeDetector = inject(ChangeDetectorRef);
  #resources = inject(SkyLibResourcesService);

  public ngOnInit(): void {
    this.#updateIcon();
  }

  public ngOnDestroy(): void {
    this.#unsubscribe();
  }

  #updateIcon(): void {
    const indicatorIcon = SkyIndicatorIconUtility.getIconsForType(
      this.labelTypeOrDefault
    );

    this.icon = indicatorIcon.defaultThemeIcon;
    this.baseIcon = indicatorIcon.modernThemeBaseIcon;
    this.topIcon = indicatorIcon.modernThemeTopIcon;
  }

  #updateDescriptionComputed(): void {
    this.#unsubscribe();

    if (this.#_descriptionType) {
      switch (this.#_descriptionType) {
        case 'none':
          this.descriptionComputed = undefined;
          break;
        case 'custom':
          this.descriptionComputed = this.#_customDescription;
          break;
        default:
          this.#descriptionTypeResourceSubscription = this.#resources
            .getString(
              'skyux_label_sr_' + this.#_descriptionType.replace(/-/g, '_')
            )
            .subscribe((value) => {
              this.descriptionComputed = value;
              this.#changeDetector.markForCheck();
            });

          break;
      }
    } else {
      this.descriptionComputed = undefined;
    }
  }

  #unsubscribe(): void {
    if (this.#descriptionTypeResourceSubscription) {
      this.#descriptionTypeResourceSubscription.unsubscribe();
      this.#descriptionTypeResourceSubscription = undefined;
    }
  }
}
