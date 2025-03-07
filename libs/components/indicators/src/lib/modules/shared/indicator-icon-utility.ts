import { SkyIndicatorIconType } from './indicator-icon-type';

/**
 * @internal
 */
export class SkyIndicatorIconUtility {
  public static getIconNameForType(
    indicatorType: SkyIndicatorIconType,
  ): string {
    let icon: string;

    switch (indicatorType) {
      case 'danger':
      case 'warning':
        icon = 'sky-warning';
        break;
      case 'info':
        icon = 'sky-info';
        break;
      case 'success':
        icon = 'sky-success';
        break;
    }

    return icon;
  }
}
