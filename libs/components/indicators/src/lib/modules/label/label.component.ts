import {
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
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
   * Specifies the predefined text to be read by screen readers for users who cannot see the indicator icon.
   * This property is optional but will be required in future versions of SKY UX.
   */
  @Input()
  public get descriptionType(): SkyIndicatorDescriptionType | undefined {
    return this.#_descriptionType;
  }

  public set descriptionType(value: SkyIndicatorDescriptionType | undefined) {
    this.#_descriptionType = value;
    this.#updateDescriptionComputed();
  }

  /**
   * Specifies the text to be read by screen readers for users who cannot see
   * the indicator icon when `descriptionType` is `custom`.
   */
  @Input()
  public set customDescription(value: string | undefined) {
    this.#_customDescription = value;
    this.#updateDescriptionComputed();
  }

  public get customDescription(): string | undefined {
    return this.#_customDescription;
  }

  public baseIcon: SkyIconStackItem | undefined;

  public descriptionComputed: string | undefined;

  public icon: string | undefined;

  public labelTypeOrDefault: SkyLabelType = LABEL_TYPE_DEFAULT;

  public topIcon: SkyIconStackItem | undefined;

  #_descriptionType: SkyIndicatorDescriptionType | undefined;

  #_customDescription: string | undefined;

  #changeDetector: ChangeDetectorRef;

  #currentSub: Subscription | undefined;

  #resources: SkyLibResourcesService;

  constructor(
    changeDetector: ChangeDetectorRef,
    resources: SkyLibResourcesService
  ) {
    this.#changeDetector = changeDetector;
    this.#resources = resources;
  }

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
    if (this.descriptionType) {
      switch (this.descriptionType) {
        case 'none':
          this.descriptionComputed = undefined;
          break;
        case 'custom':
          this.descriptionComputed = this.customDescription;
          break;
        default:
          this.#unsubscribe();

          this.#currentSub = this.#resources
            .getString(
              'skyux_label_sr_' + this.descriptionType.replace(/-/g, '_')
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
    if (this.#currentSub) {
      this.#currentSub.unsubscribe();
      this.#currentSub = undefined;
    }
  }
}
