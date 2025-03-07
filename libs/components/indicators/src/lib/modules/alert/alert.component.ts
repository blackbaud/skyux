import {
  AfterViewChecked,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { SkyLogService } from '@skyux/core';
import { SkyLibResourcesService } from '@skyux/i18n';
import { SkyThemeComponentClassDirective } from '@skyux/theme';

import { Subscription } from 'rxjs';

import { SkyIndicatorDescriptionType } from '../shared/indicator-description-type';
import { SkyIndicatorIconType } from '../shared/indicator-icon-type';
import { SkyIndicatorIconUtility } from '../shared/indicator-icon-utility';

const ALERT_TYPE_DEFAULT = 'warning';

@Component({
  selector: 'sky-alert',
  styleUrls: [
    './alert.default.component.scss',
    './alert.modern.component.scss',
  ],
  templateUrl: './alert.component.html',
  hostDirectives: [SkyThemeComponentClassDirective],
  standalone: false,
})
export class SkyAlertComponent implements AfterViewChecked, OnInit, OnDestroy {
  /**
   * The style for the alert, which determines the icon and background color.
   * The valid options are `danger`, `info`, `success`, and `warning`.
   * @default "warning"
   */
  @Input()
  public set alertType(value: SkyIndicatorIconType | undefined) {
    if (value !== this.alertTypeOrDefault) {
      this.alertTypeOrDefault = value || ALERT_TYPE_DEFAULT;
      this.#updateAlertIcon();
    }
  }

  /**
   * Whether to include a close button for users to dismiss the alert.
   * @default false
   */
  @Input()
  public closeable: boolean | undefined;

  /**
   * Whether the alert is closed.
   * @default false
   */
  @Input()
  public closed: boolean | undefined;

  /**
   * The predefined text to be read by screen readers for users who cannot see the alert icon.
   * This property is optional but will be required in future versions of SKY UX.
   */
  @Input()
  public set descriptionType(value: SkyIndicatorDescriptionType | undefined) {
    this.#_descriptionType = value;
    this.#updateDescriptionComputed();
  }

  public get descriptionType(): SkyIndicatorDescriptionType | undefined {
    return this.#_descriptionType;
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

  public get customDescription(): string | undefined {
    return this.#_customDescription;
  }

  /**
   * Fires when users close the alert.
   */
  @Output()
  public closedChange = new EventEmitter<boolean>();

  public iconName: string | undefined;

  public alertTypeOrDefault: SkyIndicatorIconType = ALERT_TYPE_DEFAULT;

  public descriptionComputed: string | undefined;

  #_descriptionType: SkyIndicatorDescriptionType | undefined;

  #_customDescription: string | undefined;

  #descriptionTypeResourceSubscription: Subscription | undefined;
  #descriptionTypeWarned: boolean | undefined;

  #resources = inject(SkyLibResourcesService);
  #logSvc = inject(SkyLogService);

  public ngOnInit(): void {
    this.#updateAlertIcon();
  }

  public ngAfterViewChecked(): void {
    if (!this.descriptionType && !this.#descriptionTypeWarned) {
      this.#logSvc.deprecated('SkyAlertComponent without `descriptionType`', {
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

  public close(): void {
    this.closed = true;
    this.closedChange.emit(true);
  }

  #updateAlertIcon(): void {
    this.iconName = SkyIndicatorIconUtility.getIconNameForType(
      this.alertTypeOrDefault,
    );
  }

  #updateDescriptionComputed(): void {
    this.#unsubscribe();

    if (this.descriptionType) {
      switch (this.descriptionType) {
        case 'none':
          this.descriptionComputed = undefined;
          break;
        case 'custom':
          this.descriptionComputed = this.customDescription;
          break;
        default:
          this.#descriptionTypeResourceSubscription = this.#resources
            .getString(
              'skyux_alert_sr_' + this.descriptionType.replace(/-/g, '_'),
            )
            .subscribe((value) => {
              this.descriptionComputed = value;
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
