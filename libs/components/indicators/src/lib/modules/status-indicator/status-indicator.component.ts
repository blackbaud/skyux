import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  TemplateRef,
  inject,
} from '@angular/core';
import { SkyLibResourcesService } from '@skyux/i18n';

import { SkyIndicatorDescriptionType } from '../shared/indicator-description-type';
import { SkyIndicatorIconType } from '../shared/indicator-icon-type';
import { SkyIndicatorIconUtility } from '../shared/indicator-icon-utility';

const INDICATOR_TYPE_DEFAULT: SkyIndicatorIconType = 'warning';
/**
 * Displays status text with an icon matching the specified indicator type.
 * To display a help button beside the label, include a help button element, such as
 * `sky-help-inline`, in the `sky-status-indicator` element and a `sky-control-help`
 * CSS class on that help button element.
 */
@Component({
  selector: 'sky-status-indicator',
  templateUrl: './status-indicator.component.html',
  styleUrls: ['./status-indicator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class SkyStatusIndicatorComponent implements OnInit {
  /**
   * The style for the status indicator, which determines the icon.
   * @default "warning"
   */
  @Input()
  public set indicatorType(value: SkyIndicatorIconType) {
    this.indicatorTypeOrDefault =
      value === undefined ? INDICATOR_TYPE_DEFAULT : value;

    this.#updateIcon();
  }

  /**
   * The predefined text to be read by screen readers for users who
   * cannot see the indicator icon.
   * @required
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
   * The content of the help popover. When specified, a [help inline](https://developer.blackbaud.com/skyux/components/help-inline)
   * button is added to the status indicator. The help inline button displays a [popover](https://developer.blackbaud.com/skyux/components/popover)
   * when clicked using the specified content and optional title.
   */
  @Input()
  public helpPopoverContent: string | TemplateRef<unknown> | undefined;

  /**
   * The title of the help popover. This property only applies when `helpPopoverContent` is
   * also specified.
   */
  @Input()
  public helpPopoverTitle: string | undefined;

  /**
   * A help key that identifies the global help content to display. When specified, a [help inline](https://developer.blackbaud.com/skyux/components/help-inline) button is
   * placed beside the status indicator label. Clicking the button invokes [global help](https://developer.blackbaud.com/skyux/learn/develop/global-help) as configured by the application.
   */
  @Input()
  public helpKey: string | undefined;

  public descriptionComputed: string | undefined;

  public iconName = SkyIndicatorIconUtility.getIconNameForType(
    INDICATOR_TYPE_DEFAULT,
  );

  public indicatorTypeOrDefault: SkyIndicatorIconType = INDICATOR_TYPE_DEFAULT;

  #changeDetector = inject(ChangeDetectorRef);
  #resourcesSvc = inject(SkyLibResourcesService);

  #_descriptionType: SkyIndicatorDescriptionType | undefined;
  #_customDescription: string | undefined;

  public ngOnInit(): void {
    this.#updateIcon();
  }

  #updateIcon(): void {
    this.iconName = SkyIndicatorIconUtility.getIconNameForType(
      this.indicatorTypeOrDefault,
    );
  }

  #updateDescriptionComputed(): void {
    if (this.descriptionType) {
      switch (this.descriptionType) {
        case 'none':
          this.descriptionComputed = '';
          break;
        case 'custom':
          this.descriptionComputed = this.customDescription;
          break;
        default:
          this.#resourcesSvc
            .getString(
              'skyux_status_indicator_sr_' +
                this.descriptionType.replace(/-/g, '_'),
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
}
