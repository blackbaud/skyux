import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import { SkyLogService } from '@skyux/core';
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
export class SkyLabelComponent implements AfterViewChecked, OnDestroy, OnInit {
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
    this.#descriptionType = value;
    this.#updateDescriptionComputed();
  }

  /**
   * The text to be read by screen readers for users who cannot see
   * the indicator icon when `descriptionType` is `custom`.
   */
  @Input()
  public set customDescription(value: string | undefined) {
    this.#customDescription = value;
    this.#updateDescriptionComputed();
  }

  public baseIcon: SkyIconStackItem | undefined;

  public descriptionComputed: string | undefined;

  public icon: string | undefined;

  public labelTypeOrDefault: SkyLabelType = LABEL_TYPE_DEFAULT;

  public topIcon: SkyIconStackItem | undefined;

  #descriptionType: SkyIndicatorDescriptionType | undefined;
  #customDescription: string | undefined;
  #descriptionTypeResourceSubscription: Subscription | undefined;
  #descriptionTypeWarned: boolean | undefined;

  #changeDetector = inject(ChangeDetectorRef);
  #resources = inject(SkyLibResourcesService);
  #logSvc = inject(SkyLogService);

  public ngOnInit(): void {
    this.#updateIcon();
  }

  public ngAfterViewChecked(): void {
    if (!this.#descriptionType && !this.#descriptionTypeWarned) {
      this.#logSvc.deprecated('SkyLabelComponent without `descriptionType`', {
        deprecationMajorVersion: 8,
        replacementRecommendation:
          'Always specify a `descriptionType` property.',
      });

      this.#descriptionTypeWarned = true;
    }
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

    if (this.#descriptionType) {
      switch (this.#descriptionType) {
        case 'none':
          this.descriptionComputed = undefined;
          break;
        case 'custom':
          this.descriptionComputed = this.#customDescription;
          break;
        default:
          this.#descriptionTypeResourceSubscription = this.#resources
            .getString(
              'skyux_label_sr_' + this.#descriptionType.replace(/-/g, '_')
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
